"use client";

import React, { useState, useMemo } from "react";
import {
  Search,
  Calendar,
  Plus,
  Paperclip,
  CheckCircle,
  X,
  Receipt,
} from "lucide-react";
import { EmployeeReimbursementItem, TeamMember } from "./types";

interface ReimbursementTabProps {
  reimbursements: EmployeeReimbursementItem[];
  members: TeamMember[];
  onNewClaim: (claimData: {
    userId: string;
    userName: string;
    reason: string;
    claimDate: string;
    amount: number;
    receiptUrl?: string;
  }) => Promise<void> | void;
  onSettleClaim: (id: string) => Promise<void> | void;
}

export function ReimbursementTab({
  reimbursements,
  members,
  onNewClaim,
  onSettleClaim,
}: ReimbursementTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [startDate, setStartDate] = useState("01/09/2026");
  const [endDate, setEndDate] = useState("30/09/2026");

  // Selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalUserId, setModalUserId] = useState(members[0]?.id || "");
  const [modalReason, setModalReason] = useState("");
  const [modalDate, setModalDate] = useState("11/09/2026");
  const [modalAmount, setModalAmount] = useState<number>(1500);
  const [modalReceiptUrl, setModalReceiptUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtered claims
  const filteredClaims = useMemo(() => {
    return reimbursements.filter((r) => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchApp = r.applicant.toLowerCase().includes(q);
        const matchReason = r.reason.toLowerCase().includes(q);
        if (!matchApp && !matchReason) return false;
      }
      return true;
    });
  }, [reimbursements, searchQuery]);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredClaims.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleOpenModal = () => {
    if (members.length > 0) setModalUserId(members[0].id);
    setModalReason("");
    setModalAmount(1500);
    setIsModalOpen(true);
  };

  const handleSubmitClaim = async (e: React.FormEvent) => {
    e.preventDefault();
    const selectedMember = members.find((m) => m.id === modalUserId);
    try {
      setIsSubmitting(true);
      await onNewClaim({
        userId: modalUserId,
        userName: selectedMember?.full_name || "Staff Member",
        reason: modalReason,
        claimDate: modalDate,
        amount: modalAmount,
        receiptUrl: modalReceiptUrl || undefined,
      });
      setIsModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatINR = (val: number) => {
    return `₹${val.toLocaleString("en-IN")}`;
  };

  return (
    <div className="space-y-4">
      {/* Toolbar matching team-4.png */}
      <div className="bg-white border border-[#E2E8F0] rounded-lg p-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs">
        <div className="text-xs font-bold text-slate-900">
          All Reimbursements ({filteredClaims.length})
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 md:w-56">
            <Search className="size-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-[#E2E8F0] rounded-md focus:outline-hidden focus:ring-1 focus:ring-indigo-500 placeholder:text-slate-400"
            />
          </div>

          {/* Start Date */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>Start Date:</span>
            <div className="relative">
              <input
                type="text"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="pl-2.5 pr-7 py-1.5 text-xs font-medium text-slate-700 bg-white border border-[#E2E8F0] rounded-md focus:outline-hidden focus:ring-1 focus:ring-indigo-500 w-28"
              />
              <Calendar className="size-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* End Date */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <span>End Date:</span>
            <div className="relative">
              <input
                type="text"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="pl-2.5 pr-7 py-1.5 text-xs font-medium text-slate-700 bg-white border border-[#E2E8F0] rounded-md focus:outline-hidden focus:ring-1 focus:ring-indigo-500 w-28"
              />
              <Calendar className="size-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* New Claim button */}
          <button
            onClick={handleOpenModal}
            className="bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-semibold px-3.5 py-1.5 rounded-md flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer shrink-0"
          >
            <Plus className="size-3.5" />
            New Claim
          </button>
        </div>
      </div>

      {/* 8-Column Claims Table matching team-4.png */}
      <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] select-none">
                <th className="py-2.5 px-3 w-8">
                  <input
                    type="checkbox"
                    checked={
                      filteredClaims.length > 0 &&
                      selectedIds.length === filteredClaims.length
                    }
                    onChange={handleSelectAll}
                    className="rounded text-indigo-600 focus:ring-indigo-500 size-3.5"
                  />
                </th>
                <th className="py-2.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Applicant
                </th>
                <th className="py-2.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Reason
                </th>
                <th className="py-2.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Date
                </th>
                <th className="py-2.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500 text-right">
                  Amount
                </th>
                <th className="py-2.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="py-2.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                  Paid
                </th>
                <th className="py-2.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500 text-center">
                  Attachments
                </th>
                <th className="py-2.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500 text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredClaims.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    <Receipt className="size-8 text-slate-300 mx-auto mb-1.5" />
                    <div className="font-semibold text-slate-700">No reimbursement claims found</div>
                    <div className="text-xs text-slate-400">Click New Claim to submit an expense</div>
                  </td>
                </tr>
              ) : (
                filteredClaims.map((claim) => (
                  <tr
                    key={claim.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="py-3 px-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(claim.id)}
                        onChange={() => handleToggleSelect(claim.id)}
                        className="rounded text-indigo-600 focus:ring-indigo-500 size-3.5"
                      />
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="size-7 rounded-full bg-[#6366F1] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                          {claim.applicant_initials}
                        </div>
                        <span className="font-semibold text-slate-900">
                          {claim.applicant}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-700 max-w-[280px]">
                      {claim.reason}
                    </td>
                    <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                      {claim.date}
                    </td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900">
                      {formatINR(claim.amount)}
                    </td>
                    <td className="py-3 px-3">
                      {claim.status === "Approved" ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Approved
                        </span>
                      ) : claim.status === "Rejected" ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                          Rejected
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3">
                      {claim.paid === "Settled" ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Settled
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                          Unsettled
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {claim.attachments ? (
                        <a
                          href={claim.attachments}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
                        >
                          <Paperclip className="size-3" />
                          Receipt
                        </a>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {claim.paid === "Unsettled" ? (
                        <button
                          onClick={() => onSettleClaim(claim.id)}
                          className="px-2 py-1 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors cursor-pointer"
                        >
                          Settle
                        </button>
                      ) : (
                        <span className="text-slate-400 text-[11px] flex items-center justify-center gap-1">
                          <CheckCircle className="size-3 text-emerald-500" />
                          Paid
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="bg-white px-4 py-2.5 border-t border-[#E2E8F0] flex items-center justify-end gap-6 text-xs text-slate-500 select-none">
          <div className="flex items-center gap-2">
            <span>Rows per page:</span>
            <span className="font-semibold text-slate-700">50</span>
          </div>
          <div>
            1–{filteredClaims.length} of {filteredClaims.length}
          </div>
        </div>
      </div>

      {/* New Claim Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <Receipt className="size-5 text-[#6366F1]" />
                <h3 className="font-bold text-slate-900 text-sm">Submit Reimbursement Claim</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitClaim} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Applicant *
                </label>
                <select
                  value={modalUserId}
                  onChange={(e) => setModalUserId(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white border border-[#E2E8F0] rounded-md focus:ring-1 focus:ring-indigo-500"
                  required
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.full_name} ({m.designation})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reason / Purpose of Expense *
                </label>
                <textarea
                  value={modalReason}
                  onChange={(e) => setModalReason(e.target.value)}
                  rows={2}
                  className="w-full text-xs px-3 py-2 bg-white border border-[#E2E8F0] rounded-md focus:ring-1 focus:ring-indigo-500"
                  placeholder="e.g., Haldia client outstation audit toll & fuel, MCA stamp paper challan..."
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Claim Date *
                  </label>
                  <input
                    type="text"
                    value={modalDate}
                    onChange={(e) => setModalDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-[#E2E8F0] rounded-md focus:ring-1 focus:ring-indigo-500"
                    placeholder="DD/MM/YYYY"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Amount (₹) *
                  </label>
                  <input
                    type="number"
                    value={modalAmount}
                    onChange={(e) => setModalAmount(Number(e.target.value))}
                    min={1}
                    className="w-full text-xs px-3 py-2 bg-white border border-[#E2E8F0] rounded-md focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Receipt Attachment URL
                </label>
                <input
                  type="text"
                  value={modalReceiptUrl}
                  onChange={(e) => setModalReceiptUrl(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white border border-[#E2E8F0] rounded-md focus:ring-1 focus:ring-indigo-500"
                  placeholder="/docs/receipts/fuel-voucher.pdf"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 text-xs font-semibold bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-md transition-colors shadow-xs"
                >
                  {isSubmitting ? "Submitting..." : "Submit Claim"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
