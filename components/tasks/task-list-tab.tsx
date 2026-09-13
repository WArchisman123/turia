"use client";

import React, { useState, useMemo, useEffect } from "react";
import {
  TaskItem,
  TaskKpiData,
  TaskFilterState,
} from "./types";
import {
  Zap,
  Hourglass,
  Clock,
  Eye,
  Edit,
  Flame,
  CheckCircle2,
  Banknote,
  PauseCircle,
  XCircle,
  Layers,
  Search,
  Filter as FilterIcon,
  MoreVertical,
  Trash2,
  Check,
  RotateCw,
} from "lucide-react";
import {
  ColumnDef,
  ColumnSort,
  TableHeaderCell,
  TableActiveModifiers,
  TablePagination,
  TableEmptyState,
} from "@/components/ui/data-table";
import { TaskFilterDrawer } from "./task-filter-drawer";

interface TaskListTabProps {
  tasks: TaskItem[];
  kpi: TaskKpiData;
  onUpdateTaskStatus?: (id: string, newStatus: TaskItem["status"]) => void;
  onDeleteTask?: (id: string) => void;
}

const ALL_COLUMNS: ColumnDef[] = [
  { key: "taskCode", label: "ID" },
  { key: "taskTitle", label: "Task Name" },
  { key: "clientName", label: "Business Name" },
  { key: "panNumber", label: "PAN Number" },
  { key: "legalName", label: "Legal Name" },
  { key: "category", label: "Category" },
  { key: "serviceName", label: "Service" },
  { key: "difficultyLevel", label: "Difficulty Level" },
  { key: "taskType", label: "Task Type" },
  { key: "billingStatus", label: "Billing Status" },
  { key: "status", label: "Status" },
  { key: "completionPercentage", label: "Completion %" },
  { key: "recurrenceFrequency", label: "Frequency" },
];

