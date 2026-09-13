import { NextResponse } from "next/server";
import { getTenantContext, createAdminClient } from "@/lib/supabase/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tenant = await getTenantContext();
    const body = await req.json();

    if (tenant?.firmId) {
      const supabase = createAdminClient();
      await supabase
        .from("firm_users")
        .update({
          ...body,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("firm_id", tenant.firmId);
    }

    return NextResponse.json({ success: true, member: { id, ...body } });
  } catch (error: unknown) {
    console.error("Error in PATCH /api/team/[id]:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update team member" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tenant = await getTenantContext();

    if (tenant?.firmId) {
      const supabase = createAdminClient();
      await supabase
        .from("firm_users")
        .update({
          is_active: false,
          employment_status: "deactivated",
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("firm_id", tenant.firmId);
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error in DELETE /api/team/[id]:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to deactivate employee" },
      { status: 500 }
    );
  }
}
