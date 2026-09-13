import { NextResponse } from "next/server";
import { getTenantContext, createAdminClient } from "@/lib/supabase/server";
import {
  TeamMember,
  TeamKPIData,
  AttendanceItem,
  LeaveApplicationItem,
  LeaveSummaryItem,
  EmployeeReimbursementItem,
  AddEmployeeFormData,
  TeamUserRole,
  EmploymentStatus,
} from "@/components/team/types";
import { Json } from "@/lib/supabase/types";

// Seed Team Members
const SEED_TEAM_MEMBERS: TeamMember[] = [
  {
    id: "usr-001",
    firm_id: "firm-001",
    clerk_user_id: "user_archi_admin",
    employee_id: "EMP-001",
    first_name: "archi",
    last_name: "saha",
    full_name: "archi saha",
    email: "arch.sas.123@gmail.com",
    phone: "8777431358",
    role: "admin",
    designation: "Managing Partner",
    department: "All Department",
    reporting_to_id: null,
    reporting_to_name: null,
    shift: "General Shift (10:00 AM - 07:00 PM)",
    clients_count: 5,
    tasks_count: 8,
    recurring_count: 4,
    joining_date: "2024-01-01",
    resignation_date: null,
    confirmation_date: "2024-01-01",
    salary: 150000,
    cost_per_hour: 1200,
    billing_rate: 3500,
    work_experience: "8+ Years",
    employment_status: "confirmed",
    status: "active",
    dob: "1994-06-15",
    gender: "Male",
    blood_group: "O+",
    pan_number: "ABCDE1234F",
    aadhaar_number: "987654321012",
    emergency_contact: "+91 98300 99999",
    icai_member_number: "FCA-412095",
    icai_student_number: null,
    avatar_url: null,
    initials: "AR",
    address_line_1: "Park Street, Flat 4B",
    city: "Kolkata",
    state: "West Bengal",
    pin_code: "700016",
    last_punch_in: "Never",
    created_at: "2024-01-01T09:00:00Z",
  },
  {
    id: "usr-002",
    firm_id: "firm-001",
    employee_id: "EMP-002",
    first_name: "Rahul",
    last_name: "Sharma",
    full_name: "Rahul Sharma",
    email: "rahul.sharma@saha.ca.in",
    phone: "98301 22334",
    role: "manager",
    designation: "Senior Audit Manager",
    department: "Audit",
    reporting_to_id: "usr-001",
    reporting_to_name: "archi saha",
    shift: "General Shift (10:00 AM - 07:00 PM)",
    clients_count: 4,
    tasks_count: 6,
    recurring_count: 2,
    joining_date: "2024-03-15",
    resignation_date: null,
    confirmation_date: "2024-06-15",
    salary: 85000,
    cost_per_hour: 650,
    billing_rate: 1800,
    work_experience: "5 Years",
    employment_status: "confirmed",
    status: "active",
    dob: "1992-09-20",
    gender: "Male",
    blood_group: "B+",
    pan_number: "BCDFG5678H",
    aadhaar_number: "876543210987",
    emergency_contact: "+91 98301 88888",
    icai_member_number: "ACA-519284",
    icai_student_number: null,
    avatar_url: null,
    initials: "RS",
    address_line_1: "Salt Lake Sector 1, Block AE",
    city: "Kolkata",
    state: "West Bengal",
    pin_code: "700064",
    last_punch_in: "10/09/2026, 09:45 AM",
    created_at: "2024-03-15T09:00:00Z",
  },
  {
    id: "usr-003",
    firm_id: "firm-001",
    employee_id: "EMP-003",
    first_name: "Priya",
    last_name: "Patel",
    full_name: "Priya Patel",
    email: "priya.patel@saha.ca.in",
    phone: "98200 44556",
    role: "senior_associate",
    designation: "Direct Tax Associate",
    department: "Direct Tax",
    reporting_to_id: "usr-002",
    reporting_to_name: "Rahul Sharma",
    shift: "General Shift (10:00 AM - 07:00 PM)",
    clients_count: 3,
    tasks_count: 4,
    recurring_count: 3,
    joining_date: "2024-07-01",
    resignation_date: null,
    confirmation_date: "2024-10-01",
    salary: 50000,
    cost_per_hour: 400,
    billing_rate: 1200,
    work_experience: "3 Years",
    employment_status: "confirmed",
    status: "active",
    dob: "1996-03-12",
    gender: "Female",
    blood_group: "A+",
    pan_number: "CDEGH9012J",
    aadhaar_number: "765432109876",
    emergency_contact: "+91 98200 77777",
    icai_member_number: "ACA-620491",
    icai_student_number: null,
    avatar_url: null,
    initials: "PP",
    address_line_1: "New Town Action Area 1",
    city: "Kolkata",
    state: "West Bengal",
    pin_code: "700156",
    last_punch_in: "10/09/2026, 09:55 AM",
    created_at: "2024-07-01T09:00:00Z",
  },
  {
    id: "usr-004",
    firm_id: "firm-001",
    employee_id: "EMP-004",
    first_name: "Vikram",
    last_name: "Malhotra",
    full_name: "Vikram Malhotra",
    email: "vikram.m@saha.ca.in",
    phone: "98740 66778",
    role: "article_trainee",
    designation: "Article Assistant (Year 2)",
    department: "GST",
    reporting_to_id: "usr-002",
    reporting_to_name: "Rahul Sharma",
    shift: "General Shift (10:00 AM - 07:00 PM)",
    clients_count: 2,
    tasks_count: 5,
    recurring_count: 1,
    joining_date: "2025-01-10",
    resignation_date: null,
    confirmation_date: "2025-01-10",
    salary: 6000,
    cost_per_hour: 150,
    billing_rate: 500,
    work_experience: "1.5 Years Articleship",
    employment_status: "intern",
    status: "active",
    dob: "2001-11-04",
    gender: "Male",
    blood_group: "B+",
    pan_number: "DEFJK3456L",
    aadhaar_number: "654321098765",
    emergency_contact: "+91 98740 11111",
    icai_member_number: null,
    icai_student_number: "ERO0294819",
    avatar_url: null,
    initials: "VM",
    address_line_1: "Bhowanipore, Ashutosh Mukherjee Rd",
    city: "Kolkata",
    state: "West Bengal",
    pin_code: "700025",
    last_punch_in: "10/09/2026, 10:02 AM",
    created_at: "2025-01-10T09:00:00Z",
  },
];

