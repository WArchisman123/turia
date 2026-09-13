export type TeamTab = "team" | "attendance" | "leave" | "reimbursement";

export type AttendanceViewMode = "today" | "weekly" | "monthly" | "regularization";
export type LeaveViewMode = "applications" | "summary";

export type TeamUserRole =
  | "admin"
  | "partner"
  | "manager"
  | "senior_associate"
  | "article_trainee"
  | "staff";

export type EmploymentStatus =
  | "confirmed"
  | "probation"
  | "notice_period"
  | "intern"
  | "resigned"
  | "deactivated";

export interface TeamMember {
  id: string;
  firm_id: string;
  clerk_user_id?: string;
  employee_id: string;
  first_name: string;
  last_name: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  role: TeamUserRole;
  designation: string;
  department: string;
  reporting_to_id: string | null;
  reporting_to_name?: string | null;
  shift: string;
  clients_count: number;
  tasks_count: number;
  recurring_count: number;
  joining_date: string | null;
  resignation_date: string | null;
  confirmation_date: string | null;
  salary: number;
  cost_per_hour: number;
  billing_rate: number;
  work_experience: string | null;
  employment_status: EmploymentStatus;
  status: "active" | "deactivated" | "resigned";
  dob: string | null;
  gender: string | null;
  blood_group?: string | null;
  pan_number: string | null;
  aadhaar_number: string | null;
  emergency_contact?: string | null;
  icai_member_number: string | null;
  icai_student_number: string | null;
  avatar_url: string | null;
  initials: string;
  address_line_1: string | null;
  city: string | null;
  state: string | null;
  pin_code: string | null;
  permissions_json?: Record<string, unknown>;
  last_punch_in: string | null;
  created_at: string;
}

export interface TeamKPIData {
  active_users: number;
  deactivated_users: number;
  resigned_users: number;
  seats_used: number;
  seats_total: number;
}

export interface AttendanceItem {
  id: string;
  user_id: string;
  user_name: string;
  user_initials: string;
  user_avatar?: string | null;
  attendance_date: string;
  clock_in: string | null;
  clock_out: string | null;
  total_hours: string | null;
  work_location: "Office" | "Remote" | "Client Site";
  client_name: string | null;
  in_geo_coords: string | null;
  out_geo_coords: string | null;
  office_location: string;
  distance_meters: number | null;
  distance_radius: string | null;
  status: "present" | "absent" | "half_day" | "late";
  is_regularized: boolean;
  regularization_reason?: string | null;
}

export interface LeaveApplicationItem {
  id: string;
  user_id: string;
  user_name: string;
  user_initials: string;
  user_avatar?: string | null;
  leave_type: "Casual Leave" | "Sick Leave" | "CA Exam Study Leave" | "Earned Leave";
  date_of_application: string;
  date_of_leave: string;
  from_date: string;
  to_date: string;
  no_of_days_leave: number;
  leaves_taken: number;
  leave_balance: number;
  reason: string;
  rejection_remarks?: string | null;
  status: "Approved" | "Pending" | "Rejected";
  last_updated: string;
}

export interface LeaveSummaryItem {
  user_id: string;
  user_name: string;
  user_initials: string;
  designation: string;
  casual_quota: number;
  casual_taken: number;
  casual_balance: number;
  sick_quota: number;
  sick_taken: number;
  sick_balance: number;
  exam_quota: number;
  exam_taken: number;
  exam_balance: number;
  total_taken: number;
  total_balance: number;
}

export interface EmployeeReimbursementItem {
  id: string;
  user_id: string;
  applicant: string;
  applicant_initials: string;
  reason: string;
  date: string;
  amount: number;
  status: "Approved" | "Pending" | "Rejected";
  paid: "Settled" | "Unsettled";
  attachments: string | null;
}

export interface AddEmployeeFormData {
  // Step 1: Employment Details
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  designation: string;
  role: TeamUserRole;
  department: string;
  reporting_to_id: string;
  shift: string;
  employee_id: string;
  joining_date: string;
  resignation_date: string;
  salary: number;
  cost_per_hour: number;
  billing_rate: number;
  work_experience: string;
  status: EmploymentStatus;
  confirmation_date: string;

  // Step 2: Personal Details
  dob: string;
  gender: string;
  blood_group: string;
  pan_number: string;
  aadhaar_number: string;
  emergency_contact: string;
  icai_member_number: string;
  icai_student_number: string;

  // Step 3: Address
  current_address_1: string;
  current_address_2: string;
  permanent_address_1: string;
  permanent_address_2: string;
  city: string;
  state: string;
  country: string;
  pin_code: string;

  // Step 4: Role Permissions
  permissions: Record<
    string,
    {
      view: boolean;
      add_edit: boolean;
      delete: boolean;
      import: boolean;
      export: boolean;
    }
  >;
}
