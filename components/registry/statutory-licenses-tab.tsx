"use client";

import React, { useState, useEffect } from "react";
import {
  FileCheck2,
  AlertTriangle,
  Clock,
  Plus,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import { ClientLicenseItem } from "./types";
import { fetchClientLicenses, createClientLicense } from "@/lib/api/registry";
import { fetchClients } from "@/lib/api/clients";
import { ClientItem } from "@/components/clients/types";

export function StatutoryLicensesTab() {
  const [licenses, setLicenses] = useState<ClientLicenseItem[]>([]);
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Form State
  const [clientId, setClientId] = useState("");
  const [licenseName, setLicenseName] = useState("FSSAI Food License");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [issuingAuthority, setIssuingAuthority] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const [lics, clientRes] = await Promise.all([
          fetchClientLicenses(),
          fetchClients(),
        ]);
        if (isMounted) {
          setLicenses(lics);
          setClients(clientRes.clients || []);
          if (clientRes.clients?.length > 0) {
            setClientId(clientRes.clients[0].id);
          }
        }
      } catch (err) {
        console.error("Error loading licenses:", err);
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
  }, []);

  const refreshData = async () => {
    try {
      const [lics, clientRes] = await Promise.all([
        fetchClientLicenses(),
        fetchClients(),
      ]);
      setLicenses(lics);
      setClients(clientRes.clients || []);
    } catch (err) {
      console.error("Error refreshing licenses:", err);
    }
  };

  const filtered = licenses.filter(
    (l) =>
      l.licenseName.toLowerCase().includes(search.toLowerCase()) ||
      l.licenseNumber.toLowerCase().includes(search.toLowerCase()) ||
      l.clientName.toLowerCase().includes(search.toLowerCase()) ||
      l.issuingAuthority.toLowerCase().includes(search.toLowerCase())
  );

  const totalCount = licenses.length;
  const activeCount = licenses.filter((l) => l.status === "active").length;
  const expiringCount = licenses.filter((l) => l.status === "expiring").length;
  const expiredCount = licenses.filter((l) => l.status === "expired").length;

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || !licenseName || !licenseNumber) return;

    setIsSubmitting(true);
    try {
      await createClientLicense({
        clientId,
        licenseName,
        licenseNumber,
        issuingAuthority,
        issueDate,
        expiryDate,
      });
      setIsAddOpen(false);
      setLicenseNumber("");
      refreshData();
    } catch (err) {
      console.error("Failed to add license:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-slate-500">Total Statutory Licenses</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{totalCount}</p>
          </div>
          <div className="size-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 flex items-center justify-center">
            <FileCheck2 className="size-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-slate-500">Active & Valid</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{activeCount}</p>
          </div>
          <div className="size-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="size-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-slate-500">Expiring in 30 Days</p>
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{expiringCount}</p>
          </div>
          <div className="size-8 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
            <Clock className="size-4" />
          </div>
        </div>

        <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-[11px] font-medium text-slate-500">Expired / Renewal Due</p>
            <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">{expiredCount}</p>
          </div>
          <div className="size-8 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 flex items-center justify-center">
            <AlertTriangle className="size-4" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 size-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search licenses, clients, authorities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 shadow-xs"
          />
        </div>

        <button
          type="button"
          onClick={() => setIsAddOpen(true)}
          className="px-3 py-1.5 rounded-lg bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs shrink-0"
        >
          <Plus className="size-3.5" />
          <span>Add License</span>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#E2E8F0] dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/80 text-[10px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 select-none">
              <th className="py-2.5 px-4">Client Name</th>
              <th className="py-2.5 px-4">License Type</th>
              <th className="py-2.5 px-4">License Number</th>
              <th className="py-2.5 px-4">Issuing Authority</th>
              <th className="py-2.5 px-4">Issue Date</th>
              <th className="py-2.5 px-4">Expiry Date</th>
              <th className="py-2.5 px-4">Renewal Countdown</th>
              <th className="py-2.5 px-4">Status</th>
            </tr>
          </thead>
          <tbody className="text-xs text-slate-700 dark:text-slate-300 divide-y divide-slate-100 dark:divide-slate-800">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400">
                  Loading statutory licenses...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-400">
                  No statutory licenses recorded yet.
                </td>
              </tr>
            ) : (
              filtered.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/75 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-2.5 px-4 font-semibold text-slate-900 dark:text-white">
                    {item.clientName}
                  </td>
                  <td className="py-2.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                    {item.licenseName}
                  </td>
                  <td className="py-2.5 px-4 font-mono font-medium text-[11px] text-slate-600 dark:text-slate-400">
                    {item.licenseNumber}
                  </td>
                  <td className="py-2.5 px-4 text-slate-500 dark:text-slate-400 max-w-[200px] truncate">
                    {item.issuingAuthority}
                  </td>
                  <td className="py-2.5 px-4 font-mono text-[11px] text-slate-500">
                    {item.issueDate || "-"}
                  </td>
                  <td className="py-2.5 px-4 font-mono text-[11px] font-semibold">
                    {item.expiryDate || "-"}
                  </td>
                  <td className="py-2.5 px-4 whitespace-nowrap">
                    {item.status === "expired" ? (
                      <span className="inline-flex items-center gap-1 font-bold text-rose-600 text-[11px]">
                        Expired ({Math.abs(item.daysRemaining)}d ago)
                      </span>
                    ) : item.daysRemaining <= 30 ? (
                      <span className="inline-flex items-center gap-1 font-bold text-amber-600 text-[11px]">
                        <Clock className="size-3" />
                        {item.daysRemaining} days left
                      </span>
                    ) : (
                      <span className="text-slate-500 text-[11px]">
                        {item.daysRemaining} days left
                      </span>
                    )}
                  </td>
                  <td className="py-2.5 px-4">
                    {item.status === "active" && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                        Active
                      </span>
                    )}
                    {item.status === "expiring" && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                        Expiring Soon
                      </span>
                    )}
                    {item.status === "expired" && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300">
                        Expired
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Add Client Statutory License
              </h3>
              <button
                type="button"
                onClick={() => setIsAddOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Select Client *
                </label>
                <select
                  required
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.tradeName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  License Type *
                </label>
                <select
                  value={licenseName}
                  onChange={(e) => setLicenseName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="FSSAI Food License">FSSAI Food License</option>
                  <option value="Import Export Code (IEC)">Import Export Code (IEC)</option>
                  <option value="Trade License">Municipal Trade License</option>
                  <option value="Shops & Establishments Registration">Shops & Establishments Registration</option>
                  <option value="Pollution Control Board Clearance">Pollution Control Board Clearance</option>
                  <option value="Drug License">State Drug License</option>
                  <option value="Factory License">Factory Inspectorate License</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  License / Registration Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 10020031004567"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Issuing Authority
                </label>
                <input
                  type="text"
                  placeholder="e.g. FSSAI, DGFT, Municipal Corporation"
                  value={issuingAuthority}
                  onChange={(e) => setIssuingAuthority(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Issue Date
                  </label>
                  <input
                    type="date"
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 rounded-lg bg-[#6366F1] text-white font-semibold disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : "Save License"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