// Seed Attendance Logs (matching team-2.png)
const SEED_ATTENDANCE: AttendanceItem[] = [
  {
    id: "att-001",
    user_id: "usr-001",
    user_name: "archi",
    user_initials: "AR",
    attendance_date: "03/09/2026",
    clock_in: "09:45 AM",
    clock_out: "07:15 PM",
    total_hours: "9h 30m",
    work_location: "Office",
    client_name: null,
    in_geo_coords: "22.5512° N, 88.3524° E",
    out_geo_coords: "22.5512° N, 88.3524° E",
    office_location: "Kolkata HQ (Camac St)",
    distance_meters: 18,
    distance_radius: "18m (Within 100m)",
    status: "present",
    is_regularized: false,
  },
  {
    id: "att-002",
    user_id: "usr-002",
    user_name: "Rahul Sharma",
    user_initials: "RS",
    attendance_date: "03/09/2026",
    clock_in: "09:50 AM",
    clock_out: "07:05 PM",
    total_hours: "9h 15m",
    work_location: "Client Site",
    client_name: "Reliance Retail Ltd",
    in_geo_coords: "22.5726° N, 88.3639° E",
    out_geo_coords: "22.5726° N, 88.3639° E",
    office_location: "Kolkata HQ (Camac St)",
    distance_meters: 2400,
    distance_radius: "2.4 km (Client Geofence)",
    status: "present",
    is_regularized: false,
  },
  {
    id: "att-003",
    user_id: "usr-003",
    user_name: "Priya Patel",
    user_initials: "PP",
    attendance_date: "03/09/2026",
    clock_in: "10:15 AM",
    clock_out: "07:30 PM",
    total_hours: "9h 15m",
    work_location: "Office",
    client_name: null,
    in_geo_coords: "22.5514° N, 88.3522° E",
    out_geo_coords: "22.5514° N, 88.3522° E",
    office_location: "Kolkata HQ (Camac St)",
    distance_meters: 25,
    distance_radius: "25m (Within 100m)",
    status: "late",
    is_regularized: true,
    regularization_reason: "Metro signal delay at Rabindra Sadan",
  },
  {
    id: "att-004",
    user_id: "usr-004",
    user_name: "Vikram Malhotra",
    user_initials: "VM",
    attendance_date: "03/09/2026",
    clock_in: "10:02 AM",
    clock_out: "06:45 PM",
    total_hours: "8h 43m",
    work_location: "Office",
    client_name: null,
    in_geo_coords: "22.5511° N, 88.3525° E",
    out_geo_coords: "22.5511° N, 88.3525° E",
    office_location: "Kolkata HQ (Camac St)",
    distance_meters: 32,
    distance_radius: "32m (Within 100m)",
    status: "present",
    is_regularized: false,
  },
];

