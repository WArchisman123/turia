"use client";

import React, { useState, useMemo } from "react";
import { SubTaskItem } from "./types";
import {
  Zap,
  Hourglass,
  Clock,
  Eye,
  Edit,
  Flame,
  CheckCircle2,
  PauseCircle,
  XCircle,
  Layers,
  Search,
  MoreVertical,
  Check,
} from "lucide-react";
import {
  ColumnDef,
  ColumnSort,
  TableHeaderCell,
  TableActiveModifiers,
  TablePagination,
  TableEmptyState,
} from "@/components/ui/data-table";

interface SubTasksTabProps {
  subtasks: SubTaskItem[];
  onToggleSubtask?: (id: string, isCompleted: boolean) => void;
}

const SUBTASK_COLUMNS: ColumnDef[] = [
  { key: "taskId", label: "Task ID" },
  { key: "parentTaskTitle", label: "Task Name" },
  { key: "clientName", label: "Client" },
  { key: "serviceName", label: "Service" },
  { key: "title", label: "Sub-Task" },
  { key: "status", label: "Status" },
  { key: "assignedToName", label: "Assignee" },
  { key: "dueDate", label: "Due Date" },
  { key: "priority", label: "Priority" },
  { key: "category", label: "Category" },
];

export function SubTasksTab({ subtasks, onToggleSubtask }: SubTasksTabProps) {
  const [scope, setScope] = useState<"all" | "my" | "due_today">("all");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);

  const [openColumnMenuKey, setOpenColumnMenuKey] = useState<string | null>(null);
  const [columnSort, setColumnSort] = useState<ColumnSort | null>(null);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [hiddenColumnKeys, setHiddenColumnKeys] = useState<string[]>([]);

  // Filter and sort subtasks
  const processedSubtasks = useMemo(() => {
    let result = [...subtasks];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.parentTaskTitle.toLowerCase().includes(q) ||
          s.clientName.toLowerCase().includes(q) ||
          s.serviceName.toLowerCase().includes(q)
      );
    }

    if (scope === "my") {
      result = result.filter((s) => s.assignedToName.includes("Archi"));
    } else if (scope === "due_today") {
      result = result.filter((s) => s.dueDate === "10/09/2026" || s.dueDate === "Today");
    }

    if (selectedStatus) {
      result = result.filter((s) => s.status === selectedStatus);
    }

    // Column Filters
    Object.entries(columnFilters).forEach(([key, val]) => {
      if (!val) return;
      const lower = val.toLowerCase();
      result = result.filter((item) => {
        const fieldVal = String(item[key as keyof SubTaskItem] || "");
        return fieldVal.toLowerCase().includes(lower);
      });
    });

    // Column Sort
    if (columnSort) {
      result.sort((a, b) => {
        const valA = String(a[columnSort.key as keyof SubTaskItem] || "");
        const valB = String(b[columnSort.key as keyof SubTaskItem] || "");
        return columnSort.direction === "asc"
          ? valA.localeCompare(valB, undefined, { numeric: true })
          : valB.localeCompare(valA, undefined, { numeric: true });
      });
    }

    return result;
  }, [subtasks, searchQuery, scope, selectedStatus, columnFilters, columnSort]);

  const visibleColumns = useMemo(() => {
    return SUBTASK_COLUMNS.filter((c) => !hiddenColumnKeys.includes(c.key));
  }, [hiddenColumnKeys]);

  const totalPages = Math.ceil(processedSubtasks.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = processedSubtasks.slice(startIndex, startIndex + rowsPerPage);

  const allSelected =
    currentRows.length > 0 && currentRows.every((r) => selectedIds.includes(r.id));
  const handleSelectAll = () => {
    if (allSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(currentRows.map((r) => r.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleClearFilters = () => {
    setColumnSort(null);
    setColumnFilters({});
    setHiddenColumnKeys([]);
    setSearchQuery("");
    setScope("all");
    setSelectedStatus(null);
    setCurrentPage(1);
  };

  // KPI counts
  const kpis = useMemo(() => {
    return {
      wip: subtasks.filter((s) => (s.status as string) === "wip").length,
      pending: subtasks.filter((s) => s.status === "pending").length,
      inProgress: subtasks.filter((s) => s.status === "in_progress").length,
      sentForReview: subtasks.filter((s) => s.status === "sent_for_review").length,
      requestChanges: subtasks.filter((s) => s.status === "request_changes").length,
      overdue: subtasks.filter((s) => s.status === "overdue").length,
      completed: subtasks.filter((s) => s.status === "completed").length,
      onHold: subtasks.filter((s) => s.status === "on_hold").length,
      cancelled: subtasks.filter((s) => s.status === "cancelled").length,
      allSubTasks: subtasks.length,
    };
  }, [subtasks]);

  const subtaskKpiCards = [
    { key: "wip", label: "WIP", value: kpis.wip, icon: Zap, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100" },
    { key: "pending", label: "Pending", value: kpis.pending, icon: Hourglass, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
    { key: "in_progress", label: "In Progress", value: kpis.inProgress, icon: Clock, color: "text-cyan-600", bg: "bg-cyan-50", border: "border-cyan-100" },
    { key: "sent_for_review", label: "Sent for Review", value: kpis.sentForReview, icon: Eye, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100" },
    { key: "request_changes", label: "Request Changes", value: kpis.requestChanges, icon: Edit, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100" },
    { key: "overdue", label: "Overdue", value: kpis.overdue, icon: Flame, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },
    { key: "completed", label: "Completed", value: kpis.completed, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
    { key: "on_hold", label: "On Hold", value: kpis.onHold, icon: PauseCircle, color: "text-slate-600", bg: "bg-slate-100", border: "border-slate-200" },
    { key: "cancelled", label: "Cancelled", value: kpis.cancelled, icon: XCircle, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },
    { key: "all", label: "All Sub Task", value: kpis.allSubTasks, icon: Layers, color: "text-indigo-700", bg: "bg-indigo-50", border: "border-indigo-100" },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* 10 Status KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2.5">
        {subtaskKpiCards.map((card) => {
          const Icon = card.icon;
          const isSelected =
            card.key === "all" ? selectedStatus === null : selectedStatus === card.key;
          return (
            <button
              key={card.key}
              type="button"
              onClick={() => {
                if (card.key === "all") {
                  setSelectedStatus(null);
                } else {
                  setSelectedStatus((prev) => (prev === card.key ? null : card.key));
                }
                setCurrentPage(1);
              }}
              className={`bg-white rounded-xl border p-3 shadow-2xs flex flex-col justify-between transition-all text-left cursor-pointer hover:border-slate-300 ${
                isSelected
                  ? "ring-2 ring-indigo-500 border-indigo-400 bg-indigo-50/20 shadow-xs"
                  : "border-slate-200/80"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xl font-bold tracking-tight ${card.color}`}>
                  {card.value}
                </span>
                <div
                  className={`size-6 rounded-md ${card.bg} ${card.border} border flex items-center justify-center ${card.color}`}
                >
                  <Icon className="size-3.5" />
                </div>
              </div>
              <p className="text-[10px] font-semibold text-slate-500 truncate leading-tight">
                {card.label}
              </p>
            </button>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        {/* Scope Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { label: "All Sub Tasks", key: "all" },
            { label: "My Sub Tasks", key: "my" },
            { label: "Due Today", key: "due_today" },
          ].map((sc) => (
            <button
              key={sc.key}
              type="button"
              onClick={() => setScope(sc.key as typeof scope)}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                scope === sc.key
                  ? "bg-[#6366F1] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {sc.label}
            </button>
          ))}

          <button
            type="button"
            onClick={handleClearFilters}
            className="px-2.5 py-1 rounded-lg border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 text-[11px] font-semibold transition-colors cursor-pointer"
          >
            Clear Filter
          </button>
        </div>

        {/* Right Search */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="size-3.5 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search sub-tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-48 sm:w-64"
            />
          </div>

          <button
            type="button"
            className="p-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-600 transition-colors cursor-pointer shadow-2xs"
          >
            <MoreVertical className="size-4" />
          </button>
        </div>
      </div>

      {/* 10-Column Checklist Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <TableActiveModifiers
          columns={SUBTASK_COLUMNS}
          columnSort={columnSort}
          columnFilters={columnFilters}
          hiddenColumnKeys={hiddenColumnKeys}
          onClearSort={() => setColumnSort(null)}
          onClearFilter={(k) => setColumnFilters((p) => ({ ...p, [k]: "" }))}
          onToggleColumnVisibility={(k) =>
            setHiddenColumnKeys((p) =>
              p.includes(k) ? p.filter((x) => x !== k) : [...p, k]
            )
          }
          onResetAll={handleClearFilters}
        />

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4 w-10">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={handleSelectAll}
                    className="rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer size-3.5"
                  />
                </th>

                {visibleColumns.map((col, index) => (
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
                    onToggleSort={() => {
                      if (!columnSort || columnSort.key !== col.key) {
                        setColumnSort({ key: col.key, direction: "asc" });
                      } else if (columnSort.direction === "asc") {
                        setColumnSort({ key: col.key, direction: "desc" });
                      } else {
                        setColumnSort(null);
                      }
                    }}
                    onSetSort={(dir) => {
                      setColumnSort({ key: col.key, direction: dir });
                      setOpenColumnMenuKey(null);
                    }}
                    onClearSort={() => {
                      setColumnSort(null);
                      setOpenColumnMenuKey(null);
                    }}
                    onSetFilter={(val) => {
                      setColumnFilters((prev) => ({ ...prev, [col.key]: val }));
                      setCurrentPage(1);
                    }}
                    onHideColumn={() => {
                      setHiddenColumnKeys((prev) => [...prev, col.key]);
                      setOpenColumnMenuKey(null);
                    }}
                    menuAlign={index >= visibleColumns.length - 3 ? "right" : "left"}
                  />
                ))}

                <th className="py-3 px-4 w-12 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentRows.length === 0 ? (
                <TableEmptyState
                  colSpan={visibleColumns.length + 2}
                  title="No sub-tasks found"
                  subtitle="Verification checklist steps will appear here"
                  hasActiveModifiers={Boolean(columnSort) || Object.keys(columnFilters).length > 0}
                  onResetAll={handleClearFilters}
                />
              ) : (
                currentRows.map((sub) => {
                  const isSelected = selectedIds.includes(sub.id);
                  const isDone = sub.status === "completed";
                  return (
                    <tr
                      key={sub.id}
                      className={`hover:bg-slate-50/70 transition-colors group ${
                        isSelected ? "bg-indigo-50/30" : ""
                      }`}
                    >
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(sub.id)}
                          className="rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer size-3.5"
                        />
                      </td>

                      {visibleColumns.map((col) => {
                        switch (col.key) {
                          case "taskId":
                            return (
                              <td key={col.key} className="py-3 px-3 font-mono text-[10px] text-indigo-700 font-bold whitespace-nowrap">
                                <span className="bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                                  {sub.taskId.slice(0, 8).toUpperCase()}
                                </span>
                              </td>
                            );
                          case "parentTaskTitle":
                            return (
                              <td key={col.key} className="py-3 px-3 font-semibold text-slate-800 max-w-[200px] truncate">
                                {sub.parentTaskTitle}
                              </td>
                            );
                          case "clientName":
                            return (
                              <td key={col.key} className="py-3 px-3 text-slate-700 font-medium whitespace-nowrap">
                                {sub.clientName}
                              </td>
                            );
                          case "serviceName":
                            return (
                              <td key={col.key} className="py-3 px-3 text-slate-600 text-xs truncate max-w-[150px]">
                                {sub.serviceName}
                              </td>
                            );
                          case "title":
                            return (
                              <td key={col.key} className="py-3 px-3 font-medium text-slate-900 max-w-[240px]">
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => onToggleSubtask?.(sub.id, !isDone)}
                                    className={`size-4 rounded border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                                      isDone
                                        ? "bg-emerald-600 border-emerald-600 text-white"
                                        : "border-slate-300 hover:border-indigo-500"
                                    }`}
                                  >
                                    {isDone && <Check className="size-3" />}
                                  </button>
                                  <span className={`truncate text-xs ${isDone ? "line-through text-slate-400" : "text-slate-800 font-medium"}`}>
                                    {sub.title}
                                  </span>
                                </div>
                              </td>
                            );
                          case "status":
                            return (
                              <td key={col.key} className="py-3 px-3 whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                    isDone
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                      : sub.status === "overdue"
                                      ? "bg-rose-50 text-rose-700 border-rose-200"
                                      : "bg-amber-50 text-amber-700 border-amber-200"
                                  }`}
                                >
                                  <span
                                    className={`size-1.5 rounded-full ${
                                      isDone
                                        ? "bg-emerald-500"
                                        : sub.status === "overdue"
                                        ? "bg-rose-500"
                                        : "bg-amber-500"
                                    }`}
                                  />
                                  {sub.status.replace(/_/g, " ")}
                                </span>
                              </td>
                            );
                          case "assignedToName":
                            return (
                              <td key={col.key} className="py-3 px-3 text-slate-700 whitespace-nowrap">
                                {sub.assignedToName}
                              </td>
                            );
                          case "dueDate":
                            return (
                              <td key={col.key} className="py-3 px-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                                {sub.dueDate}
                              </td>
                            );
                          case "priority":
                            return (
                              <td key={col.key} className="py-3 px-3 whitespace-nowrap">
                                <span
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                                    sub.priority === "urgent" || sub.priority === "high"
                                      ? "bg-rose-50 text-rose-700 border-rose-200"
                                      : "bg-slate-100 text-slate-600 border-slate-200"
                                  }`}
                                >
                                  {sub.priority}
                                </span>
                              </td>
                            );
                          case "category":
                            return (
                              <td key={col.key} className="py-3 px-3 whitespace-nowrap">
                                <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-medium text-[11px] border border-indigo-100">
                                  {sub.category}
                                </span>
                              </td>
                            );
                          default:
                            return <td key={col.key} className="py-3 px-3">{String(sub[col.key as keyof SubTaskItem] || "—")}</td>;
                        }
                      })}

                      <td className="py-3 px-4 text-right">
                        <button
                          type="button"
                          onClick={() => onToggleSubtask?.(sub.id, !isDone)}
                          className="p-1 text-slate-400 hover:text-indigo-600 cursor-pointer"
                          title={isDone ? "Mark incomplete" : "Mark complete"}
                        >
                          <CheckCircle2 className={`size-4 ${isDone ? "text-emerald-600" : "text-slate-300 hover:text-emerald-500"}`} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <TablePagination
          totalCount={subtasks.length}
          filteredCount={processedSubtasks.length}
          startIndex={startIndex}
          rowsPerPage={rowsPerPage}
          currentPage={currentPage}
          totalPages={totalPages}
          entityName="sub-tasks"
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
