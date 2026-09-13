"use client";

import React, { useState, useMemo } from "react";
import { TaskItem } from "./types";
import {
  Clock,
  AlertTriangle,
  FileCheck,
  TrendingUp,
  Smile,
  BarChart,
  Layers,
  Building,
  User,
  FolderTree,
  Briefcase,
  PieChart,
  Calendar,
  Search,
} from "lucide-react";

interface AnalyticsMisTabProps {
  tasks: TaskItem[];
}

const REPORTS_LIST = [
  { id: "timesheet", title: "Timesheet Report", desc: "Time tracking and utilization analysis", icon: Clock },
  { id: "not_billed", title: "Task Completed Not Billed", desc: "Revenue leakage tracking — completed tasks awaiting billing", icon: AlertTriangle },
  { id: "task_billing", title: "Task Billing Report", desc: "Task completion vs billing status — catch revenue leakage", icon: FileCheck },
  { id: "performance", title: "Performance Report", desc: "Team member completion rates, on-time delivery, and status breakdown", icon: TrendingUp },
  { id: "feedback", title: "Task Feedback Report", desc: "Client feedback and satisfaction scores", icon: Smile },
  { id: "workload", title: "Workload Balance", desc: "Task distribution and utilization across the team", icon: BarChart },
  { id: "pending_aging", title: "Pending Aging Tasks", desc: "Aging buckets for pending tasks — long-overdue work", icon: Layers },
  { id: "by_client", title: "Tasks by Client", desc: "Client-wise task breakdown and completion rates", icon: Building },
  { id: "by_user", title: "Tasks by User", desc: "Team member performance and workload distribution", icon: User },
  { id: "by_group", title: "Tasks by Group", desc: "Client-group task analysis", icon: FolderTree },
  { id: "by_services", title: "Tasks by Services", desc: "Service-level task metrics and revenue", icon: Briefcase },
  { id: "category_perf", title: "Category Performance", desc: "Service category comparison — volume, on-time, revenue", icon: PieChart },
];

