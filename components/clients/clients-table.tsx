"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  MoreVertical,
  Eye,
  Edit2,
  Trash2,
  CheckCircle2,
  Repeat,
  Building2,
  Phone,
  User,
} from "lucide-react";
import { ClientItem } from "./types";
import {
  ColumnDef,
  ColumnSort,
  TableHeaderCell,
  TableActiveModifiers,
  TablePagination,
  TableEmptyState,
} from "@/components/ui/data-table";

interface ClientsTableProps {
  clients: ClientItem[];
  onSelectClient?: (client: ClientItem) => void;
  onDeleteClient?: (id: string) => void;
  onEditClient?: (client: ClientItem) => void;
  onToggleStatus?: (id: string, newStatus: ClientItem["status"]) => void;
}

const ALL_COLUMNS: ColumnDef[] = [
  { key: "createdOn", label: "Created On" },
  { key: "tradeName", label: "Client Name & Code" },
  { key: "legalName", label: "Legal Name" },
  { key: "contactName", label: "Contact Person" },
  { key: "mobileNo", label: "Mobile No" },
  { key: "businessEntity", label: "Business Entity" },
  { key: "services", label: "Services" },
  { key: "employeeList", label: "Assigned Team" },
  { key: "groups", label: "Group" },
  { key: "auditor", label: "Auditor" },
  { key: "labels", label: "Labels" },
  { key: "status", label: "Status" },
];

