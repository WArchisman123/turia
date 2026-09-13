"use client";

import React, { useState } from "react";
import {
  X,
  Building2,
  MapPin,
  ShieldCheck,
  User,
  Phone,
  Mail,
  Layers,
  Award,
  Trash2,
} from "lucide-react";
import { ClientItem } from "./types";

interface ClientDetailDrawerProps {
  client: ClientItem | null;
  isOpen: boolean;
  onClose: () => void;
  onDeleteClient?: (id: string) => void;
}

export function ClientDetailDrawer({
  client,
  isOpen,
  onClose,
  onDeleteClient,
}: ClientDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "tax_statutory" | "contacts" | "services">("overview");

  if (!isOpen || !client) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl h-full shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                {client.clientCode}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  client.status === "active"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-slate-100 text-slate-600 border border-slate-200"
                }`}
              >
                {client.status.toUpperCase()}
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 leading-tight">
              {client.tradeName}
            </h2>
            <p className="text-xs text-slate-500">{client.legalName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Drawer Tabs */}
        <div className="flex border-b border-slate-200 px-5 gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("overview")}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === "overview"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab("tax_statutory")}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === "tax_statutory"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Tax &amp; GSTINs
          </button>
          <button
            onClick={() => setActiveTab("contacts")}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === "contacts"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Contacts &amp; Groups
          </button>
          <button
            onClick={() => setActiveTab("services")}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === "services"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Services &amp; Auditor
          </button>
        </div>

        {/* Drawer Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {activeTab === "overview" && (
            <div className="space-y-4">
              <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-200/80 space-y-3">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <Building2 className="size-3.5 text-indigo-600" />
                  <span>Entity Profile</span>
                </h4>
                <div className="grid grid-cols-2 gap-3 text-slate-700">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Business Entity</span>
                    <span className="font-medium">{client.businessEntity}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Currency</span>
                    <span className="font-medium">{client.currency}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Created On</span>
                    <span className="font-medium">{client.createdOn}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Referred By</span>
                    <span className="font-medium">{client.referredBy || "Direct Walk-in"}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 border border-slate-200/80 space-y-3 shadow-2xs">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <MapPin className="size-3.5 text-indigo-600" />
                  <span>Place of Supply &amp; Registered Office</span>
                </h4>
                <div className="space-y-2 text-slate-700">
                  <div className="flex justify-between items-center py-1 border-b border-slate-100">
                    <span className="text-slate-500">Place of Supply</span>
                    <span className="font-semibold text-indigo-600">{client.placeOfSupply}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-100">
                    <span className="text-slate-500">Address</span>
                    <span className="font-medium text-right">
                      {[client.addressLine1, client.addressLine2].filter(Boolean).join(", ") || "Main Corporate Office"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-500">City / State / PIN</span>
                    <span className="font-medium">{client.city}, {client.state} - {client.pincode}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "tax_statutory" && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4 border border-slate-200/80 space-y-3 shadow-2xs">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <ShieldCheck className="size-3.5 text-indigo-600" />
                  <span>GST &amp; Statutory Identifiers</span>
                </h4>
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg border border-slate-200">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Primary GSTIN</span>
                      <span className="font-mono font-bold text-indigo-700 text-xs">
                        {client.gstin || "NOT REGISTERED"}
                      </span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                      Active Regular
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Business PAN</span>
                      <span className="font-mono font-bold text-slate-800">{client.businessPan || "-"}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">CIN / Registration No</span>
                      <span className="font-mono font-bold text-slate-800">{client.registrationNo || "-"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "contacts" && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4 border border-slate-200/80 space-y-3 shadow-2xs">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <User className="size-3.5 text-indigo-600" />
                  <span>Primary Contact &amp; Signatory</span>
                </h4>
                <div className="space-y-2">
                  <div className="font-bold text-slate-900">{client.contactName}</div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail className="size-3.5 text-slate-400" />
                    <span>{client.email || "accounts@clientcorp.in"}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone className="size-3.5 text-slate-400" />
                    <span>{client.mobileNo || "+91 98300 00000"}</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-200/80 space-y-2">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <Layers className="size-3.5 text-indigo-600" />
                  <span>Corporate Group Hierarchy</span>
                </h4>
                <p className="text-slate-600">Group Name: <span className="font-semibold text-slate-900">{client.groups}</span></p>
              </div>
            </div>
          )}

          {activeTab === "services" && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4 border border-slate-200/80 space-y-3 shadow-2xs">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <Award className="size-3.5 text-indigo-600" />
                  <span>Appointed Statutory Auditor</span>
                </h4>
                <p className="font-semibold text-slate-900">{client.auditor}</p>
              </div>

              <div className="bg-white rounded-xl p-4 border border-slate-200/80 space-y-3 shadow-2xs">
                <h4 className="font-bold text-slate-900 text-xs">Subscribed Practice Services</h4>
                <div className="flex flex-wrap gap-1.5">
                  {client.services.map((srv, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-medium border border-indigo-100"
                    >
                      {srv}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer Actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
          {onDeleteClient && (
            <button
              onClick={() => {
                if (confirm(`Are you sure you want to delete client ${client.tradeName}?`)) {
                  onDeleteClient(client.id);
                  onClose();
                }
              }}
              className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Trash2 className="size-3.5" />
              <span>Delete Client</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold ml-auto transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
