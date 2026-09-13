"use client";

import React, { useState, useMemo, useRef } from "react";
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
  ArrowRightCircle,
  CreditCard,
  Trash2,
  Calendar,
} from "lucide-react";
import { Invoice, ProformaKPIData } from "./types";
import {
  ColumnDef,
  ColumnSort,
  TableHeaderCell,
  TablePagination,
  TableEmptyState,
  RowActionDropdown,
} from "@/components/ui/data-table";

interface ProformaTabProps {
  proformas: Invoice[];
  kpi: ProformaKPIData;
  onAddNew: () => void;
  onViewInvoice: (invoice: Invoice) => void;
  onConvertToTaxInvoice: (id: string) => Promise<void>;
  onRecordPayment: (invoiceId: string) => void;
  onDeleteInvoice: (id: string) => Promise<void>;
}

const PROFORMA_COLUMNS: ColumnDef[] = [
  { key: "invoice_number", label: "Proforma No" },
  { key: "client_name", label: "Client Name" },
  { key: "notes", label: "Service / Description" },
  { key: "invoice_date", label: "Date" },
  { key: "due_date", label: "Due Date" },
  { key: "place_of_supply", label: "Place of Supply" },
  { key: "subtotal", label: "Taxable Amt (₹)" },
  { key: "total_tax", label: "Total Tax (₹)" },
  { key: "total_amount", label: "Total Amt (₹)" },
  { key: "balance_due", label: "Balance Due (₹)" },
  { key: "status", label: "Status" },
];

