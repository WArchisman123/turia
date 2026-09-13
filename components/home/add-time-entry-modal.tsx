"use client";

import React, { useState } from "react";
import { X, Clock, Building2, Briefcase, FileCheck } from "lucide-react";

export interface TimeEntryItem {
  id: string;
  client: string;
  service: string;
  task: string;
  day: string; // e.g. "Thu, Sep 03"
  startTime: string;
  endTime: string;
  durationHours: number;
  costPerHour: number;
  billingRate: number;
  isBillable: boolean;
  description: string;
}

interface AddTimeEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddEntry: (entry: TimeEntryItem) => void;
}

export function AddTimeEntryModal({
  isOpen,
  onClose,
  onAddEntry,
}: AddTimeEntryModalProps) {
  const [client, setClient] = useState("Acme Global Logistics Pvt Ltd");
  const [service, setService] = useState("GST Return Filing (GSTR-3B / 1)");
  const [task, setTask] = useState("GSTR-3B Monthly Return Filing (Aug 2026)");
  const [day, setDay] = useState("Thu, Sep 03");
  const [startTime, setStartTime] = useState("02:00 PM");
  const [endTime, setEndTime] = useState("04:30 PM");
  const [costPerHour] = useState(350);
  const [billingRate] = useState(1500);
  const [isBillable, setIsBillable] = useState(true);
  const [description, setDescription] = useState(
    "ITC reconciliation under Sec 16(2) and outward supplies consolidation."
  );

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newEntry: TimeEntryItem = {
      id: Date.now().toString(),
      client,
      service,
      task,
      day,
      startTime,
      endTime,
      durationHours: 2.5,
      costPerHour,
      billingRate,
      isBillable,
      description,
    };

    onAddEntry(newEntry);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-2xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Clock className="size-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Log Timesheet Entry
              </h3>
              <p className="text-[11px] text-slate-500">
                Record billable client hours &amp; statutory task compliance effort
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="size-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Client & Service */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1.5 flex items-center gap-1">
                <Building2 className="size-3 text-slate-400" />
                Client Name<span className="text-red-500">*</span>
              </label>
              <select
                value={client}
                onChange={(e) => setClient(e.target.value)}
                className="w-full h-9 px-3 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
              >
                <option>Acme Global Logistics Pvt Ltd</option>
                <option>Reliance Retail Ventures Ltd</option>
                <option>Tata Consumer Products Ltd</option>
                <option>HDFC Life Insurance Co Ltd</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1.5 flex items-center gap-1">
                <Briefcase className="size-3 text-slate-400" />
                Service Master<span className="text-red-500">*</span>
              </label>
              <select
                value={service}
                onChange={(e) => setService(e.target.value)}
                className="w-full h-9 px-3 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
              >
                <option>GST Return Filing (GSTR-3B / 1)</option>
                <option>Statutory Audit &amp; Assurance</option>
                <option>Tax Audit Form 3CD (Sec 44AB)</option>
                <option>MCA Annual Filing (AOC-4 / MGT-7)</option>
              </select>
            </div>
          </div>

          {/* Task */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1.5 flex items-center gap-1">
              <FileCheck className="size-3 text-slate-400" />
              Statutory Task Assignment
            </label>
            <input
              type="text"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className="w-full h-9 px-3 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Day & Timings */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1.5">
                Timesheet Day
              </label>
              <select
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className="w-full h-9 px-3 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
              >
                <option>Mon, Aug 31</option>
                <option>Tue, Sep 01</option>
                <option>Wed, Sep 02</option>
                <option>Thu, Sep 03</option>
                <option>Fri, Sep 04</option>
                <option>Sat, Sep 05</option>
                <option>Sun, Sep 06</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1.5">
                Start Time
              </label>
              <select
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full h-9 px-3 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
              >
                <option>12:00 PM</option>
                <option>01:00 PM</option>
                <option>02:00 PM</option>
                <option>03:00 PM</option>
                <option>04:00 PM</option>
                <option>05:00 PM</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1.5">
                End Time
              </label>
              <select
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full h-9 px-3 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
              >
                <option>02:30 PM</option>
                <option>03:30 PM</option>
                <option>04:30 PM</option>
                <option>05:30 PM</option>
                <option>06:30 PM</option>
              </select>
            </div>
          </div>

          {/* Labor Costing Preview Strip */}
          <div className="bg-indigo-50/60 border border-indigo-100 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">
                  Internal Cost Rate
                </span>
                <span className="font-bold text-slate-800 font-mono">
                  ₹{costPerHour}/hr
                </span>
              </div>
              <div className="text-slate-300">|</div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase">
                  Client Billing Rate
                </span>
                <span className="font-bold text-indigo-700 font-mono">
                  ₹{billingRate}/hr
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isBillableToggle"
                checked={isBillable}
                onChange={(e) => setIsBillable(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500 size-4 cursor-pointer"
              />
              <label
                htmlFor="isBillableToggle"
                className="font-semibold text-slate-700 cursor-pointer"
              >
                Billable to Client
              </label>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1.5">
              Work Description &amp; Audit Notes
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-indigo-500 resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#6366F1] hover:bg-[#4F46E5] text-white font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              Save Time Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
