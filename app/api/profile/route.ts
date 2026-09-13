import { NextResponse } from "next/server";
import { getTenantContext, createAdminClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const tenant = await getTenantContext();
    if (!tenant || !tenant.firmId) {
      return NextResponse.json({ error: "Unauthorized or missing organization" }, { status: 401 });
    }

    const firmId = tenant.firmId;
    const supabase = createAdminClient();

    // 1. Fetch current firm user
    let { data: userProfile } = await supabase
      .from("firm_users")
      .select("*")
      .eq("firm_id", firmId)
      .eq("clerk_user_id", tenant.userId)
      .maybeSingle();

    // If not found by clerk_user_id, try by primary user
    if (!userProfile) {
      const { data: firstUser } = await supabase
        .from("firm_users")
        .select("*")
        .eq("firm_id", firmId)
        .limit(1)
        .maybeSingle();
      userProfile = firstUser;
    }

    // 2. Fetch firm details
    const { data: firm } = await supabase
      .from("firms")
      .select("*")
      .eq("id", firmId)
      .maybeSingle();

    // 3. Fetch monthly attendance logs for the current user
    let attendanceLogs: Array<{
      id: string;
      attendance_date: string;
      clock_in: string;
      clock_out: string | null;
      status: string;
      total_minutes: number | null;
    }> = [];

    if (userProfile?.id) {
      const { data: logs } = await supabase
        .from("attendance_logs")
        .select("id, attendance_date, clock_in, clock_out, status, total_minutes")
        .eq("firm_id", firmId)
        .eq("user_id", userProfile.id)
        .order("attendance_date", { ascending: true });

      if (logs) {
        attendanceLogs = logs;
      }
    }

    // 4. Fetch leave balances & applications
    let leaveBalance = null;
    let leaveApplications: Array<{
      id: string;
      leave_type: string;
      from_date: string;
      to_date: string;
      days_count: number;
      reason: string;
      status: string;
      created_at: string;
    }> = [];

    if (userProfile?.id) {
      const { data: balance } = await supabase
        .from("leave_balances")
        .select("*")
        .eq("firm_id", firmId)
        .eq("user_id", userProfile.id)
        .maybeSingle();
      leaveBalance = balance;

      const { data: apps } = await supabase
        .from("leave_applications")
        .select("*")
        .eq("firm_id", firmId)
        .eq("user_id", userProfile.id)
        .order("created_at", { ascending: false });
      if (apps) {
        leaveApplications = apps;
      }
    }

    return NextResponse.json({
      user: userProfile,
      firm,
      attendanceLogs,
      leaveBalance,
      leaveApplications,
    });
  } catch (error) {
    console.error("Error in GET /api/profile:", error);
    return NextResponse.json({ error: "Failed to fetch profile details" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const tenant = await getTenantContext();
    if (!tenant || !tenant.firmId) {
      return NextResponse.json({ error: "Unauthorized or missing organization" }, { status: 401 });
    }

    const firmId = tenant.firmId;
    const body = await req.json();
    const supabase = createAdminClient();

    const { data: updatedUser, error } = await supabase
      .from("firm_users")
      .update({
        first_name: body.firstName,
        last_name: body.lastName,
        full_name: `${body.firstName || ""} ${body.lastName || ""}`.trim() || undefined,
        phone: body.phone,
        email: body.email,
        designation: body.designation,
        department: body.department,
        shift: body.shift,
        dob: body.dob,
        gender: body.gender,
        pan_number: body.panNumber,
        aadhaar_number: body.aadhaarNumber,
        icai_member_number: body.icaiMemberNumber,
        address_line_1: body.addressLine1,
        city: body.city,
        state: body.state,
        pin_code: body.pinCode,
        salary: body.salary ? Number(body.salary) : undefined,
        cost_per_hour: body.costPerHour ? Number(body.costPerHour) : undefined,
        billing_rate: body.billingRate ? Number(body.billingRate) : undefined,
        work_experience: body.workExperience,
      })
      .eq("firm_id", firmId)
      .eq("clerk_user_id", tenant.userId)
      .select()
      .maybeSingle();

    if (error) {
      console.error("Error updating profile in Supabase:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Error in PATCH /api/profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
