import { NextResponse } from "next/server";
import { getTenantContext, createAdminClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const tenant = await getTenantContext();
    if (!tenant || !tenant.firmId) {
      return NextResponse.json({ error: "Unauthorized or missing organization" }, { status: 401 });
    }

    const firmId = tenant.firmId;
    const supabase = createAdminClient();

    let { data: user } = await supabase
      .from("firm_users")
      .select("id")
      .eq("firm_id", firmId)
      .eq("clerk_user_id", tenant.userId)
      .maybeSingle();

    if (!user) {
      const { data: firstUser } = await supabase
        .from("firm_users")
        .select("id")
        .eq("firm_id", firmId)
        .limit(1)
        .maybeSingle();
      user = firstUser;
    }

    const userId = user?.id;

    // Fetch clients assigned to this partner/manager or all active clients for firm
    let query = supabase
      .from("clients")
      .select("*")
      .eq("firm_id", firmId);

    if (userId) {
      query = query.or(`assigned_partner_id.eq.${userId},assigned_manager_id.eq.${userId}`);
    }

    const { data: dbClients, error } = await query.order("client_code", { ascending: true });

    if (error) {
      console.error("Error fetching profile clients:", error);
      return NextResponse.json({ clients: [] });
    }

    const formattedClients = (dbClients || []).map((c) => ({
      id: c.id,
      clientCode: c.client_code,
      tradeName: c.trade_name,
      legalName: c.legal_name,
      contactPerson: "Director / Auth Signatory",
      mobileNumber: c.primary_phone || "+91 98300 00000",
      businessEntity: c.entity_type,
      status: (c.status === "active" ? "Active" : "Dormant") as "Active" | "Dormant" | "New",
    }));

    return NextResponse.json({ clients: formattedClients });
  } catch (error) {
    console.error("Error in GET /api/profile/clients:", error);
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 });
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
    const { clientIds, newAssigneeId } = body;

    if (!clientIds || !Array.isArray(clientIds) || clientIds.length === 0) {
      return NextResponse.json({ error: "Client IDs are required" }, { status: 400 });
    }

    const supabase = createAdminClient();

    let targetUserId = newAssigneeId;
    if (!targetUserId || targetUserId === "all") {
      const { data: targetUser } = await supabase
        .from("firm_users")
        .select("id")
        .eq("firm_id", firmId)
        .neq("clerk_user_id", tenant.userId)
        .limit(1)
        .maybeSingle();
      targetUserId = targetUser?.id;
    }

    if (targetUserId) {
      await supabase
        .from("clients")
        .update({ assigned_partner_id: targetUserId })
        .eq("firm_id", firmId)
        .in("id", clientIds);
    }

    return NextResponse.json({ success: true, count: clientIds.length });
  } catch (error) {
    console.error("Error in PATCH /api/profile/clients:", error);
    return NextResponse.json({ error: "Failed to reassign clients" }, { status: 500 });
  }
}
