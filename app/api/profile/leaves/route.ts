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

    let { data: user } = await supabase
      .from("firm_users")
      .select("id")
      .eq("firm_id", firmId)
      .eq("clerk_user_id", tenant.userId)
      .maybeSingle();

    if (!user) {
      const { data: firstUser } = await supabase
        .from("firm_users")
        .select("id")
        .eq("firm_id", firmId)
        .limit(1)
        .maybeSingle();
      user = firstUser;
    }

    const userId = user?.id;
    if (!userId) {
      return NextResponse.json({ leaves: [], balance: null });
    }

    const { data: leaves } = await supabase
      .from("leave_applications")
      .select("*")
      .eq("firm_id", firmId)
      .eq("user_id", userId)
      .order("from_date", { ascending: false });

    const { data: balance } = await supabase
      .from("leave_balances")
      .select("*")
      .eq("firm_id", firmId)
      .eq("user_id", userId)
      .maybeSingle();

    const formattedLeaves = (leaves || []).map((l) => ({
      id: l.id,
      leaveType: l.leave_type,
      startDate: l.from_date,
      endDate: l.to_date,
      days: Number(l.days_count),
      reason: l.reason,
      status: l.status === "approved" ? "Approved" : l.status === "rejected" ? "Rejected" : "Pending",
      appliedOn: new Date(l.created_at).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).replace(/ /g, "-"),
    }));

    return NextResponse.json({
      leaves: formattedLeaves,
      balance,
    });
  } catch (error) {
    console.error("Error in GET /api/profile/leaves:", error);
    return NextResponse.json({ error: "Failed to fetch leaves" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const tenant = await getTenantContext();
    if (!tenant || !tenant.firmId) {
      return NextResponse.json({ error: "Unauthorized or missing organization" }, { status: 401 });
    }

    const firmId = tenant.firmId;
    const body = await req.json();
    const supabase = createAdminClient();

    let { data: user } = await supabase
      .from("firm_users")
      .select("id")
      .eq("firm_id", firmId)
      .eq("clerk_user_id", tenant.userId)
      .maybeSingle();

    if (!user) {
      const { data: firstUser } = await supabase
        .from("firm_users")
        .select("id")
        .eq("firm_id", firmId)
        .limit(1)
        .maybeSingle();
      user = firstUser;
    }

    if (!user?.id) {
      return NextResponse.json({ error: "User record not found" }, { status: 404 });
    }

    const { data: newLeave, error } = await supabase
      .from("leave_applications")
      .insert({
        firm_id: firmId,
        user_id: user.id,
        leave_type: body.leaveType,
        from_date: body.startDate,
        to_date: body.endDate,
        days_count: Number(body.days) || 1,
        reason: body.reason,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating leave application:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const formatted = {
      id: newLeave.id,
      leaveType: newLeave.leave_type,
      startDate: newLeave.from_date,
      endDate: newLeave.to_date,
      days: Number(newLeave.days_count),
      reason: newLeave.reason,
      status: "Pending",
      appliedOn: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).replace(/ /g, "-"),
    };

    return NextResponse.json({ success: true, leave: formatted });
  } catch (error) {
    console.error("Error in POST /api/profile/leaves:", error);
    return NextResponse.json({ error: "Failed to apply for leave" }, { status: 500 });
  }
}
