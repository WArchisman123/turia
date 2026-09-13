"use client";

import React, { useState, useRef } from "react";
import {
  MoreVertical,
  Copy,
  Check,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Trash2,
  Edit2,
  Repeat,
} from "lucide-react";
import { DSCItem, DSCLocation, DSCStatus } from "./types";
import { cn } from "@/lib/utils";
import { RowActionDropdown } from "@/components/ui/data-table";

interface DSCTableProps {
  items: DSCItem[];
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onToggleSelectAll: () => void;
  onTransferCustody: (item: DSCItem) => void;
  onEdit: (item: DSCItem) => void;
  onDelete: (item: DSCItem) => void;
  groupBy: "none" | "location" | "status" | "vendor";
}

type SortField =
  | "dscCode"
  | "businessName"
  | "legalName"
  | "signatoryName"
  | "issuedDate"
  | "expiryDate"
  | "location"
  | "status"
  | "binNumber"
  | "vendor";

export function DSCTable({
  items,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onTransferCustody,
  onEdit,
  onDelete,
  groupBy,
}: DSCTableProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField>("expiryDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const sortedItems = [...items].sort((a, b) => {
    let cmp = 0;
    if (sortField === "expiryDate" || sortField === "issuedDate") {
      const dateA = new Date(a[sortField]).getTime();
      const dateB = new Date(b[sortField]).getTime();
      cmp = dateA - dateB;
    } else {
      const valA = (a[sortField] || "").toString().toLowerCase();
      const valB = (b[sortField] || "").toString().toLowerCase();
      cmp = valA.localeCompare(valB);
    }
    return sortOrder === "asc" ? cmp : -cmp;
  });

  const totalRows = sortedItems.length;
  const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));
  const startIndex = (page - 1) * pageSize;
  const paginatedItems = sortedItems.slice(startIndex, startIndex + pageSize);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const renderLocationBadge = (loc: DSCLocation, label: string) => {
    switch (loc) {
      case "ca_office":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/40">
            <span className="size-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
            {label}
          </span>
        );
      case "cs_office":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/40">
            <span className="size-1.5 rounded-full bg-amber-600 dark:bg-amber-400" />
            {label}
          </span>
        );
      case "client_office":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/40">
            <span className="size-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
            {label}
          </span>
        );
      case "missing":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800/40">
            <span className="size-1.5 rounded-full bg-rose-600 dark:bg-rose-400" />
            {label}
          </span>
        );
      case "in_transit":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800/40">
            <span className="size-1.5 rounded-full bg-purple-600 dark:bg-purple-400" />
            {label}
          </span>
        );
    }
  };

  const renderStatusBadge = (status: DSCStatus, label: string) => {
    switch (status) {
      case "active":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
            <span className="size-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400" />
            {label}
          </span>
        );
      case "expired":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300">
            <span className="size-1.5 rounded-full bg-rose-600 dark:bg-rose-400" />
            {label}
          </span>
        );
      case "revoked":
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            <span className="size-1.5 rounded-full bg-slate-400" />
            {label}
          </span>
        );
    }
  };

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="size-3 text-slate-400 opacity-60 ml-1" />;
    }
    return sortOrder === "asc" ? (
      <ArrowUp className="size-3 text-indigo-600 dark:text-indigo-400 ml-1" />
    ) : (
      <ArrowDown className="size-3 text-indigo-600 dark:text-indigo-400 ml-1" />
    );
  };

  const allSelected =
    paginatedItems.length > 0 &&
    paginatedItems.every((item) => selectedIds.includes(item.id));

  // Render grouped view if groupBy is not 'none'
  const groupedData: Record<string, DSCItem[]> = {};
  if (groupBy !== "none") {
    paginatedItems.forEach((item) => {
      let key = "Other";
      if (groupBy === "location") key = item.locationLabel;
      else if (groupBy === "status") key = item.statusLabel;
      else if (groupBy === "vendor") key = item.vendor;
      if (!groupedData[key]) groupedData[key] = [];
      groupedData[key].push(item);
    });
  }

  const renderRow = (item: DSCItem) => {
    const isSelected = selectedIds.includes(item.id);
    const isCopied = copiedId === item.id;
    const isMenuOpen = openMenuId === item.id;

    return (
      <tr
        key={item.id}
        className={cn(
          "border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50/75 dark:hover:bg-slate-800/40 transition-colors text-xs text-slate-700 dark:text-slate-300 group",
          isSelected && "bg-indigo-50/40 dark:bg-indigo-950/20"
        )}
      >
        {/* 1. Checkbox */}
        <td className="py-2.5 px-3 w-10 text-center">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={() => onToggleSelect(item.id)}
            className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 size-3.5 cursor-pointer"
          />
        </td>

        {/* 2. DSC ID */}
        <td className="py-2.5 px-3 font-mono text-[11px] font-semibold text-slate-900 dark:text-slate-100 whitespace-nowrap">
          <div className="flex items-center gap-1.5">
            <span>{item.dscCode}</span>
            <button
              type="button"
              onClick={() => handleCopy(item.dscCode, item.id)}
              className="text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors p-0.5"
              title="Copy DSC ID"
            >
              {isCopied ? (
                <Check className="size-3 text-emerald-600" />
              ) : (
                <Copy className="size-3" />
              )}
            </button>
          </div>
        </td>

        {/* 3. Business Name */}
        <td className="py-2.5 px-3 font-medium text-slate-900 dark:text-white max-w-[180px] truncate" title={item.businessName}>
          {item.businessName}
        </td>

        {/* 4. Legal Name */}
        <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400 max-w-[180px] truncate" title={item.legalName}>
          {item.legalName}
        </td>

        {/* 5. Name (Signatory / Director) */}
        <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
          <div>
            <span>{item.signatoryName}</span>
            {item.dinNumber && (
              <span className="block text-[10px] font-normal text-slate-400 font-mono">
                DIN: {item.dinNumber}
              </span>
            )}
          </div>
        </td>

        {/* 6. Issued Date */}
        <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400 whitespace-nowrap font-mono text-[11px]">
          {formatDate(item.issuedDate)}
        </td>

        {/* 7. Expiry Date */}
        <td className="py-2.5 px-3 whitespace-nowrap font-mono text-[11px]">
          <div className="flex items-center gap-1.5">
            <span
              className={cn(
                "font-semibold",
                item.isExpired
                  ? "text-rose-600 dark:text-rose-400"
                  : item.isExpiringIn15d
                  ? "text-orange-600 dark:text-orange-400"
                  : item.isExpiringIn30d
                  ? "text-amber-600 dark:text-amber-400"
                  : "text-slate-700 dark:text-slate-300"
              )}
            >
              {formatDate(item.expiryDate)}
            </span>
            {item.isExpired ? (
              <span className="text-[9px] px-1 py-0.2 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-sans font-bold">
                Expired
              </span>
            ) : item.isExpiringIn15d ? (
              <span className="text-[9px] px-1 py-0.2 rounded bg-orange-100 dark:bg-orange-950 text-orange-700 dark:text-orange-300 font-sans font-bold">
                {item.daysUntilExpiry}d left
              </span>
            ) : item.isExpiringIn30d ? (
              <span className="text-[9px] px-1 py-0.2 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-sans font-bold">
                {item.daysUntilExpiry}d left
              </span>
            ) : null}
          </div>
        </td>

        {/* 8. Location */}
        <td className="py-2.5 px-3 whitespace-nowrap">
          {renderLocationBadge(item.location, item.locationLabel)}
        </td>

        {/* 9. Status */}
        <td className="py-2.5 px-3 whitespace-nowrap">
          {renderStatusBadge(item.status, item.statusLabel)}
        </td>

        {/* 10. Bin Number */}
        <td className="py-2.5 px-3 whitespace-nowrap">
          <span className="inline-flex items-center gap-1 font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700">
            {item.binNumber || "VAULT"}
          </span>
        </td>

        {/* 11. Vendor */}
        <td className="py-2.5 px-3 whitespace-nowrap font-medium text-slate-700 dark:text-slate-300">
          <span className="px-1.5 py-0.5 rounded bg-slate-100/70 dark:bg-slate-800 text-[11px]">
            {item.vendor}
          </span>
        </td>

        {/* 12. Class */}
        <td className="py-2.5 px-3 whitespace-nowrap text-slate-500 dark:text-slate-400 font-medium">
          {item.dscClass}
        </td>

        {/* 13. Email */}
        <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400 max-w-[150px] truncate" title={item.email}>
          {item.email ? (
            <a
              href={`mailto:${item.email}`}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 hover:underline flex items-center gap-1"
            >
              <span>{item.email}</span>
            </a>
          ) : (
            "-"
          )}
        </td>

        {/* Row Action ⋮ */}
        <DSCRowActionCell
          item={item}
          isOpen={isMenuOpen}
          onToggle={() => setOpenMenuId(isMenuOpen ? null : item.id)}
          onClose={() => setOpenMenuId(null)}
          onTransferCustody={onTransferCustody}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      </tr>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E2E8F0] dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 select-none">
              {/* Checkbox */}
              <th className="py-2.5 px-3 w-10 text-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={onToggleSelectAll}
                  className="rounded border-slate-300 dark:border-slate-700 text-indigo-600 focus:ring-indigo-500 size-3.5 cursor-pointer"
                />
              </th>

              {/* Columns with Sort */}
              <th
                onClick={() => handleSort("dscCode")}
                className="py-2.5 px-3 cursor-pointer hover:text-indigo-600"
              >
                <div className="flex items-center">
                  <span>DSC ID</span>
                  {renderSortIcon("dscCode")}
                </div>
              </th>
              <th
                onClick={() => handleSort("businessName")}
                className="py-2.5 px-3 cursor-pointer hover:text-indigo-600"
              >
                <div className="flex items-center">
                  <span>Business Name</span>
                  {renderSortIcon("businessName")}
                </div>
              </th>
              <th
                onClick={() => handleSort("legalName")}
                className="py-2.5 px-3 cursor-pointer hover:text-indigo-600"
              >
                <div className="flex items-center">
                  <span>Legal Name</span>
                  {renderSortIcon("legalName")}
                </div>
              </th>
              <th
                onClick={() => handleSort("signatoryName")}
                className="py-2.5 px-3 cursor-pointer hover:text-indigo-600"
              >
                <div className="flex items-center">
                  <span>Name</span>
                  {renderSortIcon("signatoryName")}
                </div>
              </th>
              <th
                onClick={() => handleSort("issuedDate")}
                className="py-2.5 px-3 cursor-pointer hover:text-indigo-600"
              >
                <div className="flex items-center">
                  <span>Issued Date</span>
                  {renderSortIcon("issuedDate")}
                </div>
              </th>
              <th
                onClick={() => handleSort("expiryDate")}
                className="py-2.5 px-3 cursor-pointer hover:text-indigo-600"
              >
                <div className="flex items-center">
                  <span>Expiry Date</span>
                  {renderSortIcon("expiryDate")}
                </div>
              </th>
              <th
                onClick={() => handleSort("location")}
                className="py-2.5 px-3 cursor-pointer hover:text-indigo-600"
              >
                <div className="flex items-center">
                  <span>Location</span>
                  {renderSortIcon("location")}
                </div>
              </th>
              <th
                onClick={() => handleSort("status")}
                className="py-2.5 px-3 cursor-pointer hover:text-indigo-600"
              >
                <div className="flex items-center">
                  <span>Status</span>
                  {renderSortIcon("status")}
                </div>
              </th>
              <th
                onClick={() => handleSort("binNumber")}
                className="py-2.5 px-3 cursor-pointer hover:text-indigo-600"
              >
                <div className="flex items-center">
                  <span>Bin Number</span>
                  {renderSortIcon("binNumber")}
                </div>
              </th>
              <th
                onClick={() => handleSort("vendor")}
                className="py-2.5 px-3 cursor-pointer hover:text-indigo-600"
              >
                <div className="flex items-center">
                  <span>Vendor</span>
                  {renderSortIcon("vendor")}
                </div>
              </th>
              <th className="py-2.5 px-3">Class</th>
              <th className="py-2.5 px-3">Email</th>
              <th className="py-2.5 px-2 w-10 text-right"></th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td colSpan={14} className="py-12 text-center text-slate-400 dark:text-slate-500 text-sm">
                  No rows
                </td>
              </tr>
            ) : groupBy !== "none" ? (
              Object.entries(groupedData).map(([groupTitle, groupItems]) => (
                <React.Fragment key={groupTitle}>
                  <tr className="bg-slate-100/60 dark:bg-slate-800/60 border-y border-slate-200 dark:border-slate-800">
                    <td colSpan={14} className="py-1.5 px-4 text-xs font-bold text-slate-800 dark:text-slate-200">
                      {groupTitle} ({groupItems.length})
                    </td>
                  </tr>
                  {groupItems.map((item) => renderRow(item))}
                </React.Fragment>
              ))
            ) : (
              paginatedItems.map((item) => renderRow(item))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-3 border-t border-[#E2E8F0] dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <div className="flex items-center gap-4">
          <span>
            {totalRows === 0
              ? "0 of 0"
              : `${startIndex + 1}-${Math.min(startIndex + pageSize, totalRows)} of ${totalRows}`}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              &lt;
            </button>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              &gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface DSCRowActionCellProps {
  item: DSCItem;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onTransferCustody: (item: DSCItem) => void;
  onEdit: (item: DSCItem) => void;
  onDelete: (item: DSCItem) => void;
}

function DSCRowActionCell({
  item,
  isOpen,
  onToggle,
  onClose,
  onTransferCustody,
  onEdit,
  onDelete,
}: DSCRowActionCellProps) {
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <td className="py-2.5 px-2 text-right">
      <button
        ref={triggerRef}
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className="size-7 rounded-md hover:bg-slate-200/60 dark:hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
      >
        <MoreVertical className="size-4" />
      </button>

      <RowActionDropdown
        isOpen={isOpen}
        onClose={onClose}
        triggerRef={triggerRef}
        width={176}
      >
        <button
          type="button"
          onClick={() => {
            onClose();
            onTransferCustody(item);
          }}
          className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
        >
          <Repeat className="size-3.5 text-indigo-500" />
          <span>Transfer Custody</span>
        </button>
        <button
          type="button"
          onClick={() => {
            onClose();
            onEdit(item);
          }}
          className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
        >
          <Edit2 className="size-3.5 text-slate-500" />
          <span>Edit Token Info</span>
        </button>
        <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
        <button
          type="button"
          onClick={() => {
            onClose();
            onDelete(item);
          }}
          className="w-full px-3 py-1.5 flex items-center gap-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 cursor-pointer"
        >
          <Trash2 className="size-3.5" />
          <span>Delete DSC</span>
        </button>
      </RowActionDropdown>
    </td>
  );
}
