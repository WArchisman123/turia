"use client";

import React, { useState, useMemo } from "react";
import {
  CreditCard,
  CheckCircle,
  Clock,
  Search,
  Plus,
  MoreVertical,
  Calendar,
  Building,
  Trash2,
} from "lucide-react";
import { PaymentReceipt, ReceiptsKPIData } from "./types";
import {
  ColumnDef,
  ColumnSort,
  TableHeaderCell,
  TablePagination,
  TableEmptyState,
} from "@/components/ui/data-table";

interface ReceiptsTabProps {
  receipts: PaymentReceipt[];
  kpi: ReceiptsKPIData;
  onOpenRecordPayment: () => void;
}

const RECEIPTS_COLUMNS: ColumnDef[] = [
  { key: "receipt_number", label: "Receipt No" },
  { key: "receipt_date", label: "Date" },
  { key: "client_name", label: "Client Name" },
  { key: "invoice_number", label: "Invoice Ref" },
  { key: "payment_mode", label: "Mode" },
  { key: "utr_reference", label: "Bank / UTR Ref" },
  { key: "amount_received", label: "Amount Received (₹)" },
  { key: "tds_deducted", label: "TDS 194J (₹)" },
  { key: "net_amount", label: "Total Credit (₹)" },
  { key: "notes", label: "Narration / Notes" },
];

