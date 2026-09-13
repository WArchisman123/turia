"use client";

import React, { useState } from "react";
import { X, UserCheck, ArrowRightLeft } from "lucide-react";

interface ReassignModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  itemCount: number;
  itemNames: string[];
  onConfirm: (assignee: string, remarks: string) => void;
}

const TEAM_MEMBERS = [
  { id: "1", name: "Vikram Saha", role: "Managing Partner", dept: "Audit & Tax" },
  { id: "2", name: "Priya Mukherjee", role: "Audit Senior Manager", dept: "Statutory Audit" },
  { id: "3", name: "Rahul Verma", role: "GST Senior Associate", dept: "Indirect Tax" },
  { id: "4", name: "Ananya Sen", role: "Article Trainee (Yr 2)", dept: "ROC & Compliance" },
  { id: "5", name: "Suresh Ghosh", role: "Direct Tax Associate", dept: "Income Tax" },
];

export function ReassignModal({
  isOpen,
  onClose,
  title,
  itemCount,
  itemNames,
  onConfirm,
}: ReassignModalProps) {
  const [selectedAssignee, setSelectedAssignee] = useState(TEAM_MEMBERS[1].name);
  const [remarks, setRemarks] = useState("Reallocated due to quarter-end filing workload distribution");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(selectedAssignee, remarks);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="size-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <ArrowRightLeft className="size-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{title}</h3>
              <p className="text-[11px] text-slate-500">
                Re-allocating {itemCount} selected {itemCount === 1 ? "record" : "records"}
              </p>
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
          {/* Selected Items summary */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
            <span className="font-bold text-slate-700 block mb-1.5 text-[11px] uppercase tracking-wider">
              Selected for Transfer:
            </span>
            <ul className="space-y-1 text-slate-600 max-h-24 overflow-y-auto">
              {itemNames.slice(0, 4).map((name, i) => (
                <li key={i} className="truncate flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-indigo-500" />
                  {name}
                </li>
              ))}
              {itemNames.length > 4 && (
                <li className="text-[11px] text-slate-400 italic">
                  + {itemNames.length - 4} more items...
                </li>
              )}
            </ul>
          </div>

          {/* New Assignee */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Assign To Team Member <span className="text-rose-500">*</span>
            </label>
            <select
              value={selectedAssignee}
              onChange={(e) => setSelectedAssignee(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              {TEAM_MEMBERS.map((m) => (
                <option key={m.id} value={m.name}>
                  {m.name} — {m.role} ({m.dept})
                </option>
              ))}
            </select>
          </div>

          {/* Handoff Remarks */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">
              Handover Remarks / Notes
            </label>
            <textarea
              rows={2}
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Provide context or instructions for the new assignee..."
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 resize-none"
            />
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
              <UserCheck className="size-3.5" />
              Confirm Re-Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
