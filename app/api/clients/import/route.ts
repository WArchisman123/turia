import { NextResponse } from "next/server";
import { getTenantContext, createAdminClient } from "@/lib/supabase/server";
import * as XLSX from "xlsx";
import { OfficialClientXlsxRow, ClientItem } from "@/components/clients/types";

export async function POST(req: Request) {
  try {
    const tenant = await getTenantContext();
    if (!tenant || !tenant.firmId) {
      return NextResponse.json({ error: "Unauthorized or missing organization" }, { status: 401 });
    }
    const firmId = tenant.firmId;
    const contentType = req.headers.get("content-type") || "";

    let rows: Partial<OfficialClientXlsxRow>[] = [];

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      if (!file) {
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
      }

      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      rows = XLSX.utils.sheet_to_json<Partial<OfficialClientXlsxRow>>(worksheet);
    } else {
      const body = await req.json();
      rows = body.rows || [];
    }

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: "No client rows found in uploaded file" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const insertedClients: ClientItem[] = [];
    let skippedCount = 0;

    for (const row of rows) {
      const businessName = row["Business Name"] || row["Legal Name"];
      if (!businessName) {
        skippedCount++;
        continue;
      }

      const clientCode = row["Client ID"] || `CL-${Date.now().toString().slice(-4)}${Math.floor(Math.random() * 100)}`;
      const legalName = row["Legal Name"] || businessName;
      const contactName = row["Contact Name"] || "Authorized Director";
      const email = row["Email"] || "";
      const mobileNo = row["Mobile No"] || "";
      const businessPan = row["Business PAN"] || "";
      const registrationNo = row["Registration No"] || "";
      const businessEntity = row["Business Entity"] || "Private Limited Company";
      const currency = row["Currency"] || "INR";
      const gstin = row["GSTIN"] || "";
      const placeOfSupply = row["Place Of Supply"] || "West Bengal (19)";
      const addressLine1 = row["Address Line 1"] || "";
      const addressLine2 = row["Address Line 2"] || "";
      const city = row["City"] || "Kolkata";
      const state = row["State"] || "West Bengal";
      const country = row["Country"] || "India";
      const pincode = row["Pin code"] || "";
      const status = (row["Status"]?.toLowerCase() === "inactive" ? "inactive" : "active");
      const servicesStr = row["Services"] || "Statutory Audit, GST Filing";
      const services = servicesStr.split(",").map((s) => s.trim()).filter(Boolean);
      const groups = row["Groups"] || "Primary Client";
      const associatePartners = row["Associate Partners"] || "";

      // Extract PAN from GSTIN if not explicitly given
      let pan = businessPan;
      if (!pan && gstin && gstin.length >= 12) {
        pan = gstin.substring(2, 12);
      }

      const { data: inserted, error: insertError } = await supabase
        .from("clients")
        .insert({
          firm_id: firmId,
          client_code: clientCode,
          trade_name: businessName,
          legal_name: legalName,
          entity_type: businessEntity,
          pan_number: pan || null,
          cin_number: registrationNo || null,
          registration_no: registrationNo || null,
          primary_gstin: gstin || null,
          primary_email: email || null,
          primary_phone: mobileNo || null,
          contact_name: contactName,
          currency,
          place_of_supply: placeOfSupply,
          address_line_1: addressLine1 || null,
          address_line_2: addressLine2 || null,
          city,
          state,
          country,
          pin_code: pincode || null,
          client_group: groups,
          services,
          associate_partners: associatePartners || null,
          status,
        })
        .select()
        .single();

      if (insertError) {
        console.error("Row import error for", clientCode, insertError);
        skippedCount++;
      } else if (inserted) {
        // Insert GSTIN record if present
        if (gstin) {
          const stateCode = gstin.substring(0, 2);
          await supabase.from("client_gstins").insert({
            firm_id: firmId,
            client_id: inserted.id,
            gstin: gstin.toUpperCase(),
            state,
            state_code: stateCode,
            is_primary: true,
          });
        }

        // Insert Contact record
        if (contactName) {
          await supabase.from("client_contacts").insert({
            firm_id: firmId,
            client_id: inserted.id,
            name: contactName,
            designation: "Director / Auth Signatory",
            email: email || undefined,
            phone: mobileNo || undefined,
            is_primary: true,
          });
        }

        insertedClients.push({
          id: inserted.id,
          clientCode: inserted.client_code,
          tradeName: inserted.trade_name,
          legalName: inserted.legal_name,
          contactName: inserted.contact_name || "Authorized Director",
          email: inserted.primary_email || "",
          mobileNo: inserted.primary_phone || "",
          createdOn: new Date(inserted.created_at).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
          businessPan: inserted.pan_number || "",
          registrationNo: inserted.registration_no || "",
          businessEntity: inserted.entity_type,
          currency: inserted.currency || "INR",
          gstin: inserted.primary_gstin || "",
          placeOfSupply: inserted.place_of_supply || "West Bengal (19)",
          addressLine1: inserted.address_line_1 || "",
          addressLine2: inserted.address_line_2 || "",
          city: inserted.city || "Kolkata",
          state: inserted.state || "West Bengal",
          country: inserted.country || "India",
          pincode: inserted.pin_code || "",
          status: "active",
          services: Array.isArray(inserted.services) && inserted.services.length > 0 ? inserted.services : ["Statutory Audit"],
          employeeList: "Assigned Practitioner",
          groups: inserted.client_group || "Primary Client",
          auditor: "Saha & Associates",
          labels: ["Corporate"],
          associatePartners: inserted.associate_partners || "",
        });
      }
    }

    return NextResponse.json({
      success: true,
      insertedCount: insertedClients.length,
      skippedCount,
      clients: insertedClients,
    });
  } catch (error) {
    console.error("Error in POST /api/clients/import:", error);
    return NextResponse.json({ error: "Failed to import clients" }, { status: 500 });
  }
}
