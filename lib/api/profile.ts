import { RoleSlug, ModuleSlug, ModulePermissionMap } from "@/lib/rbac/types";
import { LeaveApplicationItem } from "@/components/profile/apply-leave-modal";
import { PersonalReimbursementItem } from "@/components/profile/apply-reimbursement-modal";
import { AssignedTaskItem } from "@/components/profile/tasks-tab";
import { AssignedClientItem } from "@/components/profile/clients-tab";
import { EmployeeKYCDocument } from "@/components/profile/upload-document-modal";

export type SingleRolePermissions = Record<ModuleSlug, ModulePermissionMap>;

export interface PractitionerProfile {
  id: string;
  clerk_user_id: string;
  employee_id: string | null;
  first_name: string;
  last_name: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  role: string;
  designation: string | null;
  department: string | null;
  shift: string | null;
  joining_date: string | null;
  confirmation_date: string | null;
  dob: string | null;
  gender: string | null;
  pan_number: string | null;
  aadhaar_number: string | null;
  icai_member_number: string | null;
  address_line_1: string | null;
  city: string | null;
  state: string | null;
  pin_code: string | null;
  salary: number | null;
  cost_per_hour: number | null;
  billing_rate: number | null;
  work_experience: string | null;
  employment_status: string | null;
}

export interface ProfileDetailsResponse {
  user: PractitionerProfile | null;
  firm: {
    id: string;
    brand_name: string;
    legal_name: string;
  } | null;
  attendanceLogs: Array<{
    id: string;
    attendance_date: string;
    clock_in: string;
    clock_out: string | null;
    status: string;
    total_minutes: number | null;
  }>;
  leaveBalance: {
    casual_leave_quota: number;
    casual_leave_taken: number;
    sick_leave_quota: number;
    sick_leave_taken: number;
    exam_leave_quota: number;
    exam_leave_taken: number;
  } | null;
  leaveApplications: LeaveApplicationItem[];
}

// 1. Profile Details & Attendance Matrix
export async function fetchProfileDetails(): Promise<ProfileDetailsResponse | null> {
  try {
    const res = await fetch("/api/profile", { method: "GET" });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.error("fetchProfileDetails error:", err);
    return null;
  }
}

export async function updateProfileDetails(data: Partial<PractitionerProfile>): Promise<boolean> {
  try {
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch (err) {
    console.error("updateProfileDetails error:", err);
    return false;
  }
}

// 2. Reimbursements (Employee Expense Claims)
export async function fetchReimbursements(): Promise<{
  claims: PersonalReimbursementItem[];
  totalAmount: number;
  settledAmount: number;
  pendingAmount: number;
}> {
  try {
    const res = await fetch("/api/profile/reimbursements", { method: "GET" });
    if (!res.ok) return { claims: [], totalAmount: 0, settledAmount: 0, pendingAmount: 0 };
    return await res.json();
  } catch (err) {
    console.error("fetchReimbursements error:", err);
    return { claims: [], totalAmount: 0, settledAmount: 0, pendingAmount: 0 };
  }
}

export async function createReimbursement(claim: {
  date: string;
  reason: string;
  category: string;
  amount: number;
  paidBy: string;
  attachmentName?: string;
}): Promise<PersonalReimbursementItem | null> {
  try {
    const res = await fetch("/api/profile/reimbursements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(claim),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.claim;
  } catch (err) {
    console.error("createReimbursement error:", err);
    return null;
  }
}

// 3. Leaves
export async function fetchLeaves(): Promise<{
  leaves: LeaveApplicationItem[];
  balance: ProfileDetailsResponse["leaveBalance"];
}> {
  try {
    const res = await fetch("/api/profile/leaves", { method: "GET" });
    if (!res.ok) return { leaves: [], balance: null };
    return await res.json();
  } catch (err) {
    console.error("fetchLeaves error:", err);
    return { leaves: [], balance: null };
  }
}

export async function createLeave(leave: {
  leaveType: string;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
}): Promise<LeaveApplicationItem | null> {
  try {
    const res = await fetch("/api/profile/leaves", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(leave),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.leave;
  } catch (err) {
    console.error("createLeave error:", err);
    return null;
  }
}

// 4. Assigned Tasks
export async function fetchAssignedTasks(): Promise<AssignedTaskItem[]> {
  try {
    const res = await fetch("/api/profile/tasks", { method: "GET" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.tasks || [];
  } catch (err) {
    console.error("fetchAssignedTasks error:", err);
    return [];
  }
}

export async function reassignTasks(taskIds: string[], newAssigneeId: string): Promise<boolean> {
  try {
    const res = await fetch("/api/profile/tasks", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskIds, newAssigneeId }),
    });
    return res.ok;
  } catch (err) {
    console.error("reassignTasks error:", err);
    return false;
  }
}

// 5. Assigned Clients
export async function fetchAssignedClients(): Promise<AssignedClientItem[]> {
  try {
    const res = await fetch("/api/profile/clients", { method: "GET" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.clients || [];
  } catch (err) {
    console.error("fetchAssignedClients error:", err);
    return [];
  }
}

export async function reassignClients(clientIds: string[], newAssigneeId: string): Promise<boolean> {
  try {
    const res = await fetch("/api/profile/clients", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ clientIds, newAssigneeId }),
    });
    return res.ok;
  } catch (err) {
    console.error("reassignClients error:", err);
    return false;
  }
}

// 6. Documents Vault
export async function fetchDocuments(): Promise<EmployeeKYCDocument[]> {
  try {
    const res = await fetch("/api/profile/documents", { method: "GET" });
    if (!res.ok) return [];
    const data = await res.json();
    return data.documents || [];
  } catch (err) {
    console.error("fetchDocuments error:", err);
    return [];
  }
}

export async function uploadDocument(doc: {
  name: string;
  category: string;
  fileName: string;
  fileSize: string;
}): Promise<EmployeeKYCDocument | null> {
  try {
    const res = await fetch("/api/profile/documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(doc),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.document;
  } catch (err) {
    console.error("uploadDocument error:", err);
    return null;
  }
}

export async function deleteDocument(id: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/profile/documents?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    return res.ok;
  } catch (err) {
    console.error("deleteDocument error:", err);
    return false;
  }
}

// 7. Permissions Matrix
export async function fetchPermissions(role: RoleSlug): Promise<SingleRolePermissions | null> {
  try {
    const res = await fetch(`/api/profile/permissions?role=${encodeURIComponent(role)}`, {
      method: "GET",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.permissions;
  } catch (err) {
    console.error("fetchPermissions error:", err);
    return null;
  }
}

export async function savePermissions(permissions: SingleRolePermissions): Promise<boolean> {
  try {
    const res = await fetch("/api/profile/permissions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ permissions }),
    });
    return res.ok;
  } catch (err) {
    console.error("savePermissions error:", err);
    return false;
  }
}

// 8. Organization Tree
export interface OrgTreeNode {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  designation: string;
  department: string;
  level: string;
  role: string;
  email: string;
  isOnline: boolean;
  children?: OrgTreeNode[];
}

export async function fetchOrgTree(): Promise<OrgTreeNode | null> {
  try {
    const res = await fetch("/api/profile/org-tree", { method: "GET" });
    if (!res.ok) return null;
    const data = await res.json();
    return data.tree;
  } catch (err) {
    console.error("fetchOrgTree error:", err);
    return null;
  }
}