// Seed Leave Applications (matching team-3.png)
const SEED_LEAVE_APPLICATIONS: LeaveApplicationItem[] = [
  {
    id: "lv-001",
    user_id: "usr-004",
    user_name: "Vikram Malhotra",
    user_initials: "VM",
    leave_type: "CA Exam Study Leave",
    date_of_application: "28/08/2026",
    date_of_leave: "01/10/2026 - 31/10/2026",
    from_date: "2026-10-01",
    to_date: "2026-10-31",
    no_of_days_leave: 31,
    leaves_taken: 10,
    leave_balance: 80,
    reason: "ICAI CA Final Group 1 Exam Preparation under ICAI Article Regulations",
    rejection_remarks: null,
    status: "Approved",
    last_updated: "29/08/2026",
  },
  {
    id: "lv-002",
    user_id: "usr-003",
    user_name: "Priya Patel",
    user_initials: "PP",
    leave_type: "Casual Leave",
    date_of_application: "02/09/2026",
    date_of_leave: "15/09/2026 - 16/09/2026",
    from_date: "2026-09-15",
    to_date: "2026-09-16",
    no_of_days_leave: 2,
    leaves_taken: 4,
    leave_balance: 8,
    reason: "Family wedding outstation",
    rejection_remarks: null,
    status: "Pending",
    last_updated: "02/09/2026",
  },
  {
    id: "lv-003",
    user_id: "usr-002",
    user_name: "Rahul Sharma",
    user_initials: "RS",
    leave_type: "Sick Leave",
    date_of_application: "20/08/2026",
    date_of_leave: "21/08/2026 - 22/08/2026",
    from_date: "2026-08-21",
    to_date: "2026-08-22",
    no_of_days_leave: 2,
    leaves_taken: 2,
    leave_balance: 8,
    reason: "Viral fever and doctor consultation",
    rejection_remarks: null,
    status: "Approved",
    last_updated: "21/08/2026",
  },
];