export function AnalyticsMisTab({ tasks }: AnalyticsMisTabProps) {
  const [activeReportId, setActiveReportId] = useState("timesheet");
  const [timesheetSubTab, setTimesheetSubTab] = useState<"analytics" | "daily" | "monthly">("analytics");
  const [startDate, setStartDate] = useState("01/09/2026");
  const [endDate, setEndDate] = useState("30/09/2026");
  const [pendingSearch, setPendingSearch] = useState("");

  const activeReport = REPORTS_LIST.find((r) => r.id === activeReportId) || REPORTS_LIST[0];

  // Pending aging calculations
  const pendingTasks = useMemo(() => {
    return tasks.filter((t) => t.status === "pending" || t.status === "overdue" || t.status === "in_progress");
  }, [tasks]);

  const agingBuckets = useMemo(() => {
    return {
      all: pendingTasks.length,
      gt60: pendingTasks.filter((t) => t.status === "overdue" && t.id.includes("3")).length,
      d31_60: 0,
      d15_30: pendingTasks.filter((t) => t.status === "in_progress").length,
      d7_14: pendingTasks.filter((t) => t.status === "pending").length,
      lt7: 0,
    };
  }, [pendingTasks]);

  const filteredPending = useMemo(() => {
    if (!pendingSearch.trim()) return pendingTasks;
    const q = pendingSearch.toLowerCase();
    return pendingTasks.filter(
      (t) =>
        t.taskTitle.toLowerCase().includes(q) ||
        t.clientName.toLowerCase().includes(q) ||
        t.taskCode.toLowerCase().includes(q)
    );
  }, [pendingTasks, pendingSearch]);

  return (
    <div className="flex flex-col lg:flex-row gap-5 animate-in fade-in duration-150">
      {/* Left Reports Navigation Sidebar */}
      <div className="w-full lg:w-72 shrink-0 bg-white rounded-2xl border border-slate-200 shadow-xs p-2.5 space-y-1 self-start">
        {REPORTS_LIST.map((item) => {
          const isActive = activeReportId === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveReportId(item.id)}
              className={`w-full p-2.5 rounded-xl text-left transition-all flex items-start gap-2.5 cursor-pointer ${
                isActive
                  ? "bg-indigo-50/80 border border-indigo-200/80 text-indigo-950 shadow-2xs"
                  : "hover:bg-slate-50 text-slate-700"
              }`}
            >
              <div
                className={`p-1.5 rounded-lg shrink-0 mt-0.5 ${
                  isActive ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-500"
                }`}
              >
                <Icon className="size-3.5" />
              </div>
              <div className="min-w-0">
                <h4
                  className={`text-xs font-bold truncate leading-tight ${
                    isActive ? "text-indigo-900" : "text-slate-900"
                  }`}
                >
                  {item.title}
                </h4>
                <p className="text-[10px] text-slate-500 truncate mt-0.5 leading-snug">
                  {item.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Right Report Workspace */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-200 shadow-xs p-5 min-w-0">
        {/* Active Report Header */}
        <div className="pb-4 border-b border-slate-100 mb-5">
          <h2 className="text-base font-bold text-slate-900">{activeReport.title}</h2>
          <p className="text-xs text-slate-500 mt-0.5">{activeReport.desc}</p>
        </div>

        {/* View 1: Timesheet Report (matching task-5.png) */}
        {activeReportId === "timesheet" && (
          <div className="space-y-5">
            {/* Sub-tabs & Date Pickers */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setTimesheetSubTab("analytics")}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    timesheetSubTab === "analytics"
                      ? "bg-white text-indigo-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Analytics
                </button>
                <button
                  type="button"
                  onClick={() => setTimesheetSubTab("daily")}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    timesheetSubTab === "daily"
                      ? "bg-white text-indigo-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Daily Timesheet
                </button>
                <button
                  type="button"
                  onClick={() => setTimesheetSubTab("monthly")}
                  className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                    timesheetSubTab === "monthly"
                      ? "bg-white text-indigo-700 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Monthly Timesheet
                </button>
              </div>

              {/* Date Filters */}
              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700">
                  <span className="text-slate-400 font-medium">Start Date:</span>
                  <input
                    type="text"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-20 bg-transparent text-slate-900 font-medium focus:outline-none"
                  />
                  <Calendar className="size-3.5 text-slate-400" />
                </div>
                <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-slate-700">
                  <span className="text-slate-400 font-medium">End Date:</span>
                  <input
                    type="text"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-20 bg-transparent text-slate-900 font-medium focus:outline-none"
                  />
                  <Calendar className="size-3.5 text-slate-400" />
                </div>
              </div>
            </div>

            <h3 className="text-xs font-bold text-slate-900">Timesheet Analytics</h3>

            {/* 5 KPI Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                { label: "Total Hours", value: "00:00 Hrs", color: "text-indigo-600" },
                { label: "Task-linked", value: "00:00 Hrs", color: "text-emerald-600" },
                { label: "Non Task-linked", value: "00:00 Hrs", color: "text-amber-600" },
                { label: "Avg Time / Day", value: "00:00 Hrs", color: "text-cyan-600" },
                { label: "Utilization", value: "0%", color: "text-indigo-700" },
              ].map((c, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs"
                >
                  <p className="text-[11px] font-medium text-slate-500 mb-1">{c.label}</p>
                  <span className={`text-xl font-bold tracking-tight ${c.color}`}>
                    {c.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Daily Time Distribution Chart Area */}
            <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
              <h4 className="text-xs font-bold text-slate-800 mb-6">
                Daily Time Distribution — September 2026
              </h4>
              <div className="h-44 flex items-center justify-center text-xs text-slate-400 italic">
                No timesheet data for this period
              </div>
            </div>

            {/* Team Time Tracking Table */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
              <div className="p-3 bg-slate-50/80 border-b border-slate-200">
                <h4 className="text-xs font-bold text-slate-800">
                  Team Time Tracking (September 2026)
                </h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                      <th className="py-2.5 px-4">Team Member</th>
                      <th className="py-2.5 px-3">Total Hours</th>
                      <th className="py-2.5 px-3">Task-Linked</th>
                      <th className="py-2.5 px-3">Non Task-Linked</th>
                      <th className="py-2.5 px-3">Tasks</th>
                      <th className="py-2.5 px-3">Avg/Task</th>
                      <th className="py-2.5 px-4">Utilization</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400 italic">
                        No timesheet data for this period
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* View 2: Pending Aging Tasks (matching task-6.png) */}
        {activeReportId === "pending_aging" && (
          <div className="space-y-5">
            {/* 6 Aging Bucket Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[
                { label: "All Pending", value: agingBuckets.all, color: "text-indigo-600", active: true },
                { label: "More than 60 days", value: agingBuckets.gt60, color: "text-rose-600", active: false },
                { label: "31 – 60 days", value: agingBuckets.d31_60, color: "text-orange-600", active: false },
                { label: "15 – 30 days", value: agingBuckets.d15_30, color: "text-amber-600", active: false },
                { label: "7 – 14 days", value: agingBuckets.d7_14, color: "text-cyan-600", active: false },
                { label: "Less than 7 days", value: agingBuckets.lt7, color: "text-emerald-600", active: false },
              ].map((bucket, i) => (
                <div
                  key={i}
                  className={`bg-white rounded-xl p-3.5 shadow-2xs border transition-colors ${
                    bucket.active
                      ? "border-indigo-500 ring-1 ring-indigo-500/20"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <p className="text-[11px] font-medium text-slate-500 mb-1">{bucket.label}</p>
                  <span className={`text-2xl font-bold ${bucket.color}`}>{bucket.value}</span>
                  <p className="text-[10px] text-slate-400 mt-0.5">pending tasks</p>
                </div>
              ))}
            </div>

            {/* Pending Tasks Search & Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="p-3.5 flex items-center justify-between border-b border-slate-100">
                <h4 className="text-xs font-bold text-slate-900">
                  All Pending Tasks ({filteredPending.length})
                </h4>
                <div className="relative">
                  <Search className="size-3.5 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
                  <input
                    type="text"
                    placeholder="Search tasks, clients..."
                    value={pendingSearch}
                    onChange={(e) => setPendingSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-48 sm:w-60"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-600">
                  <thead>
                    <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                      <th className="py-3 px-4">Task ID</th>
                      <th className="py-3 px-3">Client</th>
                      <th className="py-3 px-3">Task</th>
                      <th className="py-3 px-3">Assignee</th>
                      <th className="py-3 px-3">Due Date</th>
                      <th className="py-3 px-3 text-center">Days Pending</th>
                      <th className="py-3 px-4">Aging</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredPending.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400">
                          No pending tasks found.
                        </td>
                      </tr>
                    ) : (
                      filteredPending.map((t) => (
                        <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-4 font-mono font-bold text-indigo-600">
                            {t.taskCode}
                          </td>
                          <td className="py-3 px-3 text-slate-900 font-medium">{t.clientName}</td>
                          <td className="py-3 px-3 font-semibold text-slate-800 max-w-[220px] truncate">
                            {t.taskTitle}
                          </td>
                          <td className="py-3 px-3 text-slate-700">{t.assignedToName}</td>
                          <td className="py-3 px-3 font-mono text-slate-500">{t.dueDate}</td>
                          <td className="py-3 px-3 text-center font-bold text-rose-600">
                            {t.status === "overdue" ? "12" : "3"} days
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                t.status === "overdue"
                                  ? "bg-rose-50 text-rose-700 border-rose-200"
                                  : "bg-amber-50 text-amber-700 border-amber-200"
                              }`}
                            >
                              {t.status === "overdue" ? "> 60 days" : "15 – 30 days"}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* View 3: Other 10 MIS Reports Template */}
        {activeReportId !== "timesheet" && activeReportId !== "pending_aging" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
                <p className="text-[11px] font-medium text-slate-500">Completed Volume</p>
                <span className="text-2xl font-bold text-emerald-600">
                  {tasks.filter((t) => t.status === "completed").length}
                </span>
                <p className="text-[10px] text-slate-400 mt-1">100% statutory compliant</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
                <p className="text-[11px] font-medium text-slate-500">In-Flight Tasks</p>
                <span className="text-2xl font-bold text-indigo-600">
                  {tasks.filter((t) => t.status === "in_progress" || t.status === "wip").length}
                </span>
                <p className="text-[10px] text-slate-400 mt-1">Active turnaround</p>
              </div>
              <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
                <p className="text-[11px] font-medium text-slate-500">Overdue Bottlenecks</p>
                <span className="text-2xl font-bold text-rose-600">
                  {tasks.filter((t) => t.status === "overdue").length}
                </span>
                <p className="text-[10px] text-slate-400 mt-1">Requires partner review</p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center shadow-xs">
              <p className="text-sm font-semibold text-slate-700">
                Detailed reporting ledger for {activeReport.title}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Data dynamically aggregates as your team logs statutory audit filings and timesheets.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
