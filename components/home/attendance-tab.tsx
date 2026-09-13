"use client";

import React, { useState, useEffect } from "react";
import posthog from "posthog-js";
import {
  Plus,
  Search,
  Calendar as CalendarIcon,
  LogIn,
  LogOut,
  ChevronLeft,
  ChevronRight,
  MapPin,
  UserCheck,
} from "lucide-react";
import { CreateNoticeModal, NoticeItem } from "./create-notice-modal";
import { punchAttendance } from "@/lib/api/home";

const INITIAL_NOTICES: NoticeItem[] = [
  {
    id: "1",
    title: "Advance Tax Q2 Filing Deadline - Sep 15, 2026",
    targetAudience: "All Staff",
    priority: "High",
    date: "Sep 03, 2026",
    description: "Ensure all corporate and high net worth clients' Challan 280 tax estimations are compiled and dispatched.",
  },
  {
    id: "2",
    title: "GSTR-3B Monthly Return Filing (Aug 2026)",
    targetAudience: "Article Trainees",
    priority: "Medium",
    date: "Sep 01, 2026",
    description: "Complete GSTR-2B purchase register reconciliation and ITC verification under Section 16(2).",
  },
];

const ATTENDANCE_RECORDS = [
  {
    id: "1",
    initials: "AR",
    name: "archi",
    role: "Sr. Associate",
    attendance: "Present",
    status: "Active Shift",
    clockIn: "09:58 AM",
    clockOut: "--",
    location: "At Office",
    clientSite: "-",
    geoLocation: "19.0760° N, 72.8777° E",
    officeLocation: "Nariman Point Office",
    distance: "18m (Within 150m)",
    breakTime: "00h:45m",
  },
  {
    id: "2",
    initials: "RS",
    name: "Rahul Sharma, FCA",
    role: "Partner",
    attendance: "Present",
    status: "Active Shift",
    clockIn: "09:30 AM",
    clockOut: "--",
    location: "Client Site",
    clientSite: "Reliance Retail HQ",
    geoLocation: "19.0178° N, 72.8478° E",
    officeLocation: "Nariman Point Office",
    distance: "5.4km (Client Site)",
    breakTime: "01h:00m",
  },
  {
    id: "3",
    initials: "PM",
    name: "Pooja Mehta",
    role: "Article Trainee",
    attendance: "Present",
    status: "Active Shift",
    clockIn: "10:04 AM",
    clockOut: "--",
    location: "At Office",
    clientSite: "-",
    geoLocation: "19.0759° N, 72.8775° E",
    officeLocation: "Nariman Point Office",
    distance: "25m (Within 150m)",
    breakTime: "00h:30m",
  },
  {
    id: "4",
    initials: "AK",
    name: "Amit Kulkarni",
    role: "Paid Assistant",
    attendance: "On Leave",
    status: "Approved",
    clockIn: "--",
    clockOut: "--",
    location: "Leave",
    clientSite: "-",
    geoLocation: "-",
    officeLocation: "Nariman Point Office",
    distance: "-",
    breakTime: "--",
  },
];

const HOLIDAYS = [
  { date: "Oct 02, 2026", holiday: "Mahatma Gandhi Jayanti", day: "Friday", type: "Gazetted Statutory Holiday" },
  { date: "Oct 20, 2026", holiday: "Dussehra (Vijaya Dashami)", day: "Tuesday", type: "National Holiday" },
  { date: "Nov 08, 2026", holiday: "Diwali (Deepavali)", day: "Sunday", type: "Statutory Holiday" },
  { date: "Jan 26, 2027", holiday: "Republic Day", day: "Tuesday", type: "Gazetted Statutory Holiday" },
];

const UPCOMING_LEAVES = [
  { name: "Pooja Mehta", role: "Article Trainee", type: "CA Final Exam Study Leave", duration: "Sep 10 - Sep 25, 2026", days: "15 Days", status: "Approved" },
  { name: "Vikram Das", role: "Tax Manager", type: "Casual Leave", duration: "Sep 18 - Sep 19, 2026", days: "2 Days", status: "Approved" },
];

