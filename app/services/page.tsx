"use client";

import React, { useState, useEffect, useMemo, useTransition } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { ServicesKpiStrip } from "@/components/services/services-kpi-strip";
import { ServicesTable } from "@/components/services/services-table";
import { AddServiceModal } from "@/components/services/add-service-modal";
import { ImportServicesModal } from "@/components/services/import-services-modal";
import { ServiceDetailDrawer } from "@/components/services/service-detail-drawer";
import {
  ServiceItem,
  ServiceFormData,
  ServiceKpiData,
} from "@/components/services/types";
import {
  fetchServices,
  createService,
  updateService,
  deleteService,
} from "@/lib/api/services";
import {
  Search,
  MoreVertical,
  Upload,
  Download,
  FileSpreadsheet,
  RotateCw,
} from "lucide-react";

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [kpiData, setKpiData] = useState<ServiceKpiData>({
    activeCount: 0,
    recurringCount: 0,
    nonRecurringCount: 0,
    defaultServicesCount: 0,
    inactiveCount: 0,
    totalServicesCount: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"popular" | "name_asc" | "fee_desc" | "fee_asc">("popular");
  const [, startTransition] = useTransition();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isTopMenuOpen, setIsTopMenuOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);

  // Load services and KPI from API
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const data = await fetchServices();
        if (isMounted) {
          setServices(data.services || []);
          if (data.kpi) {
            setKpiData(data.kpi);
          }
        }
      } catch (err) {
        console.error("Failed to load services catalog:", err);
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

  // Filter and sort services
  const filteredAndSortedServices = useMemo(() => {
    let result = [...services];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((s) => {
        return (
          s.serviceName.toLowerCase().includes(q) ||
          s.serviceCode.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q) ||
          s.sacCode.toLowerCase().includes(q) ||
          s.difficultyLevel.toLowerCase().includes(q) ||
          s.recurrenceFrequency.toLowerCase().includes(q) ||
          s.description.toLowerCase().includes(q)
        );
      });
    }

    if (sortBy === "name_asc") {
      result.sort((a, b) => a.serviceName.localeCompare(b.serviceName));
    } else if (sortBy === "fee_desc") {
      result.sort((a, b) => b.baseFee - a.baseFee);
    } else if (sortBy === "fee_asc") {
      result.sort((a, b) => a.baseFee - b.baseFee);
    }

    return result;
  }, [services, searchQuery, sortBy]);

  // Recalculate KPIs based on current services state
  const recalculateKpi = (items: ServiceItem[]): ServiceKpiData => {
    const active = items.filter((s) => s.isActive).length;
    const recurring = items.filter((s) => s.isRecurring).length;
    const nonRecurring = items.filter((s) => !s.isRecurring).length;
    const defaultServices = items.filter((s) => s.isDefault).length;
    const inactive = items.filter((s) => !s.isActive).length;
    return {
      activeCount: active,
      recurringCount: recurring,
      nonRecurringCount: nonRecurring,
      defaultServicesCount: defaultServices,
      inactiveCount: inactive,
      totalServicesCount: items.length,
    };
  };

  // Handle Add Service
  const handleAddService = async (formData: ServiceFormData) => {
    const optimisticService: ServiceItem = {
      id: `temp-${Date.now()}`,
      serviceCode: `SRV-${Date.now().toString().slice(-4)}`,
      serviceName: formData.serviceName,
      category: formData.category,
      sacCode: formData.sacCode || "998231",
      billingType: "Fixed Fee",
      baseFee: Number(formData.professionalFee) || 0,
      gstRate: Number(formData.taxRate) || 18,
      estimatedHours: Number(formData.tatDays || 1) * 8,
      tatDays: Number(formData.tatDays) || 3,
      tatHours: formData.tatHours || "04:00",
      isRecurring: formData.isRecurring,
      recurrenceFrequency: formData.frequency,
      difficultyLevel: formData.difficulty,
      description: formData.description || "",
      dueTiming: "Monthly",
      startDay: "1st",
      targetDueDay: "15th",
      endDay: "20th",
      exemptionReason: formData.exemptionReason || "",
      outOfPocketBudget: Number(formData.maxOopBudget) || 0,
      sopCount: 1,
      subtasksCount: 3,
      notes: formData.note || "",
      isDefault: false,
      subtaskTemplates: [
        { title: "Document Collection & Verification", estimatedHours: 2, order: 1 },
        { title: "Drafting & Statutory Computation", estimatedHours: 4, order: 2 },
        { title: "Partner Review & Portal Filing", estimatedHours: 2, order: 3 },
      ],
      checklistTemplates: [
        "Bank statements & general ledger extracts",
        "Statutory filing credentials / DSC PIN",
        "Prior year returns and assessment orders",
      ],
      isActive: true,
      createdOn: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      updatedOn: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    };

    const newServicesList = [optimisticService, ...services];
    setServices(newServicesList);
    setKpiData(recalculateKpi(newServicesList));

    startTransition(async () => {
      try {
        const saved = await createService(formData);
        if (saved) {
          setServices((prev) =>
            prev.map((s) => (s.id === optimisticService.id ? saved : s))
          );
        }
      } catch (err) {
        console.error("Failed to save service:", err);
      }
    });
  };

  // Handle Toggle Active Status
  const handleToggleStatus = async (id: string, newStatus: boolean) => {
    const updatedList = services.map((s) =>
      s.id === id ? { ...s, isActive: newStatus } : s
    );
    setServices(updatedList);
    setKpiData(recalculateKpi(updatedList));

    if (selectedService && selectedService.id === id) {
      setSelectedService((prev) => (prev ? { ...prev, isActive: newStatus } : null));
    }

    startTransition(async () => {
      try {
        await updateService(id, { isActive: newStatus });
      } catch (err) {
        console.error("Failed to toggle status:", err);
      }
    });
  };

  // Handle Delete Service
  const handleDeleteService = async (id: string) => {
    const updatedList = services.filter((s) => s.id !== id);
    setServices(updatedList);
    setKpiData(recalculateKpi(updatedList));

    if (selectedService && selectedService.id === id) {
      setIsDetailDrawerOpen(false);
      setSelectedService(null);
    }

    startTransition(async () => {
      try {
        await deleteService(id);
      } catch (err) {
        console.error("Failed to delete service:", err);
      }
    });
  };

  // Handle Import Success
  const handleImportSuccess = (imported: ServiceItem[]) => {
    const combined = [...imported, ...services];
    setServices(combined);
    setKpiData(recalculateKpi(combined));
  };

  // Export Services Catalog XLSX
  const handleExportServices = () => {
    setIsTopMenuOpen(false);
    const link = document.createElement("a");
    link.href = "/api/services/export";
    link.setAttribute(
      "download",
      `TURIA_Services_Catalog_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Download Sample Template XLSX
  const handleDownloadTemplate = () => {
    setIsTopMenuOpen(false);
    const link = document.createElement("a");
    link.href = "/api/services/template";
    link.setAttribute("download", "Service_SampleData.xlsx");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AppShell>
      <div className="space-y-4">
        {/* Top 6 KPI Metric Cards matching services-1.png */}
        <ServicesKpiStrip kpi={kpiData} />

        {/* Section Header & Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-slate-900 tracking-tight">
              Service ({services.length})
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
                  setSortBy(e.target.value as "popular" | "name_asc" | "fee_desc" | "fee_asc")
                }
                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs cursor-pointer"
              >
                <option value="popular">Most Popular</option>
                <option value="name_asc">Name (A-Z)</option>
                <option value="fee_desc">Fee (High to Low)</option>
                <option value="fee_asc">Fee (Low to High)</option>
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
                <div className="absolute right-0 top-10 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-30 animate-in fade-in zoom-in-95 duration-100">
                  <button
                    type="button"
                    onClick={handleDownloadTemplate}
                    className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium cursor-pointer transition-colors text-left"
                  >
                    <FileSpreadsheet className="size-4 text-emerald-600" />
                    <span>Download Sample Template</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsImportModalOpen(true);
                      setIsTopMenuOpen(false);
                    }}
                    className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium cursor-pointer transition-colors text-left"
                  >
                    <Upload className="size-4 text-indigo-600" />
                    <span>Import Services (XLSX/CSV)</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleExportServices}
                    className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 font-medium cursor-pointer transition-colors text-left"
                  >
                    <Download className="size-4 text-sky-600" />
                    <span>Export Services Catalog</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 12-Column Main Services Table */}
        <ServicesTable
          services={filteredAndSortedServices}
          onSelectService={(service) => {
            setSelectedService(service);
            setIsDetailDrawerOpen(true);
          }}
          onDeleteService={handleDeleteService}
          onToggleStatus={handleToggleStatus}
        />

        {/* Add Service Modal */}
        <AddServiceModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onAddService={handleAddService}
        />

        {/* Batch Import Modal */}
        <ImportServicesModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          onImportSuccess={handleImportSuccess}
        />

        {/* Service 360 Detail Drawer */}
        <ServiceDetailDrawer
          service={selectedService}
          isOpen={isDetailDrawerOpen}
          onClose={() => {
            setIsDetailDrawerOpen(false);
            setSelectedService(null);
          }}
          onDeleteService={handleDeleteService}
          onToggleStatus={handleToggleStatus}
        />
      </div>
    </AppShell>
  );
}
