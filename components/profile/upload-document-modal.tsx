"use client";

import React, { useState } from "react";
import { X, UploadCloud, FileCheck, Plus } from "lucide-react";

export interface EmployeeKYCDocument {
  id: string;
  name: string;
  category: string;
  fileName: string;
  uploadDate: string;
  fileSize: string;
  verified: boolean;
}

interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (doc: EmployeeKYCDocument) => void;
}

export function UploadDocumentModal({
  isOpen,
  onClose,
  onUpload,
}: UploadDocumentModalProps) {
  const [docName, setDocName] = useState("");
  const [category, setCategory] = useState("ICAI Form 102/103 Articleship Deed");
  const [fileName, setFileName] = useState("icai_form_103_registered_deed.pdf");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName) return;

    const newDoc: EmployeeKYCDocument = {
      id: `DOC-${Date.now().toString().slice(-4)}`,
      name: docName,
      category,
      fileName,
      uploadDate: "08-Sep-2026",
      fileSize: "1.8 MB",
      verified: true,
    };

    onUpload(newDoc);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <FileCheck className="size-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Upload KYC Document</h3>
              <p className="text-[11px] text-slate-500">Add statutory identification & articleship records</p>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Document Title */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Document Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={docName}
              onChange={(e) => setDocName(e.target.value)}
              placeholder="e.g. Form 103 Articleship Registration Letter"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          {/* Category */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Document Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="ICAI Form 102/103 Articleship Deed">
                ICAI Form 102/103 Articleship Deed
              </option>
              <option value="PAN Card Copy">PAN Card Copy</option>
              <option value="Aadhaar Card Copy">Aadhaar Card Copy</option>
              <option value="ICAI Membership / Reg Certificate">
                ICAI Membership / Reg Certificate
              </option>
              <option value="Educational Degrees & Marksheets">
                Educational Degrees & Marksheets
              </option>
              <option value="Employment Agreement / NDA">
                Employment Agreement / NDA
              </option>
            </select>
          </div>

          {/* Drag and Drop Zone */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Upload File</label>
            <div className="border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-xl p-6 text-center bg-slate-50/50 transition-colors cursor-pointer flex flex-col items-center justify-center">
              <UploadCloud className="size-8 text-indigo-500 mb-2" />
              <span className="font-semibold text-slate-800 block text-xs">
                {fileName}
              </span>
              <span className="text-[11px] text-slate-400 mt-1">
                Drag and drop PDF, PNG, JPG (Max 5MB)
              </span>
              <button
                type="button"
                onClick={() => setFileName(`upload_${Date.now().toString().slice(-4)}.pdf`)}
                className="mt-3 px-3 py-1 bg-white border border-slate-200 rounded-lg text-[11px] font-semibold text-indigo-600 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Browse Files
              </button>
            </div>
          </div>

          {/* Footer actions */}
          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <Plus className="size-3.5" />
              Upload to Vault
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
