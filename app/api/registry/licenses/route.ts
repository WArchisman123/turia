import { NextResponse } from "next/server";
import { getTenantContext, createAdminClient } from "@/lib/supabase/server";
import { ClientLicenseItem } from "@/components/registry/types";

export async function GET() {
  try {
    const tenant = await getTenantContext();
    if (!tenant || !tenant.firmId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createAdminClient();

    const { data: dbLicenses, error } = await supabase
      .from("client_licenses")
      .select(`
        id,
        client_id,
        license_name,
        license_number,
        issuing_authority,
        issue_date,
        expiry_date,
        status,
        created_at
      `)
      .eq("firm_id", tenant.firmId)
      .order("expiry_date", { ascending: true });

    if (error) {
      console.error("Error fetching client licenses:", error);
      return NextResponse.json({ licenses: [] });
    }

    // Get client trade names
    const clientIds = Array.from(new Set((dbLicenses || []).map((l) => l.client_id).filter(Boolean)));
    const clientMap: Record<string, string> = {};

    if (clientIds.length > 0) {
      const { data: clientRows } = await supabase
        .from("clients")
        .select("id, trade_name")
        .in("id", clientIds);

      (clientRows || []).forEach((c) => {
        clientMap[c.id] = c.trade_name;
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const formatted: ClientLicenseItem[] = (dbLicenses || []).map((l) => {
      let daysRemaining = 999;
      let statusComputed: "active" | "expiring" | "expired" = "active";

      if (l.expiry_date) {
        const exp = new Date(l.expiry_date);
        exp.setHours(0, 0, 0, 0);
        daysRemaining = Math.ceil((exp.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        if (daysRemaining < 0) {
          statusComputed = "expired";
        } else if (daysRemaining <= 30) {
          statusComputed = "expiring";
        }
      }

      return {
        id: l.id,
        clientId: l.client_id,
        clientName: clientMap[l.client_id] || "Assigned Client",
        licenseName: l.license_name,
        licenseNumber: l.license_number,
        issuingAuthority: l.issuing_authority || "Statutory Authority",
        issueDate: l.issue_date || "",
        expiryDate: l.expiry_date || "",
        status: statusComputed,
        daysRemaining,
      };
    });

    return NextResponse.json({ licenses: formatted });
  } catch (error) {
    console.error("GET /api/registry/licenses error:", error);
    return NextResponse.json(
      { error: "Failed to fetch client licenses" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const tenant = await getTenantContext();
    if (!tenant || !tenant.firmId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      clientId,
      licenseName,
      licenseNumber,
      issuingAuthority,
      issueDate,
      expiryDate,
      status = "active",
    } = body;

    if (!clientId || !licenseName || !licenseNumber) {
      return NextResponse.json(
        { error: "Client, License Name, and License Number are required" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    const { data: newLic, error } = await supabase
      .from("client_licenses")
      .insert({
        firm_id: tenant.firmId,
        client_id: clientId,
        license_name: licenseName,
        license_number: licenseNumber,
        issuing_authority: issuingAuthority || null,
        issue_date: issueDate || null,
        expiry_date: expiryDate || null,
        status: status,
      })
      .select()
      .single();

    if (error || !newLic) {
      return NextResponse.json(
        { error: error?.message || "Failed to create client license" },
        { status: 500 }
      );
    }

    return NextResponse.json(newLic, { status: 201 });
  } catch (error) {
    console.error("POST /api/registry/licenses error:", error);
    return NextResponse.json(
      { error: "Failed to create client license" },
      { status: 500 }
    );
  }
}
