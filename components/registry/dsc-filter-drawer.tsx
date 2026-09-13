"use client";

import React from "react";
import { X, Filter, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilterState {
  location: string;
  status: string;
  vendor: string;
  filterType: string;
}

interface DSCFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onApplyFilters: (newFilters: FilterState) => void;
  onResetFilters: () => void;
}

export function DSCFilterDrawer({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
  onResetFilters,
}: DSCFilterDrawerProps) {
  const [localFilters, setLocalFilters] = React.useState<FilterState>(filters);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLocalFilters(filters);
    }, 0);
    return () => clearTimeout(timer);
  }, [filters, isOpen]);

  if (!isOpen) return null;

  const locations = [
    { value: "", label: "All Locations" },
    { value: "ca_office", label: "CA Office (Vault)" },
    { value: "cs_office", label: "CS Office" },
    { value: "client_office", label: "Client Office" },
    { value: "in_transit", label: "In Transit" },
    { value: "missing", label: "Missing / Untraceable" },
  ];

  const statuses = [
    { value: "", label: "All Statuses" },
    { value: "active", label: "Active" },
    { value: "expired", label: "Expired" },
    { value: "revoked", label: "Revoked" },
  ];

  const vendors = [
    { value: "", label: "All Vendors" },
    { value: "eMudhra", label: "eMudhra" },
    { value: "Capricorn", label: "Capricorn" },
    { value: "VSign", label: "VSign" },
    { value: "Pantasign", label: "Pantasign" },
    { value: "Sify", label: "Sify" },
  ];

  const expiryTimelines = [
    { value: "", label: "All Timelines" },
    { value: "exp15", label: "Expiring within 15 Days" },
    { value: "exp30", label: "Expiring within 30 Days" },
    { value: "expired", label: "Already Expired" },
    { value: "active", label: "Active & Valid" },
  ];

  const activeCount = Object.values(localFilters).filter(Boolean).length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-sm bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col">
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
            <div className="flex items-center gap-2">
              <Filter className="size-4 text-indigo-600 dark:text-indigo-400" />
              <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                Filter DSC Records
              </h2>
              {activeCount > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                  {activeCount}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
            {/* Expiry Timeline Filter */}
            <div>
              <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-2">
                Expiry Alert Timeline
              </label>
              <div className="space-y-1">
                {expiryTimelines.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setLocalFilters({ ...localFilters, filterType: opt.value })}
                    className={cn(
                      "w-full text-left px-3 py-1.5 rounded-lg transition-colors flex items-center justify-between cursor-pointer",
                      localFilters.filterType === opt.value
                        ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200/80 dark:border-indigo-800/40"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    )}
                  >
                    <span>{opt.label}</span>
                    {localFilters.filterType === opt.value && (
                      <span className="size-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Custody Location Filter */}
            <div>
              <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-2">
                Custody Location
              </label>
              <div className="space-y-1">
                {locations.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setLocalFilters({ ...localFilters, location: opt.value })}
                    className={cn(
                      "w-full text-left px-3 py-1.5 rounded-lg transition-colors flex items-center justify-between cursor-pointer",
                      localFilters.location === opt.value
                        ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-semibold border border-indigo-200/80 dark:border-indigo-800/40"
                        : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    )}
                  >
                    <span>{opt.label}</span>
                    {localFilters.location === opt.value && (
                      <span className="size-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-2">
                Status
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {statuses.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setLocalFilters({ ...localFilters, status: opt.value })}
                    className={cn(
                      "text-center py-1.5 px-2 rounded-lg text-xs transition-colors cursor-pointer border",
                      localFilters.status === opt.value
                        ? "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700 font-semibold"
                        : "border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Certifying Vendor Filter */}
            <div>
              <label className="block font-semibold text-slate-800 dark:text-slate-200 mb-2">
                Certifying Authority (Vendor)
              </label>
              <select
                value={localFilters.vendor}
                onChange={(e) => setLocalFilters({ ...localFilters, vendor: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                {vendors.map((v) => (
                  <option key={v.value} value={v.value}>
                    {v.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => {
                onResetFilters();
                onClose();
              }}
              className="px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer text-xs"
            >
              <RotateCcw className="size-3.5" />
              <span>Reset</span>
            </button>
            <button
              type="button"
              onClick={() => {
                onApplyFilters(localFilters);
                onClose();
              }}
              className="px-4 py-2 rounded-lg bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold transition-colors cursor-pointer text-xs shadow-xs"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
