import { NextResponse } from "next/server";
import { getTenantContext, createAdminClient } from "@/lib/supabase/server";
import { RBAC_MATRIX } from "@/lib/rbac/matrix";
import { RoleSlug } from "@/lib/rbac/types";

export async function GET(req: Request) {
  try {
    const tenant = await getTenantContext();
    if (!tenant || !tenant.firmId) {
      return NextResponse.json({ error: "Unauthorized or missing organization" }, { status: 401 });
    }

    const firmId = tenant.firmId;
    const { searchParams } = new URL(req.url);
    const role = (searchParams.get("role") || "admin") as RoleSlug;

    const supabase = createAdminClient();

    // Check if customized permissions exist on firm_users
    const { data: user } = await supabase
      .from("firm_users")
      .select("permissions_json, role")
      .eq("firm_id", firmId)
      .eq("clerk_user_id", tenant.userId)
      .maybeSingle();

    if (user?.permissions_json && typeof user.permissions_json === "object" && Object.keys(user.permissions_json).length > 0) {
      return NextResponse.json({
        permissions: user.permissions_json,
        isCustom: true,
      });
    }

    // Default to RBAC matrix for the role
    const fallbackMatrix = (RBAC_MATRIX as Record<string, unknown>)[role] || RBAC_MATRIX.admin;
    return NextResponse.json({
      permissions: fallbackMatrix,
      isCustom: false,
    });
  } catch (error) {
    console.error("Error in GET /api/profile/permissions:", error);
    return NextResponse.json({ error: "Failed to fetch permissions" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const tenant = await getTenantContext();
    if (!tenant || !tenant.firmId) {
      return NextResponse.json({ error: "Unauthorized or missing organization" }, { status: 401 });
    }

    const firmId = tenant.firmId;
    const body = await req.json();
    const { permissions } = body;

    const supabase = createAdminClient();

    await supabase
      .from("firm_users")
      .update({ permissions_json: permissions })
      .eq("firm_id", firmId)
      .eq("clerk_user_id", tenant.userId);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in PATCH /api/profile/permissions:", error);
    return NextResponse.json({ error: "Failed to save permissions" }, { status: 500 });
  }
}
