"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  MoreVertical,
  XCircle,
  Trash2,
  Phone,
  Mail,
  Building2,
  UserCheck,
} from "lucide-react";
import { LeadItem, LeadStage, LeadStatus } from "./types";
import {
  ColumnDef,
  ColumnSort,
  TableHeaderCell,
  TableActiveModifiers,
  TablePagination,
  TableEmptyState,
} from "@/components/ui/data-table";

interface LeadsTableProps {
  leads: LeadItem[];
  onConvertLead: (id: string) => void;
  onMarkLost: (id: string) => void;
  onDeleteLead: (id: string) => void;
  onBatchConvert?: (ids: string[]) => void;
  onBatchDelete?: (ids: string[]) => void;
}

const ALL_COLUMNS: ColumnDef[] = [
  { key: "createdDate", label: "Created Date" },
  { key: "leadName", label: "Lead Name & Code" },
  { key: "businessEntity", label: "Business Entity" },
  { key: "dealValue", label: "Deal Value" },
  { key: "stage", label: "Stage" },
  { key: "status", label: "Status" },
  { key: "score", label: "Score" },
  { key: "assignedTo", label: "Assigned To" },
  { key: "source", label: "Source" },
  { key: "phone", label: "Phone" },
  { key: "email", label: "Email" },
];

