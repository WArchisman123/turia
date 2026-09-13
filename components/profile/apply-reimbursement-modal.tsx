"use client";

import React, { useState } from "react";
import { X, Receipt, Upload, Plus } from "lucide-react";

export interface PersonalReimbursementItem {
  id: string;
  date: string;
  reason: string;
  category: string;
  amount: number;
  paidBy: "Self" | "Firm Card";
  attachmentName?: string;
  status: "Approved" | "Pending" | "Settled" | "Rejected";
}

interface ApplyReimbursementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (claim: PersonalReimbursementItem) => void;
}

export function ApplyReimbursementModal({
  isOpen,
  onClose,
  onSubmit,
}: ApplyReimbursementModalProps) {
  const [reason, setReason] = useState("");
  const [category, setCategory] = useState("Conveyance / Audit Travel");
  const [amount, setAmount] = useState<number | "">("");
  const [date, setDate] = useState("2026-09-08");
  const [paidBy, setPaidBy] = useState<"Self" | "Firm Card">("Self");
  const [attachmentName, setAttachmentName] = useState("uber_receipt_client_audit.pdf");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !reason) return;

    const newClaim: PersonalReimbursementItem = {
      id: `EXP-${Date.now().toString().slice(-4)}`,
      date,
      reason,
      category,
      amount: Number(amount),
      paidBy,
      attachmentName,
      status: "Pending",
    };

    onSubmit(newClaim);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <Receipt className="size-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Apply for Reimbursement</h3>
              <p className="text-[11px] text-slate-500">Submit staff out-of-pocket expenses with receipt proof</p>
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
          {/* Reason / Title */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Expense Description / Purpose <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Client site statutory audit conveyance cab fare"
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              required
            />
          </div>

          {/* Category & Payment Mode */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="Conveyance / Audit Travel">Conveyance / Audit Travel</option>
                <option value="ROC & MCA Stamp Duty">ROC & MCA Stamp Duty</option>
                <option value="Client Working Lunch">Client Working Lunch</option>
                <option value="Printing & Stationery">Printing & Stationery</option>
                <option value="Courier & Postal">Courier & Postal</option>
                <option value="Other OOP Expense">Other OOP Expense</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Paid By</label>
              <select
                value={paidBy}
                onChange={(e) => setPaidBy(e.target.value as "Self" | "Firm Card")}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                <option value="Self">Self (Personal Account)</option>
                <option value="Firm Card">Firm Corporate Card</option>
              </select>
            </div>
          </div>

          {/* Amount & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">
                Amount (₹) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
                  placeholder="0.00"
                  className="w-full pl-7 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 font-medium"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Expense Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                required
              />
            </div>
          </div>

          {/* Attachment upload */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Receipt Attachment</label>
            <div className="border border-dashed border-slate-200 rounded-xl p-3 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-600">
                <Upload className="size-4 text-emerald-600" />
                <span className="truncate max-w-[240px] font-mono text-[11px] text-slate-700">
                  {attachmentName}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setAttachmentName(`receipt_${Date.now().toString().slice(-4)}.pdf`)}
                className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
              >
                Change
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
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <Plus className="size-3.5" />
              Submit Claim
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
