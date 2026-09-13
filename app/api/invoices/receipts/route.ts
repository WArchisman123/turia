import { NextResponse } from "next/server";
import { getTenantContext, createAdminClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const tenant = await getTenantContext();
    const body = await req.json();

    const receiptNumber = `RCP-2026-${Math.floor(100 + Math.random() * 900)}`;
    const amountReceived = Number(body.amountReceived) || 0;
    const tdsDeducted = Number(body.tdsDeducted) || 0;

    const receipt = {
      id: `rcp-${Date.now()}`,
      firm_id: tenant?.firmId || "firm-001",
      client_id: body.clientId,
      invoice_id: body.invoiceId || null,
      receipt_number: receiptNumber,
      receipt_date: body.receiptDate || new Date().toLocaleDateString("en-GB"),
      amount_received: amountReceived,
      tds_deducted: tdsDeducted,
      net_amount: amountReceived,
      payment_mode: body.paymentMode || "NEFT/RTGS",
      utr_reference: body.utrReference || null,
      bank_name: body.bankName || "HDFC Bank Ltd",
      notes: body.notes || null,
      created_at: new Date().toISOString(),
    };

    if (tenant?.firmId) {
      const supabase = createAdminClient();

      // Insert receipt
      await supabase.from("payment_receipts").insert({
        firm_id: tenant.firmId,
        client_id: body.clientId,
        invoice_id: body.invoiceId || null,
        receipt_number: receiptNumber,
        receipt_date: new Date().toISOString().split("T")[0],
        amount_received: amountReceived,
        tds_deducted: tdsDeducted,
        payment_mode: body.paymentMode || "NEFT/RTGS",
        utr_reference: body.utrReference || null,
        bank_name: body.bankName || null,
        notes: body.notes || null,
      });

      // If linked to an invoice, reconcile balance
      if (body.invoiceId) {
        const { data: inv } = await supabase
          .from("invoices")
          .select("total_amount, paid_amount, tds_amount, balance_due")
          .eq("id", body.invoiceId)
          .single();

        if (inv) {
          const currentPaid = Number(inv.paid_amount) || 0;
          const currentTds = Number(inv.tds_amount) || 0;
          const newPaid = currentPaid + amountReceived;
          const newTds = currentTds + tdsDeducted;
          const newBalance = Math.max(0, Number(inv.total_amount) - (newPaid + newTds));
          const newStatus = newBalance <= 0 ? "paid" : "partially_paid";

          await supabase
            .from("invoices")
            .update({
              paid_amount: newPaid,
              tds_amount: newTds,
              balance_due: newBalance,
              status: newStatus,
              updated_at: new Date().toISOString(),
            })
            .eq("id", body.invoiceId);
        }
      }
    }

    return NextResponse.json({ receipt }, { status: 201 });
  } catch (error: unknown) {
    console.error("Error in POST /api/invoices/receipts:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to record payment receipt" },
      { status: 500 }
    );
  }
}
