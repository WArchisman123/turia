"use client";

import React from "react";
import { X, RotateCcw, SlidersHorizontal, IndianRupee, Sparkles } from "lucide-react";
import { LeadFilterState } from "./types";

interface LeadsFilterBarProps {
  isOpen: boolean;
  filters: LeadFilterState;
  onFilterChange: (newFilters: LeadFilterState) => void;
  onClear: () => void;
  onClose: () => void;
}

export function LeadsFilterBar({
  isOpen,
  filters,
  onFilterChange,
  onClear,
  onClose,
}: LeadsFilterBarProps) {
  if (!isOpen) return null;

  const handleFieldChange = <K extends keyof LeadFilterState>(
    field: K,
    value: LeadFilterState[K]
  ) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  const maxDealValue = 10000000; // 100 Lakhs

  return (
    <div className="bg-white rounded-2xl border border-indigo-100 shadow-md p-5 mb-4 animate-in slide-in-from-top-2 duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 mb-4">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
            <SlidersHorizontal className="size-3.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">Advanced Pipeline Filters</h4>
            <span className="text-[10px] text-slate-400">Filter leads by stage, commercials &amp; score</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onClear}
            className="px-2.5 py-1 text-[11px] font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
          >
            <RotateCcw className="size-3" /> Clear All
          </button>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      {/* Row 1: 6 Dropdown Filters */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
        {/* 1. Stage */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Stage</label>
          <select
            value={filters.stage}
            onChange={(e) => handleFieldChange("stage", e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-xs"
          >
            <option value="All">All Stages</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Proposal Sent">Proposal Sent</option>
            <option value="Negotiation">Negotiation</option>
            <option value="Closed Won">Closed Won</option>
            <option value="Closed Lost">Closed Lost</option>
          </select>
        </div>

        {/* 2. Status */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Status</label>
          <select
            value={filters.status}
            onChange={(e) => handleFieldChange("status", e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-xs"
          >
            <option value="All">All Statuses</option>
            <option value="Open">Open</option>
            <option value="Converted">Converted</option>
            <option value="Lost">Lost</option>
          </select>
        </div>

        {/* 3. Assigned To */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Assigned To</label>
          <select
            value={filters.assignedTo}
            onChange={(e) => handleFieldChange("assignedTo", e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-xs"
          >
            <option value="All">All Assignees</option>
            <option value="archi">archi (Partner)</option>
            <option value="Vikram Saha">Vikram Saha (Managing Partner)</option>
            <option value="Priya Mukherjee">Priya Mukherjee (Manager)</option>
            <option value="Rahul Verma">Rahul Verma (Associate)</option>
            <option value="Ananya Sen">Ananya Sen (Article)</option>
          </select>
        </div>

        {/* 4. Source */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Lead Source</label>
          <select
            value={filters.source}
            onChange={(e) => handleFieldChange("source", e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-xs"
          >
            <option value="All">All Sources</option>
            <option value="Referral">Client Referral</option>
            <option value="Website">Inbound Website</option>
            <option value="LinkedIn">LinkedIn Outreach</option>
            <option value="Direct Walk-in">Direct Walk-in</option>
            <option value="MCA Data">MCA ROC Data Extraction</option>
            <option value="Partner Network">Partner Network</option>
          </select>
        </div>

        {/* 5. Entity Type */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Entity Type</label>
          <select
            value={filters.entityType}
            onChange={(e) => handleFieldChange("entityType", e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-xs"
          >
            <option value="All">All Entities</option>
            <option value="Private Limited">Private Limited Company</option>
            <option value="LLP">Limited Liability Partnership (LLP)</option>
            <option value="Public Limited">Public Limited Company</option>
            <option value="Sole Proprietorship">Sole Proprietorship</option>
            <option value="Partnership">Partnership Firm</option>
          </select>
        </div>

        {/* 6. Date Range */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">Creation Period</label>
          <select
            value={filters.dateRange}
            onChange={(e) => handleFieldChange("dateRange", e.target.value)}
            className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-xs"
          >
            <option value="All">All Time</option>
            <option value="This Month">This Month (Sep 2026)</option>
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="This FY">This Financial Year (2026-27)</option>
          </select>
        </div>
      </div>

      {/* Row 2: Dual Range Sliders (Deal Value & Lead Score) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5 pt-4 border-t border-slate-100">
        {/* Deal Value Range Slider */}
        <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
              <IndianRupee className="size-3 text-indigo-600" />
              Deal Value Range (₹0 – ₹100 Lakhs)
            </span>
            <span className="text-[11px] font-mono font-bold text-indigo-700">
              ₹{(filters.dealValueRange[0] / 100000).toFixed(1)}L — ₹
              {(filters.dealValueRange[1] / 100000).toFixed(1)}L
            </span>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={maxDealValue}
              step={50000}
              value={filters.dealValueRange[0]}
              onChange={(e) =>
                handleFieldChange("dealValueRange", [
                  Number(e.target.value),
                  Math.max(Number(e.target.value), filters.dealValueRange[1]),
                ])
              }
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <input
              type="range"
              min={0}
              max={maxDealValue}
              step={50000}
              value={filters.dealValueRange[1]}
              onChange={(e) =>
                handleFieldChange("dealValueRange", [
                  Math.min(Number(e.target.value), filters.dealValueRange[0]),
                  Number(e.target.value),
                ])
              }
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
            <span>Min: ₹{(filters.dealValueRange[0] / 100000).toFixed(1)}L</span>
            <span>Max: ₹{(filters.dealValueRange[1] / 100000).toFixed(1)}L</span>
          </div>
        </div>

        {/* Lead Score Range Slider (0 - 100) */}
        <div className="bg-slate-50/70 p-3.5 rounded-xl border border-slate-200/80">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
              <Sparkles className="size-3 text-amber-500" />
              Lead Health Score Range (0 – 100)
            </span>
            <span className="text-[11px] font-mono font-bold text-amber-700">
              Score {filters.scoreRange[0]} — {filters.scoreRange[1]}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="range"
              min={0}
              max={100}
              value={filters.scoreRange[0]}
              onChange={(e) =>
                handleFieldChange("scoreRange", [
                  Number(e.target.value),
                  Math.max(Number(e.target.value), filters.scoreRange[1]),
                ])
              }
              className="w-full accent-amber-500 cursor-pointer"
            />
            <input
              type="range"
              min={0}
              max={100}
              value={filters.scoreRange[1]}
              onChange={(e) =>
                handleFieldChange("scoreRange", [
                  Math.min(Number(e.target.value), filters.scoreRange[0]),
                  Number(e.target.value),
                ])
              }
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
            <span>Min: {filters.scoreRange[0]}</span>
            <span>Max: {filters.scoreRange[1]}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
