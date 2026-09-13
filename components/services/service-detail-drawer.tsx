"use client";

import React, { useState } from "react";
import {
  X,
  FileText,
  DollarSign,
  Repeat,
  CheckCircle2,
  Trash2,
  BookOpen,
} from "lucide-react";
import { ServiceItem } from "./types";

interface ServiceDetailDrawerProps {
  service: ServiceItem | null;
  isOpen: boolean;
  onClose: () => void;
  onDeleteService?: (id: string) => void;
  onToggleStatus?: (id: string, newStatus: boolean) => void;
}

export function ServiceDetailDrawer({
  service,
  isOpen,
  onClose,
  onDeleteService,
  onToggleStatus,
}: ServiceDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "commercial" | "checklists" | "sla">("overview");

  if (!isOpen || !service) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl h-full shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 border border-indigo-200">
                {service.serviceCode}
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  service.isActive
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-slate-100 text-slate-600 border border-slate-200"
                }`}
              >
                {service.isActive ? "ACTIVE" : "INACTIVE"}
              </span>
              {service.isRecurring && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                  RECURRING ({service.recurrenceFrequency.toUpperCase()})
                </span>
              )}
            </div>
            <h2 className="text-base font-bold text-slate-900 leading-tight">
              {service.serviceName}
            </h2>
            <p className="text-xs text-indigo-600 font-semibold">{service.category}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Drawer Sub Navigation */}
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
            onClick={() => setActiveTab("commercial")}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === "commercial"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            Commercial &amp; Tax
          </button>
          <button
            onClick={() => setActiveTab("checklists")}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === "checklists"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            SOP &amp; Checklists
          </button>
          <button
            onClick={() => setActiveTab("sla")}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === "sla"
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            TAT &amp; Recurrence
          </button>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
          {activeTab === "overview" && (
            <div className="space-y-4">
              <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-200/80 space-y-3">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <FileText className="size-3.5 text-indigo-600" />
                  <span>Scope Description</span>
                </h4>
                <p className="text-slate-700 leading-relaxed">
                  {service.description || "Standard CA professional compliance scope."}
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 border border-slate-200/80 space-y-3 shadow-2xs">
                <h4 className="font-bold text-slate-900 text-xs">Classification &amp; Difficulty</h4>
                <div className="grid grid-cols-2 gap-3 text-slate-700">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Category</span>
                    <span className="font-semibold text-slate-900">{service.category}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Difficulty Level</span>
                    <span
                      className={`inline-block font-semibold px-2 py-0.5 rounded text-[11px] ${
                        service.difficultyLevel === "Beginner"
                          ? "bg-emerald-50 text-emerald-700"
                          : service.difficultyLevel === "Intermediate"
                          ? "bg-sky-50 text-sky-700"
                          : service.difficultyLevel === "Advanced"
                          ? "bg-purple-50 text-purple-700"
                          : "bg-rose-50 text-rose-700"
                      }`}
                    >
                      {service.difficultyLevel}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Created On</span>
                    <span className="font-medium">{service.createdOn}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Last Updated</span>
                    <span className="font-medium">{service.updatedOn}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "commercial" && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4 border border-slate-200/80 space-y-3 shadow-2xs">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <DollarSign className="size-3.5 text-indigo-600" />
                  <span>Statutory Commercials &amp; GST Rates</span>
                </h4>
                <div className="space-y-2.5 text-slate-700">
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Base Professional Fee</span>
                    <span className="font-bold text-slate-900 font-mono text-sm">
                      ₹{service.baseFee.toLocaleString("en-IN")}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">SAC Code (Services Accounting)</span>
                    <span className="font-mono font-bold text-indigo-600">{service.sacCode}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Applicable GST Rate</span>
                    <span className="font-semibold text-slate-800">{service.gstRate}% (CGST 9% + SGST 9%)</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">Max Out of Pocket (OOP) Budget</span>
                    <span className="font-mono font-medium">₹{service.outOfPocketBudget.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between items-center py-1.5">
                    <span className="text-slate-500">Tax Exemption</span>
                    <span className="font-medium">{service.exemptionReason || "None (Taxable)"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "checklists" && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4 border border-slate-200/80 space-y-3 shadow-2xs">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <BookOpen className="size-3.5 text-indigo-600" />
                  <span>Standard SOP Sub-Tasks ({service.subtasksCount} Steps)</span>
                </h4>
                <div className="space-y-2">
                  {[
                    "1. Client Document Collection & Requisition Verification",
                    "2. Ledger & Bank Statement Vouching",
                    "3. Working Paper Preparation & Audit Trail Indexing",
                    "4. Manager Review & Compliance Clearance",
                    "5. Partner Sign-off & Final Portal Submission",
                  ].map((step, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2"
                    >
                      <CheckCircle2 className="size-3.5 text-indigo-600 shrink-0" />
                      <span className="text-slate-800 font-medium">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "sla" && (
            <div className="space-y-4">
              <div className="bg-white rounded-xl p-4 border border-slate-200/80 space-y-3 shadow-2xs">
                <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <Repeat className="size-3.5 text-indigo-600" />
                  <span>Turnaround Time (TAT) &amp; Due Cycle</span>
                </h4>
                <div className="space-y-2 text-slate-700">
                  <div className="flex justify-between items-center py-1 border-b border-slate-100">
                    <span className="text-slate-500">Standard Turnaround (TAT)</span>
                    <span className="font-semibold text-slate-900">{service.tatDays} Days ({service.tatHours} hrs)</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-100">
                    <span className="text-slate-500">Recurrence Frequency</span>
                    <span className="font-semibold text-purple-700">{service.recurrenceFrequency}</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-b border-slate-100">
                    <span className="text-slate-500">Due Timing</span>
                    <span className="font-medium">{service.dueTiming}</span>
                  </div>
                  <div className="flex justify-between items-center py-1">
                    <span className="text-slate-500">Schedule Window</span>
                    <span className="font-mono text-indigo-600">{service.startDay} &rarr; {service.targetDueDay} (Cutoff: {service.endDay})</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            {onToggleStatus && (
              <button
                type="button"
                onClick={() => onToggleStatus(service.id, !service.isActive)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer border ${
                  service.isActive
                    ? "text-amber-700 border-amber-200 hover:bg-amber-50"
                    : "text-emerald-700 border-emerald-200 hover:bg-emerald-50"
                }`}
              >
                {service.isActive ? "Deactivate Service" : "Activate Service"}
              </button>
            )}

            {onDeleteService && (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Are you sure you want to delete service "${service.serviceName}"?`)) {
                    onDeleteService(service.id);
                    onClose();
                  }
                }}
                className="px-3 py-1.5 text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="size-3.5" />
                <span>Delete</span>
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer ml-auto"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
