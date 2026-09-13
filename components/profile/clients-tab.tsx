"use client";

import React, { useState, useEffect } from "react";
import { Search, ArrowRightLeft, Building2, Phone, RotateCw } from "lucide-react";
import { ReassignModal } from "./reassign-modal";
import { fetchAssignedClients, reassignClients } from "@/lib/api/profile";

export interface AssignedClientItem {
  id: string;
  clientCode: string;
  tradeName: string;
  legalName: string;
  contactPerson: string;
  mobileNumber: string;
  businessEntity: string;
  status: "Active" | "Dormant" | "New";
}

export function ClientsTab() {
  const [clients, setClients] = useState<AssignedClientItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedClientIds, setSelectedClientIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isReassignOpen, setIsReassignOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadClients() {
      try {
        const data = await fetchAssignedClients();
        if (isMounted) {
          setClients(data);
        }
      } catch (err) {
        console.error("Failed to load assigned clients:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    loadClients();
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleSelectAll = () => {
    if (selectedClientIds.length === clients.length) {
      setSelectedClientIds([]);
    } else {
      setSelectedClientIds(clients.map((c) => c.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedClientIds.includes(id)) {
      setSelectedClientIds(selectedClientIds.filter((item) => item !== id));
    } else {
      setSelectedClientIds([...selectedClientIds, id]);
    }
  };

  const handleReassignConfirm = async (newAssignee: string) => {
    await reassignClients(selectedClientIds, newAssignee);
    setClients((prev) => prev.filter((c) => !selectedClientIds.includes(c.id)));
    setSelectedClientIds([]);
  };

  const filteredClients = clients.filter(
    (c) =>
      c.tradeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.legalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.clientCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.contactPerson.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Top Controls */}
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="size-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search assigned client portfolios..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>
            {isLoading && (
              <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                <RotateCw className="size-3 animate-spin text-indigo-600" /> Loading clients...
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {selectedClientIds.length > 0 && (
              <button
                type="button"
                onClick={() => setIsReassignOpen(true)}
                className="px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <ArrowRightLeft className="size-3.5" /> Re-Assign Portfolio ({selectedClientIds.length})
              </button>
            )}
          </div>
        </div>

        {/* Clients Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <th className="py-2.5 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={selectedClientIds.length > 0 && selectedClientIds.length === clients.length}
                    onChange={toggleSelectAll}
                    className="size-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                  />
                </th>
                <th className="py-2.5 px-4 font-semibold text-[11px]">Client Code</th>
                <th className="py-2.5 px-4 font-semibold text-[11px]">Trade Name</th>
                <th className="py-2.5 px-4 font-semibold text-[11px]">Legal Entity Name</th>
                <th className="py-2.5 px-4 font-semibold text-[11px]">Business Entity</th>
                <th className="py-2.5 px-4 font-semibold text-[11px]">Contact Person</th>
                <th className="py-2.5 px-4 font-semibold text-[11px]">Phone</th>
                <th className="py-2.5 px-4 font-semibold text-[11px] text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-slate-400">
                    {isLoading ? "Fetching assigned client portfolios..." : "No client portfolios assigned."}
                  </td>
                </tr>
              ) : (
                filteredClients.map((client) => {
                  const isSelected = selectedClientIds.includes(client.id);
                  return (
                    <tr
                      key={client.id}
                      className={`hover:bg-slate-50/80 transition-colors ${
                        isSelected ? "bg-indigo-50/40" : ""
                      }`}
                    >
                      <td className="py-3 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelect(client.id)}
                          className="size-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                        />
                      </td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-600">
                        {client.clientCode}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <Building2 className="size-3.5 text-indigo-600 shrink-0" />
                          <span>{client.tradeName}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{client.legalName}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {client.businessEntity}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-700 font-medium">
                        {client.contactPerson}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        <div className="flex items-center gap-1 text-[11px]">
                          <Phone className="size-3 text-slate-400" />
                          <span>{client.mobileNumber}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            client.status === "Active"
                              ? "bg-emerald-100 text-emerald-800"
                              : client.status === "New"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {client.status}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reassign Modal */}
      <ReassignModal
        isOpen={isReassignOpen}
        onClose={() => setIsReassignOpen(false)}
        title="Reassign Client Portfolios"
        itemCount={selectedClientIds.length}
        itemNames={clients.filter((c) => selectedClientIds.includes(c.id)).map((c) => c.tradeName)}
        onConfirm={handleReassignConfirm}
      />
    </div>
  );
}
