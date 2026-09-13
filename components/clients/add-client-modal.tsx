"use client";

import React, { useState } from "react";
import posthog from "posthog-js";
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  Building2,
  MapPin,
  FileCheck2,
  ChevronRight,
  UserPlus,
} from "lucide-react";
import { ClientFormData } from "./types";
import { verifyGSTIN, GSTVerificationResult } from "@/lib/gst/verifier";

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddClient: (clientData: ClientFormData) => Promise<void> | void;
}

const INDIAN_STATES_PLACE_OF_SUPPLY = [
  "West Bengal (19)",
  "Maharashtra (27)",
  "Delhi (07)",
  "Karnataka (29)",
  "Tamil Nadu (33)",
  "Gujarat (24)",
  "Uttar Pradesh (09)",
  "Haryana (06)",
  "Telangana (36)",
  "Rajasthan (08)",
  "Kerala (32)",
  "Andhra Pradesh (37)",
  "Punjab (03)",
  "Bihar (10)",
  "Odisha (21)",
  "Assam (18)",
  "Jharkhand (20)",
  "Chhattisgarh (22)",
  "Madhya Pradesh (23)",
  "Goa (30)",
  "Chandigarh (04)",
  "Uttarakhand (05)",
  "Himachal Pradesh (02)",
  "Jammu & Kashmir (01)",
  "Puducherry (34)",
  "Sikkim (11)",
];

