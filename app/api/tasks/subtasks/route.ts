import { NextResponse } from "next/server";
import { getTenantContext, createAdminClient } from "@/lib/supabase/server";

export async function PATCH(req: Request) {
  try {
    const { id, isCompleted } = await req.json();
    const tenant = await getTenantContext();
    const firmId = tenant?.firmId;

    if (firmId && id && !id.startsWith("sub-")) {
      const supabase = createAdminClient();
      const { data, error } = await supabase
        .from("task_subtasks")
        .update({
          is_completed: isCompleted,
          completed_at: isCompleted ? new Date().toISOString() : null,
        })
        .eq("id", id)
        .select()
        .single();

      if (!error && data) {
        return NextResponse.json({ subtask: data });
      }
    }

    return NextResponse.json({
      subtask: {
        id,
        status: isCompleted ? "completed" : "pending",
        is_completed: isCompleted,
      },
    });
  } catch (err) {
    console.error("PATCH /api/tasks/subtasks error:", err);
    return NextResponse.json({ error: "Failed to update subtask" }, { status: 500 });
  }
}
