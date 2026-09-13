"use client";

import React, { useState, useRef } from "react";
import posthog from "posthog-js";
import {
  X,
  UploadCloud,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ChevronRight,
} from "lucide-react";
import * as XLSX from "xlsx";
import { ClientItem } from "./types";
import { importClientsFile } from "@/lib/api/clients";

interface ImportClientsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (imported: ClientItem[]) => void;
}

export function ImportClientsModal({
  isOpen,
  onClose,
  onImportSuccess,
}: ImportClientsModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<Record<string, string>[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{ count: number; skipped: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const processFile = async (file: File) => {
    setErrorMsg(null);
    setSuccessInfo(null);
    setSelectedFile(file);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json<Record<string, string>>(worksheet);

      if (!data || data.length === 0) {
        setErrorMsg("The selected spreadsheet does not contain any data rows.");
        setParsedRows([]);
        return;
      }

      setParsedRows(data);
    } catch (err: unknown) {
      console.error("Failed to parse file:", err);
      setErrorMsg("Failed to read spreadsheet file. Please upload a valid .xlsx or .csv file.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDownloadSample = async () => {
    try {
      const link = document.createElement("a");
      link.href = "/api/clients/template";
      link.setAttribute("download", "Clients_SampleData_Template.xlsx");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to download template:", err);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    setErrorMsg(null);

    try {
      const result = await importClientsFile(selectedFile);
      setSuccessInfo({
        count: result.insertedCount,
        skipped: result.skippedCount,
      });
      posthog.capture("clients_imported", {
        imported_count: result.insertedCount,
        skipped_count: result.skippedCount,
      });
      if (result.clients && result.clients.length > 0) {
        onImportSuccess(result.clients);
      }
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Import failed. Please verify the spreadsheet headers.";
      setErrorMsg(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-3xl w-full overflow-hidden animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
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
            <h3 className="text-sm font-bold text-slate-900">Import Clients</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadSample}
              className="px-3 py-1.5 border border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-semibold rounded-xl text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="size-3.5" />
              <span>Download Sample</span>
            </button>
            <button
              type="button"
              onClick={handleImport}
              disabled={!selectedFile || isProcessing || parsedRows.length === 0}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-xs transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-xs"
            >
              {isProcessing && <Loader2 className="size-3.5 animate-spin" />}
              <span>Import</span>
            </button>
            <button
              onClick={onClose}
              type="button"
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer ml-1"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Drag and Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-3 ${
              dragActive
                ? "border-indigo-500 bg-indigo-50/50"
                : "border-indigo-200 hover:border-indigo-400 bg-slate-50/40 hover:bg-indigo-50/20"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx, .xls, .csv"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="size-16 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs">
              <UploadCloud className="size-8" />
            </div>

            <div className="space-y-1">
              <p className="text-sm font-bold text-slate-800">
                Drag files here or Click to upload
              </p>
              <p className="text-[11px] text-slate-500">
                Drop files here or click browse through your machine. Supported formats: .xlsx and .csv
              </p>
            </div>
          </div>

          {/* Feedback & File Summary */}
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="size-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successInfo && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700 text-xs flex items-center gap-2">
              <CheckCircle2 className="size-4 shrink-0" />
              <span>
                Successfully imported {successInfo.count} client(s)!{" "}
                {successInfo.skipped > 0 ? `(${successInfo.skipped} skipped)` : ""}
              </span>
            </div>
          )}

          {selectedFile && parsedRows.length > 0 && (
            <div className="space-y-2 border border-slate-200 rounded-xl p-3.5 bg-white">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <FileSpreadsheet className="size-4 text-indigo-600" />
                  <span className="font-bold text-slate-800">{selectedFile.name}</span>
                  <span className="text-[10px] text-slate-400">
                    ({(selectedFile.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <span className="text-xs font-semibold text-indigo-600">
                  {parsedRows.length} Rows Detected
                </span>
              </div>

              {/* Preview Table Slice */}
              <div className="border border-slate-100 rounded-lg overflow-x-auto max-h-40 text-[11px]">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <tr>
                      <th className="px-2.5 py-1.5">Client ID</th>
                      <th className="px-2.5 py-1.5">Business Name</th>
                      <th className="px-2.5 py-1.5">Legal Name</th>
                      <th className="px-2.5 py-1.5">Entity</th>
                      <th className="px-2.5 py-1.5">GSTIN</th>
                      <th className="px-2.5 py-1.5">City</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {parsedRows.slice(0, 5).map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60">
                        <td className="px-2.5 py-1 font-mono text-[10px] text-indigo-600">
                          {row["Client ID"] || `CL-AUTO-${idx + 1}`}
                        </td>
                        <td className="px-2.5 py-1 font-medium">{row["Business Name"] || row["Legal Name"] || "-"}</td>
                        <td className="px-2.5 py-1">{row["Legal Name"] || "-"}</td>
                        <td className="px-2.5 py-1">{row["Business Entity"] || "-"}</td>
                        <td className="px-2.5 py-1 font-mono text-[10px]">{row["GSTIN"] || "-"}</td>
                        <td className="px-2.5 py-1">{row["City"] || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
