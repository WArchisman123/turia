"use client";

import React, { useState, useEffect, useTransition } from "react";
import { AppShell } from "@/components/layout/app-shell";
import {
  Users,
  Clock,
  Calendar,
  Repeat,
  RotateCw,
} from "lucide-react";
import {
  TeamTab,
  TeamMember,
  TeamKPIData,
  AttendanceItem,
  LeaveApplicationItem,
  LeaveSummaryItem,
  EmployeeReimbursementItem,
  AddEmployeeFormData,
} from "@/components/team/types";
import {
  fetchTeamData,
  createEmployee,
  deleteEmployee,
  submitLeaveApplication,
  updateLeaveStatus,
  submitReimbursementClaim,
  settleReimbursementClaim,
  regularizeAttendance,
} from "@/lib/api/team";
import { TeamDirectoryTab } from "@/components/team/team-directory-tab";
import { AttendanceTab } from "@/components/team/attendance-tab";
import { LeaveTab } from "@/components/team/leave-tab";
import { ReimbursementTab } from "@/components/team/reimbursement-tab";
import { AddEmployeeWizard } from "@/components/team/add-employee-wizard";

export default function TeamPage() {
  const [activeTab, setActiveTab] = useState<TeamTab>("team");
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [, startTransition] = useTransition();

  // State
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [kpi, setKpi] = useState<TeamKPIData>({
    active_users: 1,
    deactivated_users: 0,
    resigned_users: 0,
    seats_used: 1,
    seats_total: 5,
  });
  const [attendance, setAttendance] = useState<AttendanceItem[]>([]);
  const [leaves, setLeaves] = useState<LeaveApplicationItem[]>([]);
  const [leaveSummary, setLeaveSummary] = useState<LeaveSummaryItem[]>([]);
  const [reimbursements, setReimbursements] = useState<EmployeeReimbursementItem[]>([]);

  const loadData = async () => {
    try {
      const data = await fetchTeamData();
      setMembers(data.members || []);
      if (data.kpi) setKpi(data.kpi);
      setAttendance(data.attendance || []);
      setLeaves(data.leaves || []);
      setLeaveSummary(data.leaveSummary || []);
      setReimbursements(data.reimbursements || []);
    } catch (err) {
      console.error("Failed to load team data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    async function init() {
      try {
        const data = await fetchTeamData();
        if (!isMounted) return;
        setMembers(data.members || []);
        if (data.kpi) setKpi(data.kpi);
        setAttendance(data.attendance || []);
        setLeaves(data.leaves || []);
        setLeaveSummary(data.leaveSummary || []);
        setReimbursements(data.reimbursements || []);
      } catch (err) {
        console.error("Failed to load team data:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    init();
    return () => {
      isMounted = false;
    };
  }, []);

  // Handlers
  const handleAddNewUser = () => {
    setIsAddingUser(true);
  };

  const handleCancelAdd = () => {
    setIsAddingUser(false);
  };

  const handleSubmitNewEmployee = async (formData: AddEmployeeFormData) => {
    const created = await createEmployee(formData);
    startTransition(() => {
      setMembers((prev) => [created, ...prev]);
      setKpi((prev) => ({
        ...prev,
        active_users: prev.active_users + 1,
        seats_used: prev.seats_used + 1,
      }));
    });
    setIsAddingUser(false);
    loadData();
  };

  const handleDeactivateUser = async (id: string) => {
    startTransition(() => {
      setMembers((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, status: "deactivated" } : m
        )
      );
      setKpi((prev) => ({
        ...prev,
        active_users: Math.max(0, prev.active_users - 1),
        deactivated_users: prev.deactivated_users + 1,
        seats_used: Math.max(0, prev.seats_used - 1),
      }));
    });
    try {
      await deleteEmployee(id);
      loadData();
    } catch (err) {
      console.error("Failed to deactivate employee:", err);
    }
  };

  const handleAssignLeave = async (leaveData: {
    userId: string;
    leaveType: string;
    fromDate: string;
    toDate: string;
    daysCount: number;
    reason: string;
  }) => {
    const user = members.find((m) => m.id === leaveData.userId);
    const created = await submitLeaveApplication({
      ...leaveData,
      userName: user?.full_name,
    });
    startTransition(() => {
      setLeaves((prev) => [created, ...prev]);
    });
    loadData();
  };

  const handleUpdateLeaveStatus = async (
    id: string,
    status: "Approved" | "Rejected",
    rejectionRemarks?: string
  ) => {
    startTransition(() => {
      setLeaves((prev) =>
        prev.map((l) =>
          l.id === id
            ? { ...l, status, rejection_remarks: rejectionRemarks || null }
            : l
        )
      );
    });
    try {
      await updateLeaveStatus(id, status, rejectionRemarks);
      loadData();
    } catch (err) {
      console.error("Failed to update leave status:", err);
    }
  };

  const handleNewClaim = async (claimData: {
    userId: string;
    userName: string;
    reason: string;
    claimDate: string;
    amount: number;
    receiptUrl?: string;
  }) => {
    const created = await submitReimbursementClaim(claimData);
    startTransition(() => {
      setReimbursements((prev) => [created, ...prev]);
    });
    loadData();
  };

  const handleSettleClaim = async (id: string) => {
    startTransition(() => {
      setReimbursements((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, paid: "Settled", status: "Approved" } : c
        )
      );
    });
    try {
      await settleReimbursementClaim(id);
      loadData();
    } catch (err) {
      console.error("Failed to settle claim:", err);
    }
  };

  const handleRegularize = async (id: string, action: "approve" | "reject") => {
    startTransition(() => {
      setAttendance((prev) =>
        prev.map((a) =>
          a.id === id
            ? {
                ...a,
                is_regularized: action === "approve",
                status: action === "approve" ? "present" : "absent",
              }
            : a
        )
      );
    });
    try {
      await regularizeAttendance(id, action);
      loadData();
    } catch (err) {
      console.error("Failed to regularize attendance:", err);
    }
  };

  return (
    <AppShell>
      <div className="space-y-4">
        {isAddingUser ? (
          /* 4-Step Add Employee Stepper Wizard matching team-add user.png */
          <AddEmployeeWizard
            onCancel={handleCancelAdd}
            onSubmit={handleSubmitNewEmployee}
            existingMembers={members}
          />
        ) : (
          /* Master Cockpit with 4 Tabs */
          <>
            {/* Top Sub-Tabs Bar matching team-1.png */}
            <div className="border-b border-[#E2E8F0] flex items-center justify-between">
              <nav className="flex items-center gap-8 -mb-px">
                {/* Tab 1: Team */}
                <button
                  onClick={() => setActiveTab("team")}
                  className={`flex items-center gap-2 py-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                    activeTab === "team"
                      ? "border-[#6366F1] text-[#6366F1]"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Users className="size-4" />
                  <span>Team</span>
                </button>

                {/* Tab 2: Attendance */}
                <button
                  onClick={() => setActiveTab("attendance")}
                  className={`flex items-center gap-2 py-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                    activeTab === "attendance"
                      ? "border-[#6366F1] text-[#6366F1]"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Clock className="size-4" />
                  <span>Attendance</span>
                </button>

                {/* Tab 3: Leave */}
                <button
                  onClick={() => setActiveTab("leave")}
                  className={`flex items-center gap-2 py-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                    activeTab === "leave"
                      ? "border-[#6366F1] text-[#6366F1]"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Calendar className="size-4" />
                  <span>Leave</span>
                </button>

                {/* Tab 4: Reimbursement */}
                <button
                  onClick={() => setActiveTab("reimbursement")}
                  className={`flex items-center gap-2 py-3 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                    activeTab === "reimbursement"
                      ? "border-[#6366F1] text-[#6366F1]"
                      : "border-transparent text-slate-500 hover:text-slate-800"
                  }`}
                >
                  <Repeat className="size-4" />
                  <span>Reimbursement</span>
                </button>
              </nav>

              <button
                onClick={loadData}
                title="Refresh Team Data"
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
              >
                <RotateCw className="size-3.5" />
              </button>
            </div>

            {/* Tab Contents */}
            {isLoading ? (
              <div className="py-20 text-center text-xs text-slate-400">
                Loading team workspace...
              </div>
            ) : (
              <>
                {activeTab === "team" && (
                  <TeamDirectoryTab
                    members={members}
                    kpi={kpi}
                    onAddNewUser={handleAddNewUser}
                    onDeactivateUser={handleDeactivateUser}
                  />
                )}

                {activeTab === "attendance" && (
                  <AttendanceTab
                    attendanceLogs={attendance}
                    onRegularize={handleRegularize}
                  />
                )}

                {activeTab === "leave" && (
                  <LeaveTab
                    applications={leaves}
                    leaveSummary={leaveSummary}
                    members={members}
                    onAssignLeave={handleAssignLeave}
                    onUpdateStatus={handleUpdateLeaveStatus}
                  />
                )}

                {activeTab === "reimbursement" && (
                  <ReimbursementTab
                    reimbursements={reimbursements}
                    members={members}
                    onNewClaim={handleNewClaim}
                    onSettleClaim={handleSettleClaim}
                  />
                )}
              </>
            )}
          </>
        )}
      </div>
    </AppShell>
  );
}