export function ReceiptsTab({
  receipts,
  kpi,
  onOpenRecordPayment,
}: ReceiptsTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [columnSort, setColumnSort] = useState<ColumnSort | null>(null);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [openColumnMenuKey, setOpenColumnMenuKey] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  const handleToggleColumnSort = (key: string) => {
    setColumnSort((prev) => {
      if (prev?.key === key) {
        if (prev.direction === "asc") return { key, direction: "desc" };
        return null;
      }
      return { key, direction: "asc" };
    });
  };

  const handleSetSort = (key: string, direction: "asc" | "desc") => {
    setColumnSort({ key, direction });
  };

  const handleClearSort = () => {
    setColumnSort(null);
  };

  const handleSetFilter = (key: string, val: string) => {
    setColumnFilters((prev) => ({ ...prev, [key]: val }));
  };

  const filteredReceipts = useMemo(() => {
    return receipts.filter((r) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesNum = r.receipt_number.toLowerCase().includes(q);
        const matchesClient = (r.client_name || "").toLowerCase().includes(q);
        const matchesUtr = (r.utr_reference || "").toLowerCase().includes(q);
        const matchesInv = (r.invoice_number || "").toLowerCase().includes(q);
        if (!matchesNum && !matchesClient && !matchesUtr && !matchesInv) return false;
      }
      for (const [colKey, filterVal] of Object.entries(columnFilters)) {
        if (!filterVal) continue;
        const val = String((r as unknown as Record<string, unknown>)[colKey] || "").toLowerCase();
        if (!val.includes(filterVal.toLowerCase())) return false;
      }
      return true;
    });
  }, [receipts, searchQuery, columnFilters]);

  const sortedReceipts = useMemo(() => {
    if (!columnSort) return filteredReceipts;
    return [...filteredReceipts].sort((a, b) => {
      const aVal = (a as unknown as Record<string, unknown>)[columnSort.key];
      const bVal = (b as unknown as Record<string, unknown>)[columnSort.key];
      if (aVal === bVal) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const res = aVal > bVal ? 1 : -1;
      return columnSort.direction === "asc" ? res : -res;
    });
  }, [filteredReceipts, columnSort]);

  const totalPages = Math.ceil(sortedReceipts.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedReceipts = sortedReceipts.slice(startIndex, startIndex + rowsPerPage);

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === paginatedReceipts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedReceipts.map((r) => r.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* 3 KPI Cards (invoice-4.png) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Total Receipts */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Total Receipts
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-slate-900 font-mono">
                ₹ {kpi.total_receipts.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">
              {kpi.total_receipts_count} Inward Collections
            </span>
          </div>
          <div className="size-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
            <CreditCard className="size-5" />
          </div>
        </div>

        {/* Card 2: Receipts (Invoice Settled) */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Invoiced Collections
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-emerald-600 font-mono">
                ₹ {kpi.receipts.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <span className="text-[10px] text-emerald-600 font-medium">
              {kpi.receipts_count} Receipts Allocated
            </span>
          </div>
          <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <CheckCircle className="size-5" />
          </div>
        </div>

        {/* Card 3: Advance Amount */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Advance Amount
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-amber-600 font-mono">
                ₹ {kpi.advance_amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <span className="text-[10px] text-amber-600 font-medium">
              {kpi.advance_amount_count} Unallocated Advances
            </span>
          </div>
          <div className="size-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
            <Clock className="size-5" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium">
            <Calendar className="size-3.5 text-slate-400" />
            <span>01/04/2026 - 31/03/2027</span>
          </div>

          <div className="px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-700 font-bold">
            FY 2026 - 2027
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="size-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search receipts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-48 sm:w-64"
            />
          </div>

          <button
            type="button"
            onClick={onOpenRecordPayment}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="size-3.5" />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {/* 12-Column Receipts Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      paginatedReceipts.length > 0 &&
                      selectedIds.length === paginatedReceipts.length
                    }
                    onChange={handleSelectAll}
                    className="rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer size-3.5"
                  />
                </th>

                {RECEIPTS_COLUMNS.map((col, index) => (
                  <TableHeaderCell
                    key={col.key}
                    column={col}
                    isSorted={columnSort?.key === col.key}
                    sortDirection={columnSort?.direction}
                    isFiltered={Boolean(columnFilters[col.key])}
                    filterValue={columnFilters[col.key]}
                    isMenuOpen={openColumnMenuKey === col.key}
                    onToggleMenu={() =>
                      setOpenColumnMenuKey(openColumnMenuKey === col.key ? null : col.key)
                    }
                    onCloseMenu={() => setOpenColumnMenuKey(null)}
                    onToggleSort={() => handleToggleColumnSort(col.key)}
                    onSetSort={(dir) => handleSetSort(col.key, dir)}
                    onClearSort={handleClearSort}
                    onSetFilter={(val) => handleSetFilter(col.key, val)}
                    onHideColumn={() => {}}
                    menuAlign={index >= RECEIPTS_COLUMNS.length - 3 ? "right" : "left"}
                  />
                ))}

                <th className="py-3 px-3 text-center w-14">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs">
              {paginatedReceipts.length === 0 ? (
                <TableEmptyState
                  colSpan={12}
                  title="No Payment Receipts recorded"
                  subtitle="Record inward bank remittances, cheques, or UPI collections with TDS 194J adjustment."
                />
              ) : (
                paginatedReceipts.map((r) => {
                  const isSelected = selectedIds.includes(r.id);
                  const totalCredit = r.amount_received + r.tds_deducted;

                  return (
                    <tr
                      key={r.id}
                      className={`hover:bg-slate-50/70 transition-colors group ${
                        isSelected ? "bg-indigo-50/30" : ""
                      }`}
                    >
                      <td className="py-3 px-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(r.id)}
                          className="rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer size-3.5"
                        />
                      </td>

                      {/* Receipt No */}
                      <td className="py-3 px-3 font-mono text-[11px] font-bold text-indigo-700 whitespace-nowrap">
                        <span className="bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                          {r.receipt_number}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3 px-3 whitespace-nowrap text-slate-600 font-medium">
                        {r.receipt_date}
                      </td>

                      {/* Client */}
                      <td className="py-3 px-3 max-w-[180px]">
                        <span className="font-bold text-slate-900 block truncate group-hover:text-indigo-600 transition-colors">
                          {r.client_name}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 block">
                          {r.client_code}
                        </span>
                      </td>

                      {/* Linked Invoice Ref */}
                      <td className="py-3 px-3 font-mono text-[11px] whitespace-nowrap">
                        {r.invoice_number ? (
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium border border-slate-200">
                            {r.invoice_number}
                          </span>
                        ) : (
                          <span className="text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 text-[10px]">
                            Direct Advance
                          </span>
                        )}
                      </td>

                      {/* Payment Mode */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
                          {r.payment_mode}
                        </span>
                      </td>

                      {/* Bank / UTR */}
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-600 max-w-[180px] truncate">
                        <span className="font-bold text-slate-800 block text-[10px]">
                          {r.bank_name || "Bank Remittance"}
                        </span>
                        <span>{r.utr_reference || "—"}</span>
                      </td>

                      {/* Amount Received */}
                      <td className="py-3 px-3 text-right font-mono font-bold text-emerald-600 whitespace-nowrap">
                        ₹ {r.amount_received.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>

                      {/* TDS 194J */}
                      <td className="py-3 px-3 text-right font-mono font-medium text-amber-600 whitespace-nowrap">
                        {r.tds_deducted > 0 ? (
                          `₹ ${r.tds_deducted.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>

                      {/* Total Credit */}
                      <td className="py-3 px-3 text-right font-mono font-black text-slate-900 whitespace-nowrap">
                        ₹ {totalCredit.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>

                      {/* Notes */}
                      <td className="py-3 px-3 text-slate-600 max-w-[200px] truncate text-[11px]">
                        {r.notes || "Payment settled towards professional services"}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-center relative">
                        <div className="relative inline-block">
                          <button
                            type="button"
                            onClick={() =>
                              setActiveMenuId(activeMenuId === r.id ? null : r.id)
                            }
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <MoreVertical className="size-3.5" />
                          </button>

                          {activeMenuId === r.id && (
                            <div className="absolute right-0 top-8 z-30 w-44 bg-white rounded-xl shadow-lg border border-slate-200 py-1 text-xs text-slate-700">
                              <button
                                type="button"
                                onClick={() => setActiveMenuId(null)}
                                className="w-full px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-left cursor-pointer"
                              >
                                <Building className="size-3.5 text-indigo-600" />
                                <span>Download Voucher</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setActiveMenuId(null)}
                                className="w-full px-3 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2 text-left cursor-pointer"
                              >
                                <Trash2 className="size-3.5" />
                                <span>Delete Receipt</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <TablePagination
          totalCount={receipts.length}
          filteredCount={sortedReceipts.length}
          startIndex={startIndex}
          rowsPerPage={rowsPerPage}
          currentPage={currentPage}
          totalPages={totalPages}
          entityName="receipts"
          onRowsPerPageChange={(n) => {
            setRowsPerPage(n);
            setCurrentPage(1);
          }}
          onPageChange={setCurrentPage}
          rowsPerPageOptions={[20, 50, 100]}
        />
      </div>
    </div>
  );
}
