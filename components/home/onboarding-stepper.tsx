"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Check,
  ShieldCheck,
  Building,
  CreditCard,
  FileText,
  Clock,
  Layers,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function OnboardingStepper() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([1]);

  // Step 1 State
  const [isGstRegistered, setIsGstRegistered] = useState(true);
  const [gstin, setGstin] = useState("27AABCU9603R1ZM");
  const [gstVerified, setGstVerified] = useState(true);

  // Step 2 State
  const [bankName, setBankName] = useState("HDFC Bank Ltd");
  const [accountNumber, setAccountNumber] = useState("50200049281729");
  const [ifscCode, setIfscCode] = useState("HDFC0000123");
  const [upiId, setUpiId] = useState("sahasans.ca@okhdfcbank");

  // Step 3 State
  const [invoicePrefix, setInvoicePrefix] = useState("TURIA/2026-27/");
  const [proformaPrefix, setProformaPrefix] = useState("PI/2026-27/");
  const [paymentTerms, setPaymentTerms] = useState("Due on Receipt");
  const [enableUpiQr, setEnableUpiQr] = useState(true);

  // Step 4 State
  const [workDays, setWorkDays] = useState("Monday - Saturday");
  const [shiftHours, setShiftHours] = useState("10:00 AM - 07:00 PM");
  const [geofenceRadius, setGeofenceRadius] = useState(150);

  // Step 5 State
  const [enableWhatsapp, setEnableWhatsapp] = useState(true);
  const [enableEmailSmtp, setEnableEmailSmtp] = useState(true);
  const [enableAiOcr, setEnableAiOcr] = useState(true);

  // Calculate dynamic progress percentage
  const progressPercent = Math.round((completedSteps.length / 5) * 100);

  const handleNext = () => {
    if (!completedSteps.includes(currentStep)) {
      setCompletedSteps([...completedSteps, currentStep]);
    }
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      if (!completedSteps.includes(5)) {
        setCompletedSteps([...completedSteps, 5]);
      }
      setIsExpanded(false);
    }
  };

  const STEPS = [
    { step: 1, label: "Organization profile", icon: Building },
    { step: 2, label: "Bank Account", icon: CreditCard },
    { step: 3, label: "Invoice", icon: FileText },
    { step: 4, label: "Business Hours", icon: Clock },
    { step: 5, label: "Integration", icon: Layers },
  ];

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs mb-6 overflow-hidden transition-all">
      {/* Top Banner Gauge */}
      <div className="p-4 sm:p-5 flex items-center justify-between gap-4 bg-white">
        <div className="flex items-center gap-3.5">
          {/* Circular Progress Gauge */}
          <div className="relative size-12 rounded-full bg-slate-100 flex items-center justify-center border-2 border-indigo-200 text-slate-800 font-bold text-xs shadow-xs">
            {progressPercent}%
            {progressPercent === 100 && (
              <span className="absolute -top-1 -right-1 size-4 bg-emerald-500 text-white rounded-full flex items-center justify-center text-[10px]">
                ✓
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                Welcome archi
              </h2>
              {progressPercent < 100 && (
                <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-100">
                  {5 - completedSteps.length} Steps Remaining
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              Complete firm profile setup for statutory compliance and client billing
            </p>
          </div>
        </div>

        {/* Complete Profile Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            "px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs",
            isExpanded
              ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
              : "bg-[#6366F1] text-white hover:bg-[#4F46E5]"
          )}
        >
          {isExpanded ? (
            <>
              Hide Stepper
              <ChevronUp className="size-3.5" />
            </>
          ) : (
            <>
              Complete Profile
              <ChevronDown className="size-3.5" />
            </>
          )}
        </button>
      </div>

      {/* Expandable Stepper Wizard */}
      {isExpanded && (
        <div className="border-t border-[#E2E8F0] p-4 sm:p-6 bg-slate-50/50 animate-in fade-in duration-200">
          
          {/* Stepper Header (5 Steps) */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0" />

              {STEPS.map((s) => {
                const isActive = s.step === currentStep;
                const isCompleted = completedSteps.includes(s.step);

                return (
                  <div
                    key={s.step}
                    onClick={() => setCurrentStep(s.step)}
                    className="flex flex-col items-center gap-1.5 z-10 cursor-pointer group"
                  >
                    <div
                      className={cn(
                        "size-8 rounded-full flex items-center justify-center text-xs font-bold transition-all border-2",
                        isActive
                          ? "bg-[#6366F1] text-white border-[#6366F1] shadow-sm"
                          : isCompleted
                          ? "bg-emerald-500 text-white border-emerald-500"
                          : "bg-white text-slate-500 border-slate-300 group-hover:border-indigo-300"
                      )}
                    >
                      {isCompleted && !isActive ? (
                        <Check className="size-3.5" />
                      ) : (
                        s.step
                      )}
                    </div>
                    <span
                      className={cn(
                        "text-[11px] font-medium hidden sm:block text-center max-w-[100px]",
                        isActive
                          ? "text-indigo-600 font-bold"
                          : isCompleted
                          ? "text-emerald-600 font-semibold"
                          : "text-slate-500"
                      )}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Container */}
          <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 sm:p-6 max-w-5xl mx-auto shadow-xs text-xs space-y-4">
            
            {/* ================= STEP 1: ORGANIZATION PROFILE ================= */}
            {currentStep === 1 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                  <h4 className="font-bold text-slate-800 text-sm">
                    1. Organization Profile &amp; Statutory Registration
                  </h4>
                  <span className="text-slate-400">Step 1 of 5</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="font-medium text-slate-700 block mb-1">
                      Business Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      defaultValue="saha and sons"
                      className="w-full h-9 px-3 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-slate-700 block mb-1">
                      Brand Name
                    </label>
                    <input
                      type="text"
                      placeholder="Enter Brand Name"
                      defaultValue="Saha &amp; Sons CA"
                      className="w-full h-9 px-3 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-slate-700 block mb-1">
                      Business Email<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      defaultValue="arch.sas.123@gmail.com"
                      className="w-full h-9 px-3 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="font-medium text-slate-700 block mb-1">
                      Contact Number<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      defaultValue="8777431358"
                      className="w-full h-9 px-3 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-slate-700 block mb-1">
                      Currency<span className="text-red-500">*</span>
                    </label>
                    <select className="w-full h-9 px-3 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white">
                      <option>Rupees INR ₹</option>
                      <option>USD $</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-medium text-slate-700 block mb-1">
                      Business Entity<span className="text-red-500">*</span>
                    </label>
                    <select className="w-full h-9 px-3 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white">
                      <option>Partnership Firm</option>
                      <option>Sole Proprietorship</option>
                      <option>LLP</option>
                      <option>Private Limited</option>
                      <option>Individual CA Practice</option>
                    </select>
                  </div>
                </div>

                {/* GST Verification Strip */}
                <div className="pt-2 border-t border-slate-100 flex flex-col md:flex-row items-start md:items-center gap-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="gstToggleStep"
                      checked={isGstRegistered}
                      onChange={(e) => setIsGstRegistered(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500 size-4 cursor-pointer"
                    />
                    <label
                      htmlFor="gstToggleStep"
                      className="font-medium text-slate-700 cursor-pointer"
                    >
                      Is GST Registered
                    </label>
                  </div>

                  <div className="flex-1 flex items-center gap-2 w-full md:w-auto">
                    <input
                      type="text"
                      placeholder="GSTIN (e.g. 27AABCU9603R1ZM)"
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value)}
                      disabled={!isGstRegistered}
                      className="flex-1 h-9 px-3 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-50 disabled:cursor-not-allowed uppercase font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setGstVerified(true)}
                      disabled={!isGstRegistered || gstin.length < 5}
                      className="h-9 px-3.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      {gstVerified ? (
                        <>
                          <ShieldCheck className="size-4 text-emerald-600" />
                          <span className="text-emerald-700">Verified</span>
                        </>
                      ) : (
                        "Verify"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ================= STEP 2: BANK ACCOUNT ================= */}
            {currentStep === 2 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                  <h4 className="font-bold text-slate-800 text-sm">
                    2. Primary Bank Account &amp; UPI Payment Instructions
                  </h4>
                  <span className="text-slate-400">Step 2 of 5</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-medium text-slate-700 block mb-1">
                      Bank Name<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full h-9 px-3 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-slate-700 block mb-1">
                      Account Number<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="w-full h-9 px-3 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-slate-700 block mb-1">
                      IFSC Code<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={ifscCode}
                      onChange={(e) => setIfscCode(e.target.value)}
                      className="w-full h-9 px-3 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono uppercase"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-slate-700 block mb-1">
                      Firm UPI ID for Instant Fee Receipts
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      className="w-full h-9 px-3 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ================= STEP 3: INVOICE SETTINGS ================= */}
            {currentStep === 3 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                  <h4 className="font-bold text-slate-800 text-sm">
                    3. Commercial Billing &amp; Tax Invoice Configuration
                  </h4>
                  <span className="text-slate-400">Step 3 of 5</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-medium text-slate-700 block mb-1">
                      Tax Invoice Number Prefix
                    </label>
                    <input
                      type="text"
                      value={invoicePrefix}
                      onChange={(e) => setInvoicePrefix(e.target.value)}
                      className="w-full h-9 px-3 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-slate-700 block mb-1">
                      Proforma Invoice Prefix
                    </label>
                    <input
                      type="text"
                      value={proformaPrefix}
                      onChange={(e) => setProformaPrefix(e.target.value)}
                      className="w-full h-9 px-3 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-slate-700 block mb-1">
                      Standard Payment Terms
                    </label>
                    <select
                      value={paymentTerms}
                      onChange={(e) => setPaymentTerms(e.target.value)}
                      className="w-full h-9 px-3 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                    >
                      <option>Due on Receipt</option>
                      <option>Net 15 Days</option>
                      <option>Net 30 Days</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2 pt-6">
                    <input
                      type="checkbox"
                      id="qrToggle"
                      checked={enableUpiQr}
                      onChange={(e) => setEnableUpiQr(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500 size-4 cursor-pointer"
                    />
                    <label
                      htmlFor="qrToggle"
                      className="font-medium text-slate-700 cursor-pointer"
                    >
                      Print Dynamic UPI QR Code on Invoices
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* ================= STEP 4: BUSINESS HOURS & GEOFENCE ================= */}
            {currentStep === 4 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                  <h4 className="font-bold text-slate-800 text-sm">
                    4. Office Hours &amp; GPS Geofenced Attendance Radius
                  </h4>
                  <span className="text-slate-400">Step 4 of 5</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="font-medium text-slate-700 block mb-1">
                      Working Days
                    </label>
                    <input
                      type="text"
                      value={workDays}
                      onChange={(e) => setWorkDays(e.target.value)}
                      className="w-full h-9 px-3 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-slate-700 block mb-1">
                      Standard Shift Hours
                    </label>
                    <input
                      type="text"
                      value={shiftHours}
                      onChange={(e) => setShiftHours(e.target.value)}
                      className="w-full h-9 px-3 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="font-medium text-slate-700 block mb-1">
                      GPS Geofencing Radius (Meters)
                    </label>
                    <input
                      type="number"
                      value={geofenceRadius}
                      onChange={(e) => setGeofenceRadius(Number(e.target.value))}
                      className="w-full h-9 px-3 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ================= STEP 5: INTEGRATION ================= */}
            {currentStep === 5 && (
              <div className="space-y-4 animate-in fade-in">
                <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                  <h4 className="font-bold text-slate-800 text-sm">
                    5. Statutory Integrations &amp; AI Notice Assistants
                  </h4>
                  <span className="text-slate-400">Step 5 of 5</span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 block">
                        WhatsApp Client Communication Gateway
                      </span>
                      <p className="text-[11px] text-slate-500">
                        Automate filing acknowledgments, proforma invoices, and payment reminders.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={enableWhatsapp}
                      onChange={(e) => setEnableWhatsapp(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500 size-4 cursor-pointer"
                    />
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 block">
                        Email SMTP Delivery Service
                      </span>
                      <p className="text-[11px] text-slate-500">
                        Dispatch signed tax audit reports and billing statements from firm domain.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={enableEmailSmtp}
                      onChange={(e) => setEnableEmailSmtp(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500 size-4 cursor-pointer"
                    />
                  </div>

                  <div className="p-3 bg-indigo-50/50 border border-indigo-200 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="font-bold text-indigo-900 flex items-center gap-1.5">
                        <Sparkles className="size-3.5 text-indigo-600" />
                        AI Statutory Notice &amp; OCR Assistant (TURIA Agents)
                      </span>
                      <p className="text-[11px] text-indigo-700">
                        Auto-extract section numbers, demand amounts, and appeal deadlines from IT/GST notices.
                      </p>
                    </div>
                    <input
                      type="checkbox"
                      checked={enableAiOcr}
                      onChange={(e) => setEnableAiOcr(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500 size-4 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Stepper Footer Navigation */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                disabled={currentStep === 1}
                onClick={() => setCurrentStep(Math.max(currentStep - 1, 1))}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-slate-50 disabled:opacity-40 cursor-pointer font-medium"
              >
                Previous
              </button>

              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
                >
                  Skip
                </button>
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-lg font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-5 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  {currentStep === 5 ? "Complete Setup ✓" : "Save & Next →"}
                </button>
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
}
