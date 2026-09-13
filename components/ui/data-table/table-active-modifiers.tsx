"use client";

import React, { useState, useRef, useEffect } from "react";
import { Filter, X, Columns as ColumnsIcon, RotateCcw } from "lucide-react";
import { ColumnDef, ColumnSort } from "./types";

interface TableActiveModifiersProps {
  columns: ColumnDef[];
  columnSort: ColumnSort | null;
  columnFilters: Record<string, string>;
  hiddenColumnKeys: string[];
  onClearSort: () => void;
  onClearFilter: (key: string) => void;
  onToggleColumnVisibility: (key: string) => void;
  onResetAll: () => void;
  className?: string;
}

export function TableActiveModifiers({
  columns,
  columnSort,
  columnFilters,
  hiddenColumnKeys,
  onClearSort,
  onClearFilter,
  onToggleColumnVisibility,
  onResetAll,
  className = "",
}: TableActiveModifiersProps) {
  const [isColumnPickerOpen, setIsColumnPickerOpen] = useState(false);
  const columnPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isColumnPickerOpen) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        columnPickerRef.current &&
        !columnPickerRef.current.contains(event.target as Node)
      ) {
        setIsColumnPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isColumnPickerOpen]);

  const hasActiveModifiers =
    Boolean(columnSort) ||
    Object.keys(columnFilters).length > 0 ||
    hiddenColumnKeys.length > 0;

  if (!hasActiveModifiers) return null;

  return (
    <div
      className={`bg-indigo-50/90 border-b border-indigo-100 px-5 py-2 flex flex-wrap items-center justify-between gap-2 text-xs animate-in fade-in duration-150 ${className}`}
    >
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-semibold text-indigo-900 flex items-center gap-1 text-[11px]">
          <Filter className="size-3 text-indigo-600 shrink-0" /> Active Controls:
        </span>

        {/* Sorted Chip */}
        {columnSort && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white border border-indigo-200 text-indigo-700 text-[11px] font-medium shadow-2xs">
            <span>
              Sorted: {columns.find((c) => c.key === columnSort.key)?.label || columnSort.key} (
              {columnSort.direction === "asc" ? "Asc" : "Desc"})
            </span>
            <button
              type="button"
              onClick={onClearSort}
              className="hover:text-indigo-950 cursor-pointer p-0.5 -mr-1"
              title="Clear sort"
            >
              <X className="size-3" />
            </button>
          </span>
        )}

        {/* Filter Chips */}
        {Object.entries(columnFilters).map(([key, val]) => (
          <span
            key={key}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white border border-indigo-200 text-indigo-700 text-[11px] font-medium shadow-2xs"
          >
            <span>
              {columns.find((c) => c.key === key)?.label || key}: &quot;{val}&quot;
            </span>
            <button
              type="button"
              onClick={() => onClearFilter(key)}
              className="hover:text-indigo-950 cursor-pointer p-0.5 -mr-1"
              title="Clear filter"
            >
              <X className="size-3" />
            </button>
          </span>
        ))}

        {/* Hidden Columns Indicator */}
        {hiddenColumnKeys.length > 0 && (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white border border-indigo-200 text-indigo-700 text-[11px] font-medium shadow-2xs">
            <span>{hiddenColumnKeys.length} column(s) hidden</span>
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {/* Columns Visibility Toggle Button */}
        <div className="relative" ref={columnPickerRef}>
          <button
            type="button"
            onClick={() => setIsColumnPickerOpen(!isColumnPickerOpen)}
            className="px-2.5 py-1 bg-white hover:bg-slate-50 border border-indigo-200 text-indigo-700 rounded-lg text-[11px] font-semibold flex items-center gap-1 cursor-pointer shadow-2xs transition-colors"
          >
            <ColumnsIcon className="size-3 shrink-0" />
            <span>Columns</span>
          </button>

          {isColumnPickerOpen && (
            <div className="absolute right-0 top-8 w-52 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-40 animate-in fade-in zoom-in-95 duration-100 text-xs text-slate-700 space-y-1.5">
              <div className="px-2 py-1 font-bold text-[11px] text-slate-900 border-b border-slate-100">
                Toggle Columns
              </div>
              <div className="max-h-56 overflow-y-auto space-y-1 px-1">
                {columns.map((col) => {
                  const isHidden = hiddenColumnKeys.includes(col.key);
                  return (
                    <label
                      key={col.key}
                      className="flex items-center gap-2 px-1.5 py-1 rounded hover:bg-slate-50 cursor-pointer text-xs select-none"
                    >
                      <input
                        type="checkbox"
                        checked={!isHidden}
                        onChange={() => onToggleColumnVisibility(col.key)}
                        className="rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500 size-3.5 cursor-pointer"
                      />
                      <span
                        className={
                          isHidden
                            ? "text-slate-400"
                            : "text-slate-800 font-medium"
                        }
                      >
                        {col.label}
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Reset All Button */}
        <button
          type="button"
          onClick={onResetAll}
          className="px-2.5 py-1 bg-white hover:bg-rose-50 border border-rose-200 text-rose-600 rounded-lg text-[11px] font-semibold flex items-center gap-1 cursor-pointer shadow-2xs transition-colors"
        >
          <RotateCcw className="size-3 shrink-0" />
          <span>Reset All</span>
        </button>
      </div>
    </div>
  );
}