// Seed Leave Summary
const SEED_LEAVE_SUMMARY: LeaveSummaryItem[] = [
  {
    user_id: "usr-001",
    user_name: "archi saha",
    user_initials: "AR",
    designation: "Managing Partner",
    casual_quota: 12,
    casual_taken: 0,
    casual_balance: 12,
    sick_quota: 10,
    sick_taken: 0,
    sick_balance: 10,
    exam_quota: 0,
    exam_taken: 0,
    exam_balance: 0,
    total_taken: 0,
    total_balance: 22,
  },
  {
    user_id: "usr-002",
    user_name: "Rahul Sharma",
    user_initials: "RS",
    designation: "Senior Audit Manager",
    casual_quota: 12,
    casual_taken: 3,
    casual_balance: 9,
    sick_quota: 10,
    sick_taken: 2,
    sick_balance: 8,
    exam_quota: 0,
    exam_taken: 0,
    exam_balance: 0,
    total_taken: 5,
    total_balance: 17,
  },
  {
    user_id: "usr-003",
    user_name: "Priya Patel",
    user_initials: "PP",
    designation: "Direct Tax Associate",
    casual_quota: 12,
    casual_taken: 4,
    casual_balance: 8,
    sick_quota: 10,
    sick_taken: 1,
    sick_balance: 9,
    exam_quota: 0,
    exam_taken: 0,
    exam_balance: 0,
    total_taken: 5,
    total_balance: 17,
  },
  {
    user_id: "usr-004",
    user_name: "Vikram Malhotra",
    user_initials: "VM",
    designation: "Article Assistant (Year 2)",
    casual_quota: 12,
    casual_taken: 2,
    casual_balance: 10,
    sick_quota: 10,
    sick_taken: 1,
    sick_balance: 9,
    exam_quota: 90,
    exam_taken: 10,
    exam_balance: 80,
    total_taken: 13,
    total_balance: 99,
  },
];

// Seed Reimbursements (matching team-4.png)
const SEED_REIMBURSEMENTS: EmployeeReimbursementItem[] = [
  {
    id: "clm-001",
    user_id: "usr-002",
    applicant: "Rahul Sharma",
    applicant_initials: "RS",
    reason: "Outstation Statutory Audit Conveyance to Haldia Petrochemicals Plant",
    date: "01/09/2026",
    amount: 4250,
    status: "Approved",
    paid: "Settled",
    attachments: "/docs/receipts/fuel-haldia-audit.pdf",
  },
  {
    id: "clm-002",
    user_id: "usr-003",
    applicant: "Priya Patel",
    applicant_initials: "PP",
    reason: "MCA ROC e-Challan payment for Form MGT-7A (Client reimbursed)",
    date: "04/09/2026",
    amount: 1800,
    status: "Approved",
    paid: "Settled",
    attachments: "/docs/receipts/mca-challan-mgt7a.pdf",
  },
  {
    id: "clm-003",
    user_id: "usr-004",
    applicant: "Vikram Malhotra",
    applicant_initials: "VM",
    reason: "Client Site Physical Stock Verification Uber ride to Dankuni warehouse",
    date: "07/09/2026",
    amount: 680,
    status: "Pending",
    paid: "Unsettled",
    attachments: "/docs/receipts/uber-dankuni-audit.pdf",
  },
  {
    id: "clm-004",
    user_id: "usr-002",
    applicant: "Rahul Sharma",
    applicant_initials: "RS",
    reason: "ITAT Tribunal physical paper-book printing & urgent registry stamps",
    date: "09/09/2026",
    amount: 950,
    status: "Pending",
    paid: "Unsettled",
    attachments: "/docs/receipts/itat-stamps-paperbook.pdf",
  },
];

