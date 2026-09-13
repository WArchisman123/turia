import { NextResponse } from "next/server";
import { getTenantContext, createAdminClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const tenant = await getTenantContext();
    if (!tenant || !tenant.firmId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createAdminClient();

    const { data: logs, error } = await supabase
      .from("dsc_movement_logs")
      .select(`
        id,
        dsc_id,
        from_location,
        to_location,
        from_bin,
        to_bin,
        handed_to,
        reason,
        logged_by,
        created_at
      `)
      .eq("firm_id", tenant.firmId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching DSC movement logs:", error);
      return NextResponse.json({ logs: [] });
    }

    // Also fetch DSC details to decorate log items with signatory name and dsc_code
    const dscIds = Array.from(new Set((logs || []).map((l) => l.dsc_id).filter(Boolean)));
    const dscMap: Record<string, { dscCode: string; signatoryName: string }> = {};

    if (dscIds.length > 0) {
      const { data: dscRows } = await supabase
        .from("dsc_register")
        .select("id, dsc_code, signatory_name")
        .in("id", dscIds);

      (dscRows || []).forEach((r) => {
        dscMap[r.id] = {
          dscCode: r.dsc_code,
          signatoryName: r.signatory_name,
        };
      });
    }

    const formatted = (logs || []).map((l) => {
      const info = dscMap[l.dsc_id] || { dscCode: "DSC-Token", signatoryName: "Signatory" };
      return {
        id: l.id,
        dscId: l.dsc_id,
        dscCode: info.dscCode,
        signatoryName: info.signatoryName,
        fromLocation: l.from_location,
        toLocation: l.to_location,
        fromBin: l.from_bin,
        toBin: l.to_bin,
        handedTo: l.handed_to,
        reason: l.reason,
        loggedBy: l.logged_by,
        createdAt: l.created_at,
      };
    });

    return NextResponse.json({ logs: formatted });
  } catch (error) {
    console.error("GET /api/registry/activity error:", error);
    return NextResponse.json(
      { error: "Failed to fetch activity logs" },
      { status: 500 }
    );
  }
}
