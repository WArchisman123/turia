"use client";

import React, { useState } from "react";
import {
  Calendar,
  Download,
  Plus,
  FileCheck2,
  GraduationCap,
  X,
  HeartPulse,
  Coffee,
  Briefcase,
} from "lucide-react";
import {
  LeaveApplicationItem,
  LeaveSummaryItem,
  LeaveViewMode,
  TeamMember,
} from "./types";

interface LeaveTabProps {
  applications: LeaveApplicationItem[];
  leaveSummary: LeaveSummaryItem[];
  members: TeamMember[];
  onAssignLeave: (leaveData: {
    userId: string;
    leaveType: string;
    fromDate: string;
    toDate: string;
    daysCount: number;
    reason: string;
  }) => Promise<void> | void;
  onUpdateStatus: (
    id: string,
    status: "Approved" | "Rejected",
    rejectionRemarks?: string
  ) => Promise<void> | void;
}

export function LeaveTab({
  applications,
  leaveSummary,
  members,
  onAssignLeave,
  onUpdateStatus,
}: LeaveTabProps) {
  const [viewMode, setViewMode] = useState<LeaveViewMode>("applications");
  const [startDate, setStartDate] = useState("01/01/2026");
  const [endDate, setEndDate] = useState("31/12/2026");

  // Modal
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [modalUserId, setModalUserId] = useState(members[0]?.id || "");
  const [modalLeaveType, setModalLeaveType] = useState("CA Exam Study Leave");
  const [modalFromDate, setModalFromDate] = useState("2026-10-01");
  const [modalToDate, setModalToDate] = useState("2026-10-31");
  const [modalDays, setModalDays] = useState(31);
  const [modalReason, setModalReason] = useState(
    "ICAI CA Final Group 1 Exam Preparation"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reject modal
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectRemarks, setRejectRemarks] = useState("");

  const handleOpenAssignModal = () => {
    if (members.length > 0) {
      setModalUserId(members[0].id);
    }
    setIsAssignModalOpen(true);
  };

  const handleModalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await onAssignLeave({
        userId: modalUserId,
        leaveType: modalLeaveType,
        fromDate: modalFromDate,
        toDate: modalToDate,
        daysCount: modalDays,
        reason: modalReason,
      });
      setIsAssignModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmReject = async () => {
    if (!rejectingId) return;
    await onUpdateStatus(rejectingId, "Rejected", rejectRemarks);
    setRejectingId(null);
    setRejectRemarks("");
  };

  const getLeaveTypeBadge = (type: LeaveApplicationItem["leave_type"]) => {
    switch (type) {
      case "CA Exam Study Leave":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#F5F3FF] text-[#7C3AED] border border-[#DDD6FE]">
            <GraduationCap className="size-3 text-[#7C3AED]" />
            CA Exam Study Leave
          </span>
        );
      case "Casual Leave":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#EFF6FF] text-[#2563EB] border border-[#DBEAFE]">
            <Coffee className="size-3 text-[#2563EB]" />
            Casual Leave
          </span>
        );
      case "Sick Leave":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <HeartPulse className="size-3 text-rose-600" />
            Sick Leave
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            <Briefcase className="size-3 text-slate-600" />
            Earned Leave
          </span>
        );
    }
  };

  const getStatusBadge = (status: LeaveApplicationItem["status"]) => {
    switch (status) {
      case "Approved":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Approved
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            Pending
          </span>
        );
      case "Rejected":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            Rejected
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      {/* Segmented Controls matching team-3.png */}
      <div className="flex items-center border border-[#E2E8F0] bg-white rounded-lg p-1 w-fit shadow-xs">
        <button
          onClick={() => setViewMode("applications")}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
            viewMode === "applications"
              ? "bg-[#EEF2FF] text-[#4F46E5]"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          All Applications
        </button>
        <button
          onClick={() => setViewMode("summary")}
          className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
            viewMode === "summary"
              ? "bg-[#EEF2FF] text-[#4F46E5]"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Summary
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-[#E2E8F0] rounded-lg p-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shadow-xs">
        <div className="text-xs font-bold text-slate-900">
          {viewMode === "applications"
            ? `All Applications (${applications.length})`
            : `Leave Entitlement & Balance Ledger (${leaveSummary.length})`}
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
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

          {/* Assign Leave button */}
          <button
            onClick={handleOpenAssignModal}
            className="bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-semibold px-3.5 py-1.5 rounded-md flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="size-3.5" />
            Assign Leave
          </button>

          {/* Export */}
          <button
            title="Export Leave Register"
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md border border-[#E2E8F0] transition-colors cursor-pointer"
          >
            <Download className="size-4" />
          </button>
        </div>
      </div>

      {/* Main Content: Applications vs Summary */}
      {viewMode === "applications" ? (
        /* 11-Column Applications Table matching team-3.png */
        <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] select-none">
                  <th className="py-2.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Applicant
                  </th>
                  <th className="py-2.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Leave Type
                  </th>
                  <th className="py-2.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Date of Application
                  </th>
                  <th className="py-2.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Date of Leave
                  </th>
                  <th className="py-2.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500 text-center">
                    No of Days Leave
                  </th>
                  <th className="py-2.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500 text-center">
                    Leaves Taken
                  </th>
                  <th className="py-2.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500 text-center">
                    Leave Balance
                  </th>
                  <th className="py-2.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Reason
                  </th>
                  <th className="py-2.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Rejection Remarks
                  </th>
                  <th className="py-2.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>
                  <th className="py-2.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Last updated
                  </th>
                  <th className="py-2.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500 text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan={12} className="py-12 text-center text-slate-500">
                      <FileCheck2 className="size-8 text-slate-300 mx-auto mb-1.5" />
                      <div className="font-semibold text-slate-700">No leave applications</div>
                      <div className="text-xs text-slate-400">Click Assign Leave to create one</div>
                    </td>
                  </tr>
                ) : (
                  applications.map((app) => (
                    <tr
                      key={app.id}
                      className="hover:bg-slate-50/70 transition-colors"
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <div className="size-7 rounded-full bg-[#6366F1] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                            {app.user_initials}
                          </div>
                          <span className="font-semibold text-slate-900">
                            {app.user_name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3">{getLeaveTypeBadge(app.leave_type)}</td>
                      <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                        {app.date_of_application}
                      </td>
                      <td className="py-3 px-3 text-slate-700 font-medium">
                        {app.date_of_leave}
                      </td>
                      <td className="py-3 px-3 text-center font-semibold text-slate-900">
                        {app.no_of_days_leave} days
                      </td>
                      <td className="py-3 px-3 text-center text-slate-600">
                        {app.leaves_taken}
                      </td>
                      <td className="py-3 px-3 text-center font-semibold text-[#059669]">
                        {app.leave_balance}
                      </td>
                      <td className="py-3 px-3 text-slate-600 max-w-[200px] truncate" title={app.reason}>
                        {app.reason}
                      </td>
                      <td className="py-3 px-3 text-slate-400 text-[11px]">
                        {app.rejection_remarks || "—"}
                      </td>
                      <td className="py-3 px-3">{getStatusBadge(app.status)}</td>
                      <td className="py-3 px-3 text-slate-500 text-[11px]">
                        {app.last_updated}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {app.status === "Pending" ? (
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => onUpdateStatus(app.id, "Approved")}
                              title="Approve Leave"
                              className="px-2 py-1 text-[11px] font-semibold bg-emerald-600 hover:bg-emerald-700 text-white rounded transition-colors cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => {
                                setRejectingId(app.id);
                                setRejectRemarks("");
                              }}
                              title="Reject Leave"
                              className="px-2 py-1 text-[11px] font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded transition-colors cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Completed</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-white px-4 py-2.5 border-t border-[#E2E8F0] flex items-center justify-end gap-6 text-xs text-slate-500 select-none">
            <div className="flex items-center gap-2">
              <span>Rows per page:</span>
              <span className="font-semibold text-slate-700">50</span>
            </div>
            <div>
              1–{applications.length} of {applications.length}
            </div>
          </div>
        </div>
      ) : (
        /* Summary Table: Leave Balances & Entitlements */
        <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0] select-none">
                  <th className="py-2.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Employee
                  </th>
                  <th className="py-2.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                    Designation
                  </th>
                  <th className="py-2.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500 text-center">
                    Casual (Taken / Bal)
                  </th>
                  <th className="py-2.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500 text-center">
                    Sick (Taken / Bal)
                  </th>
                  <th className="py-2.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500 text-center">
                    CA Exam Study (Taken / Bal)
                  </th>
                  <th className="py-2.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500 text-center">
                    Total Taken
                  </th>
                  <th className="py-2.5 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500 text-center font-bold text-emerald-700">
                    Total Balance
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {leaveSummary.map((sum) => (
                  <tr key={sum.user_id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <div className="size-7 rounded-full bg-[#6366F1] text-white flex items-center justify-center font-bold text-[10px] shrink-0">
                          {sum.user_initials}
                        </div>
                        <span className="font-semibold text-slate-900">
                          {sum.user_name}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-600">{sum.designation}</td>
                    <td className="py-3 px-3 text-center text-slate-700">
                      <span className="text-slate-500">{sum.casual_taken}</span> /{" "}
                      <span className="font-semibold text-slate-900">{sum.casual_balance}</span>
                    </td>
                    <td className="py-3 px-3 text-center text-slate-700">
                      <span className="text-slate-500">{sum.sick_taken}</span> /{" "}
                      <span className="font-semibold text-slate-900">{sum.sick_balance}</span>
                    </td>
                    <td className="py-3 px-3 text-center text-slate-700">
                      {sum.exam_quota > 0 ? (
                        <span>
                          <span className="text-slate-500">{sum.exam_taken}</span> /{" "}
                          <span className="font-bold text-[#7C3AED]">{sum.exam_balance}</span> (ICAI)
                        </span>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-center font-medium text-slate-700">
                      {sum.total_taken}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-[#059669]">
                      {sum.total_balance}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Assign / Apply Leave Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-2">
                <Calendar className="size-5 text-[#6366F1]" />
                <h3 className="font-bold text-slate-900 text-sm">Assign / Apply Leave</h3>
              </div>
              <button
                onClick={() => setIsAssignModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Employee *
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
                  Leave Type *
                </label>
                <select
                  value={modalLeaveType}
                  onChange={(e) => setModalLeaveType(e.target.value)}
                  className="w-full text-xs px-3 py-2 bg-white border border-[#E2E8F0] rounded-md focus:ring-1 focus:ring-indigo-500"
                  required
                >
                  <option value="CA Exam Study Leave">CA Exam Study Leave (ICAI 90d)</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Earned Leave">Earned Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    From Date *
                  </label>
                  <input
                    type="date"
                    value={modalFromDate}
                    onChange={(e) => setModalFromDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-[#E2E8F0] rounded-md focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    To Date *
                  </label>
                  <input
                    type="date"
                    value={modalToDate}
                    onChange={(e) => setModalToDate(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-[#E2E8F0] rounded-md focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Number of Days *
                </label>
                <input
                  type="number"
                  value={modalDays}
                  onChange={(e) => setModalDays(Number(e.target.value))}
                  min={1}
                  className="w-full text-xs px-3 py-2 bg-white border border-[#E2E8F0] rounded-md focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reason for Leave *
                </label>
                <textarea
                  value={modalReason}
                  onChange={(e) => setModalReason(e.target.value)}
                  rows={3}
                  className="w-full text-xs px-3 py-2 bg-white border border-[#E2E8F0] rounded-md focus:ring-1 focus:ring-indigo-500"
                  placeholder="Specify examination schedule, medical reason, etc."
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setIsAssignModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-1.5 text-xs font-semibold bg-[#6366F1] hover:bg-[#4F46E5] text-white rounded-md transition-colors shadow-xs"
                >
                  {isSubmitting ? "Submitting..." : "Assign Leave"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Remarks Modal */}
      {rejectingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
              <h3 className="font-bold text-slate-900 text-sm">Reject Leave Application</h3>
              <button
                onClick={() => setRejectingId(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="p-5 space-y-3">
              <label className="block text-xs font-semibold text-slate-700">
                Reason for Rejection
              </label>
              <textarea
                value={rejectRemarks}
                onChange={(e) => setRejectRemarks(e.target.value)}
                placeholder="Enter remarks for the applicant..."
                rows={3}
                className="w-full text-xs px-3 py-2 border border-[#E2E8F0] rounded-md focus:ring-1 focus:ring-indigo-500"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setRejectingId(null)}
                  className="px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmReject}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-md"
                >
                  Confirm Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
