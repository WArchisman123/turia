"use client";

import React, { useState } from "react";
import posthog from "posthog-js";
import {
  X,
  Loader2,
  FileText,
  DollarSign,
} from "lucide-react";
import {
  ServiceFormData,
  SERVICE_CATEGORIES,
  SERVICE_FREQUENCIES,
  SERVICE_DIFFICULTIES,
} from "./types";

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddService: (formData: ServiceFormData) => Promise<void> | void;
}

export function AddServiceModal({
  isOpen,
  onClose,
  onAddService,
}: AddServiceModalProps) {
  // Service Details
  const [serviceName, setServiceName] = useState("");
  const [category, setCategory] = useState("Direct Tax");
  const [frequency, setFrequency] = useState("Monthly");
  const [difficulty, setDifficulty] = useState<ServiceFormData["difficulty"]>("Intermediate");
  const [description, setDescription] = useState("");
  const [isRecurring, setIsRecurring] = useState(true);

  // Commercial & Tax
  const [professionalFee, setProfessionalFee] = useState<number | "">(5000);
  const [taxRate, setTaxRate] = useState(18);
  const [sacCode, setSacCode] = useState("998231");
  const [exemptionReason, setExemptionReason] = useState("");
  const [maxOopBudget, setMaxOopBudget] = useState<number | "">(0);
  const [tatDays, setTatDays] = useState<number | "">(3);
  const [tatHours, setTatHours] = useState("04:00");

  // Note
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!serviceName.trim() || !category) return;

    setIsSubmitting(true);
    try {
      const payload: ServiceFormData = {
        serviceName: serviceName.trim(),
        category,
        frequency,
        difficulty,
        description,
        isRecurring,
        professionalFee: Number(professionalFee) || 0,
        taxRate: Number(taxRate) || 18,
        sacCode: sacCode.trim() || "998231",
        exemptionReason,
        maxOopBudget: Number(maxOopBudget) || 0,
        tatDays: Number(tatDays) || 7,
        tatHours,
        note,
      };

      await onAddService(payload);
      posthog.capture("service_created", {
        category,
        frequency,
        difficulty,
        is_recurring: isRecurring,
      });
      onClose();
    } catch (err) {
      console.error("Failed to add service:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-5xl w-full my-auto overflow-hidden animate-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between bg-slate-50/50 shrink-0">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Add New Service</h3>
            <p className="text-[11px] text-slate-500">
              Organize and set boundaries in the standard list for convenient and accurate client billing
            </p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Modal Body: 2-Column Grid */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1 text-xs">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Columns: Form Fields */}
            <div className="lg:col-span-2 space-y-5">
              {/* Card 1: Service Details */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-4.5 space-y-4 shadow-2xs">
                <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <FileText className="size-4 text-indigo-600" />
                  <h4 className="font-bold text-slate-900 text-xs tracking-wider uppercase">
                    Service Details
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Service Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={serviceName}
                      onChange={(e) => setServiceName(e.target.value)}
                      placeholder="e.g. TDS Payment (Monthly)"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Category <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    >
                      {SERVICE_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Frequency</label>
                    <select
                      value={frequency}
                      onChange={(e) => setFrequency(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {SERVICE_FREQUENCIES.map((freq) => (
                        <option key={freq} value={freq}>
                          {freq}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Difficulty</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value as ServiceFormData["difficulty"])}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {SERVICE_DIFFICULTIES.map((diff) => (
                        <option key={diff} value={diff}>
                          {diff}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="font-semibold text-slate-700">Description</label>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {description.length}/300
                    </span>
                  </div>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value.slice(0, 300))}
                    placeholder="Internal description of what this service covers..."
                    rows={2.5}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                {/* Recurring Toggle Row */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <p className="text-xs text-slate-600">
                    Is this a recurring service? Auto-generates scheduled tasks for clients.
                  </p>
                  <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                    <button
                      type="button"
                      onClick={() => setIsRecurring(true)}
                      className={`px-3 py-1 rounded-md font-semibold text-xs transition-colors cursor-pointer ${
                        isRecurring
                          ? "bg-indigo-600 text-white shadow-2xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsRecurring(false)}
                      className={`px-3 py-1 rounded-md font-semibold text-xs transition-colors cursor-pointer ${
                        !isRecurring
                          ? "bg-indigo-600 text-white shadow-2xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>

              {/* Card 2: Commercial & Tax */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-4.5 space-y-4 shadow-2xs">
                <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2">
                  <DollarSign className="size-4 text-indigo-600" />
                  <h4 className="font-bold text-slate-900 text-xs tracking-wider uppercase">
                    Commercial &amp; Tax
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Professional Fee <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={professionalFee}
                      onChange={(e) =>
                        setProfessionalFee(e.target.value === "" ? "" : Number(e.target.value))
                      }
                      placeholder="0"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Tax Rate</label>
                    <select
                      value={taxRate}
                      onChange={(e) => setTaxRate(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value={18}>18% (Standard GST)</option>
                      <option value={12}>12%</option>
                      <option value={5}>5%</option>
                      <option value={0}>0% (Exempt)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">SAC Code</label>
                    <input
                      type="text"
                      value={sacCode}
                      onChange={(e) => setSacCode(e.target.value)}
                      placeholder="e.g. 998231"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-mono placeholder:normal-case placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Exemption Reason</label>
                    <select
                      value={exemptionReason}
                      onChange={(e) => setExemptionReason(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="">None / Not Applicable</option>
                      <option value="Export of Services">Export of Services</option>
                      <option value="SEZ Unit Supply">SEZ Unit Supply</option>
                      <option value="Threshold Exemption">Threshold Exemption</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Max OOP Budget</label>
                    <input
                      type="number"
                      value={maxOopBudget}
                      onChange={(e) =>
                        setMaxOopBudget(e.target.value === "" ? "" : Number(e.target.value))
                      }
                      placeholder="0"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">TAT (days)</label>
                    <input
                      type="number"
                      value={tatDays}
                      onChange={(e) => setTatDays(e.target.value === "" ? "" : Number(e.target.value))}
                      placeholder="e.g. 3"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">TAT (hours)</label>
                    <input
                      type="text"
                      value={tatHours}
                      onChange={(e) => setTatHours(e.target.value)}
                      placeholder="00:00"
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                </div>
              </div>

              {/* Card 3: Additional Note */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-4.5 space-y-2 shadow-2xs">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-900 text-xs tracking-wider uppercase">
                    Additional Note
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">{note.length}/500</span>
                </div>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value.slice(0, 500))}
                  placeholder="Add a note about this change — it will be recorded in the activity log..."
                  rows={2}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <p className="text-[10px] text-slate-400">
                  This note is optional and will be saved to the activity log for this service.
                </p>
              </div>
            </div>

            {/* Right 1 Column: Service Checklist Guidance matching Screenshot */}
            <div className="space-y-4">
              <div className="bg-[#FAFBFD] rounded-xl border border-slate-200/80 p-4.5 space-y-3.5 shadow-2xs">
                <h4 className="font-bold text-slate-900 text-xs">Service Checklist</h4>

                <div className="space-y-3 text-slate-600 text-[11px] leading-relaxed">
                  <div>
                    <span className="font-semibold text-slate-800 block">Service Name</span>
                    <span>Required - shown in task headers and reports</span>
                  </div>

                  <div>
                    <span className="font-semibold text-slate-800 block">Category</span>
                    <span>Determines SOP, checklist and doc defaults</span>
                  </div>

                  <div>
                    <span className="font-semibold text-slate-800 block">Frequency</span>
                    <span>How often recurring tasks trigger</span>
                  </div>

                  <div>
                    <span className="font-semibold text-slate-800 block">Recurring</span>
                    <span>Turn on to auto-create tasks on schedule</span>
                  </div>

                  <div>
                    <span className="font-semibold text-slate-800 block">Professional Fee</span>
                    <span>Base fee - can be overridden per client</span>
                  </div>

                  <div>
                    <span className="font-semibold text-slate-800 block">SAC Code</span>
                    <span>Required for GST invoicing</span>
                  </div>
                </div>
              </div>

              {/* Blue Info Helper Box matching Screenshot */}
              <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-4 text-[11px] text-indigo-900 space-y-1.5 leading-relaxed">
                <span className="font-bold text-indigo-700 block">After saving</span>
                <p className="text-indigo-800/90 text-[11px]">
                  You can configure per-client pricing, add checklist items, set sub-task templates, and define document requests from the service detail page.
                </p>
              </div>
            </div>
          </div>

          {/* Modal Action Buttons Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 rounded-xl text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              {isSubmitting && <Loader2 className="size-3.5 animate-spin" />}
              <span>Save Service</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
