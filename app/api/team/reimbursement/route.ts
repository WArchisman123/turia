import { NextResponse } from "next/server";
import { getTenantContext, createAdminClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const tenant = await getTenantContext();
    const body = await req.json();

    const newClaim = {
      id: `clm-${Date.now()}`,
      user_id: body.userId,
      applicant: body.userName || "Staff Member",
      applicant_initials: (body.userName || "SM").slice(0, 2).toUpperCase(),
      reason: body.reason,
      date: body.claimDate || new Date().toLocaleDateString("en-GB"),
      amount: Number(body.amount) || 0,
      status: "Pending",
      paid: "Unsettled",
      attachments: body.receiptUrl || null,
    };

    if (tenant?.firmId) {
      const supabase = createAdminClient();
      await supabase.from("employee_expense_claims").insert({
        firm_id: tenant.firmId,
        user_id: body.userId,
        claim_date: new Date().toISOString().split("T")[0],
        reason: body.reason,
        amount: Number(body.amount) || 0,
        receipt_url: body.receiptUrl || null,
        status: "pending",
        is_settled: false,
      });
    }

    return NextResponse.json({ claim: newClaim }, { status: 201 });
  } catch (error: unknown) {
    console.error("Error in POST /api/team/reimbursement:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create reimbursement claim" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const tenant = await getTenantContext();
    const body = await req.json();
    const { id } = body;

    if (tenant?.firmId) {
      const supabase = createAdminClient();
      await supabase
        .from("employee_expense_claims")
        .update({
          is_settled: true,
          settled_at: new Date().toISOString(),
          status: "approved",
        })
        .eq("id", id)
        .eq("firm_id", tenant.firmId);
    }

    return NextResponse.json({
      claim: {
        id,
        status: "Approved",
        paid: "Settled",
      },
    });
  } catch (error: unknown) {
    console.error("Error in PATCH /api/team/reimbursement:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to settle reimbursement claim" },
      { status: 500 }
    );
  }
}
