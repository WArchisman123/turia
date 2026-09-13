"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, FileText, Download, CheckCircle2, Clock, XCircle, RotateCw } from "lucide-react";
import { ApplyReimbursementModal, PersonalReimbursementItem } from "./apply-reimbursement-modal";
import { fetchReimbursements, createReimbursement } from "@/lib/api/profile";

export function ReimbursementTab() {
  const [claims, setClaims] = useState<PersonalReimbursementItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadClaims() {
      try {
        const res = await fetchReimbursements();
        if (isMounted) {
          setClaims(res.claims || []);
        }
      } catch (err) {
        console.error("Failed to load claims:", err);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    loadClaims();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleAddClaim = async (newClaim: PersonalReimbursementItem) => {
    setClaims((prev) => [newClaim, ...prev]);
    const saved = await createReimbursement({
      date: newClaim.date,
      reason: newClaim.reason,
      category: newClaim.category,
      amount: newClaim.amount,
      paidBy: newClaim.paidBy,
      attachmentName: newClaim.attachmentName,
    });
    if (saved) {
      setClaims((prev) => prev.map((c) => (c.id === newClaim.id ? saved : c)));
    }
  };

  const filteredClaims = claims.filter(
    (c) =>
      c.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalAmount = claims.reduce((acc, curr) => acc + curr.amount, 0);
  const settledAmount = claims
    .filter((c) => c.status === "Settled" || c.status === "Approved")
    .reduce((acc, curr) => acc + curr.amount, 0);
  const pendingAmount = claims
    .filter((c) => c.status === "Pending")
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-5">
      {/* 3 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500 block">Total Claims Submitted</span>
          <span className="text-xl font-bold text-slate-900 block mt-1">
            ₹{totalAmount.toLocaleString("en-IN")}
          </span>
          <span className="text-[11px] text-slate-400">{claims.length} claims in FY 2026-27</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-emerald-600 block">Approved &amp; Reimbursed</span>
          <span className="text-xl font-bold text-emerald-700 block mt-1">
            ₹{settledAmount.toLocaleString("en-IN")}
          </span>
          <span className="text-[11px] text-emerald-500">Processed to bank</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-amber-600 block">Pending Review</span>
          <span className="text-xl font-bold text-amber-700 block mt-1">
            ₹{pendingAmount.toLocaleString("en-IN")}
          </span>
          <span className="text-[11px] text-amber-500">Awaiting partner sign-off</span>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Table Topbar Controls */}
        <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="size-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by reason or category..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
              />
            </div>
            {isLoading && (
              <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                <RotateCw className="size-3 animate-spin text-indigo-600" /> Loading claims...
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={() => setIsApplyModalOpen(true)}
            className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="size-3.5" /> Apply Reimbursement
          </button>
        </div>

        {/* Claims Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 border-b border-slate-200">
                <th className="py-2.5 px-4 font-semibold text-[11px]">Claim ID</th>
                <th className="py-2.5 px-4 font-semibold text-[11px]">Date</th>
                <th className="py-2.5 px-4 font-semibold text-[11px]">Expense Details / Reason</th>
                <th className="py-2.5 px-4 font-semibold text-[11px]">Category</th>
                <th className="py-2.5 px-4 font-semibold text-[11px] text-right">Amount</th>
                <th className="py-2.5 px-4 font-semibold text-[11px]">Paid By</th>
                <th className="py-2.5 px-4 font-semibold text-[11px]">Receipt</th>
                <th className="py-2.5 px-4 font-semibold text-[11px] text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClaims.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-xs text-slate-400">
                    {isLoading ? "Fetching claims from database..." : "No expense claims found."}
                  </td>
                </tr>
              ) : (
                filteredClaims.map((claim) => (
                  <tr key={claim.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-600">{claim.id}</td>
                    <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">{claim.date}</td>
                    <td className="py-3 px-4 font-medium text-slate-900 max-w-xs truncate">
                      {claim.reason}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {claim.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 text-right">
                      ₹{claim.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="py-3 px-4 text-slate-600 font-medium">{claim.paidBy}</td>
                    <td className="py-3 px-4">
                      {claim.attachmentName ? (
                        <a
                          href={`#receipt-${claim.id}`}
                          onClick={(e) => {
                            e.preventDefault();
                            alert(`Downloading receipt: ${claim.attachmentName}`);
                          }}
                          className="inline-flex items-center gap-1 text-[11px] text-indigo-600 hover:text-indigo-800 font-medium"
                        >
                          <FileText className="size-3" />
                          <span className="truncate max-w-[120px]">{claim.attachmentName}</span>
                          <Download className="size-3 text-slate-400 ml-0.5" />
                        </a>
                      ) : (
                        <span className="text-slate-400 text-[10px] italic">No receipt</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          claim.status === "Settled"
                            ? "bg-emerald-100 text-emerald-800"
                            : claim.status === "Approved"
                            ? "bg-blue-100 text-blue-800"
                            : claim.status === "Rejected"
                            ? "bg-rose-100 text-rose-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {claim.status === "Settled" && <CheckCircle2 className="size-3" />}
                        {claim.status === "Approved" && <CheckCircle2 className="size-3" />}
                        {claim.status === "Pending" && <Clock className="size-3" />}
                        {claim.status === "Rejected" && <XCircle className="size-3" />}
                        {claim.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Apply Reimbursement Modal */}
      <ApplyReimbursementModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
        onSubmit={handleAddClaim}
      />
    </div>
  );
}