export async function GET() {
  try {
    const tenant = await getTenantContext();
    const firmId = tenant?.firmId;

    if (!firmId) {
      return NextResponse.json({
        members: SEED_TEAM_MEMBERS,
        kpi: {
          active_users: 4,
          deactivated_users: 0,
          resigned_users: 0,
          seats_used: 4,
          seats_total: 5,
        },
        attendance: SEED_ATTENDANCE,
        leaves: SEED_LEAVE_APPLICATIONS,
        leaveSummary: SEED_LEAVE_SUMMARY,
        reimbursements: SEED_REIMBURSEMENTS,
      });
    }

    const supabase = createAdminClient();

    // Query firm to get total license seats
    const { data: firm } = await supabase
      .from("firms")
      .select("total_license_seats")
      .eq("id", firmId)
      .single();

    // Query firm_users
    const { data: dbUsers } = await supabase
      .from("firm_users")
      .select("*")
      .eq("firm_id", firmId)
      .order("created_at", { ascending: false });

    let membersToUse: TeamMember[] = [];

    if (dbUsers && dbUsers.length > 0) {
      membersToUse = dbUsers.map((u) => ({
        id: u.id,
        firm_id: u.firm_id,
        clerk_user_id: u.clerk_user_id,
        employee_id: u.employee_id || `EMP-${u.id.slice(0, 4).toUpperCase()}`,
        first_name: u.first_name,
        last_name: u.last_name,
        full_name: u.full_name || `${u.first_name} ${u.last_name || ""}`.trim(),
        email: u.email,
        phone: u.phone,
        role: (u.role as TeamUserRole) || "staff",
        designation: u.designation || "Executive",
        department: u.department || "All Department",
        reporting_to_id: u.reporting_to_id,
        reporting_to_name: null,
        shift: u.shift || "General Shift (10:00 AM - 07:00 PM)",
        clients_count: 0,
        tasks_count: 0,
        recurring_count: 0,
        joining_date: u.joining_date,
        resignation_date: u.resignation_date,
        confirmation_date: u.confirmation_date,
        salary: Number(u.salary) || 0,
        cost_per_hour: Number(u.cost_per_hour) || 0,
        billing_rate: Number(u.billing_rate) || 0,
        work_experience: u.work_experience,
        employment_status: (u.employment_status as EmploymentStatus) || "confirmed",
        status: u.is_active ? "active" : "deactivated",
        dob: u.dob,
        gender: u.gender,
        blood_group: null,
        pan_number: u.pan_number,
        aadhaar_number: u.aadhaar_number,
        emergency_contact: null,
        icai_member_number: u.icai_member_number,
        icai_student_number: u.icai_student_number,
        avatar_url: u.avatar_url,
        initials: (
          (u.first_name?.[0] || "") + (u.last_name?.[0] || "")
        ).toUpperCase() || "US",
        address_line_1: u.address_line_1,
        city: u.city,
        state: u.state,
        pin_code: u.pin_code,
        last_punch_in: u.last_punch_in || "Never",
        created_at: u.created_at || new Date().toISOString(),
      }));
    } else {
      membersToUse = SEED_TEAM_MEMBERS;
    }

    // Query attendance
    const { data: dbAttendance } = await supabase
      .from("attendance_logs")
      .select("*, firm_users(first_name, last_name, full_name)")
      .eq("firm_id", firmId)
      .order("attendance_date", { ascending: false });

    let attendanceToUse: AttendanceItem[] = [];
    if (dbAttendance && dbAttendance.length > 0) {
      attendanceToUse = dbAttendance.map((a) => {
        const u = (a as Record<string, unknown>).firm_users as Record<string, unknown> | null;
        const name = (u?.full_name as string) || "Team Member";
        const initials = name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();
        return {
          id: a.id,
          user_id: a.user_id,
          user_name: name,
          user_initials: initials,
          attendance_date: a.attendance_date,
          clock_in: a.clock_in ? new Date(a.clock_in).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : null,
          clock_out: a.clock_out ? new Date(a.clock_out).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : null,
          total_hours: a.total_minutes ? `${Math.floor(a.total_minutes / 60)}h ${a.total_minutes % 60}m` : null,
          work_location: (a.work_location as AttendanceItem["work_location"]) || "Office",
          client_name: null,
          in_geo_coords: a.in_geo_coords,
          out_geo_coords: a.out_geo_coords,
          office_location: "Kolkata HQ (Camac St)",
          distance_meters: a.distance_meters,
          distance_radius: a.distance_meters ? `${a.distance_meters}m` : null,
          status: (a.status as AttendanceItem["status"]) || "present",
          is_regularized: a.is_regularized,
        };
      });
    } else {
      attendanceToUse = SEED_ATTENDANCE;
    }

    // Query leaves
    const { data: dbLeaves } = await supabase
      .from("leave_applications")
      .select("*, firm_users(first_name, last_name, full_name)")
      .eq("firm_id", firmId)
      .order("created_at", { ascending: false });

    let leavesToUse: LeaveApplicationItem[] = [];
    if (dbLeaves && dbLeaves.length > 0) {
      leavesToUse = dbLeaves.map((l) => {
        const u = (l as Record<string, unknown>).firm_users as Record<string, unknown> | null;
        const name = (u?.full_name as string) || "Team Member";
        const initials = name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();
        return {
          id: l.id,
          user_id: l.user_id,
          user_name: name,
          user_initials: initials,
          leave_type: (l.leave_type as LeaveApplicationItem["leave_type"]) || "Casual Leave",
          date_of_application: l.created_at ? new Date(l.created_at).toLocaleDateString("en-GB") : "01/09/2026",
          date_of_leave: `${l.from_date} - ${l.to_date}`,
          from_date: l.from_date,
          to_date: l.to_date,
          no_of_days_leave: Number(l.days_count) || 1,
          leaves_taken: 2,
          leave_balance: 10,
          reason: l.reason,
          rejection_remarks: l.rejection_remarks,
          status: (l.status === "approved" ? "Approved" : l.status === "rejected" ? "Rejected" : "Pending") as LeaveApplicationItem["status"],
          last_updated: l.updated_at ? new Date(l.updated_at).toLocaleDateString("en-GB") : "01/09/2026",
        };
      });
    } else {
      leavesToUse = SEED_LEAVE_APPLICATIONS;
    }

    // Query reimbursements
    const { data: dbReimbursements } = await supabase
      .from("employee_expense_claims")
      .select("*, firm_users(first_name, last_name, full_name)")
      .eq("firm_id", firmId)
      .order("claim_date", { ascending: false });

    let reimbursementsToUse: EmployeeReimbursementItem[] = [];
    if (dbReimbursements && dbReimbursements.length > 0) {
      reimbursementsToUse = dbReimbursements.map((r) => {
        const u = (r as Record<string, unknown>).firm_users as Record<string, unknown> | null;
        const name = (u?.full_name as string) || "Staff Member";
        const initials = name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();
        return {
          id: r.id,
          user_id: r.user_id,
          applicant: name,
          applicant_initials: initials,
          reason: r.reason,
          date: r.claim_date,
          amount: Number(r.amount) || 0,
          status: (r.status === "approved" ? "Approved" : r.status === "rejected" ? "Rejected" : "Pending") as EmployeeReimbursementItem["status"],
          paid: r.is_settled ? "Settled" : "Unsettled",
          attachments: r.receipt_url,
        };
      });
    } else {
      reimbursementsToUse = SEED_REIMBURSEMENTS;
    }

    const activeCount = membersToUse.filter((m) => m.status === "active").length;
    const deactivatedCount = membersToUse.filter((m) => m.status === "deactivated").length;
    const resignedCount = membersToUse.filter((m) => m.status === "resigned").length;
    const seatsTotal = firm?.total_license_seats || 5;

    const kpi: TeamKPIData = {
      active_users: activeCount,
      deactivated_users: deactivatedCount,
      resigned_users: resignedCount,
      seats_used: activeCount,
      seats_total: seatsTotal,
    };

    return NextResponse.json({
      members: membersToUse,
      kpi,
      attendance: attendanceToUse,
      leaves: leavesToUse,
      leaveSummary: SEED_LEAVE_SUMMARY,
      reimbursements: reimbursementsToUse,
    });
  } catch (error: unknown) {
    console.error("Error in GET /api/team:", error);
    return NextResponse.json({
      members: SEED_TEAM_MEMBERS,
      kpi: {
        active_users: 4,
        deactivated_users: 0,
        resigned_users: 0,
        seats_used: 4,
        seats_total: 5,
      },
      attendance: SEED_ATTENDANCE,
      leaves: SEED_LEAVE_APPLICATIONS,
      leaveSummary: SEED_LEAVE_SUMMARY,
      reimbursements: SEED_REIMBURSEMENTS,
    });
  }
}

