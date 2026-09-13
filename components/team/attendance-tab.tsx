"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Download,
  Calendar,
  MapPin,
  CheckCircle2,
  Clock,
  Building,
  Laptop,
  Briefcase,
} from "lucide-react";
import { AttendanceItem, AttendanceViewMode } from "./types";

interface AttendanceTabProps {
  attendanceLogs: AttendanceItem[];
  onRegularize?: (id: string, action: "approve" | "reject") => void;
}

export function AttendanceTab({
  attendanceLogs,
  onRegularize,
}: AttendanceTabProps) {
  const [viewMode, setViewMode] = useState<AttendanceViewMode>("today");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState("03/09/2026");

  const filteredLogs = useMemo(() => {
    return attendanceLogs.filter((log) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = log.user_name.toLowerCase().includes(q);
        const matchClient = log.client_name ? log.client_name.toLowerCase().includes(q) : false;
        const matchLoc = log.office_location.toLowerCase().includes(q);
        if (!matchName && !matchClient && !matchLoc) return false;
      }

      // View mode filter
      if (viewMode === "regularization") {
        return log.is_regularized || log.status === "late";
      }

      return true;
    });
  }, [attendanceLogs, searchQuery, viewMode]);

  const getStatusBadge = (status: AttendanceItem["status"], isRegularized: boolean) => {
    if (isRegularized) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="size-3 text-emerald-600" />
          Regularized
        </span>
      );
    }

    switch (status) {
      case "present":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Present
          </span>
        );
      case "late":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            Late
          </span>
        );
      case "half_day":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            Half-Day
          </span>
        );
      case "absent":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            Absent
          </span>
        );
    }
  };

  const getLocationIcon = (location: AttendanceItem["work_location"]) => {
    switch (location) {
      case "Office":
        return <Building className="size-3.5 text-slate-500" />;
      case "Remote":
        return <Laptop className="size-3.5 text-slate-500" />;
      case "Client Site":
        return <Briefcase className="size-3.5 text-indigo-600" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* 4 View Modes Segmented Controls matching team-2.png */}
      <div className="flex items-center border border-[#E2E8F0] bg-white rounded-lg p-1 w-fit shadow-xs">
        <button
          onClick={() => setViewMode("today")}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
            viewMode === "today"
              ? "bg-[#EEF2FF] text-[#4F46E5]"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Today&apos;s Attendance
        </button>
        <button
          onClick={() => setViewMode("weekly")}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
            viewMode === "weekly"
              ? "bg-[#EEF2FF] text-[#4F46E5]"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Weekly Attendance
        </button>
        <button
          onClick={() => setViewMode("monthly")}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
            viewMode === "monthly"
              ? "bg-[#EEF2FF] text-[#4F46E5]"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Monthly Attendance
        </button>
        <button
          onClick={() => setViewMode("regularization")}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
            viewMode === "regularization"
              ? "bg-[#EEF2FF] text-[#4F46E5]"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Regularization
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-[#E2E8F0] rounded-lg p-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs">
        <div className="text-xs font-bold text-slate-900">
          {viewMode === "today" && `Today Attendance List(${filteredLogs.length})`}
          {viewMode === "weekly" && `Weekly Attendance Matrix(${filteredLogs.length})`}
          {viewMode === "monthly" && `Monthly Attendance Overview(${filteredLogs.length})`}
          {viewMode === "regularization" && `Attendance Regularization Requests(${filteredLogs.length})`}
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 md:w-56">
            <Search className="size-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-[#E2E8F0] rounded-md focus:outline-hidden focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-400"
            />
          </div>

          {/* Date Picker */}
          <div className="relative">
            <input
              type="text"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="pl-3 pr-8 py-1.5 text-xs font-medium text-slate-700 bg-white border border-[#E2E8F0] rounded-md focus:outline-hidden focus:ring-1 focus:ring-indigo-500 w-32"
            />
            <Calendar className="size-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Export button */}
          <button
            title="Export Attendance"
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md border border-[#E2E8F0] transition-colors cursor-pointer"
          >
            <Download className="size-4" />
          </button>
        </div>
      </div>

      {/* 11-Column Attendance Table matching team-2.png */}
      <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] select-none">
                <th className="py-2.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Team Members
                </th>
                <th className="py-2.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="py-2.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Clock In
                </th>
                <th className="py-2.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Clock Out
                </th>
                <th className="py-2.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Total Hours
                </th>
                <th className="py-2.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Work Location
                </th>
                <th className="py-2.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Name Of The Client
                </th>
                <th className="py-2.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  In
                </th>
                <th className="py-2.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Out
                </th>
                <th className="py-2.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Office Location
                </th>
                <th className="py-2.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Distance (Radius)
                </th>
                {viewMode === "regularization" && (
                  <th className="py-2.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500 text-center">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td
                    colSpan={viewMode === "regularization" ? 12 : 11}
                    className="py-12 text-center text-slate-500"
                  >
                    <Clock className="size-8 text-slate-300 mx-auto mb-1.5" />
                    <div className="font-semibold text-slate-700">No attendance records found</div>
                    <div className="text-xs text-slate-400">Records will appear as staff punch in/out</div>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="size-7 rounded-full bg-[#6366F1] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                          {log.user_initials}
                        </div>
                        <span className="font-semibold text-slate-900">
                          {log.user_name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      {getStatusBadge(log.status, log.is_regularized)}
                    </td>
                    <td className="py-3 px-3 text-slate-700 font-mono text-[11px]">
                      {log.clock_in || "—"}
                    </td>
                    <td className="py-3 px-3 text-slate-700 font-mono text-[11px]">
                      {log.clock_out || "—"}
                    </td>
                    <td className="py-3 px-3 text-slate-700 font-medium">
                      {log.total_hours || "—"}
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        {getLocationIcon(log.work_location)}
                        <span>{log.work_location}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {log.client_name ? (
                        <span className="font-medium text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                          {log.client_name}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-500 text-[11px] font-mono">
                      {log.in_geo_coords || "—"}
                    </td>
                    <td className="py-3 px-3 text-slate-500 text-[11px] font-mono">
                      {log.out_geo_coords || "—"}
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {log.office_location}
                    </td>
                    <td className="py-3 px-3">
                      {log.distance_radius ? (
                        <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                          <MapPin className="size-3 text-emerald-600 shrink-0" />
                          <span>{log.distance_radius}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    {viewMode === "regularization" && (
                      <td className="py-3 px-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => onRegularize?.(log.id, "approve")}
                            className="px-2 py-1 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => onRegularize?.(log.id, "reject")}
                            className="px-2 py-1 text-[11px] font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="bg-white px-4 py-2.5 border-t border-[#E2E8F0] flex items-center justify-end gap-6 text-xs text-slate-500 select-none">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <span className="font-semibold text-slate-700">50</span>
          </div>
          <div>
            1–{filteredLogs.length} of {filteredLogs.length}
          </div>
        </div>
      </div>
    </div>
  );
}
