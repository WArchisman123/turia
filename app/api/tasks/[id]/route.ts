import { NextResponse } from "next/server";
import { getTenantContext, createAdminClient } from "@/lib/supabase/server";

import { Database } from "@/lib/supabase/types";

type ComplianceTaskUpdate = Database["public"]["Tables"]["compliance_tasks"]["Update"];

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const tenant = await getTenantContext();
    const firmId = tenant?.firmId;

    if (firmId && id && !id.startsWith("task-")) {
      const supabase = createAdminClient();
      const updates: ComplianceTaskUpdate = {};

      if (body.stage !== undefined) updates.stage = body.stage;
      if (body.status !== undefined) updates.status = body.status;
      if (body.priority !== undefined) updates.priority = body.priority;
      if (body.assignedToId !== undefined) updates.assigned_to_id = body.assignedToId;
      if (body.dueDate !== undefined) updates.due_date = body.dueDate;

      const { data, error } = await supabase
        .from("compliance_tasks")
        .update(updates)
        .eq("id", id)
        .eq("firm_id", firmId)
        .select()
        .single();

      if (!error && data) {
        // Record activity log
        await supabase.from("task_activities").insert({
          firm_id: firmId,
          task_id: id,
          action_type: "Task Updated",
          description: `Task updated: ${Object.keys(updates).join(", ")}`,
        });

        return NextResponse.json({ task: data });
      }
    }

    return NextResponse.json({ task: { id, ...body } });
  } catch (err) {
    console.error("PATCH /api/tasks/[id] error:", err);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tenant = await getTenantContext();
    const firmId = tenant?.firmId;

    if (firmId && id && !id.startsWith("task-")) {
      const supabase = createAdminClient();
      await supabase
        .from("compliance_tasks")
        .delete()
        .eq("id", id)
        .eq("firm_id", firmId);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/tasks/[id] error:", err);
    return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
  }
}
