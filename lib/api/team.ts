import { get, post, patch, del } from "@/lib/api";
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
  return get<TeamApiResponse>("/api/team", { cache: "no-store" });
}

export async function createEmployee(
  formData: AddEmployeeFormData
): Promise<TeamMember> {
  const data = await post<{ member: TeamMember }>("/api/team", formData);
  return data.member;
}

export async function updateEmployee(
  id: string,
  updates: Partial<TeamMember>
): Promise<TeamMember> {
  const data = await patch<{ member: TeamMember }>(`/api/team/${id}`, updates);
  return data.member;
}

export async function deleteEmployee(id: string): Promise<boolean> {
  await del(`/api/team/${id}`);
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
  const data = await post<{ leave: LeaveApplicationItem }>("/api/team/leave", leaveData);
  return data.leave;
}

export async function updateLeaveStatus(
  id: string,
  status: "Approved" | "Rejected",
  rejectionRemarks?: string
): Promise<LeaveApplicationItem> {
  const data = await patch<{ leave: LeaveApplicationItem }>("/api/team/leave", {
    id,
    status,
    rejectionRemarks,
  });
  return data.leave;
}

export async function submitReimbursementClaim(claimData: {
  userId: string;
  reason: string;
  claimDate: string;
  amount: number;
  receiptUrl?: string;
}): Promise<EmployeeReimbursementItem> {
  const data = await post<{ claim: EmployeeReimbursementItem }>(
    "/api/team/reimbursement",
    claimData
  );
  return data.claim;
}

export async function settleReimbursementClaim(
  id: string
): Promise<EmployeeReimbursementItem> {
  const data = await patch<{ claim: EmployeeReimbursementItem }>(
    "/api/team/reimbursement",
    { id, action: "settle" }
  );
  return data.claim;
}

export async function regularizeAttendance(
  id: string,
  action: "approve" | "reject"
): Promise<AttendanceItem> {
  const data = await patch<{ attendance: AttendanceItem }>("/api/team/attendance", {
    id,
    action,
  });
  return data.attendance;
}
