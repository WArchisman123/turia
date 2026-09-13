"use client";

import React, { useState, useMemo } from "react";
import {
  TaskItem,
  SummaryDimensionKey,
  SummaryRowData,
} from "./types";
import { Search, Download, HelpCircle, X } from "lucide-react";

interface TaskSummaryTabProps {
  tasks: TaskItem[];
}

const GROUP_DIMENSIONS: { key: SummaryDimensionKey; label: string }[] = [
  { key: "assigned_to", label: "Assigned To" },
  { key: "category", label: "Category" },
  { key: "client", label: "Client" },
  { key: "service", label: "Service" },
  { key: "priority", label: "Priority" },
  { key: "task_type", label: "Task Type" },
  { key: "month", label: "Month" },
  { key: "financial_year", label: "Financial Year" },
];

export function TaskSummaryTab({ tasks }: TaskSummaryTabProps) {
  const [activeDimension, setActiveDimension] = useState<SummaryDimensionKey>("assigned_to");
  const [searchQuery, setSearchQuery] = useState("");
  const [isHeatMapActive, setIsHeatMapActive] = useState(false);
  const [isHeatMapGuideOpen, setIsHeatMapGuideOpen] = useState(false);

  // Group tasks dynamically based on active dimension
  const summaryRows = useMemo(() => {
    const groups: Record<string, TaskItem[]> = {};

    tasks.forEach((task) => {
      let groupKey = "Unassigned";
      switch (activeDimension) {
        case "assigned_to":
          groupKey = task.assignedToName || "Unassigned";
          break;
        case "category":
          groupKey = task.category || "General";
          break;
        case "client":
          groupKey = task.clientName || "Unknown Client";
          break;
        case "service":
          groupKey = task.serviceName || "Other Service";
          break;
        case "priority":
          groupKey = (task.priority.charAt(0).toUpperCase() + task.priority.slice(1)) || "Normal";
          break;
        case "task_type":
          groupKey = task.taskType || "Recurring";
          break;
        case "month":
          groupKey = task.period || "Current Month";
          break;
        case "financial_year":
          groupKey = task.financialYear || "FY 2026 - 2027";
          break;
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(task);
    });

    const rows: SummaryRowData[] = Object.entries(groups).map(([label, items]) => {
      const pending = items.filter((t) => t.status === "pending").length;
      const inProgress = items.filter((t) => t.status === "in_progress" || t.status === "wip").length;
      const sentForReview = items.filter((t) => t.status === "sent_for_review").length;
      const requestChanges = items.filter((t) => t.status === "request_changes").length;
      const wipSubTotal = pending + inProgress + sentForReview + requestChanges;

      const overdue = items.filter((t) => t.status === "overdue").length;
      const dueToday = items.filter((t) => t.dueDate === "10/09/2026" || t.dueDate === "Today").length;
      const completed = items.filter((t) => t.status === "completed").length;
      const readyToBill = items.filter((t) => t.status === "ready_to_bill").length;
      const onHold = items.filter((t) => t.status === "on_hold").length;
      const cancelled = items.filter((t) => t.status === "cancelled").length;
      const total = wipSubTotal + overdue + completed + readyToBill + onHold + cancelled;
      const donePercentage = total > 0 ? Math.round(((completed + readyToBill) / total) * 100) : 0;

      return {
        key: label,
        label,
        pending,
        inProgress,
        sentForReview,
        requestChanges,
        wipSubTotal,
        overdue,
        dueToday,
        completed,
        readyToBill,
        onHold,
        cancelled,
        total,
        donePercentage,
      };
    });

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return rows.filter((r) => r.label.toLowerCase().includes(q));
    }

    return rows;
  }, [tasks, activeDimension, searchQuery]);

  // Grand Total calculation
  const grandTotal = useMemo(() => {
    return summaryRows.reduce(
      (acc, r) => {
        acc.pending += r.pending;
        acc.inProgress += r.inProgress;
        acc.sentForReview += r.sentForReview;
        acc.requestChanges += r.requestChanges;
        acc.wipSubTotal += r.wipSubTotal;
        acc.overdue += r.overdue;
        acc.dueToday += r.dueToday;
        acc.completed += r.completed;
        acc.readyToBill += r.readyToBill;
        acc.onHold += r.onHold;
        acc.cancelled += r.cancelled;
        acc.total += r.total;
        return acc;
      },
      {
        pending: 0,
        inProgress: 0,
        sentForReview: 0,
        requestChanges: 0,
        wipSubTotal: 0,
        overdue: 0,
        dueToday: 0,
        completed: 0,
        readyToBill: 0,
        onHold: 0,
        cancelled: 0,
        total: 0,
        donePercentage: 0,
      }
    );
  }, [summaryRows]);

  const grandDonePct =
    grandTotal.total > 0
      ? Math.round(((grandTotal.completed + grandTotal.readyToBill) / grandTotal.total) * 100)
      : 0;

  // Logarithmic heatmap severity calculation
  const getLogHeatmapClass = (count: number, type: "overdue" | "wip" | "done" | "hold") => {
    if (!isHeatMapActive || count === 0) return "";
    const intensity = Math.min(1, Math.log(count + 1) / Math.log(10)); // 0 to 1 scale

    switch (type) {
      case "overdue":
        if (intensity > 0.6) return "bg-rose-600 text-white font-bold";
        if (intensity > 0.3) return "bg-rose-200 text-rose-900 font-bold";
        return "bg-rose-50 text-rose-700 font-medium";
      case "wip":
        if (intensity > 0.6) return "bg-blue-600 text-white font-bold";
        if (intensity > 0.3) return "bg-blue-200 text-blue-900 font-bold";
        return "bg-blue-50 text-blue-700 font-medium";
      case "done":
        if (intensity > 0.6) return "bg-emerald-600 text-white font-bold";
        if (intensity > 0.3) return "bg-emerald-200 text-emerald-900 font-bold";
        return "bg-emerald-50 text-emerald-700 font-medium";
      case "hold":
        return "bg-slate-100 text-slate-700";
    }
  };

  // Export summary matrix to CSV
  const handleExport = () => {
    const headers = [
      "Group Dimension",
      "Pending",
      "In Progress",
      "Sent for Review",
      "Request Changes",
      "WIP Sub Total",
      "Overdue",
      "Due Today",
      "Completed",
      "Ready to Bill",
      "On Hold",
      "Cancelled",
      "Total",
      "Done %",
    ];
    const rows = summaryRows.map((r) => [
      `"${r.label}"`,
      r.pending,
      r.inProgress,
      r.sentForReview,
      r.requestChanges,
      r.wipSubTotal,
      r.overdue,
      r.dueToday,
      r.completed,
      r.readyToBill,
      r.onHold,
      r.cancelled,
      r.total,
      `"${r.donePercentage}%"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `TURIA_Task_Summary_${activeDimension}_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const activeDimensionLabel =
    GROUP_DIMENSIONS.find((d) => d.key === activeDimension)?.label || "Assigned To";

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Group By Row + Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        {/* Left: Dimension Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-slate-500 font-semibold mr-1 text-[11px]">Group by:</span>
          {GROUP_DIMENSIONS.map((dim) => {
            const isActive = activeDimension === dim.key;
            return (
              <button
                key={dim.key}
                type="button"
                onClick={() => setActiveDimension(dim.key)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#6366F1] text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {dim.label}
              </button>
            );
          })}
        </div>

        {/* Right: Search + Heatmap Popover + Export */}
        <div className="flex items-center gap-2 relative">
          <div className="relative">
            <Search className="size-3.5 absolute left-2.5 top-2.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-36 sm:w-48"
            />
          </div>

          {/* Heat Map Guide Popover Trigger */}
          <div className="relative">
            <button
              type="button"
              onClick={() => {
                setIsHeatMapActive(!isHeatMapActive);
                setIsHeatMapGuideOpen(!isHeatMapGuideOpen);
              }}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors ${
                isHeatMapActive
                  ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                  : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span>Heat Map</span>
              <HelpCircle className="size-3 text-slate-400" />
            </button>

            {/* Heat Map Explainer Popover matching task-heatmap guide.png */}
            {isHeatMapGuideOpen && (
              <div className="absolute right-0 top-10 w-80 bg-slate-900 text-white rounded-2xl shadow-2xl p-4 z-40 text-xs animate-in zoom-in-95 duration-150 border border-slate-800">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                  <span className="font-bold text-slate-100 text-[11px]">How the heat map works</span>
                  <button
                    type="button"
                    onClick={() => setIsHeatMapGuideOpen(false)}
                    className="text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="size-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-slate-300 mb-2.5">
                  Cells are color-coded by task status severity:
                </p>
                <div className="space-y-1.5 text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-rose-500 shrink-0" />
                    <span>
                      <strong className="text-rose-400">Red / Amber</strong> — Overdue, Due Today (urgent)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-blue-400 shrink-0" />
                    <span>
                      <strong className="text-blue-400">Blue</strong> — WIP (Pending, In Progress, Review, Changes)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-emerald-400 shrink-0" />
                    <span>
                      <strong className="text-emerald-400">Green</strong> — Completed, Ready to Bill
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-slate-400 shrink-0" />
                    <span>
                      <strong className="text-slate-400">Grey</strong> — On Hold
                    </span>
                  </div>
                </div>
                <p className="mt-3 pt-2 border-t border-slate-800 text-[10px] text-slate-400">
                  Darker shade = more tasks. Uses a <strong>logarithmic scale</strong>.
                </p>
              </div>
            )}
          </div>

          {/* Export Button */}
          <button
            type="button"
            onClick={handleExport}
            className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 cursor-pointer shadow-2xs transition-colors"
          >
            <Download className="size-3.5 text-slate-500" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Task Summary Matrix Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4 min-w-[180px]">
                  {activeDimensionLabel} ({summaryRows.length})
                </th>
                <th className="py-3 px-3 text-center">Pending</th>
                <th className="py-3 px-3 text-center">In Progress</th>
                <th className="py-3 px-3 text-center">Sent for Review</th>
                <th className="py-3 px-3 text-center">Request Changes</th>
                <th className="py-3 px-3 text-center bg-indigo-50/50 text-indigo-900 font-bold border-l border-r border-indigo-100">
                  WIP Sub Total
                </th>
                <th className="py-3 px-3 text-center text-rose-600 font-bold">Overdue</th>
                <th className="py-3 px-3 text-center">Due Today</th>
                <th className="py-3 px-3 text-center text-emerald-600 font-bold">Completed</th>
                <th className="py-3 px-3 text-center text-emerald-600 font-bold">Ready to Bill</th>
                <th className="py-3 px-3 text-center">On Hold</th>
                <th className="py-3 px-3 text-center text-rose-600 font-semibold">Cancelled</th>
                <th className="py-3 px-3 text-center font-bold text-slate-800">Total</th>
                <th className="py-3 px-4 text-center">Done %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {summaryRows.length === 0 ? (
                <tr>
                  <td colSpan={14} className="py-12 text-center text-slate-400">
                    No tasks found matching current dimension or search query.
                  </td>
                </tr>
              ) : (
                summaryRows.map((row) => (
                  <tr key={row.key} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-2">
                      <span className="size-2 rounded-full bg-indigo-500 shrink-0" />
                      <span>{row.label}</span>
                    </td>
                    <td className={`py-3 px-3 text-center ${getLogHeatmapClass(row.pending, "wip")}`}>
                      {row.pending}
                    </td>
                    <td className={`py-3 px-3 text-center ${getLogHeatmapClass(row.inProgress, "wip")}`}>
                      {row.inProgress}
                    </td>
                    <td className={`py-3 px-3 text-center ${getLogHeatmapClass(row.sentForReview, "wip")}`}>
                      {row.sentForReview}
                    </td>
                    <td className={`py-3 px-3 text-center ${getLogHeatmapClass(row.requestChanges, "wip")}`}>
                      {row.requestChanges}
                    </td>
                    <td
                      className={`py-3 px-3 text-center font-bold bg-indigo-50/30 text-indigo-950 border-l border-r border-indigo-100/60 ${getLogHeatmapClass(
                        row.wipSubTotal,
                        "wip"
                      )}`}
                    >
                      {row.wipSubTotal}
                    </td>
                    <td
                      className={`py-3 px-3 text-center font-bold ${
                        row.overdue > 0 ? "text-rose-600" : "text-slate-400"
                      } ${getLogHeatmapClass(row.overdue, "overdue")}`}
                    >
                      {row.overdue}
                    </td>
                    <td className={`py-3 px-3 text-center ${getLogHeatmapClass(row.dueToday, "overdue")}`}>
                      {row.dueToday}
                    </td>
                    <td
                      className={`py-3 px-3 text-center font-bold ${
                        row.completed > 0 ? "text-emerald-600" : "text-slate-400"
                      } ${getLogHeatmapClass(row.completed, "done")}`}
                    >
                      {row.completed}
                    </td>
                    <td
                      className={`py-3 px-3 text-center font-bold ${
                        row.readyToBill > 0 ? "text-emerald-600" : "text-slate-400"
                      } ${getLogHeatmapClass(row.readyToBill, "done")}`}
                    >
                      {row.readyToBill}
                    </td>
                    <td className={`py-3 px-3 text-center ${getLogHeatmapClass(row.onHold, "hold")}`}>
                      {row.onHold}
                    </td>
                    <td className={`py-3 px-3 text-center font-semibold ${row.cancelled > 0 ? "text-rose-600" : "text-slate-400"}`}>
                      {row.cancelled}
                    </td>
                    <td className="py-3 px-3 text-center font-black text-slate-900">{row.total}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          row.donePercentage === 100
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : row.donePercentage > 0
                            ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {row.donePercentage}%
                      </span>
                    </td>
                  </tr>
                ))
              )}

              {/* Grand Total Row */}
              <tr className="bg-slate-50/90 font-bold text-slate-900 border-t-2 border-slate-200">
                <td className="py-3.5 px-4 font-black text-slate-900 uppercase tracking-tight text-[11px]">
                  Grand Total
                </td>
                <td className="py-3.5 px-3 text-center">{grandTotal.pending}</td>
                <td className="py-3.5 px-3 text-center">{grandTotal.inProgress}</td>
                <td className="py-3.5 px-3 text-center">{grandTotal.sentForReview}</td>
                <td className="py-3.5 px-3 text-center">{grandTotal.requestChanges}</td>
                <td className="py-3.5 px-3 text-center text-indigo-900 bg-indigo-100/50 border-l border-r border-indigo-200 font-black">
                  {grandTotal.wipSubTotal}
                </td>
                <td className="py-3.5 px-3 text-center text-rose-600 font-black">
                  {grandTotal.overdue}
                </td>
                <td className="py-3.5 px-3 text-center">{grandTotal.dueToday}</td>
                <td className="py-3.5 px-3 text-center text-emerald-600 font-black">
                  {grandTotal.completed}
                </td>
                <td className="py-3.5 px-3 text-center text-emerald-600 font-black">
                  {grandTotal.readyToBill}
                </td>
                <td className="py-3.5 px-3 text-center">{grandTotal.onHold}</td>
                <td className="py-3.5 px-3 text-center text-rose-600 font-black">
                  {grandTotal.cancelled}
                </td>
                <td className="py-3.5 px-3 text-center font-black text-slate-950 text-sm">
                  {grandTotal.total}
                </td>
                <td className="py-3.5 px-4 text-center">
                  <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-200/80 text-slate-800">
                    {grandDonePct}%
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
