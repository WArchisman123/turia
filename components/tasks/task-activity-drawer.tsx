"use client";

import React, { useState, useMemo } from "react";
import { X, Clock, Activity, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { TaskActivityItem } from "./types";

interface TaskActivityDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activities: TaskActivityItem[];
}

export function TaskActivityDrawer({
  isOpen,
  onClose,
  activities,
}: TaskActivityDrawerProps) {
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const filteredActivities = useMemo(() => {
    if (filterCategory === "all") return activities;
    return activities.filter((a) => a.eventCategory === filterCategory);
  }, [activities, filterCategory]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-150">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 backdrop-blur-2xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white shadow-2xl h-full flex flex-col z-10 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="size-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Clock className="size-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 leading-tight">Activity Log</h2>
              <p className="text-[10px] text-slate-400">
                Last 30 days · {activities.length} events
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter Dropdown */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-semibold text-slate-700 cursor-pointer"
            >
              <option value="all">All Events</option>
              <option value="status_changes">Status Changes</option>
              <option value="comments">Comments</option>
              <option value="file_uploads">File Uploads</option>
            </select>

            <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold">
              30d
            </span>

            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Drawer Body - Activity Stream */}
        <div className="flex-1 overflow-y-auto p-5">
          {filteredActivities.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-3">
              <div className="size-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-slate-300">
                <Activity className="size-6" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-600">No activity log entries found</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Audit events will be recorded here when tasks and subtasks are updated.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredActivities.map((act) => {
                const isStatus = act.actionType.toLowerCase().includes("status");
                const isCheck = act.actionType.toLowerCase().includes("completed");
                const isOverdue = act.actionType.toLowerCase().includes("overdue");

                return (
                  <div
                    key={act.id}
                    className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-indigo-100 transition-all shadow-2xs space-y-2"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="size-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold">
                          {act.userInitials}
                        </div>
                        <div>
                          <span className="text-xs font-bold text-slate-900 block leading-none">
                            {act.userName}
                          </span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {act.createdAt}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                          isOverdue
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : isCheck
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : isStatus
                            ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                            : "bg-slate-100 text-slate-600 border-slate-200"
                        }`}
                      >
                        {isOverdue ? (
                          <AlertCircle className="size-2.5" />
                        ) : isCheck ? (
                          <CheckCircle2 className="size-2.5" />
                        ) : (
                          <FileText className="size-2.5" />
                        )}
                        {act.actionType}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 font-medium leading-snug">
                      {act.description}
                    </p>

                    <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                      <span className="font-mono text-indigo-600 font-medium truncate max-w-[200px]">
                        {act.taskTitle}
                      </span>
                      <span>30-Day Immutable Audit</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
