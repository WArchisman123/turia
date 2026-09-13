import { NextResponse } from "next/server";
import { getTenantContext } from "@/lib/supabase/server";

export async function GET() {
  try {
    const tenant = await getTenantContext();
    if (!tenant) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      tenant,
    });
  } catch (error) {
    console.error("Error in /api/auth/sync:", error);
    return NextResponse.json({ error: "Failed to sync tenant context" }, { status: 500 });
  }
}
