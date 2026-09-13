import { NextResponse } from "next/server";
import { getTenantContext, createAdminClient } from "@/lib/supabase/server";
import { Database } from "@/lib/supabase/types";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tenant = await getTenantContext();
    if (!tenant || !tenant.firmId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const supabase = createAdminClient();

    const { data: service, error } = await supabase
      .from("services_master")
      .select("*")
      .eq("firm_id", tenant.firmId)
      .eq("id", id)
      .single();

    if (error || !service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ service });
  } catch (error) {
    console.error("Error in GET /api/services/[id]:", error);
    return NextResponse.json({ error: "Failed to fetch service details" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tenant = await getTenantContext();
    if (!tenant || !tenant.firmId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const body = await req.json();
    const supabase = createAdminClient();

    const updatePayload: Database["public"]["Tables"]["services_master"]["Update"] = {
      updated_at: new Date().toISOString(),
    };

    if (body.serviceName !== undefined) updatePayload.service_name = body.serviceName;
    if (body.category !== undefined) updatePayload.category = body.category;
    if (body.sacCode !== undefined) updatePayload.sac_code = body.sacCode;
    if (body.baseFee !== undefined) updatePayload.base_fee = Number(body.baseFee);
    if (body.gstRate !== undefined) updatePayload.gst_rate = Number(body.gstRate);
    if (body.tatDays !== undefined) updatePayload.tat_days = Number(body.tatDays);
    if (body.tatHours !== undefined) updatePayload.tat_hours = body.tatHours;
    if (body.isRecurring !== undefined) updatePayload.is_recurring = Boolean(body.isRecurring);
    if (body.recurrenceFrequency !== undefined) updatePayload.recurrence_frequency = body.recurrenceFrequency;
    if (body.difficultyLevel !== undefined) updatePayload.difficulty_level = body.difficultyLevel;
    if (body.description !== undefined) updatePayload.description = body.description;
    if (body.isActive !== undefined) updatePayload.is_active = Boolean(body.isActive);
    if (body.exemptionReason !== undefined) updatePayload.exemption_reason = body.exemptionReason;
    if (body.outOfPocketBudget !== undefined) updatePayload.out_of_pocket_budget = Number(body.outOfPocketBudget);

    const { data: updated, error } = await supabase
      .from("services_master")
      .update(updatePayload)
      .eq("firm_id", tenant.firmId)
      .eq("id", id)
      .select()
      .maybeSingle();

    let serviceRecord = updated;

    if (error || !serviceRecord) {
      console.warn("Retrying service update with core columns:", error?.message);
      const corePayload: Database["public"]["Tables"]["services_master"]["Update"] = {};
      if (body.serviceName !== undefined) corePayload.service_name = body.serviceName;
      if (body.category !== undefined) corePayload.category = body.category;
      if (body.sacCode !== undefined) corePayload.sac_code = body.sacCode;
      if (body.baseFee !== undefined) corePayload.base_fee = Number(body.baseFee);
      if (body.gstRate !== undefined) corePayload.gst_rate = Number(body.gstRate);
      if (body.tatDays !== undefined) corePayload.tat_days = Number(body.tatDays);
      if (body.isRecurring !== undefined) corePayload.is_recurring = Boolean(body.isRecurring);
      if (body.recurrenceFrequency !== undefined) corePayload.recurrence_frequency = body.recurrenceFrequency;
      if (body.isActive !== undefined) corePayload.is_active = Boolean(body.isActive);

      const { data: coreUpdated, error: coreErr } = await supabase
        .from("services_master")
        .update(corePayload)
        .eq("firm_id", tenant.firmId)
        .eq("id", id)
        .select()
        .maybeSingle();

      if (!coreErr && coreUpdated) {
        serviceRecord = coreUpdated;
      } else {
        console.error("Error updating service:", error || coreErr);
        return NextResponse.json({ error: error?.message || coreErr?.message }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true, service: serviceRecord });
  } catch (error) {
    console.error("Error in PATCH /api/services/[id]:", error);
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tenant = await getTenantContext();
    if (!tenant || !tenant.firmId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const supabase = createAdminClient();

    const { error } = await supabase
      .from("services_master")
      .delete()
      .eq("firm_id", tenant.firmId)
      .eq("id", id);

    if (error) {
      console.error("Error deleting service:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Service deleted successfully" });
  } catch (error) {
    console.error("Error in DELETE /api/services/[id]:", error);
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
  }
}
