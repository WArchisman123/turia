"use client";

import React, { useState, useMemo } from "react";
import {
  Receipt,
  Clock,
  CheckCircle,
  AlertCircle,
  Search,
  RotateCcw,
  MoreVertical,
  Trash2,
  FileCheck,
  Calendar,
} from "lucide-react";
import { ClientReimbursement, ReimbursementKPIData } from "./types";
import {
  ColumnDef,
  ColumnSort,
  TableHeaderCell,
  TablePagination,
  TableEmptyState,
} from "@/components/ui/data-table";

interface ReimbursementsTabProps {
  reimbursements: ClientReimbursement[];
  kpi: ReimbursementKPIData;
}

const REIMBURSEMENT_COLUMNS: ColumnDef[] = [
  { key: "expense_date", label: "Date" },
  { key: "client_name", label: "Client Name" },
  { key: "category", label: "Category" },
  { key: "description", label: "Expense Description" },
  { key: "challan_number", label: "Challan / Ref No" },
  { key: "amount", label: "Amount (₹)" },
  { key: "invoice_number", label: "Billed Invoice" },
  { key: "is_billed", label: "Billing Status" },
];

export function ReimbursementsTab({
  reimbursements,
  kpi,
}: ReimbursementsTabProps) {
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

  const filteredReimbursements = useMemo(() => {
    return reimbursements.filter((r) => {
      if (statusFilter === "billed" && !r.is_billed) return false;
      if (statusFilter === "unbilled" && r.is_billed) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesDesc = r.description.toLowerCase().includes(q);
        const matchesClient = (r.client_name || "").toLowerCase().includes(q);
        const matchesChallan = (r.challan_number || "").toLowerCase().includes(q);
        if (!matchesDesc && !matchesClient && !matchesChallan) return false;
      }
      for (const [colKey, filterVal] of Object.entries(columnFilters)) {
        if (!filterVal) continue;
        const val = String((r as unknown as Record<string, unknown>)[colKey] || "").toLowerCase();
        if (!val.includes(filterVal.toLowerCase())) return false;
      }
      return true;
    });
  }, [reimbursements, statusFilter, searchQuery, columnFilters]);

  const sortedReimbursements = useMemo(() => {
    if (!columnSort) return filteredReimbursements;
    return [...filteredReimbursements].sort((a, b) => {
      const aVal = (a as unknown as Record<string, unknown>)[columnSort.key];
      const bVal = (b as unknown as Record<string, unknown>)[columnSort.key];
      if (aVal === bVal) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      const res = aVal > bVal ? 1 : -1;
      return columnSort.direction === "asc" ? res : -res;
    });
  }, [filteredReimbursements, columnSort]);

  const totalPages = Math.ceil(sortedReimbursements.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedReimbursements = sortedReimbursements.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === paginatedReimbursements.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedReimbursements.map((r) => r.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* 4 KPI Cards (invoice-3.png) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: All Reimbursements */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              All Reimbursements
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-slate-900 font-mono">
                ₹ {kpi.all_reimbursements.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">
              {kpi.all_reimbursements_count} Expenses Incurred
            </span>
          </div>
          <div className="size-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center border border-purple-100">
            <Receipt className="size-5" />
          </div>
        </div>

        {/* Card 2: Receivable / Unbilled */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Receivable / Unbilled
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-rose-600 font-mono">
                ₹ {kpi.receivable.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <span className="text-[10px] text-rose-500 font-medium">
              {kpi.receivable_count} Unbilled Expenses
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
              Partially Billed
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-amber-600 font-mono">
                ₹ {kpi.partially_paid.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <span className="text-[10px] text-amber-600 font-medium">
              {kpi.partially_paid_count} Under Processing
            </span>
          </div>
          <div className="size-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
            <Clock className="size-5" />
          </div>
        </div>

        {/* Card 4: Paid / Billed */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
              Billed / Recovered
            </span>
            <div className="mt-1 flex items-baseline gap-1.5">
              <span className="text-xl font-bold text-emerald-600 font-mono">
                ₹ {kpi.paid.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </span>
            </div>
            <span className="text-[10px] text-emerald-600 font-medium">
              {kpi.paid_count} Expenses Recovered
            </span>
          </div>
          <div className="size-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
            <CheckCircle className="size-5" />
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium">
            <Calendar className="size-3.5 text-slate-400" />
            <span>01/04/2026 - 31/03/2027</span>
          </div>

          <div className="px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-700 font-bold">
            FY 2026 - 2027
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700"
          >
            <option value="all">All Expenses ⌄</option>
            <option value="unbilled">Unbilled</option>
            <option value="billed">Billed & Recovered</option>
          </select>

          {statusFilter !== "all" && (
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <RotateCcw className="size-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="size-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search reimbursements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-48 sm:w-64"
            />
          </div>
        </div>
      </div>

      {/* 10-Column Reimbursements Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-3.5 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={
                      paginatedReimbursements.length > 0 &&
                      selectedIds.length === paginatedReimbursements.length
                    }
                    onChange={handleSelectAll}
                    className="rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer size-3.5"
                  />
                </th>

                {REIMBURSEMENT_COLUMNS.map((col, index) => (
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
                    menuAlign={index >= REIMBURSEMENT_COLUMNS.length - 3 ? "right" : "left"}
                  />
                ))}

                <th className="py-3 px-3 text-center w-14">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-xs">
              {paginatedReimbursements.length === 0 ? (
                <TableEmptyState
                  colSpan={10}
                  title="No Client Reimbursements found"
                  subtitle="Log pass-through government challans, ROC fees, or stamp duty incurred on behalf of clients."
                />
              ) : (
                paginatedReimbursements.map((r) => {
                  const isSelected = selectedIds.includes(r.id);

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

                      {/* Date */}
                      <td className="py-3 px-3 whitespace-nowrap text-slate-600 font-medium">
                        {r.expense_date}
                      </td>

                      {/* Client */}
                      <td className="py-3 px-3 max-w-[200px]">
                        <span className="font-bold text-slate-900 block truncate group-hover:text-indigo-600 transition-colors">
                          {r.client_name}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 block">
                          {r.client_code}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100">
                          {r.category}
                        </span>
                      </td>

                      {/* Description */}
                      <td className="py-3 px-3 text-slate-700 max-w-[240px] truncate">
                        {r.description}
                      </td>

                      {/* Challan Number */}
                      <td className="py-3 px-3 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                        {r.challan_number ? (
                          <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                            {r.challan_number}
                          </span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>

                      {/* Amount */}
                      <td className="py-3 px-3 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                        ₹ {r.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>

                      {/* Linked Invoice */}
                      <td className="py-3 px-3 font-mono text-[11px] text-indigo-700 whitespace-nowrap">
                        {r.invoice_number ? (
                          <span className="bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100 font-bold">
                            {r.invoice_number}
                          </span>
                        ) : (
                          <span className="text-slate-400 italic">Not yet billed</span>
                        )}
                      </td>

                      {/* Billing Status */}
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wider ${
                            r.is_billed
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}
                        >
                          {r.is_billed ? "Billed" : "Unbilled"}
                        </span>
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
                                <FileCheck className="size-3.5 text-indigo-600" />
                                <span>Link to Invoice</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setActiveMenuId(null)}
                                className="w-full px-3 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2 text-left cursor-pointer"
                              >
                                <Trash2 className="size-3.5" />
                                <span>Delete Claim</span>
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
          totalCount={reimbursements.length}
          filteredCount={sortedReimbursements.length}
          startIndex={startIndex}
          rowsPerPage={rowsPerPage}
          currentPage={currentPage}
          totalPages={totalPages}
          entityName="reimbursements"
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