export function AddClientModal({ isOpen, onClose, onAddClient }: AddClientModalProps) {
  const [activeSubTab, setActiveSubTab] = useState<"gst_address" | "contacts_groups" | "services">("gst_address");

  // Section 1: Business Info
  const [businessEntity, setBusinessEntity] = useState("Private Limited Company");
  const [businessName, setBusinessName] = useState("");
  const [legalName, setLegalName] = useState("");
  const [clientId, setClientId] = useState("CL-2026-101");
  const [referredBy, setReferredBy] = useState("");
  const [source, setSource] = useState("Referral");
  const [currency, setCurrency] = useState("Rupees INR ₹");
  const [clientCreationDate, setClientCreationDate] = useState("2026-09-03");

  // Section 2: GST Details
  const [gstin, setGstin] = useState("");
  const [gstinType, setGstinType] = useState("Regular Taxpayer");
  const [gstinStatus, setGstinStatus] = useState("Active");
  const [gstRegistrationDate, setGstRegistrationDate] = useState("01/07/2017");
  const [lastUpdated] = useState("03/09/2026");
  const [preference, setPreference] = useState("Monthly");

  // Section 2: Address Details
  const [placeOfSupply, setPlaceOfSupply] = useState("West Bengal (19)");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("Kolkata");
  const [country, setCountry] = useState("India");
  const [state, setState] = useState("West Bengal");
  const [pincode, setPincode] = useState("");

  // Contacts & Directors Tab
  const [contactName, setContactName] = useState("");
  const [primaryEmail, setPrimaryEmail] = useState("");
  const [primaryPhone, setPrimaryPhone] = useState("");
  const [businessPan, setBusinessPan] = useState("");
  const [registrationNo, setRegistrationNo] = useState("");
  const [clientGroup, setClientGroup] = useState("");
  const [auditor, setAuditor] = useState("Saha & Associates");

  // Services
  const [selectedServices, setSelectedServices] = useState<string[]>([
    "Statutory Audit",
    "GST Return Filing",
  ]);

  // GST Verification State
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationFeedback, setVerificationFeedback] = useState<GSTVerificationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleVerifyGstin = async () => {
    if (!gstin.trim()) return;
    setIsVerifying(true);
    setVerificationFeedback(null);

    try {
      const result = await verifyGSTIN(gstin);
      setVerificationFeedback(result);

      if (result.isValid) {
        if (result.tradeName && !businessName) setBusinessName(result.tradeName);
        if (result.legalName && !legalName) setLegalName(result.legalName);
        if (result.pan) setBusinessPan(result.pan);
        if (result.entityType) setBusinessEntity(result.entityType);
        if (result.address) setAddressLine1(result.address);
        if (result.city) setCity(result.city);
        if (result.state) {
          setState(result.state);
          const matchedPos = INDIAN_STATES_PLACE_OF_SUPPLY.find((p) =>
            p.toLowerCase().includes(result.state!.toLowerCase())
          );
          if (matchedPos) setPlaceOfSupply(matchedPos);
        }
        if (result.pincode) setPincode(result.pincode);
        if (result.taxpayerType) setGstinType(result.taxpayerType);
        if (result.status) setGstinStatus(result.status);
        if (result.registrationDate) setGstRegistrationDate(result.registrationDate);
        if (result.filingFrequency) setPreference(result.filingFrequency);
      }
    } catch (err) {
      console.error("GST verification error:", err);
    } finally {
      setIsVerifying(false);
    }
  };

  const toggleService = (srv: string) => {
    if (selectedServices.includes(srv)) {
      setSelectedServices(selectedServices.filter((s) => s !== srv));
    } else {
      setSelectedServices([...selectedServices, srv]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName || !businessEntity) return;

    setIsSubmitting(true);
    try {
      const payload: ClientFormData = {
        businessEntity,
        businessName,
        legalName: legalName || businessName,
        clientId,
        referredBy,
        source,
        currency,
        clientCreationDate,
        gstin: gstin.toUpperCase(),
        gstinType,
        gstinStatus,
        gstRegistrationDate,
        lastUpdated,
        preference,
        placeOfSupply,
        addressLine1,
        addressLine2,
        city,
        state,
        country,
        pincode,
        businessPan: businessPan || (gstin.length >= 12 ? gstin.substring(2, 12) : ""),
        registrationNo,
        primaryEmail,
        primaryPhone,
        contactName,
        clientGroup,
        auditor,
        services: selectedServices,
        labels: ["Corporate"],
      };

      await onAddClient(payload);
      posthog.capture("client_created", {
        business_entity: businessEntity,
        source,
        service_count: selectedServices.length,
      });
      onClose();
    } catch (err) {
      console.error("Failed to save client:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full my-auto overflow-hidden animate-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        {/* Modal Header & Breadcrumb */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 font-medium text-xs flex items-center gap-1 cursor-pointer"
            >
              &larr; Clients
            </button>
            <ChevronRight className="size-3 text-slate-300" />
            <h3 className="text-sm font-bold text-slate-900">Add Client</h3>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 text-xs flex-1">
          {/* Section 1: Business Info Card */}
          <div className="bg-white rounded-xl border border-slate-200/80 p-4.5 space-y-4 shadow-2xs">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
              <Building2 className="size-4 text-indigo-600" />
              <h4 className="font-bold text-slate-900 text-xs">Business Info</h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Row 1 */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Business Entity <span className="text-rose-500">*</span>
                </label>
                <select
                  value={businessEntity}
                  onChange={(e) => setBusinessEntity(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="Private Limited Company">Private Limited Company</option>
                  <option value="Limited Liability Partnership (LLP)">Limited Liability Partnership (LLP)</option>
                  <option value="Partnership Firm">Partnership Firm</option>
                  <option value="Sole Proprietorship">Sole Proprietorship</option>
                  <option value="Public Limited Company">Public Limited Company</option>
                  <option value="Trust / Society">Trust / Society</option>
                  <option value="HUF">HUF</option>
                  <option value="Foreign Entity">Foreign Entity</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Business Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="Business Name"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* Row 2 */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Legal Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={legalName}
                  onChange={(e) => setLegalName(e.target.value)}
                  placeholder="Legal Name"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Client ID</label>
                <input
                  type="text"
                  value={clientId}
                  onChange={(e) => setClientId(e.target.value)}
                  placeholder="Client ID"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Row 3 */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Referred By</label>
                <input
                  type="text"
                  value={referredBy}
                  onChange={(e) => setReferredBy(e.target.value)}
                  placeholder="Referred By"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Source</label>
                <select
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Referral">Referral</option>
                  <option value="Website">Website</option>
                  <option value="LinkedIn">LinkedIn</option>
                  <option value="Direct Walk-in">Direct Walk-in</option>
                  <option value="Bank Branch">Bank Branch</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Row 4 */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Currency <span className="text-rose-500">*</span>
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="Rupees INR ₹">Rupees INR ₹</option>
                  <option value="USD $">USD $</option>
                  <option value="EUR €">EUR €</option>
                  <option value="GBP £">GBP £</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Client Creation Date</label>
                <div className="relative">
                  <input
                    type="date"
                    value={clientCreationDate}
                    onChange={(e) => setClientCreationDate(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="border-b border-slate-200 flex items-center gap-6">
            <button
              type="button"
              onClick={() => setActiveSubTab("gst_address")}
              className={`pb-2.5 text-xs font-semibold cursor-pointer border-b-2 transition-colors ${
                activeSubTab === "gst_address"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              GST &amp; Address
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab("contacts_groups")}
              className={`pb-2.5 text-xs font-semibold cursor-pointer border-b-2 transition-colors ${
                activeSubTab === "contacts_groups"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Key Contacts &amp; Group Linking
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab("services")}
              className={`pb-2.5 text-xs font-semibold cursor-pointer border-b-2 transition-colors ${
                activeSubTab === "services"
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-500 hover:text-slate-800"
              }`}
            >
              Services &amp; Auditor Master
            </button>
          </div>

          {/* Tab 1: GST & Address 2-Pane Box */}
          {activeSubTab === "gst_address" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Box: GST Details */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-4.5 space-y-3.5 shadow-2xs">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
                    <ShieldCheck className="size-4 text-indigo-600" />
                    <span>GST Details</span>
                  </div>
                  {verificationFeedback && (
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        verificationFeedback.isValid
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-rose-50 text-rose-700 border border-rose-200"
                      }`}
                    >
                      {verificationFeedback.isValid ? "GSTIN Verified ✓" : "Invalid GSTIN"}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">GSTIN</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value.toUpperCase())}
                      placeholder="e.g. 19AAACA1122B1Z4"
                      maxLength={15}
                      className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 uppercase font-mono placeholder:normal-case placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyGstin}
                      disabled={isVerifying || !gstin}
                      className="px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-semibold rounded-lg transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shrink-0"
                    >
                      {isVerifying ? (
                        <>
                          <Loader2 className="size-3 animate-spin" />
                          <span>Verifying...</span>
                        </>
                      ) : (
                        <span>Verify</span>
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Type</label>
                  <input
                    type="text"
                    value={gstinType}
                    onChange={(e) => setGstinType(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Status</label>
                  <input
                    type="text"
                    value={gstinStatus}
                    onChange={(e) => setGstinStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">GST Registration Date</label>
                  <input
                    type="text"
                    value={gstRegistrationDate}
                    onChange={(e) => setGstRegistrationDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Last Updated</label>
                  <input
                    type="text"
                    value={lastUpdated}
                    readOnly
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 focus:outline-none cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Preference</label>
                  <input
                    type="text"
                    value={preference}
                    onChange={(e) => setPreference(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
                  />
                </div>
              </div>

              {/* Right Box: Address */}
              <div className="bg-white rounded-xl border border-slate-200/80 p-4.5 space-y-3.5 shadow-2xs">
                <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2 font-bold text-slate-900 text-xs">
                  <MapPin className="size-4 text-indigo-600" />
                  <span>Address</span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Place of Supply <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={placeOfSupply}
                    onChange={(e) => setPlaceOfSupply(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    {INDIAN_STATES_PLACE_OF_SUPPLY.map((pos) => (
                      <option key={pos} value={pos}>
                        {pos}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Address Line 1</label>
                  <input
                    type="text"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    placeholder="Address Line 1"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Address Line 2</label>
                  <input
                    type="text"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    placeholder="Address Line 2"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Country <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="India">India</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">State</label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="State"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pincode</label>
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    placeholder="Pincode"
                    maxLength={6}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Contacts & Groups */}
          {activeSubTab === "contacts_groups" && (
            <div className="bg-white rounded-xl border border-slate-200/80 p-4.5 space-y-4 shadow-2xs">
              <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2 font-bold text-slate-900 text-xs">
                <UserPlus className="size-4 text-indigo-600" />
                <span>Primary Contact Person &amp; Statutory Identifiers</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Contact Person Name / Director
                  </label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Alok Roy (Managing Director)"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Primary Email</label>
                  <input
                    type="email"
                    value={primaryEmail}
                    onChange={(e) => setPrimaryEmail(e.target.value)}
                    placeholder="accounts@clientcorp.in"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mobile No</label>
                  <input
                    type="text"
                    value={primaryPhone}
                    onChange={(e) => setPrimaryPhone(e.target.value)}
                    placeholder="+91 98300 00000"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Business PAN</label>
                  <input
                    type="text"
                    value={businessPan}
                    onChange={(e) => setBusinessPan(e.target.value.toUpperCase())}
                    placeholder="e.g. AAACA1122B"
                    maxLength={10}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 uppercase font-mono placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Registration No / CIN / LLPIN
                  </label>
                  <input
                    type="text"
                    value={registrationNo}
                    onChange={(e) => setRegistrationNo(e.target.value)}
                    placeholder="e.g. U60200WB2018PTC224455"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Client Group / Parent Entity
                  </label>
                  <input
                    type="text"
                    value={clientGroup}
                    onChange={(e) => setClientGroup(e.target.value)}
                    placeholder="e.g. Acme Group Companies"
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Services & Auditor */}
          {activeSubTab === "services" && (
            <div className="bg-white rounded-xl border border-slate-200/80 p-4.5 space-y-4 shadow-2xs">
              <div className="flex items-center gap-1.5 border-b border-slate-100 pb-2 font-bold text-slate-900 text-xs">
                <FileCheck2 className="size-4 text-indigo-600" />
                <span>Subscribed Services &amp; Appointed Auditor</span>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Appointed Statutory Auditor
                </label>
                <input
                  type="text"
                  value={auditor}
                  onChange={(e) => setAuditor(e.target.value)}
                  placeholder="e.g. Saha & Associates"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-2">
                  Active Services for this Client
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {[
                    "Statutory Audit",
                    "Tax Audit 44AB",
                    "GST Return Filing",
                    "GST Annual Reco (GSTR-9)",
                    "TDS 26Q/24Q Return",
                    "ROC Form AOC-4 / MGT-7",
                    "Transfer Pricing 3CEB",
                    "Income Tax Return (ITR-6)",
                    "Virtual CFO Advisory",
                  ].map((srv) => {
                    const isSelected = selectedServices.includes(srv);
                    return (
                      <button
                        key={srv}
                        type="button"
                        onClick={() => toggleService(srv)}
                        className={`px-3 py-2 rounded-lg text-left text-xs font-medium border transition-colors cursor-pointer flex items-center justify-between ${
                          isSelected
                            ? "bg-indigo-50 border-indigo-200 text-indigo-700 font-semibold"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        <span>{srv}</span>
                        {isSelected && <CheckCircle2 className="size-3.5 text-indigo-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Form Actions Footer */}
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
              <span>Save</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
