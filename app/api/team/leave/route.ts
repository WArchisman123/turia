import { NextResponse } from "next/server";
import { getTenantContext, createAdminClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const tenant = await getTenantContext();
    const body = await req.json();

    const newLeave = {
      id: `lv-${Date.now()}`,
      user_id: body.userId,
      user_name: body.userName || "Team Member",
      user_initials: (body.userName || "TM").slice(0, 2).toUpperCase(),
      leave_type: body.leaveType || "Casual Leave",
      date_of_application: new Date().toLocaleDateString("en-GB"),
      date_of_leave: `${body.fromDate} - ${body.toDate}`,
      from_date: body.fromDate,
      to_date: body.toDate,
      no_of_days_leave: Number(body.daysCount) || 1,
      leaves_taken: 3,
      leave_balance: 9,
      reason: body.reason,
      status: "Pending",
      last_updated: new Date().toLocaleDateString("en-GB"),
    };

    if (tenant?.firmId) {
      const supabase = createAdminClient();
      await supabase.from("leave_applications").insert({
        firm_id: tenant.firmId,
        user_id: body.userId,
        leave_type: body.leaveType,
        from_date: body.fromDate,
        to_date: body.toDate,
        days_count: Number(body.daysCount) || 1,
        reason: body.reason,
        status: "pending",
      });
    }

    return NextResponse.json({ leave: newLeave }, { status: 201 });
  } catch (error: unknown) {
    console.error("Error in POST /api/team/leave:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create leave application" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const tenant = await getTenantContext();
    const body = await req.json();
    const { id, status, rejectionRemarks } = body;

    const dbStatus = status === "Approved" ? "approved" : status === "Rejected" ? "rejected" : "pending";

    if (tenant?.firmId) {
      const supabase = createAdminClient();
      await supabase
        .from("leave_applications")
        .update({
          status: dbStatus,
          rejection_remarks: rejectionRemarks || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("firm_id", tenant.firmId);
    }

    return NextResponse.json({
      leave: {
        id,
        status,
        rejection_remarks: rejectionRemarks || null,
        last_updated: new Date().toLocaleDateString("en-GB"),
      },
    });
  } catch (error: unknown) {
    console.error("Error in PATCH /api/team/leave:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update leave application" },
      { status: 500 }
    );
  }
}
