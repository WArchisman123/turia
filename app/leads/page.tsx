"use client";

import React, { useState, useEffect, useMemo, useTransition } from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { LeadsKpiStrip } from "@/components/leads/leads-kpi-strip";
import { LeadsFilterBar } from "@/components/leads/leads-filter-bar";
import { LeadsTable } from "@/components/leads/leads-table";
import { AddLeadModal } from "@/components/leads/add-lead-modal";
import { ImportLeadsModal } from "@/components/leads/import-leads-modal";
import { LeadItem, LeadFilterState } from "@/components/leads/types";
import {
  fetchLeads,
  createLead,
  updateLeadStatus,
  deleteLead,
  convertLeadToClient,
  batchConvertLeads,
  batchDeleteLeads,
} from "@/lib/api";
import { PageLoadingState } from "@/components/ui/loading-state";
import {
  UserPlus,
  Filter,
  Search,
  MoreVertical,
  Download,
  UploadCloud,
  FileSpreadsheet,
  RotateCw,
  UserCheck,
  X,
} from "lucide-react";

const DEFAULT_FILTERS: LeadFilterState = {
  stage: "All",
  status: "All",
  assignedTo: "All",
  source: "All",
  entityType: "All",
  dateRange: "All",
  dealValueRange: [0, 10000000],
  scoreRange: [0, 100],
  searchQuery: "",
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<LeadItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [, startTransition] = useTransition();

  const [filters, setFilters] = useState<LeadFilterState>(DEFAULT_FILTERS);
  const [isFilterBarOpen, setIsFilterBarOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isActionsMenuOpen, setIsActionsMenuOpen] = useState(false);
  const [convertedNotification, setConvertedNotification] = useState<{
    clientName: string;
    clientCode?: string;
  } | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function initLeads() {
      try {
        const data = await fetchLeads();
        if (isMounted) {
          setLeads(data || []);
        }
      } catch (err) {
        console.error("Failed to load leads:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    initLeads();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter application
  const filteredLeads = useMemo(() => {
    return leads.filter((item) => {
      // Search query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        const matchesQuery =
          item.leadName.toLowerCase().includes(query) ||
          item.leadCode.toLowerCase().includes(query) ||
          item.contactPerson.toLowerCase().includes(query) ||
          item.email.toLowerCase().includes(query) ||
          item.phone.toLowerCase().includes(query) ||
          item.gstin.toLowerCase().includes(query);
        if (!matchesQuery) return false;
      }

      // Stage
      if (filters.stage !== "All" && item.stage !== filters.stage) return false;

      // Status
      if (filters.status !== "All" && item.status !== filters.status) return false;

      // Assigned To
      if (filters.assignedTo !== "All" && item.assignedTo !== filters.assignedTo) return false;

      // Source
      if (filters.source !== "All" && item.source !== filters.source) return false;

      // Entity Type
      if (filters.entityType !== "All" && item.businessEntity !== filters.entityType) return false;

      // Deal Value Range
      if (
        item.dealValue < filters.dealValueRange[0] ||
        item.dealValue > filters.dealValueRange[1]
      ) {
        return false;
      }

      // Score Range
      if (item.score < filters.scoreRange[0] || item.score > filters.scoreRange[1]) {
        return false;
      }

      return true;
    });
  }, [leads, filters]);

  // Lead Actions with API persistence
  const handleAddLead = async (newLead: LeadItem) => {
    // Optimistic UI update
    setLeads((prev) => [newLead, ...prev]);

    // Async API call
    startTransition(async () => {
      const saved = await createLead(newLead);
      if (saved) {
        setLeads((prev) => prev.map((l) => (l.id === newLead.id ? saved : l)));
      }
    });
  };

  const handleImportLeads = (newLeads: LeadItem[]) => {
    setLeads((prev) => [...newLeads, ...prev]);
  };

  const handleConvertLead = async (id: string) => {
    const targetLead = leads.find((l) => l.id === id);

    // Optimistic UI update
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === id ? { ...lead, status: "Converted" as const, stage: "Closed Won" as const } : lead
      )
    );

    // API update: Convert to Client
    startTransition(async () => {
      const res = await convertLeadToClient(id, targetLead);
      if (res.success && targetLead) {
        setConvertedNotification({
          clientName: targetLead.leadName,
          clientCode: res.client?.clientCode,
        });
      }
    });
  };

  const handleMarkLost = async (id: string) => {
    // Optimistic UI update
    setLeads((prev) =>
      prev.map((lead) =>
        lead.id === id ? { ...lead, status: "Lost" as const, stage: "Closed Lost" as const } : lead
      )
    );

    // API update
    startTransition(async () => {
      await updateLeadStatus(id, "Lost", "Closed Lost");
    });
  };

  const handleDeleteLead = async (id: string) => {
    // Optimistic UI update
    setLeads((prev) => prev.filter((lead) => lead.id !== id));

    // API delete
    startTransition(async () => {
      await deleteLead(id);
    });
  };

  const handleBatchConvert = async (ids: string[]) => {
    // Optimistic UI update
    setLeads((prev) =>
      prev.map((lead) =>
        ids.includes(lead.id)
          ? { ...lead, status: "Converted" as const, stage: "Closed Won" as const }
          : lead
      )
    );

    // API batch convert
    startTransition(async () => {
      const res = await batchConvertLeads(ids);
      if (res.success) {
        setConvertedNotification({
          clientName: `${res.count} Selected Leads`,
        });
      }
    });
  };

  const handleBatchDelete = async (ids: string[]) => {
    // Optimistic UI update
    setLeads((prev) => prev.filter((lead) => !ids.includes(lead.id)));

    // API batch delete
    startTransition(async () => {
      await batchDeleteLeads(ids);
    });
  };

  // Export Leads to CSV
  const handleExportCSV = () => {
    const headers = [
      "Lead Code",
      "Lead Name",
      "Contact Person",
      "Business Entity",
      "Deal Value (INR)",
      "Stage",
      "Status",
      "Score",
      "Assigned To",
      "Source",
      "Phone",
      "Email",
      "GSTIN",
      "PAN",
      "City",
      "State",
      "Created Date",
    ];

    const rows = filteredLeads.map((l) => [
      `"${l.leadCode}"`,
      `"${l.leadName}"`,
      `"${l.contactPerson}"`,
      `"${l.businessEntity}"`,
      l.dealValue,
      `"${l.stage}"`,
      `"${l.status}"`,
      l.score,
      `"${l.assignedTo}"`,
      `"${l.source}"`,
      `"${l.phone}"`,
      `"${l.email}"`,
      `"${l.gstin}"`,
      `"${l.pan}"`,
      `"${l.city}"`,
      `"${l.state}"`,
      `"${l.createdDate}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `TURIA_Leads_Export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.stage !== "All") count++;
    if (filters.status !== "All") count++;
    if (filters.assignedTo !== "All") count++;
    if (filters.source !== "All") count++;
    if (filters.entityType !== "All") count++;
    if (filters.dateRange !== "All") count++;
    if (filters.dealValueRange[0] > 0 || filters.dealValueRange[1] < 10000000) count++;
    if (filters.scoreRange[0] > 0 || filters.scoreRange[1] < 100) count++;
    return count;
  }, [filters]);

  return (
    <AppShell>
        <div className="space-y-5">
          {/* Top Header & Action Toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">Leads Management</h1>
                <span className="text-[11px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
                  {leads.length} Leads
                </span>
                {isLoading && (
                  <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                    <RotateCw className="size-3 animate-spin text-indigo-600" /> Syncing...
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Prospect acquisition pipeline, live GST verification &amp; qualified client conversion
              </p>
            </div>

            {/* Action Toolbar */}
            <div className="flex items-center gap-2.5">
              {/* Search Input */}
              <div className="relative">
                <Search className="size-3.5 absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search leads, GSTIN, email..."
                  value={filters.searchQuery}
                  onChange={(e) => setFilters({ ...filters, searchQuery: e.target.value })}
                  className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-48 sm:w-60 shadow-2xs"
                />
              </div>

              {/* Filter Toggle Button */}
              <button
                type="button"
                onClick={() => setIsFilterBarOpen(!isFilterBarOpen)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                  isFilterBarOpen || activeFiltersCount > 0
                    ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Filter className="size-3.5" />
                <span>Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="size-4 rounded-full bg-indigo-600 text-white font-bold text-[9px] flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>

              {/* + Add Lead Primary Button */}
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <UserPlus className="size-3.5" />
                <span>Add Lead</span>
              </button>

              {/* 3-Dots Action Menu (Import, Export, Download Template) */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setIsActionsMenuOpen(!isActionsMenuOpen)}
                  className="p-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-600 transition-colors cursor-pointer shadow-2xs"
                >
                  <MoreVertical className="size-4" />
                </button>

                {isActionsMenuOpen && (
                  <div className="absolute right-0 top-10 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
                    <button
                      type="button"
                      onClick={() => {
                        setIsImportModalOpen(true);
                        setIsActionsMenuOpen(false);
                      }}
                      className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium cursor-pointer transition-colors text-left"
                    >
                      <UploadCloud className="size-4 text-indigo-600" />
                      <span>Import Leads (CSV/XLSX)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        handleExportCSV();
                        setIsActionsMenuOpen(false);
                      }}
                      className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium cursor-pointer transition-colors text-left"
                    >
                      <Download className="size-4 text-emerald-600" />
                      <span>Export All Leads (CSV)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsImportModalOpen(true);
                        setIsActionsMenuOpen(false);
                      }}
                      className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium cursor-pointer transition-colors text-left"
                    >
                      <FileSpreadsheet className="size-4 text-amber-600" />
                      <span>Download CSV Template</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {isLoading ? (
            <PageLoadingState
              title="Loading Leads Pipeline & Prospect Intelligence..."
              subtitle="Syncing statutory inquiries, live GST verification status, and conversion deal metrics"
              kpiCount={6}
              skeletonRows={6}
            />
          ) : (
            <>
              {/* 6 Top KPI Metric Cards */}
              <LeadsKpiStrip leads={leads} />

              {/* Dynamic Expandable Filter Bar with Dual Range Sliders */}
              <LeadsFilterBar
                isOpen={isFilterBarOpen}
                filters={filters}
                onFilterChange={(newFilters) => setFilters(newFilters)}
                onClear={() => setFilters(DEFAULT_FILTERS)}
                onClose={() => setIsFilterBarOpen(false)}
              />

              {/* Conversion Success Notification */}
              {convertedNotification && (
                <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 rounded-xl p-3.5 flex items-center justify-between animate-in fade-in duration-150 shadow-2xs">
                  <div className="flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-200">
                    <UserCheck className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <span>
                      Lead <strong>{convertedNotification.clientName}</strong> was successfully converted into an active Client in the Client Master!
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link
                      href="/clients"
                      className="px-3 py-1 text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors cursor-pointer shadow-2xs"
                    >
                      View in Client Master →
                    </Link>
                    <button
                      type="button"
                      onClick={() => setConvertedNotification(null)}
                      className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* 13-Column Leads Table */}
              <LeadsTable
                leads={filteredLeads}
                onConvertLead={handleConvertLead}
                onMarkLost={handleMarkLost}
                onDeleteLead={handleDeleteLead}
                onBatchConvert={handleBatchConvert}
                onBatchDelete={handleBatchDelete}
              />
            </>
          )}

          {/* 5-Section Add Lead Modal with Live GST Verification */}
          <AddLeadModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onAddLead={handleAddLead}
          />

          {/* Batch Import CSV/XLSX Modal */}
          <ImportLeadsModal
            isOpen={isImportModalOpen}
            onClose={() => setIsImportModalOpen(false)}
            onImportLeads={handleImportLeads}
          />
        </div>
      </AppShell>
  );
}
