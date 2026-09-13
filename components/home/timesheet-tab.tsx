"use client";

import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus, Copy, Check } from "lucide-react";
import { AddTimeEntryModal, TimeEntryItem } from "./add-time-entry-modal";
import { fetchTimesheet, saveTimesheetEntry } from "@/lib/api/home";

const DAYS = [
  { day: "Mon, Aug 31", expected: "08:00", total: "08:30", diff: "+00:30", isToday: false },
  { day: "Tue, Sep 01", expected: "08:00", total: "08:00", diff: "+00:00", isToday: false },
  { day: "Wed, Sep 02", expected: "08:00", total: "07:30", diff: "-00:30", isToday: false },
  { day: "Thu, Sep 03", expected: "08:00", total: "05:00", diff: "-03:00", isToday: true },
  { day: "Fri, Sep 04", expected: "08:00", total: "00:00", diff: "-08:00", isToday: false },
  { day: "Sat, Sep 05", expected: "04:00", total: "00:00", diff: "-04:00", isToday: false },
  { day: "Sun, Sep 06", expected: "00:00", total: "00:00", diff: "+00:00", isToday: false },
];

const HOURS = [
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
  "9:00 PM",
  "10:00 PM",
  "11:00 PM",
];

export function TimesheetTab() {
  const [viewMode, setViewMode] = useState("Weekly");
  const [userView, setUserView] = useState("My View");
  const [entries, setEntries] = useState<TimeEntryItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadTimesheet() {
      const data = await fetchTimesheet();
      if (isMounted) {
        setEntries(data || []);
      }
    }
    loadTimesheet();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddEntry = async (entry: TimeEntryItem) => {
    setEntries((prev) => [entry, ...prev]);
    await saveTimesheetEntry(entry);
  };

  const handleCopyPrevious = () => {
    setCopiedMessage(true);
    setTimeout(() => setCopiedMessage(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs overflow-hidden">
      {/* Top Header Control Strip */}
      <div className="p-4 border-b border-[#E2E8F0] flex flex-wrap items-center justify-between gap-3 bg-white">
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 border border-indigo-200 bg-indigo-50/50 text-indigo-700 hover:bg-indigo-100 font-semibold text-xs rounded-lg transition-colors cursor-pointer">
            Today
          </button>

          {/* Date Range Navigator */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700">
            <button className="text-slate-400 hover:text-slate-700 cursor-pointer">
              <ChevronLeft className="size-3.5" />
            </button>
            <span>Aug 31 - Sep 06, 2026</span>
            <button className="text-slate-400 hover:text-slate-700 cursor-pointer">
              <ChevronRight className="size-3.5" />
            </button>
          </div>

          {copiedMessage && (
            <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-100 flex items-center gap-1 font-medium animate-in fade-in">
              <Check className="size-3" />
              Copied template from previous week!
            </span>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* View Dropdown */}
          <select
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            className="h-8 px-2.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-medium cursor-pointer"
          >
            <option>Weekly</option>
            <option>Daily</option>
            <option>Monthly</option>
          </select>

          {/* User View Dropdown */}
          <select
            value={userView}
            onChange={(e) => setUserView(e.target.value)}
            className="h-8 px-2.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 font-medium cursor-pointer"
          >
            <option>My View (archi)</option>
            <option>Team View (All 4 Users)</option>
          </select>

          {/* Add Time Entry Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="h-8 px-3.5 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold text-xs rounded-lg flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="size-3.5" />
            Add Entry
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopyPrevious}
            className="size-8 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 flex items-center justify-center transition-colors cursor-pointer"
            title="Copy Previous Timesheet"
          >
            <Copy className="size-3.5" />
          </button>
        </div>
      </div>

      {/* Weekly Matrix Calendar Grid */}
      <div className="overflow-x-auto relative">
        <table className="w-full text-left border-collapse">
          {/* Days Header Row */}
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/70">
              <th className="w-24 p-3 text-center text-xs font-semibold text-slate-500 border-r border-slate-200 uppercase">
                Time
              </th>

              {DAYS.map((d, i) => (
                <th
                  key={i}
                  className={`p-3 text-center border-r border-slate-200 min-w-[140px] ${
                    d.isToday ? "bg-indigo-50/40" : ""
                  }`}
                >
                  <div
                    className={`text-xs font-bold ${
                      d.isToday ? "text-[#4F46E5]" : "text-slate-800"
                    }`}
                  >
                    {d.day}
                  </div>

                  {/* Daily Metric Summaries */}
                  <div className="grid grid-cols-3 gap-1 mt-1.5 text-[10px] font-mono">
                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase font-sans">
                        Expected
                      </span>
                      <span className="text-slate-600 font-medium">{d.expected}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase font-sans">
                        Total
                      </span>
                      <span className="text-slate-600 font-medium">{d.total}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[9px] uppercase font-sans">
                        Difference
                      </span>
                      <span
                        className={`font-bold ${
                          d.diff.startsWith("+")
                            ? "text-emerald-600"
                            : "text-amber-600"
                        }`}
                      >
                        {d.diff}
                      </span>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Hourly Matrix Rows (12 PM - 11 PM) */}
          <tbody className="divide-y divide-slate-100">
            {HOURS.map((hour, idx) => {
              const isIndicatorRow = hour === "3:00 PM";

              return (
                <tr
                  key={idx}
                  className="h-16 relative hover:bg-slate-50/30 transition-colors"
                >
                  {/* Time Label */}
                  <td className="p-3 text-center text-xs font-mono font-medium text-slate-500 border-r border-slate-200 bg-slate-50/30">
                    {hour}
                  </td>

                  {/* 7 Day Slot Columns */}
                  {DAYS.map((d, dayIdx) => {
                    const matchedEntry = entries.find(
                      (e) => e.day === d.day && e.startTime.startsWith(hour.slice(0, 2))
                    );

                    return (
                      <td
                        key={dayIdx}
                        className={`border-r border-slate-100 relative p-1 ${
                          d.isToday ? "bg-indigo-50/10" : ""
                        }`}
                      >
                        {/* Rendered Time Entry Card */}
                        {matchedEntry && (
                          <div className="h-full bg-indigo-50 border border-indigo-200/80 rounded-md p-1.5 text-[10px] shadow-xs flex flex-col justify-between">
                            <span className="font-bold text-indigo-950 truncate block">
                              {matchedEntry.client}
                            </span>
                            <span className="text-indigo-700 truncate block">
                              {matchedEntry.service}
                            </span>
                            <div className="flex items-center justify-between text-[9px] text-slate-500 font-mono">
                              <span>{matchedEntry.durationHours} hrs</span>
                              <span className="text-emerald-700 font-bold">
                                ₹{matchedEntry.billingRate}/hr
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Live Red Indicator Line on current hour */}
                        {isIndicatorRow && (
                          <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-red-500 z-10 pointer-events-none">
                            {dayIdx === 0 && (
                              <span className="absolute -left-1.5 -top-1 size-2.5 rounded-full bg-red-500 shadow-xs" />
                            )}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add Time Entry Modal */}
      <AddTimeEntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddEntry={handleAddEntry}
      />
    </div>
  );
}
