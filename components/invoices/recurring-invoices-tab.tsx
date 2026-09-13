"use client";

import React, { useState, useMemo } from "react";
import {
  Repeat,
  LayoutGrid,
  List,
  Search,
  RotateCcw,
  Play,
} from "lucide-react";
import { RecurringInvoice, RecurringKPIData } from "./types";

interface RecurringInvoicesTabProps {
  recurring: RecurringInvoice[];
  kpi: RecurringKPIData;
  onToggleActive?: (id: string, currentActive: boolean) => void;
}

export function RecurringInvoicesTab({
  recurring,
  kpi,
  onToggleActive,
}: RecurringInvoicesTabProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [frequencyFilter, setFrequencyFilter] = useState("all");

  const filteredRecurring = useMemo(() => {
    return recurring.filter((r) => {
      if (frequencyFilter !== "all" && r.frequency !== frequencyFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesClient = (r.client_name || "").toLowerCase().includes(q);
        const matchesService = (r.service_name || "").toLowerCase().includes(q);
        if (!matchesClient && !matchesService) return false;
      }
      return true;
    });
  }, [recurring, frequencyFilter, searchQuery]);

  return (
    <div className="space-y-6">
      {/* 5 KPI Cards (invoice-5.png) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Card 1: Total */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Total Retainers
            </span>
            <Repeat className="size-4 text-purple-600" />
          </div>
          <p className="text-xl font-bold text-slate-900 mt-1 font-mono">{kpi.total}</p>
          <span className="text-[10px] text-slate-400 font-medium">Active Contracts</span>
        </div>

        {/* Card 2: Monthly */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Monthly
            </span>
            <span className="size-2 rounded-full bg-indigo-500" />
          </div>
          <p className="text-xl font-bold text-indigo-600 mt-1 font-mono">{kpi.monthly}</p>
          <span className="text-[10px] text-indigo-500 font-medium">Monthly Auto-run</span>
        </div>

        {/* Card 3: Quarterly */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Quarterly
            </span>
            <span className="size-2 rounded-full bg-blue-500" />
          </div>
          <p className="text-xl font-bold text-blue-600 mt-1 font-mono">{kpi.quarterly}</p>
          <span className="text-[10px] text-blue-500 font-medium">Every 3 Months</span>
        </div>

        {/* Card 4: Half-Yearly */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Half-Yearly
            </span>
            <span className="size-2 rounded-full bg-amber-500" />
          </div>
          <p className="text-xl font-bold text-amber-600 mt-1 font-mono">{kpi.half_yearly}</p>
          <span className="text-[10px] text-amber-500 font-medium">Every 6 Months</span>
        </div>

        {/* Card 5: Yearly */}
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              Yearly
            </span>
            <span className="size-2 rounded-full bg-emerald-500" />
          </div>
          <p className="text-xl font-bold text-emerald-600 mt-1 font-mono">{kpi.yearly}</p>
          <span className="text-[10px] text-emerald-600 font-medium">Annual Retainer</span>
        </div>
      </div>

      {/* Toolbar & View Mode Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs text-xs">
        <div className="flex items-center gap-2">
          {/* Frequency Dropdown */}
          <select
            value={frequencyFilter}
            onChange={(e) => setFrequencyFilter(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-700"
          >
            <option value="all">All Frequencies ⌄</option>
            <option value="Monthly">Monthly</option>
            <option value="Quarterly">Quarterly</option>
            <option value="Half-Yearly">Half-Yearly</option>
            <option value="Yearly">Yearly</option>
          </select>

          {frequencyFilter !== "all" && (
            <button
              type="button"
              onClick={() => setFrequencyFilter("all")}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <RotateCcw className="size-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search className="size-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search retainer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-44 sm:w-60"
            />
          </div>

          {/* View Toggle */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === "grid"
                  ? "bg-white text-indigo-600 shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="Grid View"
            >
              <LayoutGrid className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === "list"
                  ? "bg-white text-indigo-600 shadow-2xs"
                  : "text-slate-500 hover:text-slate-800"
              }`}
              title="List View"
            >
              <List className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRecurring.length === 0 ? (
            <div className="col-span-3 py-12 text-center text-slate-400 text-xs bg-white rounded-2xl border border-slate-200">
              No recurring retainer profiles found.
            </div>
          ) : (
            filteredRecurring.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4 hover:shadow-md transition-shadow relative"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700 border border-indigo-100">
                      {r.frequency}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 mt-2">{r.client_name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">
                      {r.service_name || "Compliance & Retainership"}
                    </p>
                  </div>
                  {/* Active Toggle */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={r.is_active}
                      onChange={() => onToggleActive?.(r.id, r.is_active)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
                  <span className="text-xs text-slate-400">Retainer Fee:</span>
                  <span className="text-lg font-bold font-mono text-slate-900">
                    ₹ {r.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="bg-slate-50/80 p-3 rounded-xl border border-slate-200 text-[11px] space-y-1">
                  <div className="flex justify-between text-slate-600">
                    <span>Next Auto-Generation:</span>
                    <span className="font-bold text-indigo-700">{r.next_run_date}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Contract Period:</span>
                    <span>{r.start_date} - {r.end_date || "Continuous"}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3.5">Client</th>
                  <th className="py-3 px-3">Service Scope</th>
                  <th className="py-3 px-3">Frequency</th>
                  <th className="py-3 px-3 text-right">Fee (₹)</th>
                  <th className="py-3 px-3">Next Run Date</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecurring.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-3.5 font-bold text-slate-900">{r.client_name}</td>
                    <td className="py-3 px-3 text-slate-600">{r.service_name || "General Compliance"}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700">
                        {r.frequency}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-900">
                      ₹ {r.amount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-3 px-3 font-medium text-indigo-700">{r.next_run_date}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          r.is_active
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}
                      >
                        {r.is_active ? "Active" : "Paused"}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => onToggleActive?.(r.id, r.is_active)}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
                      >
                        <Play className="size-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
