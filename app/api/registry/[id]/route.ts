import { NextResponse } from "next/server";
import { getTenantContext, createAdminClient } from "@/lib/supabase/server";
import { DSCLocation, DSCStatus } from "@/components/registry/types";
import { Database } from "@/lib/supabase/types";

type DSCUpdatePayload = Database["public"]["Tables"]["dsc_register"]["Update"];

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tenant = await getTenantContext();
    if (!tenant || !tenant.firmId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const supabase = createAdminClient();

    // Fetch existing record to verify tenant ownership
    const { data: existing, error: fetchErr } = await supabase
      .from("dsc_register")
      .select("*")
      .eq("id", id)
      .eq("firm_id", tenant.firmId)
      .single();

    if (fetchErr || !existing) {
      return NextResponse.json(
        { error: "DSC token record not found" },
        { status: 404 }
      );
    }

    // Handle token custody transfer action
    if (body.action === "transfer_custody") {
      const {
        location: toLocation,
        bin_number: toBin,
        handed_to: handedTo,
        reason,
        logged_by: loggedBy,
      } = body;

      const { data: updated, error: updateErr } = await supabase
        .from("dsc_register")
        .update({
          location: (toLocation || existing.location) as DSCLocation,
          bin_number: toBin ?? existing.bin_number,
          status: toLocation === "missing" ? ("revoked" as DSCStatus) : existing.status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("firm_id", tenant.firmId)
        .select()
        .single();

      if (updateErr) {
        return NextResponse.json(
          { error: updateErr.message || "Failed to update custody" },
          { status: 500 }
        );
      }

      // Log movement in custody audit trail safely (non-blocking)
      try {
        await supabase.from("dsc_movement_logs").insert({
          firm_id: tenant.firmId,
          dsc_id: id,
          from_location: existing.location,
          to_location: toLocation,
          from_bin: existing.bin_number,
          to_bin: toBin,
          handed_to: handedTo || null,
          reason: reason || "Physical token custody transfer",
          logged_by: loggedBy || tenant.fullName,
        });
      } catch (logErr) {
        console.warn("Custody log table not available, skipping audit entry:", logErr);
      }

      return NextResponse.json({ success: true, dsc: updated });
    }

    // General update
    const updatePayload: DSCUpdatePayload = {
      updated_at: new Date().toISOString(),
    };

    if (body.signatoryName !== undefined) updatePayload.signatory_name = body.signatoryName;
    if (body.businessName !== undefined) updatePayload.business_name = body.businessName;
    if (body.legalName !== undefined) updatePayload.legal_name = body.legalName;
    if (body.panNumber !== undefined) updatePayload.pan_number = body.panNumber;
    if (body.dinNumber !== undefined) updatePayload.din_number = body.dinNumber;
    if (body.vendor !== undefined) updatePayload.vendor = body.vendor;
    if (body.dscClass !== undefined) updatePayload.dsc_class = body.dscClass;
    if (body.issuedDate !== undefined) updatePayload.issued_date = body.issuedDate;
    if (body.expiryDate !== undefined) updatePayload.expiry_date = body.expiryDate;
    if (body.location !== undefined) updatePayload.location = body.location;
    if (body.binNumber !== undefined) updatePayload.bin_number = body.binNumber;
    if (body.status !== undefined) updatePayload.status = body.status;
    if (body.email !== undefined) updatePayload.email = body.email;
    if (body.phone !== undefined) updatePayload.phone = body.phone;
    if (body.tokenPin !== undefined) updatePayload.token_pin_encrypted = body.tokenPin;
    if (body.tokenHardwareModel !== undefined) updatePayload.token_hardware_model = body.tokenHardwareModel;
    if (body.notes !== undefined) updatePayload.notes = body.notes;

    const { data: updated, error: updateErr } = await supabase
      .from("dsc_register")
      .update(updatePayload)
      .eq("id", id)
      .eq("firm_id", tenant.firmId)
      .select()
      .maybeSingle();

    let dscRecord = updated;

    if (updateErr || !dscRecord) {
      console.warn("Retrying DSC update with core columns:", updateErr?.message);
      const corePayload: DSCUpdatePayload = {};
      if (body.signatoryName !== undefined) corePayload.signatory_name = body.signatoryName;
      if (body.businessName !== undefined) corePayload.business_name = body.businessName;
      if (body.legalName !== undefined) corePayload.legal_name = body.legalName;
      if (body.panNumber !== undefined) corePayload.pan_number = body.panNumber;
      if (body.dinNumber !== undefined) corePayload.din_number = body.dinNumber;
      if (body.vendor !== undefined) corePayload.vendor = body.vendor;
      if (body.dscClass !== undefined) corePayload.dsc_class = body.dscClass;
      if (body.issuedDate !== undefined) corePayload.issued_date = body.issuedDate;
      if (body.expiryDate !== undefined) corePayload.expiry_date = body.expiryDate;
      if (body.location !== undefined) corePayload.location = body.location;
      if (body.binNumber !== undefined) corePayload.bin_number = body.binNumber;
      if (body.status !== undefined) corePayload.status = body.status;
      if (body.email !== undefined) corePayload.email = body.email;
      if (body.phone !== undefined) corePayload.phone = body.phone;
      if (body.tokenPin !== undefined) corePayload.token_pin_encrypted = body.tokenPin;

      const { data: coreUpdated, error: coreErr } = await supabase
        .from("dsc_register")
        .update(corePayload)
        .eq("id", id)
        .eq("firm_id", tenant.firmId)
        .select()
        .maybeSingle();

      if (!coreErr && coreUpdated) {
        dscRecord = coreUpdated;
      } else {
        return NextResponse.json(
          { error: updateErr?.message || coreErr?.message || "Failed to update DSC record" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(dscRecord);
  } catch (error) {
    console.error("PATCH /api/registry/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update DSC record" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const tenant = await getTenantContext();
    if (!tenant || !tenant.firmId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Role check: Only admin and partner can delete DSC records
    if (tenant.role !== "admin" && tenant.role !== "partner") {
      return NextResponse.json(
        { error: "Forbidden: Only Managing Partners and Admins can delete DSC records" },
        { status: 403 }
      );
    }

    const { id } = await params;
    const supabase = createAdminClient();

    const { error } = await supabase
      .from("dsc_register")
      .delete()
      .eq("id", id)
      .eq("firm_id", tenant.firmId);

    if (error) {
      return NextResponse.json(
        { error: error.message || "Failed to delete DSC record" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/registry/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete DSC record" },
      { status: 500 }
    );
  }
}