export function LeadsTable({
  leads,
  onConvertLead,
  onMarkLost,
  onDeleteLead,
  onBatchConvert,
  onBatchDelete,
}: LeadsTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);

  // Column operations state
  const [openColumnMenuKey, setOpenColumnMenuKey] = useState<string | null>(null);
  const [columnSort, setColumnSort] = useState<ColumnSort | null>(null);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [hiddenColumnKeys, setHiddenColumnKeys] = useState<string[]>([]);

  // Close row action menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!(event.target as HTMLElement).closest(".row-action-menu-container")) {
        setActiveMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Selection handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(leads.map((l) => l.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const getFieldValue = (lead: LeadItem, key: string): string | number => {
    switch (key) {
      case "createdDate":
        return lead.createdDate;
      case "leadName":
        return `${lead.leadName} ${lead.leadCode}`;
      case "businessEntity":
        return lead.businessEntity;
      case "dealValue":
        return lead.dealValue;
      case "stage":
        return lead.stage;
      case "status":
        return lead.status;
      case "score":
        return lead.score;
      case "assignedTo":
        return lead.assignedTo;
      case "source":
        return lead.source;
      case "phone":
        return lead.phone;
      case "email":
        return lead.email;
      default:
        return "";
    }
  };

  // Process leads through column filters and sorting
  const processedLeads = useMemo(() => {
    let result = [...leads];

    // Apply column filters
    Object.entries(columnFilters).forEach(([key, filterText]) => {
      if (!filterText.trim()) return;
      const q = filterText.toLowerCase();
      result = result.filter((item) => {
        const val = getFieldValue(item, key);
        return String(val).toLowerCase().includes(q);
      });
    });

    // Apply column sorting
    if (columnSort) {
      result.sort((a, b) => {
        const valA = getFieldValue(a, columnSort.key);
        const valB = getFieldValue(b, columnSort.key);

        if (typeof valA === "number" && typeof valB === "number") {
          return columnSort.direction === "asc" ? valA - valB : valB - valA;
        }

        const strA = String(valA);
        const strB = String(valB);
        return columnSort.direction === "asc"
          ? strA.localeCompare(strB, undefined, { numeric: true })
          : strB.localeCompare(strA, undefined, { numeric: true });
      });
    }

    return result;
  }, [leads, columnFilters, columnSort]);

  // Visible columns
  const visibleColumns = useMemo(() => {
    return ALL_COLUMNS.filter((c) => !hiddenColumnKeys.includes(c.key));
  }, [hiddenColumnKeys]);

  // Pagination calculation
  const totalPages = Math.ceil(processedLeads.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedLeads = processedLeads.slice(startIndex, startIndex + rowsPerPage);

  const handleSetSort = (key: string, direction: "asc" | "desc") => {
    setColumnSort({ key, direction });
    setOpenColumnMenuKey(null);
  };

  const handleClearSort = () => {
    setColumnSort(null);
    setOpenColumnMenuKey(null);
  };

  const handleToggleColumnSort = (key: string) => {
    if (!columnSort || columnSort.key !== key) {
      setColumnSort({ key, direction: "asc" });
    } else if (columnSort.direction === "asc") {
      setColumnSort({ key, direction: "desc" });
    } else {
      setColumnSort(null);
    }
  };

  const handleSetFilter = (key: string, text: string) => {
    setColumnFilters((prev) => {
      const next = { ...prev };
      if (!text.trim()) {
        delete next[key];
      } else {
        next[key] = text;
      }
      return next;
    });
    setCurrentPage(1);
  };

  const handleHideColumn = (key: string) => {
    setHiddenColumnKeys((prev) => [...prev, key]);
    setOpenColumnMenuKey(null);
  };

  const handleToggleColumnVisibility = (key: string) => {
    setHiddenColumnKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleResetAll = () => {
    setColumnSort(null);
    setColumnFilters({});
    setHiddenColumnKeys([]);
    setCurrentPage(1);
  };

  const hasActiveModifiers =
    Boolean(columnSort) ||
    Object.keys(columnFilters).length > 0 ||
    hiddenColumnKeys.length > 0;

  // Helper styling for Stage
  const getStageBadge = (stage: LeadStage) => {
    switch (stage) {
      case "New":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Contacted":
        return "bg-sky-50 text-sky-700 border-sky-200";
      case "Proposal Sent":
        return "bg-purple-50 text-purple-700 border-purple-200";
      case "Negotiation":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Closed Won":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Closed Lost":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  // Helper styling for Status
  const getStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case "Open":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Converted":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "Lost":
        return "bg-rose-50 text-rose-700 border-rose-200";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 75) return "bg-emerald-500";
    if (score >= 45) return "bg-amber-500";
    return "bg-rose-500";
  };

  // Assignee Avatar Initial & Color
  const getAvatarInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Batch Actions Bar (when rows are selected) */}
      {selectedIds.length > 0 && (
        <div className="bg-indigo-50/90 border-b border-indigo-100 px-6 py-2.5 flex items-center justify-between animate-in fade-in duration-150">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-900">
            <span className="size-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-[10px]">
              {selectedIds.length}
            </span>
            <span>
              {selectedIds.length} lead{selectedIds.length > 1 ? "s" : ""} selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            {onBatchConvert && (
              <button
                type="button"
                onClick={() => {
                  onBatchConvert(selectedIds);
                  setSelectedIds([]);
                }}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <UserCheck className="size-3.5" /> Convert Selected
              </button>
            )}
            {onBatchDelete && (
              <button
                type="button"
                onClick={() => {
                  onBatchDelete(selectedIds);
                  setSelectedIds([]);
                }}
                className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="size-3.5" /> Delete Selected
              </button>
            )}
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-900 hover:bg-indigo-100/50 rounded-lg transition-colors cursor-pointer"
            >
              Deselect All
            </button>
          </div>
        </div>
      )}

      {/* Active Modifiers Bar (Filters / Sorting / Hidden Columns) */}
      <TableActiveModifiers
        columns={ALL_COLUMNS}
        columnSort={columnSort}
        columnFilters={columnFilters}
        hiddenColumnKeys={hiddenColumnKeys}
        onClearSort={() => setColumnSort(null)}
        onClearFilter={(key) => handleSetFilter(key, "")}
        onToggleColumnVisibility={handleToggleColumnVisibility}
        onResetAll={handleResetAll}
      />

      {/* 13-Column Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600 border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              {/* Checkbox */}
              <th className="py-3 px-4 w-10">
                <input
                  type="checkbox"
                  checked={selectedIds.length === leads.length && leads.length > 0}
                  onChange={handleSelectAll}
                  className="rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </th>

              {/* Data Columns with 3-dot column headers */}
              {visibleColumns.map((col, index) => {
                const isSorted = columnSort?.key === col.key;
                const isFiltered = Boolean(columnFilters[col.key]);
                const isMenuOpen = openColumnMenuKey === col.key;
                const isRightAligned = index >= visibleColumns.length - 3;

                return (
                  <TableHeaderCell
                    key={col.key}
                    column={col}
                    isSorted={isSorted}
                    sortDirection={columnSort?.direction}
                    isFiltered={isFiltered}
                    filterValue={columnFilters[col.key]}
                    isMenuOpen={isMenuOpen}
                    onToggleMenu={() =>
                      setOpenColumnMenuKey(isMenuOpen ? null : col.key)
                    }
                    onCloseMenu={() => setOpenColumnMenuKey(null)}
                    onToggleSort={() => handleToggleColumnSort(col.key)}
                    onSetSort={(dir) => handleSetSort(col.key, dir)}
                    onClearSort={handleClearSort}
                    onSetFilter={(val) => handleSetFilter(col.key, val)}
                    onHideColumn={() => handleHideColumn(col.key)}
                    menuAlign={isRightAligned ? "right" : "left"}
                  />
                );
              })}

              {/* Actions Header */}
              <th className="py-3 px-4 w-12 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {paginatedLeads.length === 0 ? (
              <TableEmptyState
                colSpan={visibleColumns.length + 2}
                title="No leads found"
                subtitle={
                  hasActiveModifiers
                    ? "Try resetting column filters or search"
                    : "Try adjusting your filters or search query"
                }
                hasActiveModifiers={hasActiveModifiers}
                onResetAll={handleResetAll}
              />
            ) : (
              paginatedLeads.map((lead) => {
                const isSelected = selectedIds.includes(lead.id);

                return (
                  <tr
                    key={lead.id}
                    className={`hover:bg-slate-50/70 transition-colors group ${
                      isSelected ? "bg-indigo-50/30" : ""
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(lead.id)}
                        className="rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                    </td>

                    {/* Visible Columns */}
                    {visibleColumns.map((col) => {
                      switch (col.key) {
                        case "createdDate":
                          return (
                            <td
                              key={col.key}
                              className="py-3 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap"
                            >
                              {lead.createdDate}
                            </td>
                          );
                        case "leadName":
                          return (
                            <td key={col.key} className="py-3 px-3">
                              <div>
                                <span className="font-bold text-slate-900 block group-hover:text-indigo-600 transition-colors truncate max-w-[220px]">
                                  {lead.leadName}
                                </span>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="font-mono text-[10px] text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-100 font-bold">
                                    {lead.leadCode}
                                  </span>
                                  <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                                    {lead.contactPerson}
                                  </span>
                                </div>
                              </div>
                            </td>
                          );
                        case "businessEntity":
                          return (
                            <td key={col.key} className="py-3 px-3">
                              <div className="flex items-center gap-1.5">
                                <Building2 className="size-3.5 text-slate-400 shrink-0" />
                                <span className="text-slate-700 text-xs truncate max-w-[130px]">
                                  {lead.businessEntity}
                                </span>
                              </div>
                            </td>
                          );
                        case "dealValue":
                          return (
                            <td key={col.key} className="py-3 px-3">
                              <span className="font-mono font-bold text-slate-900 text-xs block">
                                ₹{lead.dealValue.toLocaleString("en-IN")}
                              </span>
                            </td>
                          );
                        case "stage":
                          return (
                            <td key={col.key} className="py-3 px-3">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStageBadge(
                                  lead.stage
                                )}`}
                              >
                                {lead.stage}
                              </span>
                            </td>
                          );
                        case "status":
                          return (
                            <td key={col.key} className="py-3 px-3">
                              <span
                                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadge(
                                  lead.status
                                )}`}
                              >
                                {lead.status}
                              </span>
                            </td>
                          );
                        case "score":
                          return (
                            <td key={col.key} className="py-3 px-3">
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-[10px]">
                                  <span className="font-mono font-bold text-slate-800">
                                    {lead.score}
                                  </span>
                                  <span className="text-[9px] text-slate-400">/100</span>
                                </div>
                                <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${getScoreBarColor(
                                      lead.score
                                    )}`}
                                    style={{ width: `${lead.score}%` }}
                                  />
                                </div>
                              </div>
                            </td>
                          );
                        case "assignedTo":
                          return (
                            <td key={col.key} className="py-3 px-3">
                              <div className="flex items-center gap-2">
                                <div className="size-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center shrink-0">
                                  {getAvatarInitials(lead.assignedTo)}
                                </div>
                                <span className="text-slate-800 font-medium text-xs truncate max-w-[100px]">
                                  {lead.assignedTo}
                                </span>
                              </div>
                            </td>
                          );
                        case "source":
                          return (
                            <td key={col.key} className="py-3 px-3">
                              <span className="text-slate-600 text-xs bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                                {lead.source}
                              </span>
                            </td>
                          );
                        case "phone":
                          return (
                            <td key={col.key} className="py-3 px-3">
                              <div className="flex items-center gap-1 font-mono text-[11px] text-slate-600 whitespace-nowrap">
                                <Phone className="size-3 text-slate-400 shrink-0" />
                                <span>{lead.phone}</span>
                              </div>
                            </td>
                          );
                        case "email":
                          return (
                            <td key={col.key} className="py-3 px-3">
                              <div className="flex items-center gap-1 text-slate-600 truncate max-w-[150px]">
                                <Mail className="size-3 text-slate-400 shrink-0" />
                                <span className="truncate">{lead.email}</span>
                              </div>
                            </td>
                          );
                        default:
                          return null;
                      }
                    })}

                    {/* Actions Menu */}
                    <td className="py-3 px-4 text-right relative row-action-menu-container">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenuId(
                            activeMenuId === lead.id ? null : lead.id
                          );
                        }}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <MoreVertical className="size-4" />
                      </button>

                      {/* Dropdown Menu */}
                      {activeMenuId === lead.id && (
                        <div className="absolute right-4 top-10 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100 text-left">
                          {lead.status === "Open" && (
                            <button
                              type="button"
                              onClick={() => {
                                onConvertLead(lead.id);
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3 py-1.5 text-xs text-emerald-700 hover:bg-emerald-50 flex items-center gap-2 font-semibold cursor-pointer transition-colors"
                            >
                              <UserCheck className="size-3.5 text-emerald-600" />{" "}
                              Convert to Client
                            </button>
                          )}

                          {lead.status === "Open" && (
                            <button
                              type="button"
                              onClick={() => {
                                onMarkLost(lead.id);
                                setActiveMenuId(null);
                              }}
                              className="w-full px-3 py-1.5 text-xs text-rose-700 hover:bg-rose-50 flex items-center gap-2 font-medium cursor-pointer transition-colors"
                            >
                              <XCircle className="size-3.5 text-rose-500" /> Mark as
                              Lost
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => {
                              onDeleteLead(lead.id);
                              setActiveMenuId(null);
                            }}
                            className="w-full px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50 flex items-center gap-2 font-medium cursor-pointer transition-colors"
                          >
                            <Trash2 className="size-3.5 text-slate-400" /> Delete
                            Lead
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Standard Table Pagination / Footer */}
      <TablePagination
        filteredCount={processedLeads.length}
        totalCount={leads.length}
        startIndex={startIndex}
        rowsPerPage={rowsPerPage}
        currentPage={currentPage}
        totalPages={totalPages}
        entityName="leads"
        onRowsPerPageChange={(n) => {
          setRowsPerPage(n);
          setCurrentPage(1);
        }}
        onPageChange={(p) => setCurrentPage(p)}
        rowsPerPageOptions={[20, 50, 100]}
      />
    </div>
  );
}
