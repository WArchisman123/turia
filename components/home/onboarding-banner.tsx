"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Check, ShieldCheck, Database, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { triggerSeedDatabase, SeedResult } from "@/lib/api/home";

export function OnboardingBanner() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [isGstRegistered, setIsGstRegistered] = useState(false);
  const [gstin, setGstin] = useState("");
  const [gstVerified, setGstVerified] = useState(false);

  // Seeding State
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedResult, setSeedResult] = useState<SeedResult | null>(null);

  const handleVerifyGst = () => {
    if (gstin.length > 5) {
      setGstVerified(true);
    }
  };

  const handleSeed = async () => {
    setIsSeeding(true);
    setSeedResult(null);
    try {
      const res = await triggerSeedDatabase();
      setSeedResult(res);
      if (res.success) {
        // Refresh page after 1.5s to load seeded data across all tabs
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      }
    } catch (err) {
      console.error("Failed to seed:", err);
      setSeedResult({ success: false, message: "Error seeding database" });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-xs mb-6 overflow-hidden transition-all">
      {/* Top Progress Gauge Header */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3.5">
          {/* 60% Circular Gauge */}
          <div className="relative size-12 rounded-full bg-indigo-50 flex items-center justify-center border-2 border-indigo-200 text-indigo-700 font-bold text-xs shrink-0">
            60%
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
                Welcome to Saha &amp; Sons Practice Hub
              </h2>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                Step 3 of 5
              </span>
            </div>
            <p className="text-xs text-slate-500 font-normal mt-0.5">
              Multi-tenant CA practice active • Cloud database connected
            </p>
          </div>
        </div>

        {/* Top Action Buttons */}
        <div className="flex items-center gap-2.5">
          {/* 1-Click Database Seeding Button */}
          <button
            type="button"
            onClick={handleSeed}
            disabled={isSeeding}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white transition-all flex items-center gap-1.5 shadow-2xs cursor-pointer"
          >
            {isSeeding ? (
              <>
                <Loader2 className="size-3.5 animate-spin" />
                <span>Seeding Database...</span>
              </>
            ) : (
              <>
                <Database className="size-3.5" />
                <span>Seed Demo Database</span>
              </>
            )}
          </button>

          {/* Complete Profile Toggle Button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer",
              isExpanded
                ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                : "bg-[#6366F1] text-white hover:bg-[#4F46E5] shadow-xs"
            )}
          >
            {isExpanded ? (
              <>
                Hide Setup
                <ChevronUp className="size-3.5" />
              </>
            ) : (
              <>
                Profile Setup
                <ChevronDown className="size-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Seed Success Notification */}
      {seedResult && (
        <div
          className={`mx-5 mb-4 p-3 rounded-xl border text-xs flex items-center gap-2 animate-in fade-in duration-150 ${
            seedResult.success
              ? "bg-emerald-50 border-emerald-200 text-emerald-900"
              : "bg-rose-50 border-rose-200 text-rose-900"
          }`}
        >
          <Sparkles className="size-4 text-emerald-600 shrink-0" />
          <span>{seedResult.message} Reloading dashboard...</span>
        </div>
      )}

      {/* Expandable Stepper Wizard */}
      {isExpanded && (
        <div className="border-t border-[#E2E8F0] p-4 sm:p-6 bg-slate-50/50 animate-in fade-in duration-200">
          
          {/* Stepper Progress Bar (5 Steps) */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="flex items-center justify-between relative">
              {/* Connecting Line */}
              <div className="absolute top-4 left-6 right-6 h-0.5 bg-slate-200 -z-0" />

              {[
                { step: 1, label: "Organization profile" },
                { step: 2, label: "Bank Account" },
                { step: 3, label: "Invoice" },
                { step: 4, label: "Business Hours" },
                { step: 5, label: "Integration" },
              ].map((s) => {
                const isActive = s.step === currentStep;
                const isCompleted = s.step < currentStep;

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
                      {isCompleted ? <Check className="size-3.5" /> : s.step}
                    </div>
                    <span
                      className={cn(
                        "text-[11px] font-medium hidden sm:block text-center max-w-[100px]",
                        isActive ? "text-indigo-600 font-bold" : "text-slate-500"
                      )}
                    >
                      {s.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Content: Step 1 Organization Profile */}
          {currentStep === 1 && (
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-5 sm:p-6 space-y-4 max-w-5xl mx-auto shadow-xs text-xs">
              {/* Row 1 */}
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
                    defaultValue="Saha & Sons CA Practice"
                    className="w-full h-9 px-3 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-medium text-slate-700 block mb-1">
                    Business Email<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    defaultValue="contact@sahaandsons.in"
                    className="w-full h-9 px-3 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">
                    Contact Number<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    defaultValue="+91 33 2288 4400"
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

              {/* Row 3 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">
                    Business Type<span className="text-red-500">*</span>
                  </label>
                  <select className="w-full h-9 px-3 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white">
                    <option>Chartered Accountant Practice</option>
                    <option>Tax Advisory &amp; Compliance</option>
                    <option>Audit &amp; Assurance</option>
                  </select>
                </div>

                <div>
                  <label className="font-medium text-slate-700 block mb-1">
                    Address Line 1<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    defaultValue="Suite 402, Trinity Tower, Topsia Road"
                    className="w-full h-9 px-3 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-medium text-slate-700 block mb-1">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    defaultValue="Near Science City"
                    className="w-full h-9 px-3 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Row 4 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">
                    City<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    defaultValue="Kolkata"
                    className="w-full h-9 px-3 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="font-medium text-slate-700 block mb-1">
                    Country<span className="text-red-500">*</span>
                  </label>
                  <select className="w-full h-9 px-3 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white">
                    <option>India</option>
                  </select>
                </div>

                <div>
                  <label className="font-medium text-slate-700 block mb-1">
                    State<span className="text-red-500">*</span>
                  </label>
                  <select className="w-full h-9 px-3 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white">
                    <option>West Bengal</option>
                    <option>Maharashtra</option>
                    <option>Delhi</option>
                    <option>Karnataka</option>
                    <option>Gujarat</option>
                  </select>
                </div>
              </div>

              {/* GST Section */}
              <div className="pt-2 border-t border-slate-100 flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="gstToggle"
                    checked={isGstRegistered}
                    onChange={(e) => setIsGstRegistered(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500 size-4 cursor-pointer"
                  />
                  <label htmlFor="gstToggle" className="font-medium text-slate-700 cursor-pointer">
                    Is GST Registered
                  </label>
                </div>

                <div className="flex-1 flex items-center gap-2 w-full md:w-auto">
                  <input
                    type="text"
                    placeholder="GSTIN (e.g. 19AACFS1234F1Z8)"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    disabled={!isGstRegistered}
                    className="flex-1 h-9 px-3 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-50 disabled:cursor-not-allowed uppercase font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyGst}
                    disabled={!isGstRegistered || gstin.length < 5}
                    className="h-9 px-3.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-semibold rounded-lg transition-colors flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
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

              {/* Actions Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  disabled={currentStep === 1}
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
                    onClick={() => setCurrentStep(Math.min(currentStep + 1, 5))}
                    className="px-5 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold rounded-lg shadow-xs cursor-pointer"
                  >
                    Save &amp; Next
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Placeholder for Steps 2-5 */}
          {currentStep > 1 && (
            <div className="bg-white rounded-xl border border-[#E2E8F0] p-8 text-center max-w-5xl mx-auto shadow-xs text-xs">
              <h4 className="font-bold text-slate-800 text-sm mb-1">
                Step {currentStep} Configuration
              </h4>
              <p className="text-slate-500 mb-4">
                Configure your organization details for statutory CA practice operations.
              </p>
              <button
                onClick={() => setCurrentStep(1)}
                className="px-4 py-1.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg font-medium cursor-pointer"
              >
                Back to Step 1
              </button>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