export async function POST(req: Request) {
  try {
    const tenant = await getTenantContext();
    const body: AddEmployeeFormData = await req.json();

    const fullName = `${body.first_name} ${body.last_name || ""}`.trim();
    const initials = (
      (body.first_name?.[0] || "") + (body.last_name?.[0] || "")
    ).toUpperCase() || "US";

    const newMember: TeamMember = {
      id: `usr-${Date.now()}`,
      firm_id: tenant?.firmId || "firm-001",
      clerk_user_id: `clerk_${Date.now()}`,
      employee_id: body.employee_id || `EMP-00${Math.floor(10 + Math.random() * 90)}`,
      first_name: body.first_name,
      last_name: body.last_name || null,
      full_name: fullName,
      email: body.email,
      phone: body.phone || null,
      role: body.role || "staff",
      designation: body.designation || "Staff Associate",
      department: body.department || "Audit",
      reporting_to_id: body.reporting_to_id || null,
      reporting_to_name: null,
      shift: body.shift || "General Shift (10:00 AM - 07:00 PM)",
      clients_count: 0,
      tasks_count: 0,
      recurring_count: 0,
      joining_date: body.joining_date || new Date().toISOString().split("T")[0],
      resignation_date: body.resignation_date || null,
      confirmation_date: body.confirmation_date || null,
      salary: Number(body.salary) || 0,
      cost_per_hour: Number(body.cost_per_hour) || 0,
      billing_rate: Number(body.billing_rate) || 0,
      work_experience: body.work_experience || null,
      employment_status: body.status || "confirmed",
      status: "active",
      dob: body.dob || null,
      gender: body.gender || null,
      blood_group: body.blood_group || null,
      pan_number: body.pan_number || null,
      aadhaar_number: body.aadhaar_number || null,
      emergency_contact: body.emergency_contact || null,
      icai_member_number: body.icai_member_number || null,
      icai_student_number: body.icai_student_number || null,
      avatar_url: null,
      initials,
      address_line_1: body.current_address_1 || null,
      city: body.city || "Kolkata",
      state: body.state || "West Bengal",
      pin_code: body.pin_code || null,
      permissions_json: body.permissions,
      last_punch_in: "Never",
      created_at: new Date().toISOString(),
    };

    if (tenant?.firmId) {
      const supabase = createAdminClient();
      await supabase.from("firm_users").insert({
        firm_id: tenant.firmId,
        clerk_user_id: newMember.clerk_user_id!,
        employee_id: newMember.employee_id,
        first_name: newMember.first_name,
        last_name: newMember.last_name,
        full_name: newMember.full_name,
        email: newMember.email,
        phone: newMember.phone,
        role: newMember.role,
        designation: newMember.designation,
        department: newMember.department,
        reporting_to_id: newMember.reporting_to_id,
        shift: newMember.shift,
        joining_date: newMember.joining_date,
        resignation_date: newMember.resignation_date,
        confirmation_date: newMember.confirmation_date,
        salary: newMember.salary,
        cost_per_hour: newMember.cost_per_hour,
        billing_rate: newMember.billing_rate,
        work_experience: newMember.work_experience,
        employment_status: newMember.employment_status,
        dob: newMember.dob,
        gender: newMember.gender,
        pan_number: newMember.pan_number,
        aadhaar_number: newMember.aadhaar_number,
        icai_member_number: newMember.icai_member_number,
        icai_student_number: newMember.icai_student_number,
        address_line_1: newMember.address_line_1,
        city: newMember.city,
        state: newMember.state,
        pin_code: newMember.pin_code,
        permissions_json: (body.permissions || {}) as unknown as Json,
        is_active: true,
      });
    }

    return NextResponse.json({ member: newMember }, { status: 201 });
  } catch (error: unknown) {
    console.error("Error in POST /api/team:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create team member" },
      { status: 500 }
    );
  }
}
