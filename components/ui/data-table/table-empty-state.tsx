"use client";

import React from "react";
import { Sparkles, RotateCcw } from "lucide-react";

interface TableEmptyStateProps {
  title?: string;
  subtitle?: string;
  hasActiveModifiers?: boolean;
  onResetAll?: () => void;
  colSpan?: number;
  className?: string;
}

export function TableEmptyState({
  title = "No items found",
  subtitle = "Try adjusting your filters or search query",
  hasActiveModifiers = false,
  onResetAll,
  colSpan = 1,
  className = "",
}: TableEmptyStateProps) {
  return (
    <tr>
      <td colSpan={colSpan} className={`py-16 text-center text-slate-400 ${className}`}>
        <div className="size-12 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto mb-2 text-slate-400">
          <Sparkles className="size-5" />
        </div>
        <p className="text-sm font-semibold text-slate-700">{title}</p>
        <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
        {hasActiveModifiers && onResetAll && (
          <button
            type="button"
            onClick={onResetAll}
            className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="size-3" />
            <span>Reset Table Filters</span>
          </button>
        )}
      </td>
    </tr>
  );
}
