import { NextResponse } from "next/server";
import { getTenantContext, createAdminClient } from "@/lib/supabase/server";
import * as XLSX from "xlsx";
import { OfficialClientXlsxRow, OFFICIAL_XLSX_COLUMNS } from "@/components/clients/types";

export async function GET() {
  try {
    const tenant = await getTenantContext();
    if (!tenant || !tenant.firmId) {
      return NextResponse.json({ error: "Unauthorized or missing organization" }, { status: 401 });
    }
    const firmId = tenant.firmId;
    const supabase = createAdminClient();

    const { data: dbClients, error } = await supabase
      .from("clients")
      .select("*")
      .eq("firm_id", firmId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error exporting clients:", error);
      return NextResponse.json({ error: "Failed to export clients" }, { status: 500 });
    }

    const rows: OfficialClientXlsxRow[] = (dbClients || []).map((c) => ({
      "Client ID": c.client_code,
      "Business Name": c.trade_name,
      "Legal Name": c.legal_name,
      "Contact Name": c.contact_name || "Authorized Signatory",
      "Email": c.primary_email || "",
      "Mobile No": c.primary_phone || "",
      "Created On": new Date(c.created_at).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      "Business PAN": c.pan_number || "",
      "Registration No": c.registration_no || c.cin_number || "",
      "Business Entity": c.entity_type,
      "Currency": c.currency || "INR",
      "GSTIN": c.primary_gstin || "",
      "Place Of Supply": c.place_of_supply || "West Bengal (19)",
      "Address Line 1": c.address_line_1 || "",
      "Address Line 2": c.address_line_2 || "",
      "City": c.city || "Kolkata",
      "State": c.state || "West Bengal",
      "Country": c.country || "India",
      "Pin code": c.pin_code || "",
      "Status": c.status === "active" ? "Active" : "Inactive",
      "Services": Array.isArray(c.services) ? c.services.join(", ") : "Statutory Audit, GST Filing",
      "Employee List": "Archi Saha (Partner)",
      "Groups": c.client_group || "Primary Client",
      "Associate Partners": c.associate_partners || "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows, {
      header: [...OFFICIAL_XLSX_COLUMNS],
    });

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    const filename = `TURIA_Clients_Master_${new Date().toISOString().slice(0, 10)}.xlsx`;

    return new Response(excelBuffer, {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  } catch (error) {
    console.error("Error in GET /api/clients/export:", error);
    return NextResponse.json({ error: "Failed to export clients" }, { status: 500 });
  }
}
