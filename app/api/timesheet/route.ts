import { NextResponse } from "next/server";
import { getTenantContext, createAdminClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const tenant = await getTenantContext();
    if (!tenant || !tenant.firmId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createAdminClient();
    const { data: entries, error } = await supabase
      .from("timesheet_entries")
      .select("*")
      .eq("firm_id", tenant.firmId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching timesheet entries:", error);
      return NextResponse.json({ entries: [] });
    }

    return NextResponse.json({ entries: entries || [] });
  } catch (error) {
    console.error("Error in GET /api/timesheet:", error);
    return NextResponse.json({ error: "Failed to fetch timesheet" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const tenant = await getTenantContext();
    if (!tenant || !tenant.firmId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const {
      client,
      service,
      task,
      day,
      startTime,
      endTime,
      durationHours,
      costPerHour,
      billingRate,
      isBillable,
      description,
    } = body;

    const supabase = createAdminClient();

    // Get firm user
    const { data: user } = await supabase
      .from("firm_users")
      .select("id")
      .eq("firm_id", tenant.firmId)
      .eq("clerk_user_id", tenant.userId)
      .single();

    if (!user) {
      return NextResponse.json({ error: "Firm user not found" }, { status: 404 });
    }

    const todayDate = new Date().toISOString().slice(0, 10);

    const { data: newEntry, error } = await supabase
      .from("timesheet_entries")
      .insert({
        firm_id: tenant.firmId,
        user_id: user.id,
        entry_date: todayDate,
        hours_spent: Number(durationHours) || 1.0,
        hourly_rate: Number(billingRate) || 1500,
        cost_rate: Number(costPerHour) || 350,
        is_billable: isBillable ?? true,
        work_description: `${client ? `[${client}] ` : ""}${service ? `${service} - ` : ""}${task ? `${task}: ` : ""}${description || "Timesheet work logged"}`,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating timesheet entry:", error);
      return NextResponse.json({ error: "Failed to create entry" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      entry: {
        id: newEntry.id,
        client: client || "Acme Global Logistics",
        service: service || "GST Return Filing",
        task: task || "GSTR-3B ITC Reco",
        day: day || "Today",
        startTime: startTime || "10:00 AM",
        endTime: endTime || "12:30 PM",
        durationHours: Number(durationHours) || 2.5,
        costPerHour: Number(costPerHour) || 350,
        billingRate: Number(billingRate) || 1500,
        isBillable: isBillable ?? true,
        description: description || "Timesheet log",
      },
    });
  } catch (error) {
    console.error("Error in POST /api/timesheet:", error);
    return NextResponse.json({ error: "Failed to create timesheet entry" }, { status: 500 });
  }
}
