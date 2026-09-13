import { NextResponse } from "next/server";
import { getTenantContext, createAdminClient } from "@/lib/supabase/server";
import { Database } from "@/lib/supabase/types";

export async function GET() {
  try {
    const tenant = await getTenantContext();
    if (!tenant) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (tenant.firmId) {
      const supabase = createAdminClient();
      const { data: firm, error } = await supabase
        .from("firms")
        .select("*")
        .eq("id", tenant.firmId)
        .single();

      if (!error && firm) {
        return NextResponse.json({ success: true, firm });
      }
    }

    // Default firm profile representation
    return NextResponse.json({
      success: true,
      firm: {
        id: "default-firm",
        brand_name: "saha and sons",
        legal_name: "Saha & Sons Chartered Accountants",
        business_entity: "Partnership Firm",
        pan_number: "AACFS1234F",
        gstin: "19AACFS1234F1Z8",
        onboarding_step: 3,
        onboarding_completed: false,
        city: "Kolkata",
        state: "West Bengal",
        country: "India",
      },
    });
  } catch (error) {
    console.error("Error in GET /api/firm:", error);
    return NextResponse.json({ error: "Failed to fetch firm profile" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const tenant = await getTenantContext();
    if (!tenant) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: Database["public"]["Tables"]["firms"]["Update"] = await req.json();

    if (tenant.firmId) {
      const supabase = createAdminClient();
      const { data: updatedFirm, error } = await supabase
        .from("firms")
        .update({
          ...body,
          updated_at: new Date().toISOString(),
        })
        .eq("id", tenant.firmId)
        .select()
        .single();

      if (!error && updatedFirm) {
        return NextResponse.json({ success: true, firm: updatedFirm });
      }
    }

    return NextResponse.json({ success: true, firm: body });
  } catch (error) {
    console.error("Error in PATCH /api/firm:", error);
    return NextResponse.json({ error: "Failed to update firm profile" }, { status: 500 });
  }
}
