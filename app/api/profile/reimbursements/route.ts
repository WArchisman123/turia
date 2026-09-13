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

    // Get current firm user id
    const { data: user } = await supabase
      .from("firm_users")
      .select("id")
      .eq("firm_id", firmId)
      .eq("clerk_user_id", tenant.userId)
      .maybeSingle();

    const userId = user?.id;
    if (!userId) {
      return NextResponse.json({ claims: [], totalAmount: 0, settledAmount: 0, pendingAmount: 0 });
    }

    const { data: claims, error } = await supabase
      .from("employee_expense_claims")
      .select("*")
      .eq("firm_id", firmId)
      .eq("user_id", userId)
      .order("claim_date", { ascending: false });

    if (error) {
      console.error("Error fetching claims:", error);
      return NextResponse.json({ claims: [], totalAmount: 0, settledAmount: 0, pendingAmount: 0 });
    }

    const formattedClaims = (claims || []).map((c) => ({
      id: c.id,
      date: new Date(c.claim_date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).replace(/ /g, "-"),
      reason: c.reason,
      category: "Conveyance / Travel",
      amount: Number(c.amount) || 0,
      paidBy: "Self",
      attachmentName: c.receipt_url ? c.receipt_url.split("/").pop() || "receipt.pdf" : "receipt.pdf",
      status: c.is_settled ? "Settled" : c.status === "approved" ? "Approved" : "Pending",
    }));

    const totalAmount = formattedClaims.reduce((acc, curr) => acc + curr.amount, 0);
    const settledAmount = formattedClaims.filter((c) => c.status === "Settled" || c.status === "Approved").reduce((acc, curr) => acc + curr.amount, 0);
    const pendingAmount = formattedClaims.filter((c) => c.status === "Pending").reduce((acc, curr) => acc + curr.amount, 0);

    return NextResponse.json({
      claims: formattedClaims,
      totalAmount,
      settledAmount,
      pendingAmount,
    });
  } catch (error) {
    console.error("Error in GET /api/profile/reimbursements:", error);
    return NextResponse.json({ error: "Failed to fetch claims" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const tenant = await getTenantContext();
    if (!tenant || !tenant.firmId) {
      return NextResponse.json({ error: "Unauthorized or missing organization" }, { status: 401 });
    }

    const firmId = tenant.firmId;
    const body = await req.json();
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

    if (!user?.id) {
      return NextResponse.json({ error: "User record not found in firm" }, { status: 404 });
    }

    const { data: newClaim, error } = await supabase
      .from("employee_expense_claims")
      .insert({
        firm_id: firmId,
        user_id: user.id,
        claim_date: body.date || new Date().toISOString().slice(0, 10),
        reason: body.reason,
        amount: Number(body.amount) || 0,
        receipt_url: body.receiptUrl || null,
        status: "pending",
        is_settled: false,
      })
      .select()
      .single();

    if (error) {
      console.error("Error inserting claim:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const formatted = {
      id: newClaim.id,
      date: new Date(newClaim.claim_date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).replace(/ /g, "-"),
      reason: newClaim.reason,
      category: body.category || "General Expense",
      amount: Number(newClaim.amount),
      paidBy: body.paidBy || "Self",
      attachmentName: body.attachmentName || "receipt.pdf",
      status: "Pending",
    };

    return NextResponse.json({ success: true, claim: formatted });
  } catch (error) {
    console.error("Error in POST /api/profile/reimbursements:", error);
    return NextResponse.json({ error: "Failed to create claim" }, { status: 500 });
  }
}
