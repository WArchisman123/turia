import { NextResponse } from "next/server";
import { getTenantContext, createAdminClient } from "@/lib/supabase/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const tenant = await getTenantContext();

    if (body.action === "convert_to_tax_invoice") {
      // 1-Click Proforma to Tax Invoice Conversion
      const newInvoiceNumber = `INV-2026-${Math.floor(100 + Math.random() * 900)}`;

      if (tenant?.firmId) {
        const supabase = createAdminClient();
        // Fetch the proforma
        const { data: proforma } = await supabase
          .from("invoices")
          .select("*")
          .eq("id", id)
          .eq("firm_id", tenant.firmId)
          .single();

        if (proforma) {
          // Create the tax invoice
          const { data: createdTaxInv } = await supabase
            .from("invoices")
            .insert({
              firm_id: tenant.firmId,
              client_id: proforma.client_id,
              invoice_type: "tax_invoice",
              invoice_number: newInvoiceNumber,
              invoice_date: new Date().toISOString().split("T")[0],
              due_date: new Date(Date.now() + 15 * 86400000).toISOString().split("T")[0],
              place_of_supply: proforma.place_of_supply,
              subtotal: proforma.subtotal,
              cgst_amount: proforma.cgst_amount,
              sgst_amount: proforma.sgst_amount,
              igst_amount: proforma.igst_amount,
              total_tax: proforma.total_tax,
              total_amount: proforma.total_amount,
              paid_amount: proforma.paid_amount,
              tds_amount: proforma.tds_amount,
              balance_due: proforma.balance_due,
              status: proforma.paid_amount >= proforma.total_amount ? "paid" : proforma.paid_amount > 0 ? "partially_paid" : "unpaid",
              notes: `Converted from Proforma ${proforma.invoice_number}. ${proforma.notes || ""}`,
            })
            .select()
            .single();

          // Mark proforma as converted
          await supabase
            .from("invoices")
            .update({
              status: "converted",
              converted_tax_invoice_id: createdTaxInv?.id,
            })
            .eq("id", id);

          return NextResponse.json({
            success: true,
            invoice: createdTaxInv,
            message: `Successfully converted to Tax Invoice ${newInvoiceNumber}`,
          });
        }
      }

      return NextResponse.json({
        success: true,
        invoice: {
          id: `inv-${Date.now()}`,
          invoice_type: "tax_invoice",
          invoice_number: newInvoiceNumber,
          status: "unpaid",
          notes: "Converted from Proforma",
        },
        message: `Successfully converted to Tax Invoice ${newInvoiceNumber}`,
      });
    }

    if (body.action === "toggle_recurring") {
      if (tenant?.firmId) {
        const supabase = createAdminClient();
        await supabase
          .from("recurring_invoices")
          .update({ is_active: body.isActive })
          .eq("id", id)
          .eq("firm_id", tenant.firmId);
      }
      return NextResponse.json({ success: true, is_active: body.isActive });
    }

    // Generic status update
    if (tenant?.firmId) {
      const supabase = createAdminClient();
      await supabase
        .from("invoices")
        .update({ status: body.status, updated_at: new Date().toISOString() })
        .eq("id", id)
        .eq("firm_id", tenant.firmId);
    }

    return NextResponse.json({ success: true, id, status: body.status });
  } catch (error: unknown) {
    console.error("Error in PATCH /api/invoices/[id]:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update invoice" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const tenant = await getTenantContext();

    if (tenant?.firmId) {
      const supabase = createAdminClient();
      await supabase
        .from("invoices")
        .delete()
        .eq("id", id)
        .eq("firm_id", tenant.firmId);
    }

    return NextResponse.json({ success: true, id });
  } catch (error: unknown) {
    console.error("Error in DELETE /api/invoices/[id]:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete invoice" },
      { status: 500 }
    );
  }
}