export function AttendanceTab() {
  const [isPunchedIn, setIsPunchedIn] = useState(true);
  const [punchInTime, setPunchInTime] = useState<string>("09:58:24 AM");
  const [punchOutTime, setPunchOutTime] = useState<string>("00:00:00");
  const [secondsElapsed, setSecondsElapsed] = useState(14520); // ~4 hours logged
  const [notices, setNotices] = useState<NoticeItem[]>(INITIAL_NOTICES);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPunchedIn) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPunchedIn]);

  const handlePunchToggle = async () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString();
    if (!isPunchedIn) {
      setIsPunchedIn(true);
      setPunchInTime(timeStr);
      await punchAttendance("punch_in", "At Office");
      posthog.capture("attendance_punched", { action: "punch_in" });
    } else {
      setIsPunchedIn(false);
      setPunchOutTime(timeStr);
      await punchAttendance("punch_out", "At Office");
      posthog.capture("attendance_punched", { action: "punch_out" });
    }
  };

  const handleAddNotice = (newNotice: NoticeItem) => {
    setNotices([newNotice, ...notices]);
  };

  const hours = Math.floor(secondsElapsed / 3600);
  const minutes = Math.floor((secondsElapsed % 3600) / 60);
  const seconds = secondsElapsed % 60;

  const pad = (n: number) => n.toString().padStart(2, "0");

  const filteredRecords = ATTENDANCE_RECORDS.filter(
    (r) =>
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Row 1: Punch In Hub + Notice Board */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Punch-In Timer Card (Col 6) */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                Welcome, archi <span className="text-lg">👋</span>
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                  <MapPin className="size-3" />
                  Office GPS: 18m Radius (Geofence Verified)
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center my-4">
            {/* Timer Counter & Punch Button */}
            <div className="sm:col-span-7 flex flex-col gap-3">
              {/* Digit Boxes */}
              <div className="flex items-center gap-2">
                <div className="text-center">
                  <div className="size-14 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center text-xl font-bold text-slate-800 font-mono shadow-inner">
                    {pad(hours)}
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium mt-1 block">
                    Hours
                  </span>
                </div>

                <span className="text-xl font-bold text-slate-400 -mt-4">:</span>

                <div className="text-center">
                  <div className="size-14 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center text-xl font-bold text-slate-800 font-mono shadow-inner">
                    {pad(minutes)}
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium mt-1 block">
                    Minutes
                  </span>
                </div>

                <span className="text-xl font-bold text-slate-400 -mt-4">:</span>

                <div className="text-center">
                  <div className="size-14 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center text-xl font-bold text-slate-800 font-mono shadow-inner">
                    {pad(seconds)}
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium mt-1 block">
                    Seconds
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={handlePunchToggle}
                className={`w-full sm:w-36 py-2 px-4 rounded-lg font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs ${
                  isPunchedIn
                    ? "bg-red-500 hover:bg-red-600 text-white"
                    : "bg-[#10B981] hover:bg-[#059669] text-white"
                }`}
              >
                {isPunchedIn ? (
                  <>
                    <LogOut className="size-3.5" />
                    Punch Out
                  </>
                ) : (
                  <>
                    <LogIn className="size-3.5" />
                    Punch In
                  </>
                )}
              </button>

              {/* Punch Logs */}
              <div className="flex items-center gap-4 text-xs pt-1">
                <div className="flex items-center gap-1.5">
                  <div className="size-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <LogIn className="size-3" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block leading-tight">
                      Punch In
                    </span>
                    <span className="font-semibold text-emerald-600 font-mono text-[11px]">
                      {punchInTime}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <div className="size-6 rounded-md bg-red-50 text-red-600 flex items-center justify-center">
                    <LogOut className="size-3" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block leading-tight">
                      Punch Out
                    </span>
                    <span className="font-semibold text-red-500 font-mono text-[11px]">
                      {punchOutTime}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Circular Gauge */}
            <div className="sm:col-span-5 flex flex-col items-center justify-center">
              <div className="relative size-24 rounded-full border-8 border-indigo-100 flex flex-col items-center justify-center text-center shadow-xs">
                <span className="text-sm font-bold text-slate-900 font-mono">
                  {Math.floor(secondsElapsed / 60)} min
                </span>
                <span className="text-[10px] text-slate-400">Total Today</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Notice Board (Col 6) */}
        <div className="lg:col-span-6 bg-white rounded-xl border border-[#E2E8F0] p-5 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">Notice Board</h3>
              <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {notices.length} Active
              </span>
            </div>
            
            <button
              onClick={() => setIsNoticeModalOpen(true)}
              className="size-7 rounded-lg bg-indigo-50 text-indigo-600 hover:bg-indigo-100 flex items-center justify-center transition-colors cursor-pointer"
              title="Add Notice"
            >
              <Plus className="size-4" />
            </button>
          </div>

          <div className="space-y-2.5 mt-3 max-h-48 overflow-y-auto pr-1">
            {notices.map((notice) => (
              <div
                key={notice.id}
                className="p-3 bg-slate-50/80 hover:bg-slate-50 rounded-lg border border-slate-100 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <h5 className="font-bold text-slate-800 text-xs leading-snug">
                    {notice.title}
                  </h5>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.2 rounded whitespace-nowrap ${
                      notice.priority === "High"
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}
                  >
                    {notice.priority}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                  {notice.description}
                </p>
                <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-100 text-[10px] text-slate-400">
                  <span>Audience: {notice.targetAudience}</span>
                  <span>{notice.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: 4 Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Employees */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">
            Total Employees
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-slate-900">04</span>
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-1.5 py-0.2 rounded">
              100%
            </span>
          </div>
          <div className="mt-3 text-[11px] text-indigo-700 bg-indigo-50/70 py-1 px-2 rounded-md">
            1 Partner • 1 Mgr • 1 Assoc • 1 Trainee
          </div>
        </div>

        {/* Attendance Rate */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">
            Attendance Rate
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-slate-900">75%</span>
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-1.5 py-0.2 rounded">
              3/4 Active
            </span>
          </div>
          <div className="mt-3 text-[11px] text-emerald-700 bg-emerald-50/70 py-1 px-2 rounded-md">
            1 Employee on Approved Study Leave
          </div>
        </div>

        {/* On Time */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">On Time</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-emerald-600">03</span>
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-1.5 py-0.2 rounded">
              100%
            </span>
          </div>
          <div className="mt-3 text-[11px] text-emerald-700 bg-emerald-50/70 py-1 px-2 rounded-md">
            All morning punches before 10:15 AM
          </div>
        </div>

        {/* Late Clock In */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-4 shadow-xs">
          <span className="text-xs text-slate-500 font-medium block">
            Late Clock In
          </span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold text-slate-900">00</span>
            <span className="bg-emerald-50 text-emerald-700 text-[10px] font-semibold px-1.5 py-0.2 rounded">
              0%
            </span>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 bg-slate-50 py-1 px-2 rounded-md">
            Zero tardiness recorded this week
          </div>
        </div>
      </div>

      {/* Row 3: Today's Attendance Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        {/* Table Topbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-slate-900">
            Today&apos;s Attendance Register
          </h3>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-60">
              <Search className="size-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search staff, role or location..."
                className="w-full h-8 pl-8 pr-3 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            {/* Date Selector */}
            <div className="flex items-center gap-1.5 h-8 px-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-700 font-medium">
              <span>Sep 03, 2026</span>
              <CalendarIcon className="size-3.5 text-slate-400" />
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-100 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-2.5 px-4">Employee</th>
                <th className="py-2.5 px-3">Attendance</th>
                <th className="py-2.5 px-3">Shift Status</th>
                <th className="py-2.5 px-3">Clock In &amp; Out</th>
                <th className="py-2.5 px-3">Location</th>
                <th className="py-2.5 px-3">Client Site / Audit</th>
                <th className="py-2.5 px-3">Geo Distance</th>
                <th className="py-2.5 px-4">Break Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/60 transition-colors">
                  {/* Employee */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="size-7 rounded-full bg-[#6366F1] text-white font-bold text-[10px] flex items-center justify-center">
                        {r.initials}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block leading-tight">
                          {r.name}
                        </span>
                        <span className="text-[10px] text-slate-400 font-normal">
                          {r.role}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Attendance */}
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                        r.attendance === "Present"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      <span
                        className={`size-1.5 rounded-full ${
                          r.attendance === "Present"
                            ? "bg-emerald-500"
                            : "bg-amber-500"
                        }`}
                      />
                      {r.attendance}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-3 text-slate-700 font-medium text-[11px]">
                    {r.status}
                  </td>

                  {/* Clock In & Out */}
                  <td className="py-3 px-3 font-mono text-[11px]">
                    <span className="text-emerald-600 font-semibold">{r.clockIn}</span>
                    <span className="text-slate-300 mx-1">→</span>
                    <span className="text-slate-500">{r.clockOut}</span>
                  </td>

                  {/* Location */}
                  <td className="py-3 px-3">
                    <span className="text-slate-700 font-medium bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                      {r.location}
                    </span>
                  </td>

                  {/* Client Site */}
                  <td className="py-3 px-3 text-slate-600 text-[11px]">
                    {r.clientSite}
                  </td>

                  {/* Distance */}
                  <td className="py-3 px-3 text-slate-600 text-[11px]">
                    {r.distance}
                  </td>

                  {/* Break */}
                  <td className="py-3 px-4 text-slate-600 font-mono text-[11px]">
                    {r.breakTime}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Showing {filteredRecords.length} staff members</span>
          <div className="flex items-center gap-1">
            <button disabled className="size-6 rounded border border-slate-200 flex items-center justify-center opacity-40">
              <ChevronLeft className="size-3.5" />
            </button>
            <button disabled className="size-6 rounded border border-slate-200 flex items-center justify-center opacity-40">
              <ChevronRight className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Row 4: Upcoming Holidays & Upcoming Employee Leave */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* Holidays Ledger */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <CalendarIcon className="size-4 text-indigo-600" />
              Upcoming Statutory Holidays
            </h3>
            <span className="text-[10px] text-slate-400 font-medium">
              FY 2026-27
            </span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {HOLIDAYS.map((h, i) => (
              <div key={i} className="p-3.5 flex items-center justify-between hover:bg-slate-50/50">
                <div>
                  <span className="font-bold text-slate-800 block">
                    {h.holiday}
                  </span>
                  <span className="text-[10px] text-slate-400">{h.type}</span>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-indigo-600 block text-[11px]">
                    {h.date}
                  </span>
                  <span className="text-[10px] text-slate-400">{h.day}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Leave Ledger */}
        <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <UserCheck className="size-4 text-indigo-600" />
              Approved Team Leaves
            </h3>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              ICAI Exam Season
            </span>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {UPCOMING_LEAVES.map((l, i) => (
              <div key={i} className="p-3.5 flex items-center justify-between hover:bg-slate-50/50">
                <div>
                  <span className="font-bold text-slate-800 block">
                    {l.name}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {l.role} • {l.type}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-semibold text-slate-700 block text-[11px]">
                    {l.duration}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-bold">
                    {l.days} ({l.status})
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Create Notice Modal */}
      <CreateNoticeModal
        isOpen={isNoticeModalOpen}
        onClose={() => setIsNoticeModalOpen(false)}
        onAddNotice={handleAddNotice}
      />
    </div>
  );
}
