"use client";

import React, { useState, useEffect } from "react";
import { AppShell } from "@/components/layout/app-shell";
import {
  Shield,
  Search,
  Plus,
  Filter,
  History,
  MoreVertical,
  Download,
  RotateCw,
  Layers,
  FileCheck2,
  Vault,
} from "lucide-react";
import * as XLSX from "xlsx";
import {
  DSCItem,
  DSCKpiData,
  DSCFormData,
  CustodyTransferData,
  RegistryTab,
} from "@/components/registry/types";
import {
  fetchRegistryData,
  createDSC,
  updateDSC,
  transferCustody,
  deleteDSC,
} from "@/lib/api/registry";
import { DSCKpiStrip } from "@/components/registry/dsc-kpi-strip";
import { DSCTable } from "@/components/registry/dsc-table";
import { AddDSCModal } from "@/components/registry/add-dsc-modal";
import { TransferCustodyModal } from "@/components/registry/transfer-custody-modal";
import { DSCFilterDrawer } from "@/components/registry/dsc-filter-drawer";
import { DSCActivityDrawer } from "@/components/registry/dsc-activity-drawer";
import { StatutoryLicensesTab } from "@/components/registry/statutory-licenses-tab";
import { VaultBinMap } from "@/components/registry/vault-bin-map";
import { cn } from "@/lib/utils";

