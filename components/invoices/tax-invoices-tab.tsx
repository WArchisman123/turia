"use client";

import React, { useState, useMemo } from "react";
import {
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  Plus,
  RotateCcw,
  MoreVertical,
  Printer,
  CreditCard,
  Trash2,
  Calendar,
} from "lucide-react";
import { Invoice, TaxInvoiceKPIData } from "./types";
import {
  ColumnDef,
  ColumnSort,
  TableHeaderCell,
  TablePagination,
  TableEmptyState,
} from "@/components/ui/data-table";

interface TaxInvoicesTabProps {
  invoices: Invoice[];
  kpi: TaxInvoiceKPIData;
  onAddNew: () => void;
  onViewInvoice: (invoice: Invoice) => void;
  onRecordPayment: (invoiceId: string) => void;
  onDeleteInvoice: (id: string) => Promise<void>;
}

const TAX_INVOICE_COLUMNS: ColumnDef[] = [
  { key: "invoice_number", label: "Invoice No" },
  { key: "client_name", label: "Client Name" },
  { key: "sac_code", label: "SAC Code" },
  { key: "invoice_date", label: "Invoice Date" },
  { key: "due_date", label: "Due Date" },
  { key: "place_of_supply", label: "Place of Supply" },
  { key: "subtotal", label: "Taxable Value (₹)" },
  { key: "cgst_amount", label: "CGST (₹)" },
  { key: "sgst_amount", label: "SGST (₹)" },
  { key: "igst_amount", label: "IGST (₹)" },
  { key: "total_amount", label: "Total Amount (₹)" },
  { key: "balance_due", label: "Balance Due (₹)" },
  { key: "status", label: "Status" },
];

