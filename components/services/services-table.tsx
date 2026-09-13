"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  MoreVertical,
  Eye,
  Trash2,
  CheckCircle2,
  Repeat,
  Zap,
} from "lucide-react";
import { ServiceItem } from "./types";
import {
  ColumnDef,
  ColumnSort,
  TableHeaderCell,
  TableActiveModifiers,
  TablePagination,
  TableEmptyState,
} from "@/components/ui/data-table";

interface ServicesTableProps {
  services: ServiceItem[];
  onSelectService?: (service: ServiceItem) => void;
  onDeleteService?: (id: string) => void;
  onToggleStatus?: (id: string, newStatus: boolean) => void;
}

const ALL_COLUMNS: ColumnDef[] = [
  { key: "createdOn", label: "Created On" },
  { key: "serviceName", label: "Service Name & Code" },
  { key: "category", label: "Category" },
  { key: "isRecurring", label: "Recurring" },
  { key: "recurrenceFrequency", label: "Frequency" },
  { key: "baseFee", label: "Professional Fee" },
  { key: "sopCount", label: "SOP" },
  { key: "subtasksCount", label: "Sub Tasks" },
  { key: "difficultyLevel", label: "Difficulty" },
  { key: "isActive", label: "Status" },
  { key: "updatedOn", label: "Updated On" },
];

