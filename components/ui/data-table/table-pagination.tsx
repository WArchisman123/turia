"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TablePaginationProps {
  totalCount: number;
  filteredCount: number;
  startIndex: number;
  rowsPerPage: number;
  currentPage: number;
  totalPages: number;
  entityName?: string;
  onRowsPerPageChange: (newRows: number) => void;
  onPageChange: (newPage: number) => void;
  rowsPerPageOptions?: number[];
  className?: string;
}

export function TablePagination({
  filteredCount,
  startIndex,
  rowsPerPage,
  currentPage,
  totalPages,
  entityName = "items",
  onRowsPerPageChange,
  onPageChange,
  rowsPerPageOptions = [20, 50, 100],
  className = "",
}: TablePaginationProps) {
  const startNumber = filteredCount === 0 ? 0 : startIndex + 1;
  const endNumber = Math.min(startIndex + rowsPerPage, filteredCount);

  return (
    <div
      className={`p-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-slate-500 bg-slate-50/50 select-none ${className}`}
    >
      <div>
        Showing{" "}
        <span className="font-bold text-slate-700">
          {startNumber}–{endNumber}
        </span>{" "}
        of <span className="font-bold text-slate-700">{filteredCount}</span>{" "}
        {entityName}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 text-[11px]">Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
            className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-slate-700 focus:outline-none cursor-pointer text-xs"
          >
            {rowsPerPageOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={currentPage <= 1}
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            title="Previous page"
          >
            <ChevronLeft className="size-3.5" />
          </button>
          <span className="px-2 font-semibold text-slate-700 text-[11px]">
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            disabled={currentPage >= totalPages}
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            title="Next page"
          >
            <ChevronRight className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
