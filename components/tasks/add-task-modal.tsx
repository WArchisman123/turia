"use client";

import React, { useState } from "react";
import posthog from "posthog-js";
import { X, Paperclip } from "lucide-react";
import { TaskFormData, TaskPriority } from "./types";

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: TaskFormData) => Promise<void>;
  clientOptions?: { id: string; name: string }[];
  serviceOptions?: { id: string; name: string; category: string }[];
  userOptions?: { id: string; name: string }[];
}

export function AddTaskModal({
  isOpen,
  onClose,
  onSubmit,
  clientOptions = [
    { id: "client-001", name: "Reliance Retail Ltd" },
    { id: "client-002", name: "Tata Consultancy Services" },
    { id: "client-003", name: "Infosys Technologies Ltd" },
    { id: "client-004", name: "Larsen & Toubro Ltd" },
    { id: "client-005", name: "HDFC Bank Limited" },
  ],
  serviceOptions = [
    { id: "srv-001", name: "TDS Payment & Monthly Compliances", category: "Direct Tax" },
    { id: "srv-002", name: "GSTR-1 & GSTR-3B Return Filing", category: "GST" },
    { id: "srv-003", name: "Tax Audit u/s 44AB", category: "Audit" },
    { id: "srv-004", name: "Statutory Audit under Companies Act 2013", category: "Audit" },
    { id: "srv-005", name: "ROC Annual Filing (AOC-4 & MGT-7)", category: "ROC" },
    { id: "srv-006", name: "Corporate Income Tax Return (ITR-6)", category: "Direct Tax" },
  ],
  userOptions = [
    { id: "usr-001", name: "Archi Saha" },
    { id: "usr-002", name: "Rahul Sen (Partner)" },
    { id: "usr-003", name: "Sneha Roy" },
    { id: "usr-004", name: "Amitabh Ghosh" },
  ],
}: AddTaskModalProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    clientId: clientOptions[0]?.id || "",
    serviceId: serviceOptions[0]?.id || "",
    financialYear: "FY 2026 - 2027",
    frequency: "One-Time",
    selectPeriod: "N/A - One Time Task",
    taskName: "",
    department: "GST",
    assigneeId: userOptions[0]?.id || "",
    reviewerId: userOptions[1]?.id || "",
    priority: "low" as TaskPriority,
    startDate: "03/09/2026",
    targetDueDate: "15/09/2026",
    endDate: "20/09/2026",
    billingType: "Billable",
    sprintPlanner: false,
    description: "",
    createProformaInvoice: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.taskName.trim()) {
      setErrorMsg("Please enter a task name");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg("");

      const client = clientOptions.find((c) => c.id === formData.clientId);
      const service = serviceOptions.find((s) => s.id === formData.serviceId);
      const assignee = userOptions.find((u) => u.id === formData.assigneeId);
      const reviewer = userOptions.find((u) => u.id === formData.reviewerId);

      await onSubmit({
        ...formData,
        clientName: client?.name,
        serviceName: service?.name,
        assigneeName: assignee?.name,
        reviewerName: reviewer?.name,
      });

      posthog.capture("task_created", {
        department: formData.department,
        frequency: formData.frequency,
        priority: formData.priority,
        billing_type: formData.billingType,
        create_proforma_invoice: formData.createProformaInvoice,
      });
      onClose();
    } catch (err) {
      console.error("Error saving task:", err);
      setErrorMsg("Failed to create compliance task");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-2xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Add Task Details</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          {/* Row 1: Client, Service, Financial Year, Frequency, Period */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Client <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.clientId}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-1 focus:ring-indigo-500"
              >
                {clientOptions.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Service <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.serviceId}
                onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-1 focus:ring-indigo-500"
              >
                {serviceOptions.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Financial Year <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.financialYear}
                onChange={(e) => setFormData({ ...formData, financialYear: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="FY 2026 - 2027">FY 2026 - 2027</option>
                <option value="FY 2025 - 2026">FY 2025 - 2026</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Frequency</label>
              <select
                value={formData.frequency}
                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="One-Time">One-Time</option>
                <option value="Monthly">Monthly</option>
                <option value="Quarterly">Quarterly</option>
                <option value="Half-Yearly">Half-Yearly</option>
                <option value="Yearly">Yearly</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Select Period</label>
              <select
                value={formData.selectPeriod}
                onChange={(e) => setFormData({ ...formData, selectPeriod: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="N/A - One Time Task">N/A - One Time Task</option>
                <option value="August 2026">August 2026</option>
                <option value="September 2026">September 2026</option>
                <option value="Q2 FY 26-27">Q2 FY 26-27</option>
                <option value="Annual AY 26-27">Annual AY 26-27</option>
              </select>
            </div>
          </div>

          {/* Row 2: Task Name, Department, Assignee, Reviewer, Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Task Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Enter task name"
                value={formData.taskName}
                onChange={(e) => setFormData({ ...formData, taskName: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Department</label>
              <select
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="GST">GST</option>
                <option value="Direct Tax">Direct Tax</option>
                <option value="Audit">Audit</option>
                <option value="ROC">ROC</option>
                <option value="Accounting">Accounting</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Assignee <span className="text-rose-500">*</span>
              </label>
              <select
                value={formData.assigneeId}
                onChange={(e) => setFormData({ ...formData, assigneeId: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-1 focus:ring-indigo-500"
              >
                {userOptions.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Reviewer</label>
              <select
                value={formData.reviewerId}
                onChange={(e) => setFormData({ ...formData, reviewerId: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-1 focus:ring-indigo-500"
              >
                {userOptions.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })}
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:ring-1 focus:ring-indigo-500"
              >
                <option value="low">Low</option>
                <option value="normal">Medium / Normal</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Row 3: Start Date, Target Due Date, End Date, Billing Type, Sprint Planner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Start Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                placeholder="DD/MM/YYYY"
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Target Due Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.targetDueDate}
                onChange={(e) => setFormData({ ...formData, targetDueDate: e.target.value })}
                placeholder="DD/MM/YYYY"
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                End Date <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                placeholder="DD/MM/YYYY"
                className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Billing Type</label>
              <div className="flex items-center gap-3 pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="modalBillingType"
                    checked={formData.billingType === "Billable"}
                    onChange={() => setFormData({ ...formData, billingType: "Billable" })}
                    className="text-indigo-600 size-3.5"
                  />
                  <span>Billable</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="radio"
                    name="modalBillingType"
                    checked={formData.billingType === "Non Billable"}
                    onChange={() => setFormData({ ...formData, billingType: "Non Billable" })}
                    className="text-indigo-600 size-3.5"
                  />
                  <span>Non Billable</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Sprint Planner</label>
              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={formData.sprintPlanner}
                  onChange={(e) => setFormData({ ...formData, sprintPlanner: e.target.checked })}
                  className="rounded border-slate-300 text-indigo-600 size-3.5"
                />
                <span>Add to Sprint Planner</span>
              </label>
            </div>
          </div>

          {/* Row 4: Description */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Description</label>
            <div className="relative">
              <textarea
                rows={4}
                placeholder="Add description..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <button
                type="button"
                className="absolute left-3 bottom-3 text-indigo-600 hover:text-indigo-700 p-1 rounded-md cursor-pointer"
                title="Attach file"
              >
                <Paperclip className="size-4" />
              </button>
            </div>
          </div>

          {/* Row 5: 1-Click Proforma Invoice Checkbox */}
          <div className="pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.createProformaInvoice}
                onChange={(e) =>
                  setFormData({ ...formData, createProformaInvoice: e.target.checked })
                }
                className="rounded border-slate-300 text-indigo-600 size-4 focus:ring-indigo-500 cursor-pointer"
              />
              <span className="font-semibold text-slate-800 text-xs">
                Create Proforma Invoice for this Task
              </span>
            </label>
            <p className="text-[11px] text-slate-500 ml-6 mt-0.5">
              Automatically creates a draft proforma invoice with the standard service fee linked to this statutory filing.
            </p>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl font-semibold text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-[#6366F1] hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
