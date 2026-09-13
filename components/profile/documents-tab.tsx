"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, FileText, Download, Trash2, Eye, ShieldCheck, RotateCw } from "lucide-react";
import { UploadDocumentModal, EmployeeKYCDocument } from "./upload-document-modal";
import { fetchDocuments, uploadDocument, deleteDocument } from "@/lib/api/profile";

export function DocumentsTab() {
  const [documents, setDocuments] = useState<EmployeeKYCDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadDocs() {
      try {
        const data = await fetchDocuments();
        if (isMounted) {
          setDocuments(data);
        }
      } catch (err) {
        console.error("Failed to load documents:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    loadDocs();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleUpload = async (newDoc: EmployeeKYCDocument) => {
    setDocuments((prev) => [newDoc, ...prev]);
    const saved = await uploadDocument({
      name: newDoc.name,
      category: newDoc.category,
      fileName: newDoc.fileName,
      fileSize: newDoc.fileSize,
    });
    if (saved) {
      setDocuments((prev) => prev.map((d) => (d.id === newDoc.id ? saved : d)));
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this document from the vault?")) {
      setDocuments((prev) => prev.filter((d) => d.id !== id));
      await deleteDocument(id);
    }
  };

  const filteredDocs = documents.filter(
    (d) =>
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.fileName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Top Controls */}
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="size-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search employee KYC documents..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>
            {isLoading && (
              <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                <RotateCw className="size-3 animate-spin text-indigo-600" /> Loading KYC vault...
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsUploadModalOpen(true)}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="size-3.5" /> Upload Document
          </button>
        </div>

        {/* Documents Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <th className="py-2.5 px-4 font-semibold text-[11px]">Doc ID</th>
                <th className="py-2.5 px-4 font-semibold text-[11px]">Document Name</th>
                <th className="py-2.5 px-4 font-semibold text-[11px]">Document Category</th>
                <th className="py-2.5 px-4 font-semibold text-[11px]">File Attachment</th>
                <th className="py-2.5 px-4 font-semibold text-[11px]">Size</th>
                <th className="py-2.5 px-4 font-semibold text-[11px]">Upload Date</th>
                <th className="py-2.5 px-4 font-semibold text-[11px] text-center">Status</th>
                <th className="py-2.5 px-4 font-semibold text-[11px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-slate-400">
                    {isLoading ? "Fetching KYC documents from vault..." : "No documents in KYC vault."}
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-600">{doc.id}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{doc.name}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {doc.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 text-slate-700">
                        <FileText className="size-3.5 text-indigo-600 shrink-0" />
                        <span className="font-mono text-[11px] truncate max-w-[160px]">
                          {doc.fileName}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{doc.fileSize}</td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                      {doc.uploadDate}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        <ShieldCheck className="size-3" /> Verified
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => alert(`Viewing document: ${doc.fileName}`)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors cursor-pointer"
                          title="View"
                        >
                          <Eye className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => alert(`Downloading: ${doc.fileName}`)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-600 transition-colors cursor-pointer"
                          title="Download"
                        >
                          <Download className="size-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(doc.id)}
                          className="p-1.5 hover:bg-rose-50 rounded-lg text-rose-600 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Document Modal */}
      <UploadDocumentModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUpload}
      />
    </div>
  );
}