export function TaxInvoicesTab({
  invoices,
  kpi,
  onAddNew,
  onViewInvoice,
  onRecordPayment,
  onDeleteInvoice,
}: TaxInvoicesTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
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

  // Filtering
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      if (statusFilter !== "all" && inv.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesNum = inv.invoice_number.toLowerCase().includes(q);
        const matchesClient = (inv.client_name || "").toLowerCase().includes(q);
        const matchesNotes = (inv.notes || "").toLowerCase().includes(q);
        if (!matchesNum && !matchesClient && !matchesNotes) return false;
      }
      for (const [colKey, filterVal] of Object.entries(columnFilters)) {
        if (!filterVal) continue;
        const val = String((inv as unknown as Record<string, unknown>)[colKey] || "").toLowerCase();
        if (!val.includes(filterVal.toLowerCase())) return false;
      }
      return true;
    });
  }, [invoices, statusFilter, searchQuery, columnFilters]);

  // Sorting
  const sortedInvoices = useMemo(() => {
    if (!columnSort) return filteredInvoices;
    return [...filteredInvoices].sort((a, b) => {
      const aVal = (a as unknown as Record<string, unknown>)[columnSort.key];
      const bVal = (b as unknown as Record<string, unknown>)[columnSort.key];
      if (aVal === bVal) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const res = aVal > bVal ? 1 : -1;
      return columnSort.direction === "asc" ? res : -res;
    });
  }, [filteredInvoices, columnSort]);

  // Pagination
  const totalPages = Math.ceil(sortedInvoices.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedInvoices = sortedInvoices.slice(startIndex, startIndex + rowsPerPage);

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === paginatedInvoices.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedInvoices.map((i) => i.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* 4 KPI Cards (invoice-2.png) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: All Invoices */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              All Invoices
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-slate-900 font-mono">
                ₹ {kpi.all_invoices.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">
              {kpi.all_invoices_count} Tax Invoices Raised
            </span>
          </div>
          <div className="size-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
            <FileText className="size-5" />
          </div>
        </div>

        {/* Card 2: Receivable */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Receivable
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-rose-600 font-mono">
                ₹ {kpi.receivable.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <span className="text-[10px] text-rose-500 font-medium">
              {kpi.receivable_count} Unpaid Invoices
            </span>
          </div>
          <div className="size-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center border border-rose-100">
            <AlertCircle className="size-5" />
          </div>
        </div>

        {/* Card 3: Partially Paid */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Partially Paid
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-amber-600 font-mono">
                ₹ {kpi.partially_paid.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <span className="text-[10px] text-amber-600 font-medium">
              {kpi.partially_paid_count} Invoices in Recovery
            </span>
          </div>
          <div className="size-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
            <Clock className="size-5" />
          </div>
        </div>

        {/* Card 4: Paid */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Paid
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-emerald-600 font-mono">
                ₹ {kpi.paid.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <span className="text-[10px] text-emerald-600 font-medium">
              {kpi.paid_count} Invoices Settled
            </span>
          </div>
          <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <CheckCircle className="size-5" />
          </div>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Date range */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium">
            <Calendar className="size-3.5 text-slate-400" />
            <span>01/04/2026 - 31/03/2027</span>
          </div>

          {/* FY Pill */}
          <div className="px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-700 font-bold">
            FY 2026 - 2027
          </div>

          {/* Currency */}
          <div className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-600">
            INR (₹)
          </div>

          {/* Status Dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700"
          >
            <option value="all">All Statuses ⌄</option>
            <option value="unpaid">Unpaid</option>
            <option value="partially_paid">Partially Paid</option>
            <option value="paid">Paid</option>
          </select>

          {statusFilter !== "all" && (
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              title="Reset Filter"
            >
              <RotateCcw className="size-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Search Box */}
          <div className="relative">
            <Search className="size-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search tax invoices..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-48 sm:w-64"
            />
          </div>

          {/* + Add Button */}
          <button
            type="button"
            onClick={onAddNew}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="size-3.5" />
            <span>Add Tax Invoice</span>
          </button>
        </div>
      </div>

      {/* 13-Column Tax Invoice Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      paginatedInvoices.length > 0 &&
                      selectedIds.length === paginatedInvoices.length
                    }
                    onChange={handleSelectAll}
                    className="rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer size-3.5"
                  />
                </th>

                {TAX_INVOICE_COLUMNS.map((col, index) => (
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
                    menuAlign={index >= TAX_INVOICE_COLUMNS.length - 3 ? "right" : "left"}
                  />
                ))}

                <th className="py-3 px-3 text-center w-14">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs">
              {paginatedInvoices.length === 0 ? (
                <TableEmptyState
                  colSpan={14}
                  title="No Tax Invoices found"
                  subtitle="Issue a new GST tax invoice for billed compliance assignments."
                />
              ) : (
                paginatedInvoices.map((inv) => {
                  const isSelected = selectedIds.includes(inv.id);
                  const sacCode = inv.items?.[0]?.sac_code || "998231";

                  return (
                    <tr
                      key={inv.id}
                      className={`hover:bg-slate-50/70 transition-colors group ${
                        isSelected ? "bg-indigo-50/30" : ""
                      }`}
                    >
                      <td className="py-3 px-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(inv.id)}
                          className="rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer size-3.5"
                        />
                      </td>

                      {/* Invoice Number */}
                      <td className="py-3 px-3 font-mono text-[11px] font-bold text-indigo-700 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => onViewInvoice(inv)}
                          className="bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded-md border border-indigo-100 transition-colors cursor-pointer text-left"
                        >
                          {inv.invoice_number}
                        </button>
                      </td>

                      {/* Client Name */}
                      <td className="py-3 px-3 max-w-[200px]">
                        <span className="font-bold text-slate-900 block truncate group-hover:text-indigo-600 transition-colors">
                          {inv.client_name}
                        </span>
                        {inv.client_pan && (
                          <span className="text-[10px] font-mono text-slate-400 block">
                            PAN: {inv.client_pan}
                          </span>
                        )}
                      </td>

                      {/* SAC Code */}
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                        <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          {sacCode}
                        </span>
                      </td>

                      {/* Invoice Date */}
                      <td className="py-3 px-3 whitespace-nowrap text-slate-600">
                        {inv.invoice_date}
                      </td>

                      {/* Due Date */}
                      <td className="py-3 px-3 whitespace-nowrap text-slate-600 font-medium">
                        {inv.due_date}
                      </td>

                      {/* Place of Supply */}
                      <td className="py-3 px-3 whitespace-nowrap text-slate-700">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[10px]">
                          {inv.place_of_supply}
                        </span>
                      </td>

                      {/* Taxable Value */}
                      <td className="py-3 px-3 text-right font-mono font-medium text-slate-800 whitespace-nowrap">
                        ₹ {inv.subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>

                      {/* CGST */}
                      <td className="py-3 px-3 text-right font-mono text-slate-600 whitespace-nowrap">
                        {inv.cgst_amount > 0 ? (
                          `₹ ${inv.cgst_amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>

                      {/* SGST */}
                      <td className="py-3 px-3 text-right font-mono text-slate-600 whitespace-nowrap">
                        {inv.sgst_amount > 0 ? (
                          `₹ ${inv.sgst_amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>

                      {/* IGST */}
                      <td className="py-3 px-3 text-right font-mono text-slate-600 whitespace-nowrap">
                        {inv.igst_amount > 0 ? (
                          `₹ ${inv.igst_amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}`
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>

                      {/* Total Amount */}
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                        ₹ {inv.total_amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>

                      {/* Balance Due */}
                      <td className="py-3 px-3 text-right font-mono font-bold whitespace-nowrap">
                        <span
                          className={
                            inv.balance_due > 0 ? "text-rose-600" : "text-emerald-600"
                          }
                        >
                          ₹ {inv.balance_due.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                            inv.status === "paid"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : inv.status === "partially_paid"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}
                        >
                          {inv.status.replace("_", " ")}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-center relative">
                        <div className="relative inline-block">
                          <button
                            type="button"
                            onClick={() =>
                              setActiveMenuId(activeMenuId === inv.id ? null : inv.id)
                            }
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <MoreVertical className="size-3.5" />
                          </button>

                          {activeMenuId === inv.id && (
                            <div className="absolute right-0 top-8 z-30 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1 text-xs text-slate-700">
                              <button
                                type="button"
                                onClick={() => {
                                  onViewInvoice(inv);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-left cursor-pointer"
                              >
                                <Printer className="size-3.5 text-slate-500" />
                                <span>View / Print Invoice</span>
                              </button>

                              {inv.balance_due > 0 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    onRecordPayment(inv.id);
                                    setActiveMenuId(null);
                                  }}
                                  className="w-full px-3 py-2 hover:bg-emerald-50 text-emerald-700 font-semibold flex items-center gap-2 text-left cursor-pointer"
                                >
                                  <CreditCard className="size-3.5 text-emerald-600" />
                                  <span>Record Payment</span>
                                </button>
                              )}

                              <div className="border-t border-slate-100 my-1" />

                              <button
                                type="button"
                                onClick={() => {
                                  onDeleteInvoice(inv.id);
                                  setActiveMenuId(null);
                                }}
                                className="w-full px-3 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2 text-left cursor-pointer"
                              >
                                <Trash2 className="size-3.5" />
                                <span>Delete Invoice</span>
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
          totalCount={invoices.length}
          filteredCount={sortedInvoices.length}
          startIndex={startIndex}
          rowsPerPage={rowsPerPage}
          currentPage={currentPage}
          totalPages={totalPages}
          entityName="tax invoices"
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
