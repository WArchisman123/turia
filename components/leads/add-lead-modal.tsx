"use client";

import React, { useState } from "react";
import posthog from "posthog-js";
import {
  X,
  UserPlus,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Send,
} from "lucide-react";
import { LeadItem, LeadStage, LeadSource } from "./types";
import { verifyGSTIN, GSTVerificationResult } from "@/lib/gst/verifier";

interface AddLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLead: (lead: LeadItem) => void;
}

export function AddLeadModal({ isOpen, onClose, onAddLead }: AddLeadModalProps) {
  // Form State
  const [leadName, setLeadName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [businessEntity, setBusinessEntity] = useState("Private Limited Company");
  const [gstin, setGstin] = useState("");
  const [pan, setPan] = useState("");

  const [dealValue, setDealValue] = useState<number | "">(450000);
  const [serviceInterest, setServiceInterest] = useState("Statutory Audit & Tax Audit 44AB");

  const [source, setSource] = useState<LeadSource>("Referral");
  const [stage, setStage] = useState<LeadStage>("New");
  const [score, setScore] = useState(75);
  const [assignedTo, setAssignedTo] = useState("archi");

  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Kolkata");
  const [state, setState] = useState("West Bengal");
  const [notes, setNotes] = useState("Prospect requested statutory audit and GSTR-9 annual reconciliation quotation");

  // GST Verification State
  const [isVerifyingGstin, setIsVerifyingGstin] = useState(false);
  const [gstinFeedback, setGstinFeedback] = useState<GSTVerificationResult | null>(null);

  if (!isOpen) return null;

  const handleVerifyGSTIN = async () => {
    if (!gstin) return;
    setIsVerifyingGstin(true);
    setGstinFeedback(null);

    const result = await verifyGSTIN(gstin);
    setGstinFeedback(result);
    setIsVerifyingGstin(false);

    if (result.isValid) {
      if (result.tradeName && !leadName) setLeadName(result.tradeName);
      if (result.pan) setPan(result.pan);
      if (result.entityType) setBusinessEntity(result.entityType);
      if (result.address) setAddress(result.address);
      if (result.city) setCity(result.city);
      if (result.state) setState(result.state);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName || !contactPerson) return;

    const newLead: LeadItem = {
      id: `LD-${Date.now().toString().slice(-4)}`,
      leadCode: `LEAD-2026-${Date.now().toString().slice(-3)}`,
      leadName,
      contactPerson,
      businessEntity,
      dealValue: Number(dealValue) || 0,
      currency: "INR",
      stage,
      status: "Open",
      score,
      assignedTo,
      source,
      serviceInterest,
      createdDate: "08-Sep-2026",
      phone: phone.startsWith("+91") ? phone : `+91 ${phone || "98300 00000"}`,
      email: email || "info@clientcorp.in",
      gstin: gstin.toUpperCase(),
      pan: pan.toUpperCase(),
      city,
      state,
      notes,
    };

    onAddLead(newLead);
    posthog.capture("lead_created", {
      business_entity: businessEntity,
      deal_value: Number(dealValue) || 0,
      source,
      stage,
      service_interest: serviceInterest,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full my-8 overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <UserPlus className="size-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Add New Prospect Lead</h3>
              <p className="text-[11px] text-slate-500">Capture lead info, live GST verification &amp; pipeline stage</p>
            </div>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Modal Form with 5 Structured Sections */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 text-xs max-h-[75vh] overflow-y-auto">
          {/* Section 1: Lead Information */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-1.5">
              <span className="size-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center">
                1
              </span>
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                Lead Basic Details
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Lead / Entity Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder="e.g. Apex FinTech Solutions Pvt Ltd"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Primary Contact Person <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder="e.g. Rajesh Singhania (Director)"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="finance@apexfintech.com"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mobile Number (IN +91)</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="98310 99881"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Business & Statutory Details (Live GSTIN Verification) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-1.5">
              <span className="size-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center">
                2
              </span>
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                Statutory &amp; Live GSTIN Verification
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Business Entity Type</label>
                <select
                  value={businessEntity}
                  onChange={(e) => setBusinessEntity(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Private Limited Company">Private Limited Company</option>
                  <option value="Limited Liability Partnership (LLP)">Limited Liability Partnership (LLP)</option>
                  <option value="Public Limited Company">Public Limited Company</option>
                  <option value="Sole Proprietorship">Sole Proprietorship</option>
                  <option value="Partnership Firm">Partnership Firm</option>
                  <option value="Trust / Society">Trust / Society</option>
                </select>
              </div>

              {/* GSTIN Input with Live Verify Button */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  GSTIN (15 Digits)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    maxLength={15}
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value.toUpperCase())}
                    placeholder="19AAACB1234F1Z5"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono uppercase"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyGSTIN}
                    disabled={isVerifyingGstin || !gstin}
                    className="px-3 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer whitespace-nowrap flex items-center gap-1.5"
                  >
                    {isVerifyingGstin ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <ShieldCheck className="size-3.5" />
                    )}
                    Verify
                  </button>
                </div>
              </div>
            </div>

            {/* GST Verification Status Box */}
            {gstinFeedback && (
              <div
                className={`p-3 rounded-xl border text-[11px] leading-relaxed flex items-start gap-2 ${
                  gstinFeedback.isValid
                    ? "bg-emerald-50 border-emerald-200 text-emerald-900"
                    : "bg-rose-50 border-rose-200 text-rose-900"
                }`}
              >
                {gstinFeedback.isValid ? (
                  <CheckCircle2 className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="size-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  {gstinFeedback.isValid ? (
                    <>
                      <strong>Live GSTIN Verified:</strong> {gstinFeedback.tradeName} |{" "}
                      {gstinFeedback.entityType} ({gstinFeedback.state}) • Taxpayer:{" "}
                      {gstinFeedback.taxpayerType}
                    </>
                  ) : (
                    <>
                      <strong>Verification Failed:</strong> {gstinFeedback.error}
                    </>
                  )}
                </div>
              </div>
            )}

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Permanent Account Number (PAN)</label>
              <input
                type="text"
                maxLength={10}
                value={pan}
                onChange={(e) => setPan(e.target.value.toUpperCase())}
                placeholder="ABCDE1234F"
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono uppercase"
              />
            </div>
          </div>

          {/* Section 3: Commercials & Engagement */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-1.5">
              <span className="size-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center">
                3
              </span>
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                Commercial Value &amp; Services
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Estimated Deal Value (₹) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-slate-400 font-bold">₹</span>
                  <input
                    type="number"
                    value={dealValue}
                    onChange={(e) => setDealValue(e.target.value === "" ? "" : Number(e.target.value))}
                    placeholder="450000"
                    className="w-full pl-7 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Service Interest</label>
                <select
                  value={serviceInterest}
                  onChange={(e) => setServiceInterest(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Statutory Audit & Tax Audit 44AB">Statutory Audit &amp; Tax Audit 44AB</option>
                  <option value="GST Return Filing & Reco">GST Return Filing &amp; Reco (GSTR-3B/1/9)</option>
                  <option value="ROC & MCA Annual Compliance">ROC &amp; MCA Annual Compliance (AOC-4, MGT-7)</option>
                  <option value="International Tax & Transfer Pricing">International Tax &amp; Transfer Pricing</option>
                  <option value="Direct Tax Representation & Appeals">Direct Tax Representation &amp; Appeals</option>
                  <option value="Full Retainership CA Suite">Full Retainership CA Suite</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Acquisition & Pipeline Allocation */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-1.5">
              <span className="size-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center">
                4
              </span>
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                Pipeline Allocation &amp; Source
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Lead Source</label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value as LeadSource)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Referral">Client Referral</option>
                  <option value="Website">Inbound Website</option>
                  <option value="LinkedIn">LinkedIn Outreach</option>
                  <option value="Direct Walk-in">Direct Walk-in</option>
                  <option value="MCA Data">MCA Data Mining</option>
                  <option value="Partner Network">Partner Network</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Stage</label>
                <select
                  value={stage}
                  onChange={(e) => setStage(e.target.value as LeadStage)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Proposal Sent">Proposal Sent</option>
                  <option value="Negotiation">Negotiation</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Lead Score (0-100)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={score}
                  onChange={(e) => setScore(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-indigo-700"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Assigned Partner / Associate</label>
                <select
                  value={assignedTo}
                  onChange={(e) => setAssignedTo(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="archi">archi (Partner)</option>
                  <option value="Vikram Saha">Vikram Saha (Managing Partner)</option>
                  <option value="Priya Mukherjee">Priya Mukherjee (Manager)</option>
                  <option value="Rahul Verma">Rahul Verma (Associate)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 5: Address & Notes */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-1.5">
              <span className="size-5 rounded-full bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center justify-center">
                5
              </span>
              <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">
                Address &amp; Practitioner Notes
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-3">
                <label className="block font-semibold text-slate-700 mb-1">Registered Address</label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Plot 14, Salt Lake Sector V"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">State / Place of Supply</label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Country</label>
                <input
                  type="text"
                  disabled
                  value="India"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block font-semibold text-slate-700 mb-1">Practitioner Remarks / Follow-up Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                />
              </div>
            </div>
          </div>

          {/* Footer actions */}
          <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100 sticky bottom-0 bg-white py-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <Send className="size-3.5" />
              Save &amp; Create Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