export function TaskListTab({
  tasks,
  kpi,
  onUpdateTaskStatus,
  onDeleteTask,
}: TaskListTabProps) {
  // Filters state
  const [filters, setFilters] = useState<TaskFilterState>({
    scope: "all",
    statusList: [],
    priorityList: [],
    dueTodayOnly: false,
    assignedTo: "All",
    department: "All",
    billingStatus: "All",
    taskType: "All",
    category: "All",
    searchQuery: "",
  });

  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeRowMenuId, setActiveRowMenuId] = useState<string | null>(null);

  // Table controls
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);
  const [openColumnMenuKey, setOpenColumnMenuKey] = useState<string | null>(null);
  const [columnSort, setColumnSort] = useState<ColumnSort | null>(null);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [hiddenColumnKeys, setHiddenColumnKeys] = useState<string[]>([]);

  // Close row action menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!(event.target as HTMLElement).closest(".row-action-menu-container")) {
        setActiveRowMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter and sort items
  const processedTasks = useMemo(() => {
    let result = [...tasks];

    // Search query filter
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.taskTitle.toLowerCase().includes(q) ||
          t.taskCode.toLowerCase().includes(q) ||
          t.clientName.toLowerCase().includes(q) ||
          t.serviceName.toLowerCase().includes(q) ||
          (t.panNumber && t.panNumber.toLowerCase().includes(q))
      );
    }

    // Scope filter
    if (filters.scope === "my_tasks") {
      result = result.filter((t) => t.assignedToName.includes("Archi"));
    } else if (filters.scope === "due_today") {
      result = result.filter((t) => t.dueDate === "10/09/2026" || t.dueDate === "Today");
    } else if (filters.scope === "live_task") {
      result = result.filter((t) => t.status === "in_progress" || t.status === "wip");
    }

    // Status multi-select filter
    if (filters.statusList.length > 0) {
      result = result.filter((t) => filters.statusList.includes(t.status));
    }

    // Priority multi-select filter
    if (filters.priorityList.length > 0) {
      result = result.filter((t) => filters.priorityList.includes(t.priority));
    }

    // Due Today checkbox
    if (filters.dueTodayOnly) {
      result = result.filter((t) => t.dueDate === "10/09/2026" || t.dueDate === "Today");
    }

    // Billing Status filter
    if (filters.billingStatus !== "All") {
      result = result.filter((t) => t.billingStatus === filters.billingStatus);
    }

    // Task Type filter
    if (filters.taskType !== "All") {
      result = result.filter((t) => t.taskType === filters.taskType);
    }

    // Category filter
    if (filters.category !== "All") {
      result = result.filter((t) => t.category.toLowerCase().includes(filters.category.toLowerCase()));
    }

    // Column Header Inline Filters
    Object.entries(columnFilters).forEach(([key, val]) => {
      if (!val) return;
      const lower = val.toLowerCase();
      result = result.filter((item) => {
        const fieldVal = String(item[key as keyof TaskItem] || "");
        return fieldVal.toLowerCase().includes(lower);
      });
    });

    // Column Header Sorting
    if (columnSort) {
      result.sort((a, b) => {
        const valA = String(a[columnSort.key as keyof TaskItem] || "");
        const valB = String(b[columnSort.key as keyof TaskItem] || "");
        return columnSort.direction === "asc"
          ? valA.localeCompare(valB, undefined, { numeric: true })
          : valB.localeCompare(valA, undefined, { numeric: true });
      });
    }

    return result;
  }, [tasks, filters, columnFilters, columnSort]);

  // Visible columns
  const visibleColumns = useMemo(() => {
    return ALL_COLUMNS.filter((c) => !hiddenColumnKeys.includes(c.key));
  }, [hiddenColumnKeys]);

  // Pagination
  const totalPages = Math.ceil(processedTasks.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = processedTasks.slice(startIndex, startIndex + rowsPerPage);

  const allSelected = currentRows.length > 0 && currentRows.every((r) => selectedIds.includes(r.id));
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

  const handleToggleColumnSort = (key: string) => {
    if (!columnSort || columnSort.key !== key) {
      setColumnSort({ key, direction: "asc" });
    } else if (columnSort.direction === "asc") {
      setColumnSort({ key, direction: "desc" });
    } else {
      setColumnSort(null);
    }
  };

  const handleSetSort = (key: string, direction: "asc" | "desc") => {
    setColumnSort({ key, direction });
    setOpenColumnMenuKey(null);
  };

  const handleClearSort = () => {
    setColumnSort(null);
    setOpenColumnMenuKey(null);
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
    setFilters({
      scope: "all",
      statusList: [],
      priorityList: [],
      dueTodayOnly: false,
      assignedTo: "All",
      department: "All",
      billingStatus: "All",
      taskType: "All",
      category: "All",
      searchQuery: "",
    });
    setCurrentPage(1);
  };

  const hasActiveModifiers =
    Boolean(columnSort) ||
    Object.keys(columnFilters).length > 0 ||
    hiddenColumnKeys.length > 0;

  // 11 KPI Cards definitions (10 statuses + All Task)
  const kpiCards = [
    { key: "wip", label: "WIP", value: kpi.wip, icon: Zap, color: "text-indigo-600", bg: "bg-indigo-50", border: "border-indigo-100" },
    { key: "pending", label: "Pending", value: kpi.pending, icon: Hourglass, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
    { key: "in_progress", label: "In Progress", value: kpi.inProgress, icon: Clock, color: "text-cyan-600", bg: "bg-cyan-50", border: "border-cyan-100" },
    { key: "sent_for_review", label: "Sent for Review", value: kpi.sentForReview, icon: Eye, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100" },
    { key: "request_changes", label: "Request Changes", value: kpi.requestChanges, icon: Edit, color: "text-orange-600", bg: "bg-orange-50", border: "border-orange-100" },
    { key: "overdue", label: "Overdue", value: kpi.overdue, icon: Flame, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },
    { key: "completed", label: "Completed", value: kpi.completed, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
    { key: "ready_to_bill", label: "Ready to Bill", value: kpi.readyToBill, icon: Banknote, color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-100" },
    { key: "on_hold", label: "On Hold", value: kpi.onHold, icon: PauseCircle, color: "text-slate-600", bg: "bg-slate-100", border: "border-slate-200" },
    { key: "cancelled", label: "Cancelled", value: kpi.cancelled, icon: XCircle, color: "text-rose-600", bg: "bg-rose-50", border: "border-rose-100" },
    { key: "all", label: "All Task", value: kpi.allTasks, icon: Layers, color: "text-indigo-700", bg: "bg-indigo-50", border: "border-indigo-100" },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Category Selection Bar */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="px-3 py-1 rounded-full text-xs font-semibold bg-[#6366F1] text-white shadow-xs cursor-pointer"
        >
          All Categories
        </button>
        <button
          type="button"
          className="px-3 py-1 rounded-full text-xs font-semibold bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer shadow-2xs"
        >
          Manage
        </button>
      </div>

      {/* 11 Status KPI Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-11 gap-2.5">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          const isSelected =
            card.key === "all"
              ? filters.statusList.length === 0
              : filters.statusList.length === 1 && filters.statusList[0] === card.key;
          return (
            <button
              key={card.key}
              type="button"
              onClick={() => {
                if (card.key === "all") {
                  setFilters((prev) => ({ ...prev, statusList: [] }));
                } else {
                  setFilters((prev) => ({
                    ...prev,
                    statusList:
                      prev.statusList.includes(card.key) && prev.statusList.length === 1
                        ? []
                        : [card.key],
                  }));
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

      {/* Filters Toolbar */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        {/* Left: Quick Scope Pills & Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Scope Pills */}
          {[
            { label: "All Tasks", key: "all" },
            { label: "My Tasks", key: "my_tasks" },
            { label: "Due Today", key: "due_today" },
            { label: "Live Task", key: "live_task" },
          ].map((scope) => (
            <button
              key={scope.key}
              type="button"
              onClick={() => setFilters({ ...filters, scope: scope.key as TaskFilterState["scope"] })}
              className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                filters.scope === scope.key
                  ? "bg-[#6366F1] text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {scope.label}
            </button>
          ))}

          <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

          {/* Department Selector */}
          <select
            value={filters.department}
            onChange={(e) => setFilters({ ...filters, department: e.target.value })}
            className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 cursor-pointer font-medium"
          >
            <option value="All">All Dept ⌄</option>
            <option value="Direct Tax">Direct Tax</option>
            <option value="GST">GST</option>
            <option value="Audit">Audit</option>
            <option value="ROC">ROC</option>
          </select>

          {/* Assignees Selector */}
          <select
            value={filters.assignedTo}
            onChange={(e) => setFilters({ ...filters, assignedTo: e.target.value })}
            className="px-2.5 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 cursor-pointer font-medium"
          >
            <option value="All">All Assignees ⌄</option>
            <option value="Archi Saha">Archi Saha</option>
            <option value="Rahul Sen">Rahul Sen</option>
            <option value="Sneha Roy">Sneha Roy</option>
            <option value="Amitabh Ghosh">Amitabh Ghosh</option>
          </select>

          {/* Filter Drawer Trigger */}
          <button
            type="button"
            onClick={() => setIsFilterDrawerOpen(true)}
            className="px-3 py-1 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
          >
            <FilterIcon className="size-3 text-indigo-600" />
            <span>Filter</span>
          </button>
        </div>

        {/* Right: Search + Actions */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="size-3.5 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={filters.searchQuery}
              onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-44 sm:w-60"
            />
          </div>

          <button
            type="button"
            className="p-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-600 transition-colors cursor-pointer shadow-2xs"
            title="Options"
          >
            <MoreVertical className="size-4" />
          </button>
        </div>
      </div>

      {/* 14-Column Master Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <TableActiveModifiers
          columns={ALL_COLUMNS}
          columnSort={columnSort}
          columnFilters={columnFilters}
          hiddenColumnKeys={hiddenColumnKeys}
          onClearSort={handleClearSort}
          onClearFilter={(k) => handleSetFilter(k, "")}
          onToggleColumnVisibility={handleToggleColumnVisibility}
          onResetAll={handleResetAll}
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
                    onToggleSort={() => handleToggleColumnSort(col.key)}
                    onSetSort={(dir) => handleSetSort(col.key, dir)}
                    onClearSort={handleClearSort}
                    onSetFilter={(val) => handleSetFilter(col.key, val)}
                    onHideColumn={() => handleHideColumn(col.key)}
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
                  title="No compliance tasks found"
                  subtitle="Try adjusting your filters or click + Add Task to create one"
                  hasActiveModifiers={hasActiveModifiers}
                  onResetAll={handleResetAll}
                />
              ) : (
                currentRows.map((task) => {
                  const isSelected = selectedIds.includes(task.id);
                  return (
                    <tr
                      key={task.id}
                      className={`hover:bg-slate-50/70 transition-colors group ${
                        isSelected ? "bg-indigo-50/30" : ""
                      }`}
                    >
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleToggleSelect(task.id)}
                          className="rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer size-3.5"
                        />
                      </td>

                      {visibleColumns.map((col) => {
                        switch (col.key) {
                          case "taskCode":
                            return (
                              <td key={col.key} className="py-3 px-3 font-mono text-[10px] text-indigo-700 font-bold whitespace-nowrap">
                                <span className="bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-100">
                                  {task.taskCode}
                                </span>
                              </td>
                            );
                          case "taskTitle":
                            return (
                              <td key={col.key} className="py-3 px-3 font-semibold text-slate-900 max-w-[220px]">
                                <span className="block truncate text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                  {task.taskTitle}
                                </span>
                                <span className="text-[10px] text-slate-400 block mt-0.5 font-normal">
                                  Due: {task.dueDate}
                                </span>
                              </td>
                            );
                          case "clientName":
                            return (
                              <td key={col.key} className="py-3 px-3 text-slate-800 font-medium whitespace-nowrap truncate max-w-[160px]">
                                {task.clientName}
                              </td>
                            );
                          case "panNumber":
                            return (
                              <td key={col.key} className="py-3 px-3 font-mono text-[10px] text-slate-600 whitespace-nowrap">
                                {task.panNumber ? (
                                  <span className="bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                                    {task.panNumber}
                                  </span>
                                ) : (
                                  "—"
                                )}
                              </td>
                            );
                          case "legalName":
                            return (
                              <td key={col.key} className="py-3 px-3 text-slate-600 text-xs truncate max-w-[160px]">
                                {task.legalName || task.clientName}
                              </td>
                            );
                          case "category":
                            return (
                              <td key={col.key} className="py-3 px-3 whitespace-nowrap">
                                <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-medium text-[11px] border border-indigo-100">
                                  {task.category}
                                </span>
                              </td>
                            );
                          case "serviceName":
                            return (
                              <td key={col.key} className="py-3 px-3 text-slate-700 text-xs truncate max-w-[160px]">
                                {task.serviceName}
                              </td>
                            );
                          case "difficultyLevel":
                            return (
                              <td key={col.key} className="py-3 px-3 whitespace-nowrap">
                                <span
                                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                                    task.difficultyLevel === "Beginner"
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                      : task.difficultyLevel === "Intermediate"
                                      ? "bg-amber-50 text-amber-700 border-amber-200"
                                      : task.difficultyLevel === "Advanced"
                                      ? "bg-rose-50 text-rose-700 border-rose-200"
                                      : "bg-purple-50 text-purple-700 border-purple-200"
                                  }`}
                                >
                                  {task.difficultyLevel}
                                </span>
                              </td>
                            );
                          case "taskType":
                            return (
                              <td key={col.key} className="py-3 px-3 text-xs text-slate-600 whitespace-nowrap">
                                {task.taskType}
                              </td>
                            );
                          case "billingStatus":
                            return (
                              <td key={col.key} className="py-3 px-3 whitespace-nowrap">
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                    task.billingStatus === "Billable"
                                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                      : "bg-slate-100 text-slate-600 border border-slate-200"
                                  }`}
                                >
                                  {task.billingStatus}
                                </span>
                              </td>
                            );
                          case "status":
                            return (
                              <td key={col.key} className="py-3 px-3 whitespace-nowrap">
                                <span
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                    task.status === "completed" || task.status === "ready_to_bill"
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                      : task.status === "overdue"
                                      ? "bg-rose-50 text-rose-700 border-rose-200"
                                      : task.status === "in_progress" || task.status === "wip"
                                      ? "bg-cyan-50 text-cyan-700 border-cyan-200"
                                      : task.status === "sent_for_review"
                                      ? "bg-purple-50 text-purple-700 border-purple-200"
                                      : "bg-amber-50 text-amber-700 border-amber-200"
                                  }`}
                                >
                                  <span
                                    className={`size-1.5 rounded-full ${
                                      task.status === "completed"
                                        ? "bg-emerald-500"
                                        : task.status === "overdue"
                                        ? "bg-rose-500"
                                        : "bg-amber-500"
                                    }`}
                                  />
                                  {task.status.replace(/_/g, " ")}
                                </span>
                              </td>
                            );
                          case "completionPercentage":
                            return (
                              <td key={col.key} className="py-3 px-3 whitespace-nowrap">
                                <div className="flex items-center gap-2">
                                  <div className="w-12 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                    <div
                                      className="bg-indigo-600 h-1.5 rounded-full"
                                      style={{ width: `${task.completionPercentage}%` }}
                                    />
                                  </div>
                                  <span className="text-[10px] font-bold text-slate-700">
                                    {task.completionPercentage}%
                                  </span>
                                </div>
                              </td>
                            );
                          case "recurrenceFrequency":
                            return (
                              <td key={col.key} className="py-3 px-3 text-xs text-slate-500 whitespace-nowrap">
                                {task.recurrenceFrequency || "—"}
                              </td>
                            );
                          default:
                            return <td key={col.key} className="py-3 px-3">{String(task[col.key as keyof TaskItem] || "—")}</td>;
                        }
                      })}

                      {/* Row Actions 3-dot Menu */}
                      <td className="py-3 px-4 text-right">
                        <div className="row-action-menu-container relative inline-block text-left">
                          <button
                            type="button"
                            onClick={() =>
                              setActiveRowMenuId(activeRowMenuId === task.id ? null : task.id)
                            }
                            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                          >
                            <MoreVertical className="size-4" />
                          </button>

                          {activeRowMenuId === task.id && (
                            <div className="absolute right-0 top-8 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-20 animate-in fade-in zoom-in-95 duration-100 text-xs text-slate-700">
                              <button
                                type="button"
                                onClick={() => {
                                  onUpdateTaskStatus?.(task.id, "completed");
                                  setActiveRowMenuId(null);
                                }}
                                className="w-full px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-left font-medium cursor-pointer"
                              >
                                <Check className="size-3.5 text-emerald-600" />
                                <span>Mark Completed</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  onUpdateTaskStatus?.(task.id, "in_progress");
                                  setActiveRowMenuId(null);
                                }}
                                className="w-full px-3.5 py-2 hover:bg-slate-50 flex items-center gap-2 text-left font-medium cursor-pointer"
                              >
                                <RotateCw className="size-3.5 text-indigo-600" />
                                <span>Set In Progress</span>
                              </button>
                              <div className="border-t border-slate-100 my-1" />
                              <button
                                type="button"
                                onClick={() => {
                                  onDeleteTask?.(task.id);
                                  setActiveRowMenuId(null);
                                }}
                                className="w-full px-3.5 py-2 hover:bg-rose-50 text-rose-600 flex items-center gap-2 text-left font-medium cursor-pointer"
                              >
                                <Trash2 className="size-3.5" />
                                <span>Delete Task</span>
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
          totalCount={tasks.length}
          filteredCount={processedTasks.length}
          startIndex={startIndex}
          rowsPerPage={rowsPerPage}
          currentPage={currentPage}
          totalPages={totalPages}
          entityName="tasks"
          onRowsPerPageChange={(n) => {
            setRowsPerPage(n);
            setCurrentPage(1);
          }}
          onPageChange={setCurrentPage}
          rowsPerPageOptions={[20, 50, 100]}
        />
      </div>

      {/* Slide-over Filter Panel */}
      <TaskFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onFilterChange={setFilters}
        onClearAll={handleResetAll}
      />
    </div>
  );
}
