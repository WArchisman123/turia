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

    const { data: client, error } = await supabase
      .from("clients")
      .select("*")
      .eq("firm_id", tenant.firmId)
      .eq("id", id)
      .single();

    if (error || !client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    // Also fetch associated GSTINs, Contacts, and Licenses
    const [{ data: gstins }, { data: contacts }, { data: licenses }] = await Promise.all([
      supabase.from("client_gstins").select("*").eq("client_id", id),
      supabase.from("client_contacts").select("*").eq("client_id", id),
      supabase.from("client_licenses").select("*").eq("client_id", id),
    ]);

    return NextResponse.json({
      client,
      gstins: gstins || [],
      contacts: contacts || [],
      licenses: licenses || [],
    });
  } catch (error) {
    console.error("Error in GET /api/clients/[id]:", error);
    return NextResponse.json({ error: "Failed to fetch client details" }, { status: 500 });
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

    const updatePayload: Database["public"]["Tables"]["clients"]["Update"] = {
      updated_at: new Date().toISOString(),
    };

    if (body.tradeName !== undefined) updatePayload.trade_name = body.tradeName;
    if (body.legalName !== undefined) updatePayload.legal_name = body.legalName;
    if (body.businessEntity !== undefined) updatePayload.entity_type = body.businessEntity;
    if (body.businessPan !== undefined) updatePayload.pan_number = body.businessPan;
    if (body.gstin !== undefined) updatePayload.primary_gstin = body.gstin;
    if (body.email !== undefined) updatePayload.primary_email = body.email;
    if (body.mobileNo !== undefined) updatePayload.primary_phone = body.mobileNo;
    if (body.contactName !== undefined) updatePayload.contact_name = body.contactName;
    if (body.placeOfSupply !== undefined) updatePayload.place_of_supply = body.placeOfSupply;
    if (body.city !== undefined) updatePayload.city = body.city;
    if (body.state !== undefined) updatePayload.state = body.state;
    if (body.pincode !== undefined) updatePayload.pin_code = body.pincode;
    if (body.status !== undefined) updatePayload.status = body.status;
    if (body.services !== undefined) updatePayload.services = body.services;
    if (body.labels !== undefined) updatePayload.labels = body.labels;
    if (body.clientGroup !== undefined) updatePayload.client_group = body.clientGroup;
    if (body.auditor !== undefined) updatePayload.auditor = body.auditor;

    const { data: updated, error } = await supabase
      .from("clients")
      .update(updatePayload)
      .eq("firm_id", tenant.firmId)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating client:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, client: updated });
  } catch (error) {
    console.error("Error in PATCH /api/clients/[id]:", error);
    return NextResponse.json({ error: "Failed to update client" }, { status: 500 });
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
      .from("clients")
      .delete()
      .eq("firm_id", tenant.firmId)
      .eq("id", id);

    if (error) {
      console.error("Error deleting client:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Client deleted successfully" });
  } catch (error) {
    console.error("Error in DELETE /api/clients/[id]:", error);
    return NextResponse.json({ error: "Failed to delete client" }, { status: 500 });
  }
}