export function ClientsTable({
  clients,
  onSelectClient,
  onDeleteClient,
  onEditClient,
  onToggleStatus,
}: ClientsTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeRowMenuId, setActiveRowMenuId] = useState<string | null>(null);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [currentPage, setCurrentPage] = useState(1);

  // Column operations state
  const [openColumnMenuKey, setOpenColumnMenuKey] = useState<string | null>(null);
  const [columnSort, setColumnSort] = useState<ColumnSort | null>(null);
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [hiddenColumnKeys, setHiddenColumnKeys] = useState<string[]>([]);

  // Close row action menu on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!(event.target as HTMLElement).closest(".row-action-menu-container")) {
        setActiveRowMenuId(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectAll = () => {
    if (selectedIds.length === clients.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(clients.map((c) => c.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const getFieldValue = (c: ClientItem, key: string): string => {
    switch (key) {
      case "createdOn":
        return c.createdOn;
      case "tradeName":
        return `${c.tradeName} ${c.clientCode}`;
      case "legalName":
        return c.legalName;
      case "contactName":
        return c.contactName;
      case "mobileNo":
        return c.mobileNo;
      case "businessEntity":
        return c.businessEntity;
      case "services":
        return c.services.join(", ");
      case "employeeList":
        return c.employeeList;
      case "groups":
        return c.groups;
      case "auditor":
        return c.auditor;
      case "labels":
        return c.labels.join(", ");
      case "status":
        return c.status;
      default:
        return "";
    }
  };

  // Process clients through column filters and sorting
  const processedClients = useMemo(() => {
    let result = [...clients];

    // Apply column filters
    Object.entries(columnFilters).forEach(([key, filterText]) => {
      if (!filterText.trim()) return;
      const q = filterText.toLowerCase();
      result = result.filter((c) => {
        const val = getFieldValue(c, key);
        return String(val).toLowerCase().includes(q);
      });
    });

    // Apply column sorting
    if (columnSort) {
      result.sort((a, b) => {
        const strA = String(getFieldValue(a, columnSort.key));
        const strB = String(getFieldValue(b, columnSort.key));
        return columnSort.direction === "asc"
          ? strA.localeCompare(strB, undefined, { numeric: true })
          : strB.localeCompare(strA, undefined, { numeric: true });
      });
    }

    return result;
  }, [clients, columnFilters, columnSort]);

  // Visible columns
  const visibleColumns = useMemo(() => {
    return ALL_COLUMNS.filter((c) => !hiddenColumnKeys.includes(c.key));
  }, [hiddenColumnKeys]);

  const totalPages = Math.ceil(processedClients.length / rowsPerPage) || 1;
  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentRows = processedClients.slice(startIndex, startIndex + rowsPerPage);

  const handleSetSort = (key: string, direction: "asc" | "desc") => {
    setColumnSort({ key, direction });
    setOpenColumnMenuKey(null);
  };

  const handleClearSort = () => {
    setColumnSort(null);
    setOpenColumnMenuKey(null);
  };

  const handleToggleColumnSort = (key: string) => {
    if (!columnSort || columnSort.key !== key) {
      setColumnSort({ key, direction: "asc" });
    } else if (columnSort.direction === "asc") {
      setColumnSort({ key, direction: "desc" });
    } else {
      setColumnSort(null);
    }
  };

  const handleSetFilter = (key: string, text: string) => {
    setColumnFilters((prev) => {
      const next = { ...prev };
      if (!text.trim()) {
        delete next[key];
      } else {
        next[key] = text;
      }
      return next;
    });
    setCurrentPage(1);
  };

  const handleHideColumn = (key: string) => {
    setHiddenColumnKeys((prev) => [...prev, key]);
    setOpenColumnMenuKey(null);
  };

  const handleToggleColumnVisibility = (key: string) => {
    setHiddenColumnKeys((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleResetAll = () => {
    setColumnSort(null);
    setColumnFilters({});
    setHiddenColumnKeys([]);
    setCurrentPage(1);
  };

  const hasActiveModifiers =
    Boolean(columnSort) ||
    Object.keys(columnFilters).length > 0 ||
    hiddenColumnKeys.length > 0;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Active Modifiers Bar (Filters / Sorting / Hidden Columns) */}
      <TableActiveModifiers
        columns={ALL_COLUMNS}
        columnSort={columnSort}
        columnFilters={columnFilters}
        hiddenColumnKeys={hiddenColumnKeys}
        onClearSort={() => setColumnSort(null)}
        onClearFilter={(key) => handleSetFilter(key, "")}
        onToggleColumnVisibility={handleToggleColumnVisibility}
        onResetAll={handleResetAll}
      />

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-600">
          {/* Table Header */}
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              {/* Checkbox */}
              <th className="py-3 px-4 w-10">
                <input
                  type="checkbox"
                  checked={clients.length > 0 && selectedIds.length === clients.length}
                  onChange={handleSelectAll}
                  className="rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </th>

              {/* Data Columns with 3-dot column headers */}
              {visibleColumns.map((col, index) => {
                const isSorted = columnSort?.key === col.key;
                const isFiltered = Boolean(columnFilters[col.key]);
                const isMenuOpen = openColumnMenuKey === col.key;
                const isRightAligned = index >= visibleColumns.length - 3;

                return (
                  <TableHeaderCell
                    key={col.key}
                    column={col}
                    isSorted={isSorted}
                    sortDirection={columnSort?.direction}
                    isFiltered={isFiltered}
                    filterValue={columnFilters[col.key]}
                    isMenuOpen={isMenuOpen}
                    onToggleMenu={() =>
                      setOpenColumnMenuKey(isMenuOpen ? null : col.key)
                    }
                    onCloseMenu={() => setOpenColumnMenuKey(null)}
                    onToggleSort={() => handleToggleColumnSort(col.key)}
                    onSetSort={(dir) => handleSetSort(col.key, dir)}
                    onClearSort={handleClearSort}
                    onSetFilter={(val) => handleSetFilter(col.key, val)}
                    onHideColumn={() => handleHideColumn(col.key)}
                    menuAlign={isRightAligned ? "right" : "left"}
                  />
                );
              })}

              {/* Actions Header */}
              <th className="py-3 px-4 w-12 text-right">
                <span>Actions</span>
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100">
            {currentRows.length === 0 ? (
              <TableEmptyState
                colSpan={visibleColumns.length + 2}
                title="No clients found"
                subtitle={
                  hasActiveModifiers
                    ? "Try resetting column filters or search"
                    : 'Click "Add" or import your 24-column client spreadsheet'
                }
                hasActiveModifiers={hasActiveModifiers}
                onResetAll={handleResetAll}
              />
            ) : (
              currentRows.map((client) => {
                const isSelected = selectedIds.includes(client.id);
                const isActive = client.status === "active";

                return (
                  <tr
                    key={client.id}
                    className={`hover:bg-slate-50/70 transition-colors group ${
                      isSelected ? "bg-indigo-50/30" : ""
                    }`}
                  >
                    {/* Checkbox */}
                    <td className="py-3 px-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => handleToggleSelect(client.id)}
                        className="rounded-sm border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                      />
                    </td>

                    {/* Visible Columns */}
                    {visibleColumns.map((col) => {
                      switch (col.key) {
                        case "createdOn":
                          return (
                            <td
                              key={col.key}
                              className="py-3 px-3 text-slate-500 font-mono text-[11px]"
                            >
                              {client.createdOn}
                            </td>
                          );
                        case "tradeName":
                          return (
                            <td
                              key={col.key}
                              className="py-3 px-3 font-semibold text-slate-900"
                            >
                              <div>
                                <button
                                  type="button"
                                  onClick={() => onSelectClient?.(client)}
                                  className="font-bold text-slate-900 block group-hover:text-indigo-600 transition-colors cursor-pointer text-left truncate max-w-[240px]"
                                  title={client.tradeName}
                                >
                                  {client.tradeName}
                                </button>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="font-mono text-[10px] text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-100 font-bold">
                                    {client.clientCode}
                                  </span>
                                  {client.gstin && (
                                    <span className="text-[10px] text-slate-400 font-mono">
                                      GST: {client.gstin}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </td>
                          );
                        case "legalName":
                          return (
                            <td
                              key={col.key}
                              className="py-3 px-3 text-slate-600 truncate max-w-[180px]"
                              title={client.legalName}
                            >
                              {client.legalName || "-"}
                            </td>
                          );
                        case "contactName":
                          return (
                            <td
                              key={col.key}
                              className="py-3 px-3 text-slate-700"
                            >
                              <div className="flex items-center gap-1.5">
                                <User className="size-3 text-slate-400 shrink-0" />
                                <span className="font-medium">{client.contactName}</span>
                              </div>
                            </td>
                          );
                        case "mobileNo":
                          return (
                            <td
                              key={col.key}
                              className="py-3 px-3 font-mono text-slate-600"
                            >
                              <div className="flex items-center gap-1">
                                <Phone className="size-3 text-slate-400 shrink-0" />
                                <span>{client.mobileNo || "-"}</span>
                              </div>
                            </td>
                          );
                        case "businessEntity":
                          return (
                            <td
                              key={col.key}
                              className="py-3 px-3"
                            >
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px] border border-slate-200 inline-flex items-center gap-1">
                                <Building2 className="size-3 text-slate-400 shrink-0" />
                                <span>{client.businessEntity}</span>
                              </span>
                            </td>
                          );
                        case "services":
                          return (
                            <td key={col.key} className="py-3 px-3">
                              <div className="flex items-center gap-1">
                                {client.services.slice(0, 2).map((srv, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[10px] font-medium border border-indigo-100 whitespace-nowrap"
                                  >
                                    {srv}
                                  </span>
                                ))}
                                {client.services.length > 2 && (
                                  <span className="text-[10px] text-slate-400 font-bold">
                                    +{client.services.length - 2}
                                  </span>
                                )}
                              </div>
                            </td>
                          );
                        case "employeeList":
                          return (
                            <td
                              key={col.key}
                              className="py-3 px-3 text-slate-600"
                            >
                              <span className="font-medium text-slate-700">{client.employeeList}</span>
                            </td>
                          );
                        case "groups":
                          return (
                            <td
                              key={col.key}
                              className="py-3 px-3 text-slate-600"
                            >
                              <span className="text-slate-600 font-medium">{client.groups}</span>
                            </td>
                          );
                        case "auditor":
                          return (
                            <td
                              key={col.key}
                              className="py-3 px-3 text-slate-600"
                            >
                              {client.auditor}
                            </td>
                          );
                        case "labels":
                          return (
                            <td key={col.key} className="py-3 px-3">
                              <div className="flex items-center gap-1">
                                {client.labels.map((lbl, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded text-[10px] font-bold border border-emerald-100"
                                  >
                                    {lbl}
                                  </span>
                                ))}
                              </div>
                            </td>
                          );
                        case "status":
                          return (
                            <td key={col.key} className="py-3 px-3">
                              <button
                                type="button"
                                onClick={() =>
                                  onToggleStatus?.(
                                    client.id,
                                    isActive ? "inactive" : "active"
                                  )
                                }
                                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-colors cursor-pointer border ${
                                  isActive
                                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                    : client.status === "dormant"
                                    ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                                    : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                                }`}
                              >
                                {isActive && <CheckCircle2 className="size-3 shrink-0" />}
                                <span className="capitalize">{client.status}</span>
                              </button>
                            </td>
                          );
                        default:
                          return null;
                      }
                    })}

                    {/* Actions Menu */}
                    <td className="py-3 px-4 w-12 text-right relative row-action-menu-container">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveRowMenuId(
                            activeRowMenuId === client.id ? null : client.id
                          );
                        }}
                        className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                      >
                        <MoreVertical className="size-4" />
                      </button>

                      {activeRowMenuId === client.id && (
                        <div className="absolute right-4 top-10 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100 text-left">
                          <button
                            type="button"
                            onClick={() => {
                              onSelectClient?.(client);
                              setActiveRowMenuId(null);
                            }}
                            className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium cursor-pointer"
                          >
                            <Eye className="size-3.5 text-indigo-600" />
                            <span>View 360 Details</span>
                          </button>
                          {onEditClient && (
                            <button
                              type="button"
                              onClick={() => {
                                onEditClient(client);
                                setActiveRowMenuId(null);
                              }}
                              className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium cursor-pointer"
                            >
                              <Edit2 className="size-3.5 text-slate-600" />
                              <span>Edit Client</span>
                            </button>
                          )}
                          {onToggleStatus && (
                            <button
                              type="button"
                              onClick={() => {
                                onToggleStatus(
                                  client.id,
                                  isActive ? "inactive" : "active"
                                );
                                setActiveRowMenuId(null);
                              }}
                              className="w-full px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium cursor-pointer"
                            >
                              <Repeat className="size-3.5 text-slate-600" />
                              <span>{isActive ? "Deactivate" : "Activate"}</span>
                            </button>
                          )}
                          {onDeleteClient && (
                            <button
                              type="button"
                              onClick={() => {
                                if (
                                  confirm(
                                    `Are you sure you want to delete ${client.tradeName}?`
                                  )
                                ) {
                                  onDeleteClient(client.id);
                                }
                                setActiveRowMenuId(null);
                              }}
                              className="w-full px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium cursor-pointer"
                            >
                              <Trash2 className="size-3.5 text-rose-600" />
                              <span>Delete Client</span>
                            </button>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Standard Table Pagination / Footer */}
      <TablePagination
        filteredCount={processedClients.length}
        totalCount={clients.length}
        startIndex={startIndex}
        rowsPerPage={rowsPerPage}
        currentPage={currentPage}
        totalPages={totalPages}
        entityName="clients"
        onRowsPerPageChange={(n) => {
          setRowsPerPage(n);
          setCurrentPage(1);
        }}
        onPageChange={(p) => setCurrentPage(p)}
        rowsPerPageOptions={[20, 50, 100]}
      />
    </div>
  );
}
