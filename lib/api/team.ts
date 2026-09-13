import {
  TeamMember,
  TeamKPIData,
  AttendanceItem,
  LeaveApplicationItem,
  LeaveSummaryItem,
  EmployeeReimbursementItem,
  AddEmployeeFormData,
} from "@/components/team/types";

export interface TeamApiResponse {
  members: TeamMember[];
  kpi: TeamKPIData;
  attendance: AttendanceItem[];
  leaves: LeaveApplicationItem[];
  leaveSummary: LeaveSummaryItem[];
  reimbursements: EmployeeReimbursementItem[];
}

export async function fetchTeamData(): Promise<TeamApiResponse> {
  const res = await fetch("/api/team", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to fetch team data");
  }

  return res.json();
}

export async function createEmployee(
  formData: AddEmployeeFormData
): Promise<TeamMember> {
  const res = await fetch("/api/team", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to create employee");
  }

  const data = await res.json();
  return data.member;
}

export async function updateEmployee(
  id: string,
  updates: Partial<TeamMember>
): Promise<TeamMember> {
  const res = await fetch(`/api/team/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updates),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to update employee");
  }

  const data = await res.json();
  return data.member;
}

export async function deleteEmployee(id: string): Promise<boolean> {
  const res = await fetch(`/api/team/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to deactivate employee");
  }

  return true;
}

export async function submitLeaveApplication(leaveData: {
  userId: string;
  userName?: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  daysCount: number;
  reason: string;
}): Promise<LeaveApplicationItem> {
  const res = await fetch("/api/team/leave", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(leaveData),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to submit leave application");
  }

  const data = await res.json();
  return data.leave;
}

export async function updateLeaveStatus(
  id: string,
  status: "Approved" | "Rejected",
  rejectionRemarks?: string
): Promise<LeaveApplicationItem> {
  const res = await fetch("/api/team/leave", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, status, rejectionRemarks }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to update leave status");
  }

  const data = await res.json();
  return data.leave;
}

export async function submitReimbursementClaim(claimData: {
  userId: string;
  reason: string;
  claimDate: string;
  amount: number;
  receiptUrl?: string;
}): Promise<EmployeeReimbursementItem> {
  const res = await fetch("/api/team/reimbursement", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(claimData),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to submit reimbursement claim");
  }

  const data = await res.json();
  return data.claim;
}

export async function settleReimbursementClaim(
  id: string
): Promise<EmployeeReimbursementItem> {
  const res = await fetch("/api/team/reimbursement", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, action: "settle" }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to settle reimbursement claim");
  }

  const data = await res.json();
  return data.claim;
}

export async function regularizeAttendance(
  id: string,
  action: "approve" | "reject"
): Promise<AttendanceItem> {
  const res = await fetch("/api/team/attendance", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, action }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to regularize attendance");
  }

  const data = await res.json();
  return data.attendance;
}
