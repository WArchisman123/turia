"use client";

import React, { useState, useEffect } from "react";
import { X, Shield } from "lucide-react";
import { DSCFormData, DSCLocation } from "./types";
import { fetchClients } from "@/lib/api/clients";
import { ClientItem } from "@/components/clients/types";

interface AddDSCModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DSCFormData) => Promise<void>;
  initialData?: DSCFormData | null;
  mode?: "add" | "edit";
}

function getInitialDates() {
  const d = new Date();
  const todayStr = d.toISOString().slice(0, 10);
  const expD = new Date(d);
  expD.setFullYear(expD.getFullYear() + 2);
  const defaultExpStr = expD.toISOString().slice(0, 10);
  return { todayStr, defaultExpStr };
}

export function AddDSCModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  mode = "add",
}: AddDSCModalProps) {
  const [clients, setClients] = useState<ClientItem[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const [formData, setFormData] = useState<DSCFormData>(() => {
    const { todayStr, defaultExpStr } = getInitialDates();
    return {
      businessName: "",
      legalName: "",
      signatoryName: "",
      panNumber: "",
      dinNumber: "",
      vendor: "eMudhra",
      dscClass: "Class 3",
      issuedDate: todayStr,
      expiryDate: defaultExpStr,
      location: "ca_office",
      binNumber: "BIN-A01",
      status: "active",
      email: "",
      phone: "",
      tokenHardwareModel: "ePass2003",
      tokenPin: "",
      notes: "",
    };
  });

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setIsLoadingClients(true);
        fetchClients()
          .then((res) => {
            setClients(res.clients || []);
          })
          .catch((err) => console.error("Error loading clients:", err))
          .finally(() => setIsLoadingClients(false));

        if (initialData) {
          setFormData(initialData);
        } else {
          const dates = getInitialDates();
          setFormData({
            businessName: "",
            legalName: "",
            signatoryName: "",
            panNumber: "",
            dinNumber: "",
            vendor: "eMudhra",
            dscClass: "Class 3",
            issuedDate: dates.todayStr,
            expiryDate: dates.defaultExpStr,
            location: "ca_office",
            binNumber: "BIN-A01",
            status: "active",
            email: "",
            phone: "",
            tokenHardwareModel: "ePass2003",
            tokenPin: "",
            notes: "",
          });
        }
        setErrorMsg("");
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleClientSelect = (clientId: string) => {
    const selected = clients.find((c) => c.id === clientId);
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        clientId: selected.id,
        businessName: selected.tradeName,
        legalName: selected.legalName || selected.tradeName,
        email: prev.email || selected.email || "",
        phone: prev.phone || selected.mobileNo || "",
        panNumber: prev.panNumber || selected.businessPan || "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessName.trim() || !formData.signatoryName.trim()) {
      setErrorMsg("Please fill in Business Name and Signatory Name");
      return;
    }
    if (!formData.issuedDate || !formData.expiryDate) {
      setErrorMsg("Please provide both Issue Date and Expiry Date");
      return;
    }

    setIsSubmitting(true);
    setErrorMsg("");
    try {
      await onSubmit(formData);
      onClose();
    } catch (err: unknown) {
      setErrorMsg((err as Error)?.message || "Failed to save DSC record");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2.5">
            <div className="size-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Shield className="size-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {mode === "edit" ? "Edit Digital Signature Certificate" : "Register Digital Signature (DSC)"}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Cryptographic Class 3 USB token vault storage and director custody tracking
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
              {errorMsg}
            </div>
          )}

          {/* Section 1: Client & Entity Association */}
          <div className="space-y-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              1. Client Entity Association
            </h3>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Link to Client Master (Optional)
              </label>
              <select
                disabled={isLoadingClients}
                value={formData.clientId || ""}
                onChange={(e) => handleClientSelect(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              >
                <option value="">-- Choose Client or Enter Manually --</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.clientCode} — {c.tradeName} ({c.businessEntity || "Company"})
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Business / Trade Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Acme Corp"
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Legal Registered Entity Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Acme Private Limited"
                  value={formData.legalName}
                  onChange={(e) => setFormData({ ...formData, legalName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Signatory Details */}
          <div className="space-y-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              2. Signatory & Director Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Signatory Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajesh Singhania"
                  value={formData.signatoryName}
                  onChange={(e) => setFormData({ ...formData, signatoryName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  PAN Number (10 digits)
                </label>
                <input
                  type="text"
                  maxLength={10}
                  placeholder="e.g. AAAPS1234F"
                  value={formData.panNumber || ""}
                  onChange={(e) => setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white uppercase font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  DIN Number (MCA)
                </label>
                <input
                  type="text"
                  maxLength={8}
                  placeholder="e.g. 08441122"
                  value={formData.dinNumber || ""}
                  onChange={(e) => setFormData({ ...formData, dinNumber: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="director@company.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+91 98300 12345"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Certificate Specs & Expiry */}
          <div className="space-y-3 pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              3. Certificate Authority & Validity
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Certifying Vendor
                </label>
                <select
                  value={formData.vendor}
                  onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="eMudhra">eMudhra</option>
                  <option value="Capricorn">Capricorn</option>
                  <option value="VSign">VSign</option>
                  <option value="Pantasign">Pantasign</option>
                  <option value="Sify">Sify</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  DSC Class
                </label>
                <select
                  value={formData.dscClass}
                  onChange={(e) => setFormData({ ...formData, dscClass: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="Class 3">Class 3 (MCA & GST)</option>
                  <option value="Class 2">Class 2 (Legacy)</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Issued Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.issuedDate}
                  onChange={(e) => setFormData({ ...formData, issuedDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Expiry Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Physical Custody & Vault Location */}
          <div className="space-y-3 pb-2">
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              4. Vault Physical Custody & Hardware
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Custody Location
                </label>
                <select
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value as DSCLocation })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="ca_office">CA Office (Vault Bin)</option>
                  <option value="cs_office">CS Office</option>
                  <option value="client_office">Client Office</option>
                  <option value="in_transit">In Transit</option>
                  <option value="missing">Missing / Untraceable</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Vault Drawer Bin #
                </label>
                <input
                  type="text"
                  placeholder="e.g. BIN-A12"
                  value={formData.binNumber}
                  onChange={(e) => setFormData({ ...formData, binNumber: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  USB Hardware Token
                </label>
                <select
                  value={formData.tokenHardwareModel}
                  onChange={(e) => setFormData({ ...formData, tokenHardwareModel: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  <option value="ePass2003">ePass2003</option>
                  <option value="ProxKey">ProxKey</option>
                  <option value="Watchdata">Watchdata</option>
                  <option value="mToken">mToken</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Token PIN (Encrypted Vault)
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={formData.tokenPin || ""}
                  onChange={(e) => setFormData({ ...formData, tokenPin: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-medium text-slate-700 dark:text-slate-300 mb-1">
                Internal Vault Notes
              </label>
              <textarea
                rows={2}
                placeholder="Add any specific custody remarks, director instructions, or physical token serial numbers..."
                value={formData.notes || ""}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
            >
              {isSubmitting ? "Saving..." : mode === "edit" ? "Save Changes" : "Register DSC"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