export function ProformaTab({
  proformas,
  kpi,
  onAddNew,
  onViewInvoice,
  onConvertToTaxInvoice,
  onRecordPayment,
  onDeleteInvoice,
}: ProformaTabProps) {
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

  // Filter & Search
  const filteredProformas = useMemo(() => {
    return proformas.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesNum = p.invoice_number.toLowerCase().includes(q);
        const matchesClient = (p.client_name || "").toLowerCase().includes(q);
        const matchesNotes = (p.notes || "").toLowerCase().includes(q);
        if (!matchesNum && !matchesClient && !matchesNotes) return false;
      }
      // Column filters
      for (const [colKey, filterVal] of Object.entries(columnFilters)) {
        if (!filterVal) continue;
        const val = String((p as unknown as Record<string, unknown>)[colKey] || "").toLowerCase();
        if (!val.includes(filterVal.toLowerCase())) return false;
      }
      return true;
    });
  }, [proformas, statusFilter, searchQuery, columnFilters]);

  // Sorting
  const sortedProformas = useMemo(() => {
    if (!columnSort) return filteredProformas;
    return [...filteredProformas].sort((a, b) => {
      const aVal = (a as unknown as Record<string, unknown>)[columnSort.key];
      const bVal = (b as unknown as Record<string, unknown>)[columnSort.key];
      if (aVal === bVal) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const res = aVal > bVal ? 1 : -1;
      return columnSort.direction === "asc" ? res : -res;
    });
  }, [filteredProformas, columnSort]);

  // Pagination
  const totalPages = Math.ceil(sortedProformas.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedProformas = sortedProformas.slice(startIndex, startIndex + rowsPerPage);

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === paginatedProformas.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedProformas.map((p) => p.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* 4 KPI Cards (invoice-1.png) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: All Proforma */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              All Proforma
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-slate-900 font-mono">
                ₹ {kpi.all_proforma.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">
              {kpi.all_proforma_count} Proforma Issued
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
              {kpi.receivable_count} Unpaid Proforma
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
              {kpi.partially_paid_count} In Process
            </span>
          </div>
          <div className="size-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
            <Clock className="size-5" />
          </div>
        </div>

        {/* Card 4: Advance Paid */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Advance Paid
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-emerald-600 font-mono">
                ₹ {kpi.advance_paid.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <span className="text-[10px] text-emerald-600 font-medium">
              {kpi.advance_paid_count} Settled Ahead
            </span>
          </div>
          <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <CheckCircle className="size-5" />
          </div>
        </div>
      </div>

      {/* Filter Bar (invoice-1.png) */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Date Range Picker Placeholder */}
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
            <option value="draft">Draft</option>
            <option value="converted">Converted</option>
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
              placeholder="Search proforma..."
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
            <span>Add Proforma</span>
          </button>
        </div>
      </div>

      {/* 13-Column Proforma Table (ui_doc.md compliant) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      paginatedProformas.length > 0 &&
                      selectedIds.length === paginatedProformas.length
                    }
                    onChange={handleSelectAll}
                    className="rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer size-3.5"
                  />
                </th>

                {PROFORMA_COLUMNS.map((col, index) => (
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
                    menuAlign={index >= PROFORMA_COLUMNS.length - 3 ? "right" : "left"}
                  />
                ))}

                <th className="py-3 px-3 text-center w-14">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs">
              {paginatedProformas.length === 0 ? (
                <TableEmptyState
                  colSpan={13}
                  title="No Proforma Invoices found"
                  subtitle="Issue a new proforma invoice to generate estimates for client engagements."
                />
              ) : (
                paginatedProformas.map((p) => {
                  const isSelected = selectedIds.includes(p.id);

                  return (
                    <tr
                      key={p.id}
                      className={`hover:bg-slate-50/70 transition-colors group ${
                        isSelected ? "bg-indigo-50/30" : ""
                      }`}
                    >
                      <td className="py-3 px-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(p.id)}
                          className="rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer size-3.5"
                        />
                      </td>

                      {/* Proforma Number */}
                      <td className="py-3 px-3 font-mono text-[11px] font-bold text-indigo-700 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => onViewInvoice(p)}
                          className="bg-indigo-50 hover:bg-indigo-100 px-2 py-0.5 rounded-md border border-indigo-100 transition-colors cursor-pointer text-left"
                        >
                          {p.invoice_number}
                        </button>
                      </td>

                      {/* Client Name */}
                      <td className="py-3 px-3 max-w-[200px]">
                        <span className="font-bold text-slate-900 block truncate group-hover:text-indigo-600 transition-colors">
                          {p.client_name}
                        </span>
                        {p.client_pan && (
                          <span className="text-[10px] font-mono text-slate-400 block">
                            PAN: {p.client_pan}
                          </span>
                        )}
                      </td>

                      {/* Service / Description */}
                      <td className="py-3 px-3 text-slate-600 truncate max-w-[200px]">
                        {p.notes || "Professional Legal & Compliance Services"}
                      </td>

                      {/* Date */}
                      <td className="py-3 px-3 whitespace-nowrap text-slate-600">
                        {p.invoice_date}
                      </td>

                      {/* Due Date */}
                      <td className="py-3 px-3 whitespace-nowrap text-slate-600 font-medium">
                        {p.due_date}
                      </td>

                      {/* Place of Supply */}
                      <td className="py-3 px-3 whitespace-nowrap text-slate-700">
                        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[10px]">
                          {p.place_of_supply}
                        </span>
                      </td>

                      {/* Taxable Amount */}
                      <td className="py-3 px-3 text-right font-mono font-medium text-slate-800 whitespace-nowrap">
                        ₹ {p.subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>

                      {/* Total Tax */}
                      <td className="py-3 px-3 text-right font-mono text-slate-600 whitespace-nowrap">
                        ₹ {p.total_tax.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>

                      {/* Total Amount */}
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                        ₹ {p.total_amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>

                      {/* Balance Due */}
                      <td className="py-3 px-3 text-right font-mono font-bold whitespace-nowrap">
                        <span
                          className={
                            p.balance_due > 0 ? "text-rose-600" : "text-emerald-600"
                          }
                        >
                          ₹ {p.balance_due.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                            p.status === "paid"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : p.status === "partially_paid"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : p.status === "converted"
                              ? "bg-blue-50 text-blue-700 border-blue-200"
                              : p.status === "draft"
                              ? "bg-slate-100 text-slate-600 border-slate-200"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}
                        >
                          {p.status.replace("_", " ")}
                        </span>
                      </td>

                      {/* Actions Menu */}
                      <ProformaRowActionCell
                        invoice={p}
                        isOpen={activeMenuId === p.id}
                        onToggle={() =>
                          setActiveMenuId(activeMenuId === p.id ? null : p.id)
                        }
                        onClose={() => setActiveMenuId(null)}
                        onViewInvoice={onViewInvoice}
                        onConvertToTaxInvoice={onConvertToTaxInvoice}
                        onRecordPayment={onRecordPayment}
                        onDeleteInvoice={onDeleteInvoice}
                      />
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <TablePagination
          totalCount={proformas.length}
          filteredCount={sortedProformas.length}
          startIndex={startIndex}
          rowsPerPage={rowsPerPage}
          currentPage={currentPage}
          totalPages={totalPages}
          entityName="proforma invoices"
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

interface ProformaRowActionCellProps {
  invoice: Invoice;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onViewInvoice: (invoice: Invoice) => void;
  onConvertToTaxInvoice: (id: string) => Promise<void>;
  onRecordPayment: (invoiceId: string) => void;
  onDeleteInvoice: (id: string) => Promise<void>;
}

function ProformaRowActionCell({
  invoice,
  isOpen,
  onToggle,
  onClose,
  onViewInvoice,
  onConvertToTaxInvoice,
  onRecordPayment,
  onDeleteInvoice,
}: ProformaRowActionCellProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <td className="py-3 px-3 text-center">
      <button
        ref={triggerRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
          isOpen
            ? "text-slate-900 bg-slate-100"
            : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
        }`}
        title="Actions"
      >
        <MoreVertical className="size-3.5" />
      </button>

      <RowActionDropdown
        isOpen={isOpen}
        onClose={onClose}
        triggerRef={triggerRef}
        width={192}
      >
        <button
          type="button"
          onClick={() => {
            onViewInvoice(invoice);
            onClose();
          }}
          className="w-full px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-left cursor-pointer"
        >
          <Printer className="size-3.5 text-slate-500" />
          <span>View / Print Proforma</span>
        </button>

        {invoice.status !== "converted" && (
          <button
            type="button"
            onClick={() => {
              onConvertToTaxInvoice(invoice.id);
              onClose();
            }}
            className="w-full px-3 py-2 hover:bg-indigo-50 text-indigo-700 font-semibold flex items-center gap-2 text-left cursor-pointer"
          >
            <ArrowRightCircle className="size-3.5 text-indigo-600" />
            <span>Convert to Tax Invoice</span>
          </button>
        )}

        {invoice.balance_due > 0 && (
          <button
            type="button"
            onClick={() => {
              onRecordPayment(invoice.id);
              onClose();
            }}
            className="w-full px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-left cursor-pointer"
          >
            <CreditCard className="size-3.5 text-emerald-600" />
            <span>Record Advance Payment</span>
          </button>
        )}

        <div className="border-t border-slate-100 my-1" />

        <button
          type="button"
          onClick={() => {
            onDeleteInvoice(invoice.id);
            onClose();
          }}
          className="w-full px-3 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2 text-left cursor-pointer"
        >
          <Trash2 className="size-3.5" />
          <span>Delete Proforma</span>
        </button>
      </RowActionDropdown>
    </td>
  );
}