export default function RegistryPage() {
  const [activeTab, setActiveTab] = useState<RegistryTab>("dsc");
  const [items, setItems] = useState<DSCItem[]>([]);
  const [kpi, setKpi] = useState<DSCKpiData>({
    totalDSC: 0,
    active: 0,
    expIn30d: 0,
    expIn15d: 0,
    expired: 0,
    caOffice: 0,
    csOffice: 0,
    clientOffice: 0,
    missing: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [kpiFilter, setKpiFilter] = useState<string | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [groupBy, setGroupBy] = useState<"none" | "location" | "status" | "vendor">("none");
  const [isGroupMenuOpen, setIsGroupMenuOpen] = useState(false);
  const [isTopMoreOpen, setIsTopMoreOpen] = useState(false);

  // Drawers and modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isActivityDrawerOpen, setIsActivityDrawerOpen] = useState(false);
  const [selectedTokenForTransfer, setSelectedTokenForTransfer] = useState<DSCItem | null>(null);
  const [editingToken, setEditingToken] = useState<DSCItem | null>(null);

  // Granular Filter Drawer State
  const [filters, setFilters] = useState({
    location: "",
    status: "",
    vendor: "",
    filterType: "",
  });

  const loadData = async () => {
    try {
      const data = await fetchRegistryData({
        search,
        location: filters.location,
        status: filters.status,
        vendor: filters.vendor,
        filterType: kpiFilter || filters.filterType,
      });
      setItems(data.dscs || []);
      if (data.kpi) {
        setKpi(data.kpi);
      }
    } catch (err) {
      console.error("Failed to load registry data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const data = await fetchRegistryData({
          search,
          location: filters.location,
          status: filters.status,
          vendor: filters.vendor,
          filterType: kpiFilter || filters.filterType,
        });
        if (isMounted) {
          setItems(data.dscs || []);
          if (data.kpi) {
            setKpi(data.kpi);
          }
        }
      } catch (err) {
        console.error("Failed to load registry data:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    load();
    return () => {
      isMounted = false;
    };
  }, [search, filters, kpiFilter]);

  // Handle Multi-Select
  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = () => {
    if (selectedIds.length === items.length && items.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(items.map((i) => i.id));
    }
  };

  // Add / Edit submission
  const handleSaveDSC = async (data: DSCFormData) => {
    if (editingToken) {
      await updateDSC(editingToken.id, data);
    } else {
      await createDSC(data);
    }
    loadData();
  };

  // Custody transfer submission
  const handleConfirmTransfer = async (data: CustodyTransferData) => {
    await transferCustody(data);
    loadData();
  };

  // Delete DSC
  const handleDeleteDSC = async (item: DSCItem) => {
    if (confirm(`Are you sure you want to delete token ${item.dscCode} (${item.signatoryName})?`)) {
      try {
        await deleteDSC(item.id);
        loadData();
      } catch (err: unknown) {
        alert((err as Error)?.message || "Failed to delete DSC record");
      }
    }
  };

  // Export to Excel
  const handleExportXlsx = () => {
    const exportData = items.map((item) => ({
      "DSC ID": item.dscCode,
      "Business Name": item.businessName,
      "Legal Name": item.legalName,
      "Signatory Name": item.signatoryName,
      "PAN Number": item.panNumber,
      "DIN Number": item.dinNumber,
      "Issued Date": item.issuedDate,
      "Expiry Date": item.expiryDate,
      "Location": item.locationLabel,
      "Status": item.statusLabel,
      "Bin Number": item.binNumber,
      "Vendor": item.vendor,
      "Class": item.dscClass,
      "Email": item.email,
      "Phone": item.phone,
      "Hardware Model": item.tokenHardwareModel,
      "Internal Notes": item.notes,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "DSC Vault Register");
    XLSX.writeFile(
      workbook,
      `Turia_DSC_Register_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
    setIsTopMoreOpen(false);
  };

  return (
    <AppShell>
      <div className="space-y-4">
        {/* Sub-Tabs Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("dsc")}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer",
                activeTab === "dsc"
                  ? "bg-[#6366F1] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
            >
              <Shield className="size-3.5" />
              <span>Digital Signatures (Vault)</span>
              <span
                className={cn(
                  "px-1.5 py-0.2 rounded-full text-[10px]",
                  activeTab === "dsc"
                    ? "bg-white/20 text-white"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                )}
              >
                {kpi.totalDSC}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("licenses")}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer",
                activeTab === "licenses"
                  ? "bg-[#6366F1] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
            >
              <FileCheck2 className="size-3.5" />
              <span>Client Statutory Licenses</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("bin_map")}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer",
                activeTab === "bin_map"
                  ? "bg-[#6366F1] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
            >
              <Vault className="size-3.5" />
              <span>Vault Bin Map</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => loadData()}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Refresh Data"
            >
              <RotateCw className={`size-3.5 ${isLoading ? "animate-spin text-indigo-600" : ""}`} />
            </button>
          </div>
        </div>

        {/* Tab 1: Digital Signatures View (Matching reference screenshot exactly) */}
        {activeTab === "dsc" && (
          <>
            {/* 9 KPI Metrics Row */}
            <DSCKpiStrip
              kpi={kpi}
              activeFilter={kpiFilter}
              onSelectFilter={(val) => setKpiFilter(val)}
            />

            {/* Section Controls Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pt-1">
              {/* Heading */}
              <div className="flex items-center gap-2">
                <h1 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                  Digital Signature ({items.length})
                </h1>
                {kpiFilter && (
                  <button
                    type="button"
                    onClick={() => setKpiFilter(null)}
                    className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
                  >
                    Clear KPI filter
                  </button>
                )}
              </div>

              {/* Action Controls */}
              <div className="flex items-center gap-2 flex-wrap">
                {/* Search Bar */}
                <div className="relative w-64 sm:w-72">
                  <Search className="absolute left-2.5 top-2.5 size-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search name, ID, role..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-lg border border-[#E2E8F0] dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-xs"
                  />
                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 text-xs"
                    >
                      ×
                    </button>
                  )}
                </div>

                {/* Group By Dropdown */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsGroupMenuOpen(!isGroupMenuOpen)}
                    className={cn(
                      "px-2.5 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs",
                      groupBy !== "none"
                        ? "border-indigo-400 text-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30"
                        : "border-[#E2E8F0] dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                    )}
                  >
                    <Layers className="size-3.5" />
                    <span>Group ⌄</span>
                  </button>

                  {isGroupMenuOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-20"
                        onClick={() => setIsGroupMenuOpen(false)}
                      />
                      <div className="absolute right-0 top-9 z-30 w-36 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg py-1 text-xs">
                        <button
                          type="button"
                          onClick={() => {
                            setGroupBy("none");
                            setIsGroupMenuOpen(false);
                          }}
                          className="w-full px-3 py-1.5 text-left hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                        >
                          None
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setGroupBy("location");
                            setIsGroupMenuOpen(false);
                          }}
                          className="w-full px-3 py-1.5 text-left hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                        >
                          By Location
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setGroupBy("status");
                            setIsGroupMenuOpen(false);
                          }}
                          className="w-full px-3 py-1.5 text-left hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                        >
                          By Status
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setGroupBy("vendor");
                            setIsGroupMenuOpen(false);
                          }}
                          className="w-full px-3 py-1.5 text-left hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                        >
                          By Vendor
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {/* Filters Button */}
                <button
                  type="button"
                  onClick={() => setIsFilterDrawerOpen(true)}
                  className={cn(
                    "px-2.5 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs",
                    Object.values(filters).some(Boolean)
                      ? "border-indigo-400 text-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30"
                      : "border-[#E2E8F0] dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                  )}
                >
                  <Filter className="size-3.5" />
                  <span>Filters</span>
                  {Object.values(filters).filter(Boolean).length > 0 && (
                    <span className="size-4 rounded-full bg-indigo-600 text-white text-[9px] flex items-center justify-center font-bold">
                      {Object.values(filters).filter(Boolean).length}
                    </span>
                  )}
                </button>

                {/* Audit / History Button */}
                <button
                  type="button"
                  onClick={() => setIsActivityDrawerOpen(true)}
                  className="p-1.5 rounded-lg border border-[#E2E8F0] dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
                  title="Token Movement & Checkout Audit Trail"
                >
                  <History className="size-4" />
                </button>

                {/* Primary + Add Button */}
                <button
                  type="button"
                  onClick={() => {
                    setEditingToken(null);
                    setIsAddModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
                >
                  <Plus className="size-3.5" />
                  <span>Add</span>
                </button>

                {/* Vertical Three Dots Menu */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsTopMoreOpen(!isTopMoreOpen)}
                    className="p-1.5 rounded-lg border border-[#E2E8F0] dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-xs"
                  >
                    <MoreVertical className="size-4" />
                  </button>

                  {isTopMoreOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-20"
                        onClick={() => setIsTopMoreOpen(false)}
                      />
                      <div className="absolute right-0 top-9 z-30 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-lg py-1 text-xs">
                        <button
                          type="button"
                          onClick={handleExportXlsx}
                          className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
                        >
                          <Download className="size-3.5 text-slate-500" />
                          <span>Export to Excel (.xlsx)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            loadData();
                            setIsTopMoreOpen(false);
                          }}
                          className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 cursor-pointer"
                        >
                          <RotateCw className="size-3.5 text-slate-500" />
                          <span>Refresh Table</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* 12-Column Table */}
            <DSCTable
              items={items}
              selectedIds={selectedIds}
              onToggleSelect={handleToggleSelect}
              onToggleSelectAll={handleToggleSelectAll}
              onTransferCustody={(item) => {
                setSelectedTokenForTransfer(item);
                setIsTransferModalOpen(true);
              }}
              onEdit={(item) => {
                setEditingToken(item);
                setIsAddModalOpen(true);
              }}
              onDelete={handleDeleteDSC}
              groupBy={groupBy}
            />
          </>
        )}

        {/* Tab 2: Client Statutory Licenses */}
        {activeTab === "licenses" && <StatutoryLicensesTab />}

        {/* Tab 3: Vault Bin Map */}
        {activeTab === "bin_map" && (
          <VaultBinMap
            items={items}
            onSelectToken={(item) => {
              setSelectedTokenForTransfer(item);
              setIsTransferModalOpen(true);
            }}
          />
        )}
      </div>

      {/* Add / Edit Modal */}
      <AddDSCModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingToken(null);
        }}
        onSubmit={handleSaveDSC}
        initialData={
          editingToken
            ? {
                clientId: editingToken.clientId || undefined,
                dscCode: editingToken.dscCode,
                businessName: editingToken.businessName,
                legalName: editingToken.legalName,
                signatoryName: editingToken.signatoryName,
                panNumber: editingToken.panNumber,
                dinNumber: editingToken.dinNumber,
                vendor: editingToken.vendor,
                dscClass: editingToken.dscClass,
                issuedDate: editingToken.issuedDate,
                expiryDate: editingToken.expiryDate,
                location: editingToken.location,
                binNumber: editingToken.binNumber,
                status: editingToken.status,
                email: editingToken.email,
                phone: editingToken.phone,
                tokenHardwareModel: editingToken.tokenHardwareModel,
                notes: editingToken.notes,
              }
            : null
        }
        mode={editingToken ? "edit" : "add"}
      />

      {/* Custody Transfer Modal */}
      <TransferCustodyModal
        isOpen={isTransferModalOpen}
        onClose={() => {
          setIsTransferModalOpen(false);
          setSelectedTokenForTransfer(null);
        }}
        dsc={selectedTokenForTransfer}
        onTransfer={handleConfirmTransfer}
      />

      {/* Filter Drawer */}
      <DSCFilterDrawer
        isOpen={isFilterDrawerOpen}
        onClose={() => setIsFilterDrawerOpen(false)}
        filters={filters}
        onApplyFilters={(newFilters) => setFilters(newFilters)}
        onResetFilters={() =>
          setFilters({
            location: "",
            status: "",
            vendor: "",
            filterType: "",
          })
        }
      />

      {/* Activity Log Drawer */}
      <DSCActivityDrawer
        isOpen={isActivityDrawerOpen}
        onClose={() => setIsActivityDrawerOpen(false)}
      />
    </AppShell>
  );
}
