"use client";

import React, { useState, useMemo } from "react";
import { TaskItem, RecurringKpiData } from "./types";
import {
  Repeat,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Search,
  Grid as GridIcon,
  List as ListIcon,
  Clock,
  CheckCircle2,
} from "lucide-react";

interface RecurringScheduleTabProps {
  tasks: TaskItem[];
  recurringKpi: RecurringKpiData;
}

const FY_MONTHS = [
  { name: "April", code: "Apr 2026", num: "04" },
  { name: "May", code: "May 2026", num: "05" },
  { name: "June", code: "Jun 2026", num: "06" },
  { name: "July", code: "Jul 2026", num: "07" },
  { name: "August", code: "Aug 2026", num: "08" },
  { name: "September", code: "Sep 2026", num: "09" },
  { name: "October", code: "Oct 2026", num: "10" },
  { name: "November", code: "Nov 2026", num: "11" },
  { name: "December", code: "Dec 2026", num: "12" },
  { name: "January", code: "Jan 2027", num: "01" },
  { name: "February", code: "Feb 2027", num: "02" },
  { name: "March", code: "Mar 2027", num: "03" },
];

export function RecurringScheduleTab({
  tasks,
  recurringKpi,
}: RecurringScheduleTabProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [frequencyFilter, setFrequencyFilter] = useState<string>("All");
  const [currentFy, setCurrentFy] = useState("FY 2026-27");

  const recurringTasks = useMemo(() => {
    let list = tasks.filter((t) => t.taskType === "Recurring");

    if (frequencyFilter !== "All") {
      list = list.filter((t) => t.recurrenceFrequency === frequencyFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (t) =>
          t.taskTitle.toLowerCase().includes(q) ||
          t.clientName.toLowerCase().includes(q) ||
          t.serviceName.toLowerCase().includes(q)
      );
    }

    return list;
  }, [tasks, frequencyFilter, searchQuery]);

  const cards = [
    { label: "Total", value: recurringKpi.total, icon: Repeat, color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100" },
    { label: "Monthly", value: recurringKpi.monthly, icon: Repeat, color: "text-emerald-600", bg: "bg-emerald-50", border: "border-emerald-100" },
    { label: "Quarterly", value: recurringKpi.quarterly, icon: Repeat, color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-100" },
    { label: "Half-Year", value: recurringKpi.halfYear, icon: Repeat, color: "text-cyan-600", bg: "bg-cyan-50", border: "border-cyan-100" },
    { label: "Yearly", value: recurringKpi.yearly, icon: Repeat, color: "text-slate-600", bg: "bg-slate-100", border: "border-slate-200" },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Category Pills */}
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

      {/* 5 Recurrence KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-xl border border-slate-200/80 p-3.5 shadow-2xs flex items-center justify-between transition-all hover:border-slate-300"
            >
              <div>
                <span className={`text-2xl font-bold tracking-tight ${card.color}`}>
                  {card.value}
                </span>
                <p className="text-[11px] font-semibold text-slate-500 mt-0.5">
                  {card.label}
                </p>
              </div>
              <div
                className={`size-8 rounded-lg ${card.bg} ${card.border} border flex items-center justify-center ${card.color}`}
              >
                <Icon className="size-4" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
        {/* Left: View Mode Toggle & Search */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === "grid"
                  ? "bg-white text-indigo-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <GridIcon className="size-3.5" />
              <span>Grid</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                viewMode === "list"
                  ? "bg-white text-indigo-700 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ListIcon className="size-3.5" />
              <span>List</span>
            </button>
          </div>

          <div className="relative">
            <Search className="size-3.5 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search recurring schedules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-44 sm:w-60"
            />
          </div>
        </div>

        {/* Right: Frequency Pills & FY Navigator */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 p-0.5 rounded-xl text-xs">
            {["All", "Monthly", "Quarterly", "Half-Yearly", "Yearly"].map((freq) => (
              <button
                key={freq}
                type="button"
                onClick={() => setFrequencyFilter(freq)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer text-[11px] ${
                  frequencyFilter === freq
                    ? "bg-[#6366F1] text-white font-semibold shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {freq}
              </button>
            ))}
          </div>

          {/* FY Navigator */}
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl px-2 py-1 shadow-2xs text-xs font-semibold text-slate-700">
            <button
              type="button"
              onClick={() => setCurrentFy("FY 2025-26")}
              className="p-0.5 hover:text-indigo-600 cursor-pointer"
            >
              <ChevronLeft className="size-3.5" />
            </button>
            <span className="px-1">{currentFy}</span>
            <button
              type="button"
              onClick={() => setCurrentFy("FY 2027-28")}
              className="p-0.5 hover:text-indigo-600 cursor-pointer"
            >
              <ChevronRight className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid or List Content */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {FY_MONTHS.map((month) => {
            // Find recurring tasks associated with this month
            const monthTasks = recurringTasks.filter((t) => {
              if (t.recurrenceFrequency === "Monthly") return true;
              if (t.recurrenceFrequency === "Quarterly") {
                return ["June", "September", "December", "March"].includes(month.name);
              }
              if (t.recurrenceFrequency === "Yearly") {
                return ["September", "October", "November"].includes(month.name);
              }
              return false;
            });

            return (
              <div
                key={month.code}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 flex flex-col justify-between hover:border-indigo-200 transition-colors"
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="size-4 text-indigo-600" />
                    <h3 className="font-bold text-slate-900 text-xs">{month.code}</h3>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    {monthTasks.length} Schedules
                  </span>
                </div>

                <div className="space-y-2 my-2 flex-1">
                  {monthTasks.length === 0 ? (
                    <p className="text-[11px] text-slate-400 py-6 text-center italic">
                      No statutory filings scheduled
                    </p>
                  ) : (
                    monthTasks.slice(0, 3).map((t) => (
                      <div
                        key={t.id}
                        className="p-2 rounded-xl bg-slate-50 border border-slate-200/70 text-xs space-y-1 hover:bg-indigo-50/40 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-slate-800 text-[11px] truncate max-w-[140px]">
                            {t.taskTitle}
                          </span>
                          <span className="font-mono text-[9px] text-slate-500 font-bold bg-white px-1 py-0.2 rounded border border-slate-200">
                            {t.dueDate.slice(0, 5)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-slate-500">
                          <span className="truncate max-w-[120px]">{t.clientName}</span>
                          <span className="text-indigo-600 font-medium">{t.category.split("/")[0]}</span>
                        </div>
                      </div>
                    ))
                  )}
                  {monthTasks.length > 3 && (
                    <p className="text-[10px] text-indigo-600 font-semibold text-center pt-1">
                      +{monthTasks.length - 3} more compliance tasks
                    </p>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="size-3" /> Auto-generates on 1st
                  </span>
                  <span className="font-medium text-emerald-600">Active</span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List Mode */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-4">Task Name</th>
                  <th className="py-3 px-3">Client</th>
                  <th className="py-3 px-3">Service</th>
                  <th className="py-3 px-3">Frequency</th>
                  <th className="py-3 px-3">Due Day</th>
                  <th className="py-3 px-3">Assignee</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recurringTasks.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-slate-400">
                      No recurring tasks for this financial year.
                    </td>
                  </tr>
                ) : (
                  recurringTasks.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">{t.taskTitle}</td>
                      <td className="py-3 px-3 text-slate-700">{t.clientName}</td>
                      <td className="py-3 px-3 text-slate-600">{t.serviceName}</td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-semibold text-[10px] border border-purple-200">
                          {t.recurrenceFrequency || "Monthly"}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-600">{t.dueDate.slice(0, 5)}</td>
                      <td className="py-3 px-3 text-slate-700">{t.assignedToName}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-bold text-[10px]">
                          <CheckCircle2 className="size-3" /> Scheduled
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
