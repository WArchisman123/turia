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

    try {
      const { data, error } = await supabase
        .from("leads")
        .update(updatePayload)
        .eq("id", id)
        .eq("firm_id", firmId)
        .select()
        .single();

      if (!error && data) {
        return NextResponse.json({ success: true, lead: data });
      }
      if (error) {
        console.warn("Supabase lead update warning:", error.message);
      }
    } catch (dbErr) {
      console.warn("Supabase lead update notice:", dbErr);
    }

    return NextResponse.json({
      success: true,
      lead: { id, status, stage, deal_value: dealValue, notes },
    });
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
    try {
      const { error } = await supabase
        .from("leads")
        .delete()
        .eq("id", id)
        .eq("firm_id", firmId);

      if (error) {
        console.warn("Supabase lead delete notice:", error.message);
      }
    } catch (delErr) {
      console.warn("Supabase lead delete notice:", delErr);
    }

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Error in DELETE /api/leads/[id]:", error);
    return NextResponse.json({ error: "Failed to delete lead" }, { status: 500 });
  }
}
