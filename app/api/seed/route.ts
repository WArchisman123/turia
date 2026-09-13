import { NextResponse } from "next/server";
import { getTenantContext } from "@/lib/supabase/server";
import { seedTenantDatabase } from "@/lib/supabase/seeder";

export async function POST() {
  try {
    const tenant = await getTenantContext();
    if (!tenant) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!tenant.firmId) {
      return NextResponse.json(
        { error: "No active firm found. Please create or select an organization first." },
        { status: 400 }
      );
    }

    const result = await seedTenantDatabase(tenant.firmId, tenant.userId);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in POST /api/seed:", error);
    return NextResponse.json(
      { error: "Failed to seed demo data" },
      { status: 500 }
    );
  }
}
