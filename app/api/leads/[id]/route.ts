import { NextResponse } from "next/server";
import { getTenantContext, createAdminClient } from "@/lib/supabase/server";
import { Database } from "@/lib/supabase/types";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tenant = await getTenantContext();
    if (!tenant || !tenant.firmId) {
      return NextResponse.json({ error: "Unauthorized or missing organization" }, { status: 401 });
    }
    const firmId = tenant.firmId;

    const body = await req.json();
    const { status, stage, dealValue, notes } = body;

    const supabase = createAdminClient();

    const updatePayload: Database["public"]["Tables"]["leads"]["Update"] = {
      updated_at: new Date().toISOString(),
    };
    if (status) updatePayload.status = status;
    if (stage) updatePayload.stage = stage;
    if (dealValue !== undefined) updatePayload.deal_value = dealValue;
    if (notes !== undefined) updatePayload.notes = notes;

    const { data, error } = await supabase
      .from("leads")
      .update(updatePayload)
      .eq("id", id)
      .eq("firm_id", firmId)
      .select()
      .single();

    if (error) {
      console.error("Error updating lead in Supabase:", error);
      return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
    }

    return NextResponse.json({ success: true, lead: data });
  } catch (error) {
    console.error("Error in PATCH /api/leads/[id]:", error);
    return NextResponse.json({ error: "Failed to update lead" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tenant = await getTenantContext();
    if (!tenant || !tenant.firmId) {
      return NextResponse.json({ error: "Unauthorized or missing organization" }, { status: 401 });
    }
    const firmId = tenant.firmId;

    const supabase = createAdminClient();
    const { error } = await supabase
      .from("leads")
      .delete()
      .eq("id", id)
      .eq("firm_id", firmId);

    if (error) {
      console.error("Error deleting lead from Supabase:", error);
      return NextResponse.json({ error: "Failed to delete lead" }, { status: 500 });
    }

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Error in DELETE /api/leads/[id]:", error);
    return NextResponse.json({ error: "Failed to delete lead" }, { status: 500 });
  }
}
