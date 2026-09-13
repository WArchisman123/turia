"use client";

import React, { useState } from "react";
import { X, UploadCloud, FileSpreadsheet, Download, CheckCircle2, Loader2, ArrowRight } from "lucide-react";
import { LeadItem } from "./types";

interface ImportLeadsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportLeads: (leads: LeadItem[]) => void;
}

export function ImportLeadsModal({ isOpen, onClose, onImportLeads }: ImportLeadsModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);
  const [importedCount, setImportedCount] = useState(0);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDownloadSample = () => {
    const headers = [
      "Lead Code",
      "Lead / Trade Name",
      "Contact Person",
      "Business Entity",
      "Deal Value (INR)",
      "Stage",
      "Score (0-100)",
      "Assigned To",
      "Source",
      "Phone",
      "Email",
      "GSTIN",
      "PAN",
      "City",
      "State",
      "Service Interest",
      "Notes"
    ];

    const sampleRow = [
      "LEAD-2026-009",
      "Kolkata Industrial Tech LLP",
      "Alok Chatterjee (Partner)",
      "Limited Liability Partnership (LLP)",
      "350000",
      "Proposal Sent",
      "82",
      "Vikram Saha",
      "Referral",
      "+91 98310 55443",
      "alok@kolkataindustrial.in",
      "19AABCK9988D1Z2",
      "AABCK9988D",
      "Kolkata",
      "West Bengal",
      "Statutory Audit & Tax Audit 44AB",
      "ROC annual compliance + LLP Form 11 filing"
    ];

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), sampleRow.join(",")].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "TURIA_Leads_Import_Template.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleProcessImport = () => {
    if (!selectedFile) return;
    setIsProcessing(true);

    setTimeout(() => {
      const mockBatchLeads: LeadItem[] = [
        {
          id: `LD-IMP-${Date.now().toString().slice(-4)}1`,
          leadCode: `LEAD-2026-101`,
          leadName: "Zenith Agro Exports Pvt Ltd",
          contactPerson: "Rameshwar Patel",
          businessEntity: "Private Limited Company",
          dealValue: 750000,
          currency: "INR",
          stage: "Proposal Sent",
          status: "Open",
          score: 88,
          assignedTo: "archi",
          source: "Referral",
          serviceInterest: "Statutory Audit & Transfer Pricing",
          createdDate: "08-Sep-2026",
          phone: "+91 98200 44332",
          email: "rpatel@zenithagro.com",
          gstin: "27AABCZ1234F1Z8",
          pan: "AABCZ1234F",
          city: "Mumbai",
          state: "Maharashtra",
          notes: "Large agro exporter requiring statutory audit and form 3CEB filing.",
        },
        {
          id: `LD-IMP-${Date.now().toString().slice(-4)}2`,
          leadCode: `LEAD-2026-102`,
          leadName: "Bengal Logistics & Warehousing LLP",
          contactPerson: "Soumitra Banerjee",
          businessEntity: "Limited Liability Partnership (LLP)",
          dealValue: 320000,
          currency: "INR",
          stage: "Contacted",
          status: "Open",
          score: 72,
          assignedTo: "Priya Mukherjee",
          source: "Website",
          serviceInterest: "GST Return Filing & Reco",
          createdDate: "08-Sep-2026",
          phone: "+91 98300 77665",
          email: "soumitra@bengallogistics.in",
          gstin: "19AABCB8877K1Z4",
          pan: "AABCB8877K",
          city: "Kolkata",
          state: "West Bengal",
          notes: "Monthly GSTR-1, GSTR-3B and e-way bill reconciliation.",
        },
        {
          id: `LD-IMP-${Date.now().toString().slice(-4)}3`,
          leadCode: `LEAD-2026-103`,
          leadName: "Pinnacle MedTech Labs Pvt Ltd",
          contactPerson: "Dr. Ananya Roy",
          businessEntity: "Private Limited Company",
          dealValue: 900000,
          currency: "INR",
          stage: "Negotiation",
          status: "Open",
          score: 91,
          assignedTo: "Vikram Saha",
          source: "LinkedIn",
          serviceInterest: "Full Retainership CA Suite",
          createdDate: "08-Sep-2026",
          phone: "+91 98450 11223",
          email: "finance@pinnaclemedtech.com",
          gstin: "29AABCP5544M1Z9",
          pan: "AABCP5544M",
          city: "Bengaluru",
          state: "Karnataka",
          notes: "Series A funded startup requiring full outsourced CFO and statutory audit.",
        },
      ];

      setIsProcessing(false);
      setImportSuccess(true);
      setImportedCount(mockBatchLeads.length);
      onImportLeads(mockBatchLeads);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <FileSpreadsheet className="size-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Batch Import Leads</h3>
              <p className="text-[11px] text-slate-500">Upload CSV or XLSX spreadsheet to bulk import leads</p>
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

        {/* Body */}
        <div className="p-6 space-y-4">
          {importSuccess ? (
            <div className="text-center py-6 space-y-3">
              <div className="size-12 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="size-6" />
              </div>
              <h4 className="text-sm font-bold text-slate-900">Batch Import Completed Successfully!</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Successfully parsed and imported <strong>{importedCount} new qualified leads</strong> into the pipeline.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  View in Pipeline <ArrowRight className="size-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Drag and Drop Zone */}
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors ${
                  dragActive
                    ? "border-indigo-500 bg-indigo-50/50"
                    : selectedFile
                    ? "border-emerald-400 bg-emerald-50/30"
                    : "border-slate-200 hover:border-indigo-300 bg-slate-50/50"
                }`}
              >
                <input
                  type="file"
                  id="file-upload"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label htmlFor="file-upload" className="cursor-pointer block">
                  <div className="size-10 rounded-full bg-white shadow-xs border border-slate-200 text-indigo-600 flex items-center justify-center mx-auto mb-2">
                    <UploadCloud className="size-5" />
                  </div>
                  {selectedFile ? (
                    <div>
                      <p className="text-xs font-bold text-slate-800">{selectedFile.name}</p>
                      <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                        {(selectedFile.size / 1024).toFixed(1)} KB • Ready to parse
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-semibold text-slate-700">
                        <span className="text-indigo-600 hover:underline">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        Supported formats: .CSV, .XLSX, .XLS (Up to 10MB)
                      </p>
                    </div>
                  )}
                </label>
              </div>

              {/* Sample Template Download */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="size-4 text-emerald-600" />
                  <div>
                    <span className="text-xs font-semibold text-slate-800 block leading-tight">
                      Need the standard format?
                    </span>
                    <span className="text-[10px] text-slate-400">Download the TURIA CSV import template</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadSample}
                  className="px-2.5 py-1 text-[11px] font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Download className="size-3" /> Template
                </button>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleProcessImport}
                  disabled={!selectedFile || isProcessing}
                  className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="size-3.5 animate-spin" />
                      Parsing &amp; Importing...
                    </>
                  ) : (
                    <>
                      <UploadCloud className="size-3.5" />
                      Import Leads
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
