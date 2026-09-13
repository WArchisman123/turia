"use client";

import React, { useState, useEffect, useMemo, useTransition } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ClientKpiStrip } from "@/components/clients/client-kpi-strip";
import { ClientsTable } from "@/components/clients/clients-table";
import { AddClientModal } from "@/components/clients/add-client-modal";
import { ImportClientsModal } from "@/components/clients/import-clients-modal";
import { ClientDetailDrawer } from "@/components/clients/client-detail-drawer";
import { ClientItem, ClientFormData, ClientKpiData } from "@/components/clients/types";
import { fetchClients, createClient, updateClient, deleteClient } from "@/lib/api/clients";
import {
  Search,
  MoreVertical,
  Upload,
  Download,
  RotateCw,
} from "lucide-react";

export default function ClientsPage() {
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [kpiData, setKpiData] = useState<ClientKpiData>({
    totalClients: 0,
    newClientsThisMonth: 0,
    activeClients90Days: 0,
    noActivity90Days: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"popular" | "name_asc" | "recent" | "code">("popular");
  const [, startTransition] = useTransition();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isTopMenuOpen, setIsTopMenuOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientItem | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

  // Load clients and KPI from API
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const data = await fetchClients();
        if (isMounted) {
          setClients(data.clients || []);
          if (data.kpi) {
            setKpiData(data.kpi);
          }
        }
      } catch (err) {
        console.error("Failed to load clients:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter and sort clients
  const filteredAndSortedClients = useMemo(() => {
    let result = [...clients];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((c) => {
        return (
          c.tradeName.toLowerCase().includes(q) ||
          c.legalName.toLowerCase().includes(q) ||
          c.clientCode.toLowerCase().includes(q) ||
          c.contactName.toLowerCase().includes(q) ||
          c.gstin.toLowerCase().includes(q) ||
          c.businessPan.toLowerCase().includes(q) ||
          c.city.toLowerCase().includes(q) ||
          c.businessEntity.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q)
        );
      });
    }

    if (sortBy === "name_asc") {
      result.sort((a, b) => a.tradeName.localeCompare(b.tradeName));
    } else if (sortBy === "recent") {
      result.sort((a, b) => b.createdOn.localeCompare(a.createdOn));
    } else if (sortBy === "code") {
      result.sort((a, b) => a.clientCode.localeCompare(b.clientCode));
    }

    return result;
  }, [clients, searchQuery, sortBy]);

  // Recalculate KPIs based on current client list
  const recalculateKpi = (items: ClientItem[]): ClientKpiData => {
    const active = items.filter((c) => c.status === "active").length;
    const newThisMonth = items.filter((c) => c.status === "new").length;
    const dormant = items.filter((c) => c.status === "dormant" || c.status === "inactive").length;
    return {
      totalClients: items.length,
      newClientsThisMonth: newThisMonth,
      activeClients90Days: active,
      noActivity90Days: dormant,
    };
  };

  // Handle Add Client
  const handleAddClient = async (formData: ClientFormData) => {
    const optimisticClient: ClientItem = {
      id: `temp-${Date.now()}`,
      clientCode: formData.clientId || `CL-${Date.now().toString().slice(-4)}`,
      tradeName: formData.businessName,
      legalName: formData.legalName || formData.businessName,
      contactName: formData.contactName || "Authorized Signatory",
      email: formData.primaryEmail || "",
      mobileNo: formData.primaryPhone || "",
      createdOn: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      businessPan: formData.businessPan || "",
      registrationNo: formData.registrationNo || "",
      businessEntity: formData.businessEntity,
      currency: formData.currency || "INR",
      gstin: formData.gstin || "",
      placeOfSupply: formData.placeOfSupply,
      addressLine1: formData.addressLine1 || "",
      addressLine2: formData.addressLine2 || "",
      city: formData.city || "Kolkata",
      state: formData.state || "West Bengal",
      country: formData.country || "India",
      pincode: formData.pincode || "",
      status: "active",
      services: formData.services || ["Statutory Audit"],
      employeeList: "Archi Saha (Partner)",
      groups: formData.clientGroup || "Primary Client",
      auditor: formData.auditor || "Saha & Associates",
      labels: formData.labels || ["Corporate"],
      associatePartners: formData.associatePartners || "",
      referredBy: formData.referredBy,
      source: formData.source,
    };

    const updatedList = [optimisticClient, ...clients];
    setClients(updatedList);
    setKpiData(recalculateKpi(updatedList));

    startTransition(async () => {
      try {
        const saved = await createClient(formData);
        if (saved) {
          setClients((prev) =>
            prev.map((c) => (c.id === optimisticClient.id ? saved : c))
          );
        }
      } catch (err) {
        console.error("Failed to save client:", err);
      }
    });
  };

  // Handle Toggle Active Status
  const handleToggleStatus = async (id: string, newStatus: ClientItem["status"]) => {
    const updatedList = clients.map((c) =>
      c.id === id ? { ...c, status: newStatus } : c
    );
    setClients(updatedList);
    setKpiData(recalculateKpi(updatedList));

    if (selectedClient && selectedClient.id === id) {
      setSelectedClient((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    startTransition(async () => {
      try {
        await updateClient(id, { status: newStatus });
      } catch (err) {
        console.error("Failed to toggle client status:", err);
      }
    });
  };

  // Handle Import Success
  const handleImportSuccess = (imported: ClientItem[]) => {
    const combined = [...imported, ...clients];
    setClients(combined);
    setKpiData(recalculateKpi(combined));
  };

  // Handle Delete Client
  const handleDeleteClient = async (id: string) => {
    const updatedList = clients.filter((c) => c.id !== id);
    setClients(updatedList);
    setKpiData(recalculateKpi(updatedList));

    if (selectedClient && selectedClient.id === id) {
      setIsDetailDrawerOpen(false);
      setSelectedClient(null);
    }

    startTransition(async () => {
      try {
        await deleteClient(id);
      } catch (err) {
        console.error("Failed to delete client:", err);
      }
    });
  };

  // Export Clients XLSX
  const handleExportClients = () => {
    setIsTopMenuOpen(false);
    const link = document.createElement("a");
    link.href = "/api/clients/export";
    link.setAttribute("download", `TURIA_Clients_Master_${new Date().toISOString().slice(0, 10)}.xlsx`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Contacts CSV
  const handleExportContacts = () => {
    setIsTopMenuOpen(false);
    const headers = ["Client Code", "Trade Name", "Contact Person", "Email", "Mobile No", "Business Entity", "GSTIN", "Place of Supply"];
    const rows = clients.map((c) => [
      `"${c.clientCode}"`,
      `"${c.tradeName}"`,
      `"${c.contactName}"`,
      `"${c.email}"`,
      `"${c.mobileNo}"`,
      `"${c.businessEntity}"`,
      `"${c.gstin}"`,
      `"${c.placeOfSupply}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `TURIA_Client_Contacts_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AppShell>
      <div className="space-y-4">
        {/* Top 4 KPI Metric Cards */}
        <ClientKpiStrip kpi={kpiData} />

        {/* Section Header & Toolbar matching Services standard */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-slate-900 tracking-tight">
              Client ({clients.length})
            </h1>
            {isLoading && (
              <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                <RotateCw className="size-3 animate-spin text-indigo-600" /> Syncing...
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="size-3.5 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 w-44 sm:w-60 shadow-2xs"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "popular" | "name_asc" | "recent" | "code")
                }
                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="name_asc">Name (A-Z)</option>
                <option value="recent">Recently Added</option>
                <option value="code">Client Code</option>
              </select>
            </div>

            {/* Add Primary Button */}
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-1.5 bg-[#6366F1] hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center gap-1"
            >
              <span>Add</span>
            </button>

            {/* 3-Dots Action Menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsTopMenuOpen(!isTopMenuOpen)}
                className="p-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl text-slate-600 transition-colors cursor-pointer shadow-2xs"
              >
                <MoreVertical className="size-4" />
              </button>

              {isTopMenuOpen && (
                <div className="absolute right-0 top-10 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
                  <button
                    type="button"
                    onClick={() => {
                      setIsImportModalOpen(true);
                      setIsTopMenuOpen(false);
                    }}
                    className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium cursor-pointer transition-colors text-left"
                  >
                    <Upload className="size-4 text-indigo-600" />
                    <span>Import Clients</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsImportModalOpen(true);
                      setIsTopMenuOpen(false);
                    }}
                    className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium cursor-pointer transition-colors text-left"
                  >
                    <Upload className="size-4 text-sky-600" />
                    <span>Import Contacts</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportClients}
                    className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium cursor-pointer transition-colors text-left"
                  >
                    <Download className="size-4 text-emerald-600" />
                    <span>Export Clients</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportContacts}
                    className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium cursor-pointer transition-colors text-left"
                  >
                    <Download className="size-4 text-amber-600" />
                    <span>Export Contacts</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 13-Column Main Clients Table */}
        <ClientsTable
          clients={filteredAndSortedClients}
          onSelectClient={(client) => {
            setSelectedClient(client);
            setIsDetailDrawerOpen(true);
          }}
          onDeleteClient={handleDeleteClient}
          onToggleStatus={handleToggleStatus}
        />

        {/* Add Client Modal */}
        <AddClientModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddClient={handleAddClient}
        />

        {/* Batch Import Modal */}
        <ImportClientsModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          onImportSuccess={handleImportSuccess}
        />

        {/* Client 360 Detail Drawer */}
        <ClientDetailDrawer
          client={selectedClient}
          isOpen={isDetailDrawerOpen}
          onClose={() => {
            setIsDetailDrawerOpen(false);
            setSelectedClient(null);
          }}
          onDeleteClient={handleDeleteClient}
        />
      </div>
    </AppShell>
  );
}
