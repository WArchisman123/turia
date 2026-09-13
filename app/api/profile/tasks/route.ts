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
      .select("id, full_name")
      .eq("firm_id", firmId)
      .eq("clerk_user_id", tenant.userId)
      .maybeSingle();

    if (!user) {
      const { data: firstUser } = await supabase
        .from("firm_users")
        .select("id, full_name")
        .eq("firm_id", firmId)
        .limit(1)
        .maybeSingle();
      user = firstUser;
    }

    const userId = user?.id;
    if (!userId) {
      return NextResponse.json({ tasks: [] });
    }

    // Fetch tasks where assigned_to_id = userId
    const { data: dbTasks, error } = await supabase
      .from("compliance_tasks")
      .select(`
        id,
        task_code,
        task_title,
        financial_year,
        due_date,
        priority,
        stage,
        status,
        client_id,
        service_id,
        clients (
          trade_name
        ),
        services_master (
          service_name,
          category
        )
      `)
      .eq("firm_id", firmId)
      .eq("assigned_to_id", userId)
      .order("due_date", { ascending: true });

    if (error) {
      console.error("Error fetching profile tasks:", error);
      return NextResponse.json({ tasks: [] });
    }

    const formattedTasks = (dbTasks || []).map((t) => {
      const clientName = (t.clients as unknown as { trade_name: string } | null)?.trade_name || "Assigned Client";
      const service = (t.services_master as unknown as { service_name: string } | null)?.service_name || "Statutory Compliance";

      const stageMapping: Record<string, string> = {
        not_started: "In Progress",
        in_progress: "In Progress",
        review: "Under Review",
        pending_client: "Pending Client Info",
        completed: "Completed",
      };

      const priorityMapping: Record<string, "High" | "Medium" | "Low"> = {
        urgent: "High",
        high: "High",
        normal: "Medium",
        medium: "Medium",
        low: "Low",
      };

      return {
        id: t.id,
        taskName: t.task_title,
        clientName,
        service,
        endDate: new Date(t.due_date).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).replace(/ /g, "-"),
        assignee: user?.full_name || "archi",
        reviewer: "Practice Partner",
        status: (stageMapping[t.stage] || "In Progress") as "In Progress" | "Under Review" | "Completed" | "Pending Client Info",
        priority: priorityMapping[t.priority || "normal"] || "Medium",
      };
    });

    return NextResponse.json({ tasks: formattedTasks });
  } catch (error) {
    console.error("Error in GET /api/profile/tasks:", error);
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
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
    const { taskIds, newAssigneeId } = body;

    if (!taskIds || !Array.isArray(taskIds) || taskIds.length === 0) {
      return NextResponse.json({ error: "Task IDs are required" }, { status: 400 });
    }

    const supabase = createAdminClient();

    let targetUserId = newAssigneeId;
    if (!targetUserId || targetUserId === "all") {
      const { data: targetUser } = await supabase
        .from("firm_users")
        .select("id")
        .eq("firm_id", firmId)
        .neq("clerk_user_id", tenant.userId)
        .limit(1)
        .maybeSingle();
      targetUserId = targetUser?.id;
    }

    if (targetUserId) {
      await supabase
        .from("compliance_tasks")
        .update({ assigned_to_id: targetUserId })
        .eq("firm_id", firmId)
        .in("id", taskIds);
    }

    return NextResponse.json({ success: true, count: taskIds.length });
  } catch (error) {
    console.error("Error in PATCH /api/profile/tasks:", error);
    return NextResponse.json({ error: "Failed to reassign tasks" }, { status: 500 });
  }
}
