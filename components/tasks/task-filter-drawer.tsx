"use client";

import React from "react";
import { X, SlidersHorizontal } from "lucide-react";
import { TaskFilterState } from "./types";

interface TaskFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: TaskFilterState;
  onFilterChange: (newFilters: TaskFilterState) => void;
  onClearAll: () => void;
}

export function TaskFilterDrawer({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onClearAll,
}: TaskFilterDrawerProps) {
  if (!isOpen) return null;

  const handleToggleStatus = (statusKey: string) => {
    const list = filters.statusList.includes(statusKey)
      ? filters.statusList.filter((s) => s !== statusKey)
      : [...filters.statusList, statusKey];
    onFilterChange({ ...filters, statusList: list });
  };

  const handleTogglePriority = (priorityKey: string) => {
    const list = filters.priorityList.includes(priorityKey)
      ? filters.priorityList.filter((p) => p !== priorityKey)
      : [...filters.priorityList, priorityKey];
    onFilterChange({ ...filters, priorityList: list });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-150">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-2xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Card */}
      <div className="relative w-full max-w-sm bg-white shadow-2xl h-full flex flex-col z-10 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="size-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900">Filters</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-slate-700">
          {/* Quick Filters */}
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Quick Filters
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {[
                { label: "Overdue", key: "overdue" },
                { label: "Due Today", key: "due_today" },
                { label: "High Priority", key: "high_priority" },
              ].map((qf) => (
                <button
                  key={qf.key}
                  type="button"
                  onClick={() => {
                    if (qf.key === "overdue") handleToggleStatus("overdue");
                    if (qf.key === "due_today")
                      onFilterChange({ ...filters, dueTodayOnly: !filters.dueTodayOnly });
                    if (qf.key === "high_priority") handleTogglePriority("high");
                  }}
                  className="px-2.5 py-1 rounded-full border border-slate-200 text-[11px] font-medium text-slate-600 hover:bg-slate-50 cursor-pointer"
                >
                  {qf.label}
                </button>
              ))}
            </div>
          </div>

          {/* Status with colored dots */}
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Status
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "WIP", key: "wip", dot: "bg-indigo-500" },
                { label: "Pending", key: "pending", dot: "bg-amber-500" },
                { label: "In Progress", key: "in_progress", dot: "bg-cyan-500" },
                { label: "Sent for Review", key: "sent_for_review", dot: "bg-purple-500" },
                { label: "Request Changes", key: "request_changes", dot: "bg-orange-500" },
                { label: "Overdue", key: "overdue", dot: "bg-rose-500" },
                { label: "Completed", key: "completed", dot: "bg-emerald-500" },
                { label: "Ready to Bill", key: "ready_to_bill", dot: "bg-green-600" },
                { label: "On Hold", key: "on_hold", dot: "bg-slate-400" },
                { label: "Cancelled", key: "cancelled", dot: "bg-red-500" },
              ].map((st) => (
                <label
                  key={st.key}
                  className="flex items-center gap-2 cursor-pointer select-none py-0.5"
                >
                  <input
                    type="checkbox"
                    checked={filters.statusList.includes(st.key)}
                    onChange={() => handleToggleStatus(st.key)}
                    className="rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500 size-3.5 cursor-pointer"
                  />
                  <span className={`size-2 rounded-full ${st.dot} shrink-0`} />
                  <span className="text-[11px] text-slate-700">{st.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Priority */}
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Priority
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "High", key: "high", dot: "bg-rose-500" },
                { label: "Medium", key: "normal", dot: "bg-amber-500" },
                { label: "Low", key: "low", dot: "bg-emerald-500" },
              ].map((pr) => (
                <label
                  key={pr.key}
                  className="flex items-center gap-2 cursor-pointer select-none py-0.5"
                >
                  <input
                    type="checkbox"
                    checked={filters.priorityList.includes(pr.key)}
                    onChange={() => handleTogglePriority(pr.key)}
                    className="rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500 size-3.5 cursor-pointer"
                  />
                  <span className={`size-2 rounded-full ${pr.dot} shrink-0`} />
                  <span className="text-[11px] text-slate-700">{pr.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Due Today Checkbox */}
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Due Date
            </h4>
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={filters.dueTodayOnly}
                onChange={(e) =>
                  onFilterChange({ ...filters, dueTodayOnly: e.target.checked })
                }
                className="rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500 size-3.5 cursor-pointer"
              />
              <span className="text-[11px] text-slate-700">Due Today</span>
            </label>
          </div>

          {/* Billing Status */}
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Billing Status
            </h4>
            <div className="space-y-1.5">
              {["All", "Billable", "Non-Billable"].map((bs) => (
                <label
                  key={bs}
                  className="flex items-center gap-2 cursor-pointer select-none"
                >
                  <input
                    type="radio"
                    name="billingStatusFilter"
                    checked={filters.billingStatus === bs}
                    onChange={() => onFilterChange({ ...filters, billingStatus: bs })}
                    className="border-slate-300 text-indigo-600 focus:ring-indigo-500 size-3.5 cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-700">{bs}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Task Type */}
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Task Type
            </h4>
            <div className="space-y-1.5">
              {["All", "Recurring", "One-Time"].map((tt) => (
                <label
                  key={tt}
                  className="flex items-center gap-2 cursor-pointer select-none"
                >
                  <input
                    type="radio"
                    name="taskTypeFilter"
                    checked={filters.taskType === tt}
                    onChange={() => onFilterChange({ ...filters, taskType: tt })}
                    className="border-slate-300 text-indigo-600 focus:ring-indigo-500 size-3.5 cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-700">{tt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Category
            </h4>
            <div className="space-y-1.5">
              {["All", "GST", "Direct Tax", "Corporate Law / ROC", "Audit & Assurance"].map((cat) => (
                <label
                  key={cat}
                  className="flex items-center gap-2 cursor-pointer select-none"
                >
                  <input
                    type="radio"
                    name="categoryFilter"
                    checked={filters.category === cat}
                    onChange={() => onFilterChange({ ...filters, category: cat })}
                    className="border-slate-300 text-indigo-600 focus:ring-indigo-500 size-3.5 cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-700">{cat}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
          <button
            type="button"
            onClick={onClearAll}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
          >
            Clear All
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-[#6366F1] hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
