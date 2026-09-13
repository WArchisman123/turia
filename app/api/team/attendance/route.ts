import { NextResponse } from "next/server";
import { getTenantContext, createAdminClient } from "@/lib/supabase/server";

export async function PATCH(req: Request) {
  try {
    const tenant = await getTenantContext();
    const body = await req.json();
    const { id, action } = body;

    const isApproved = action === "approve";

    if (tenant?.firmId) {
      const supabase = createAdminClient();
      await supabase
        .from("attendance_logs")
        .update({
          is_regularized: isApproved,
          status: isApproved ? "present" : "absent",
        })
        .eq("id", id)
        .eq("firm_id", tenant.firmId);
    }

    return NextResponse.json({
      attendance: {
        id,
        is_regularized: isApproved,
        status: isApproved ? "present" : "absent",
      },
    });
  } catch (error: unknown) {
    console.error("Error in PATCH /api/team/attendance:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to regularize attendance" },
      { status: 500 }
    );
  }
}
