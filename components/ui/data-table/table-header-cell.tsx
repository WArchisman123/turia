"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import {
  MoreVertical,
  ArrowUpAZ,
  ArrowDownZA,
  Search,
  X,
  EyeOff,
  RotateCcw,
} from "lucide-react";
import { ColumnDef } from "./types";

interface TableHeaderCellProps {
  column: ColumnDef;
  isSorted: boolean;
  sortDirection?: "asc" | "desc";
  isFiltered: boolean;
  filterValue?: string;
  isMenuOpen: boolean;
  onToggleMenu: () => void;
  onCloseMenu: () => void;
  onToggleSort: () => void;
  onSetSort: (direction: "asc" | "desc") => void;
  onClearSort: () => void;
  onSetFilter: (val: string) => void;
  onHideColumn: () => void;
  menuAlign?: "left" | "right";
  className?: string;
}

interface MenuPosition {
  top: number;
  left?: number;
  right?: number;
}

export function TableHeaderCell({
  column,
  isSorted,
  sortDirection,
  isFiltered,
  filterValue,
  isMenuOpen,
  onToggleMenu,
  onCloseMenu,
  onToggleSort,
  onSetSort,
  onClearSort,
  onSetFilter,
  onHideColumn,
  menuAlign = "left",
  className = "",
}: TableHeaderCellProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [menuPos, setMenuPos] = useState<MenuPosition>({ top: 0, left: 0 });

  // Compute fixed position from the trigger button's bounding rect
  const updateMenuPosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const MENU_WIDTH = 224; // w-56 = 14rem = 224px
    const GAP = 6;

    if (menuAlign === "right") {
      setMenuPos({
        top: rect.bottom + GAP + window.scrollY,
        right: window.innerWidth - rect.right,
      });
    } else {
      setMenuPos({
        top: rect.bottom + GAP + window.scrollY,
        left: rect.left - MENU_WIDTH + rect.width,
      });
    }
  }, [menuAlign]);

  useEffect(() => {
    if (!isMenuOpen) return;
    updateMenuPosition();

    // Recompute on scroll/resize to keep menu anchored
    window.addEventListener("scroll", updateMenuPosition, true);
    window.addEventListener("resize", updateMenuPosition);
    return () => {
      window.removeEventListener("scroll", updateMenuPosition, true);
      window.removeEventListener("resize", updateMenuPosition);
    };
  }, [isMenuOpen, updateMenuPosition]);

  // Close on outside click
  useEffect(() => {
    if (!isMenuOpen) return;
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const clickedMenu = menuRef.current?.contains(target);
      const clickedTrigger = triggerRef.current?.contains(target);
      if (!clickedMenu && !clickedTrigger) {
        onCloseMenu();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen, onCloseMenu]);

  const menuStyle: React.CSSProperties = {
    position: "fixed",
    top: menuPos.top,
    ...(menuPos.left !== undefined ? { left: menuPos.left } : {}),
    ...(menuPos.right !== undefined ? { right: menuPos.right } : {}),
    zIndex: 9999,
    width: 224,
  };

  return (
    <th
      className={`py-3 px-3 relative transition-colors border-0 ${
        isSorted || isFiltered ? "bg-indigo-50/50 text-indigo-700" : ""
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-1">
        {/* Column Title / Sort Toggle */}
        <button
          type="button"
          onClick={onToggleSort}
          className="flex items-center gap-1 hover:text-indigo-600 cursor-pointer text-left font-semibold uppercase tracking-wider"
          title="Click to sort"
        >
          <span>{column.label}</span>
          {isSorted && (
            <span className="text-indigo-600 font-bold">
              {sortDirection === "asc" ? "↑" : "↓"}
            </span>
          )}
          {isFiltered && (
            <span className="size-1.5 rounded-full bg-indigo-600 shrink-0" />
          )}
        </button>

        {/* 3-Dot Column Header Action Button */}
        <button
          ref={triggerRef}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleMenu();
          }}
          className={`p-1 rounded-md transition-colors cursor-pointer ${
            isMenuOpen || isSorted || isFiltered
              ? "text-indigo-600 bg-indigo-100/70"
              : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          }`}
          title={`Actions for ${column.label}`}
        >
          <MoreVertical className="size-3.5" />
        </button>

        {/* Portal: Dropdown renders at document.body level — escapes overflow clipping */}
        {isMenuOpen &&
          createPortal(
            <div
              ref={menuRef}
              style={menuStyle}
              className="bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 animate-in fade-in zoom-in-95 duration-100 text-xs font-normal normal-case text-slate-700 text-left"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-3 py-1.5 border-b border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                <span>Column: {column.label}</span>
              </div>

              {/* Sort Ascending */}
              <button
                type="button"
                onClick={() => onSetSort("asc")}
                className={`w-full px-3 py-2 text-left flex items-center gap-2.5 hover:bg-slate-50 cursor-pointer transition-colors ${
                  isSorted && sortDirection === "asc"
                    ? "text-indigo-600 font-semibold bg-indigo-50/50"
                    : "text-slate-700"
                }`}
              >
                <ArrowUpAZ className="size-3.5 text-indigo-500 shrink-0" />
                <span>Sort Ascending</span>
              </button>

              {/* Sort Descending */}
              <button
                type="button"
                onClick={() => onSetSort("desc")}
                className={`w-full px-3 py-2 text-left flex items-center gap-2.5 hover:bg-slate-50 cursor-pointer transition-colors ${
                  isSorted && sortDirection === "desc"
                    ? "text-indigo-600 font-semibold bg-indigo-50/50"
                    : "text-slate-700"
                }`}
              >
                <ArrowDownZA className="size-3.5 text-indigo-500 shrink-0" />
                <span>Sort Descending</span>
              </button>

              {/* Clear Sort */}
              {isSorted && (
                <button
                  type="button"
                  onClick={onClearSort}
                  className="w-full px-3 py-1.5 text-left flex items-center gap-2.5 text-rose-600 hover:bg-rose-50 cursor-pointer text-[11px] transition-colors"
                >
                  <RotateCcw className="size-3 text-rose-500 shrink-0" />
                  <span>Clear Column Sort</span>
                </button>
              )}

              {/* Filter Column */}
              <div className="p-2 border-t border-slate-100">
                <div className="text-[10px] font-semibold text-slate-400 mb-1 px-0.5">
                  FILTER BY VALUE
                </div>
                <div className="relative">
                  <Search className="size-3 absolute left-2 top-2 text-slate-400" />
                  <input
                    type="text"
                    placeholder={`Search ${column.label}...`}
                    value={filterValue || ""}
                    onChange={(e) => onSetFilter(e.target.value)}
                    className="w-full pl-6 pr-6 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    autoFocus
                  />
                  {filterValue && (
                    <button
                      type="button"
                      onClick={() => onSetFilter("")}
                      className="absolute right-1.5 top-1.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="size-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Hide Column */}
              <div className="border-t border-slate-100 pt-1">
                <button
                  type="button"
                  onClick={onHideColumn}
                  className="w-full px-3 py-1.5 text-left flex items-center gap-2.5 text-slate-600 hover:bg-slate-50 cursor-pointer text-[11px] transition-colors"
                >
                  <EyeOff className="size-3.5 text-slate-400 shrink-0" />
                  <span>Hide Column</span>
                </button>
              </div>
            </div>,
            document.body
          )}
      </div>
    </th>
  );
}