export function ServicesTable({
  services,
  onSelectService,
  onDeleteService,
  onToggleStatus,
}: ServicesTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeRowMenuId, setActiveRowMenuId] = useState<string | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);

  // Column operations state
  const [openColumnMenuKey, setOpenColumnMenuKey] = useState<string | null>(null);
  const [columnSort, setColumnSort] = useState<ColumnSort | null>(null);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [hiddenColumnKeys, setHiddenColumnKeys] = useState<string[]>([]);

  // Close menus on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!(event.target as HTMLElement).closest(".row-action-menu-container")) {
        setActiveRowMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectAll = () => {
    if (selectedIds.length === services.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(services.map((s) => s.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const getFieldValue = (s: ServiceItem, key: string): string | number => {
    switch (key) {
      case "createdOn":
        return s.createdOn;
      case "serviceName":
        return `${s.serviceName} ${s.serviceCode}`;
      case "category":
        return s.category;
      case "isRecurring":
        return s.isRecurring ? 1 : 0;
      case "recurrenceFrequency":
        return s.recurrenceFrequency;
      case "baseFee":
        return s.baseFee;
      case "sopCount":
        return s.sopCount;
      case "subtasksCount":
        return s.subtasksCount;
      case "difficultyLevel": {
        const order: Record<string, number> = { Beginner: 1, Intermediate: 2, Advanced: 3, Expert: 4 };
        return order[s.difficultyLevel] || 0;
      }
      case "isActive":
        return s.isActive ? 1 : 0;
      case "updatedOn":
        return s.updatedOn;
      default:
        return "";
    }
  };

  // Process services through column filters and sorting
  const processedServices = useMemo(() => {
    let result = [...services];

    // Apply column filters
    Object.entries(columnFilters).forEach(([key, filterText]) => {
      if (!filterText.trim()) return;
      const q = filterText.toLowerCase();
      result = result.filter((s) => {
        if (key === "isRecurring") {
          const recText = s.isRecurring ? "yes recurring" : "no non-recurring";
          return recText.includes(q);
        }
        if (key === "isActive") {
          const statusText = s.isActive ? "active" : "inactive";
          return statusText.includes(q);
        }
        const val = getFieldValue(s, key);
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
  }, [services, columnFilters, columnSort]);

  // Visible columns
  const visibleColumns = useMemo(() => {
    return ALL_COLUMNS.filter((c) => !hiddenColumnKeys.includes(c.key));
  }, [hiddenColumnKeys]);

  const totalPages = Math.ceil(processedServices.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = processedServices.slice(startIndex, startIndex + rowsPerPage);

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

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
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

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          {/* Table Header matching modern clean styling */}
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              {/* Checkbox */}
              <th className="py-3 px-4 w-10">
                <input
                  type="checkbox"
                  checked={services.length > 0 && selectedIds.length === services.length}
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
              <th className="py-3 px-4 w-12 text-right">
                <span>Actions</span>
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100">
            {currentRows.length === 0 ? (
              <TableEmptyState
                colSpan={visibleColumns.length + 2}
                title="No services found"
                subtitle={
                  hasActiveModifiers
                    ? "Try resetting column filters or search"
                    : 'Click "Add" or import your 3-sheet Service_SampleData.xlsx spreadsheet'
                }
                hasActiveModifiers={hasActiveModifiers}
                onResetAll={handleResetAll}
              />
            ) : (
              currentRows.map((service) => {
                const isSelected = selectedIds.includes(service.id);
                return (
                  <tr
                    key={service.id}
                    className={`hover:bg-slate-50/70 transition-colors group ${
                      isSelected ? "bg-indigo-50/30" : ""
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(service.id)}
                        className="rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                    </td>

                    {/* Visible Columns */}
                    {visibleColumns.map((col) => {
                      switch (col.key) {
                        case "createdOn":
                          return (
                            <td
                              key={col.key}
                              className="py-3 px-3 text-slate-500 font-mono text-[11px]"
                            >
                              {service.createdOn}
                            </td>
                          );
                        case "serviceName":
                          return (
                            <td
                              key={col.key}
                              className="py-3 px-3 font-semibold text-slate-900"
                            >
                              <div>
                                <button
                                  type="button"
                                  onClick={() => onSelectService?.(service)}
                                  className="font-bold text-slate-900 block group-hover:text-indigo-600 transition-colors cursor-pointer text-left truncate max-w-[240px]"
                                  title={service.serviceName}
                                >
                                  {service.serviceName}
                                </button>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="font-mono text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200">
                                    {service.serviceCode}
                                  </span>
                                  <span className="text-[10px] text-slate-400 font-mono">
                                    SAC: {service.sacCode}
                                  </span>
                                </div>
                              </div>
                            </td>
                          );
                        case "category":
                          return (
                            <td key={col.key} className="py-3 px-3">
                              <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-medium text-[11px] border border-indigo-100">
                                {service.category}
                              </span>
                            </td>
                          );
                        case "isRecurring":
                          return (
                            <td key={col.key} className="py-3 px-3">
                              {service.isRecurring ? (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 font-bold text-[10px] border border-purple-200">
                                  <Repeat className="size-3" />
                                  <span>Yes</span>
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium text-[10px] border border-slate-200">
                                  <Zap className="size-3 text-slate-400" />
                                  <span>No</span>
                                </span>
                              )}
                            </td>
                          );
                        case "recurrenceFrequency":
                          return (
                            <td
                              key={col.key}
                              className="py-3 px-3 text-slate-700 font-medium"
                            >
                              {service.recurrenceFrequency}
                            </td>
                          );
                        case "baseFee":
                          return (
                            <td
                              key={col.key}
                              className="py-3 px-3 font-mono font-bold text-slate-900"
                            >
                              ₹{service.baseFee.toLocaleString("en-IN")}
                            </td>
                          );
                        case "sopCount":
                          return (
                            <td
                              key={col.key}
                              className="py-3 px-3"
                            >
                              <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 font-bold text-[10px] border border-sky-200">
                                {service.sopCount} SOPs
                              </span>
                            </td>
                          );
                        case "subtasksCount":
                          return (
                            <td
                              key={col.key}
                              className="py-3 px-3"
                            >
                              <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-[10px] border border-indigo-200">
                                {service.subtasksCount} Tasks
                              </span>
                            </td>
                          );
                        case "difficultyLevel":
                          return (
                            <td key={col.key} className="py-3 px-3">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  service.difficultyLevel === "Beginner"
                                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                    : service.difficultyLevel === "Intermediate"
                                    ? "bg-sky-50 text-sky-700 border border-sky-200"
                                    : service.difficultyLevel === "Advanced"
                                    ? "bg-purple-50 text-purple-700 border border-purple-200"
                                    : "bg-rose-50 text-rose-700 border border-rose-200"
                                }`}
                              >
                                {service.difficultyLevel}
                              </span>
                            </td>
                          );
                        case "isActive":
                          return (
                            <td key={col.key} className="py-3 px-3">
                              <button
                                type="button"
                                onClick={() => onToggleStatus?.(service.id, !service.isActive)}
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-colors cursor-pointer border ${
                                  service.isActive
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                    : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                                }`}
                              >
                                {service.isActive && <CheckCircle2 className="size-3" />}
                                <span>{service.isActive ? "Active" : "Inactive"}</span>
                              </button>
                            </td>
                          );
                        case "updatedOn":
                          return (
                            <td
                              key={col.key}
                              className="py-3 px-3 text-slate-500 font-mono text-[11px]"
                            >
                              {service.updatedOn}
                            </td>
                          );
                        default:
                          return null;
                      }
                    })}

                    {/* Actions Menu */}
                    <td className="py-3 px-4 w-12 text-right relative row-action-menu-container">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveRowMenuId(activeRowMenuId === service.id ? null : service.id);
                        }}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <MoreVertical className="size-4" />
                      </button>

                      {activeRowMenuId === service.id && (
                        <div className="absolute right-4 top-10 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100 text-left">
                          <button
                            type="button"
                            onClick={() => {
                              onSelectService?.(service);
                              setActiveRowMenuId(null);
                            }}
                            className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium cursor-pointer"
                          >
                            <Eye className="size-3.5 text-indigo-600" />
                            <span>View Details</span>
                          </button>
                          {onToggleStatus && (
                            <button
                              type="button"
                              onClick={() => {
                                onToggleStatus(service.id, !service.isActive);
                                setActiveRowMenuId(null);
                              }}
                              className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium cursor-pointer"
                            >
                              <Repeat className="size-3.5 text-slate-600" />
                              <span>{service.isActive ? "Deactivate" : "Activate"}</span>
                            </button>
                          )}
                          {onDeleteService && (
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete "${service.serviceName}"?`)) {
                                  onDeleteService(service.id);
                                }
                                setActiveRowMenuId(null);
                              }}
                              className="w-full px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium cursor-pointer"
                            >
                              <Trash2 className="size-3.5 text-rose-600" />
                              <span>Delete Service</span>
                            </button>
                          )}
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
        filteredCount={processedServices.length}
        totalCount={services.length}
        startIndex={startIndex}
        rowsPerPage={rowsPerPage}
        currentPage={currentPage}
        totalPages={totalPages}
        entityName="services"
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
