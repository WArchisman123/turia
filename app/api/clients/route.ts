import { NextResponse } from "next/server";
import { getTenantContext, createAdminClient } from "@/lib/supabase/server";
import { ClientItem, ClientKpiData } from "@/components/clients/types";

export async function GET() {
  try {
    const tenant = await getTenantContext();
    if (!tenant || !tenant.firmId) {
      return NextResponse.json({ error: "Unauthorized or missing organization" }, { status: 401 });
    }
    const firmId = tenant.firmId;
    const supabase = createAdminClient();

    // Fetch clients for this firm
    const { data: dbClients, error } = await supabase
      .from("clients")
      .select("*")
      .eq("firm_id", firmId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching clients from Supabase:", error);
      return NextResponse.json({ clients: [], kpi: { totalClients: 0, newClientsThisMonth: 0, activeClients90Days: 0, noActivity90Days: 0 } });
    }

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let newThisMonthCount = 0;
    let active90DaysCount = 0;
    let noActivityCount = 0;

    const formattedClients: ClientItem[] = (dbClients || []).map((c) => {
      const createdAt = new Date(c.created_at);
      const isNewMonth = createdAt.getMonth() === currentMonth && createdAt.getFullYear() === currentYear;
      if (isNewMonth) newThisMonthCount++;

      const isStatusActive = c.status === "active";
      if (isStatusActive) {
        active90DaysCount++;
      } else {
        noActivityCount++;
      }

      return {
        id: c.id,
        clientCode: c.client_code,
        tradeName: c.trade_name,
        legalName: c.legal_name,
        contactName: c.contact_name || "Authorized Director",
        email: c.primary_email || "",
        mobileNo: c.primary_phone || "",
        createdOn: createdAt.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
        businessPan: c.pan_number || "",
        registrationNo: c.registration_no || c.cin_number || "",
        businessEntity: c.entity_type,
        currency: c.currency || "INR",
        gstin: c.primary_gstin || "",
        placeOfSupply: c.place_of_supply || `${c.state || "West Bengal"} (19)`,
        addressLine1: c.address_line_1 || "",
        addressLine2: c.address_line_2 || "",
        city: c.city || "Kolkata",
        state: c.state || "West Bengal",
        country: c.country || "India",
        pincode: c.pin_code || "",
        status: (c.status === "active" ? "active" : c.status === "inactive" ? "inactive" : "active") as ClientItem["status"],
        services: Array.isArray(c.services) && c.services.length > 0 ? c.services : ["Statutory Audit", "GST Filing"],
        employeeList: c.assigned_partner_id ? "Archi Saha (Partner)" : "Unassigned",
        assignedPartnerId: c.assigned_partner_id,
        assignedManagerId: c.assigned_manager_id,
        groups: c.client_group || "Primary Client",
        auditor: c.auditor || "Saha & Associates",
        labels: Array.isArray(c.labels) && c.labels.length > 0 ? c.labels : ["Corporate"],
        associatePartners: c.associate_partners || "Senior Audit Partner",
        referredBy: c.referred_by || "",
        source: c.source || "Referral",
      };
    });

    const kpi: ClientKpiData = {
      totalClients: formattedClients.length,
      newClientsThisMonth: newThisMonthCount,
      activeClients90Days: active90DaysCount,
      noActivity90Days: noActivityCount,
    };

    return NextResponse.json({
      clients: formattedClients,
      kpi,
    });
  } catch (error) {
    console.error("Error in GET /api/clients:", error);
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 });
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

    const {
      businessEntity,
      businessName,
      legalName,
      clientId,
      referredBy,
      source,
      currency,
      gstin,
      placeOfSupply,
      addressLine1,
      addressLine2,
      city,
      state,
      country,
      pincode,
      businessPan,
      registrationNo,
      primaryEmail,
      primaryPhone,
      contactName,
      clientGroup,
      auditor,
      services,
      labels,
      associatePartners,
      assignedPartnerId,
      assignedManagerId,
    } = body;

    if (!businessName || !businessEntity) {
      return NextResponse.json(
        { error: "Business Entity and Business Name are required" },
        { status: 400 }
      );
    }

    const code = clientId || `CL-${Date.now().toString().slice(-4)}`;
    const supabase = createAdminClient();

    // Extract PAN from GSTIN if missing
    let pan = businessPan;
    if (!pan && gstin && gstin.length >= 12) {
      pan = gstin.substring(2, 12);
    }

    const { data: newClient, error } = await supabase
      .from("clients")
      .insert({
        firm_id: firmId,
        client_code: code,
        trade_name: businessName,
        legal_name: legalName || businessName,
        entity_type: businessEntity,
        pan_number: pan || null,
        cin_number: registrationNo || null,
        registration_no: registrationNo || null,
        primary_gstin: gstin || null,
        primary_email: primaryEmail || null,
        primary_phone: primaryPhone || null,
        contact_name: contactName || "Director / Authorized Signatory",
        currency: currency || "INR",
        place_of_supply: placeOfSupply || "West Bengal (19)",
        address_line_1: addressLine1 || null,
        address_line_2: addressLine2 || null,
        city: city || "Kolkata",
        state: state || "West Bengal",
        country: country || "India",
        pin_code: pincode || null,
        referred_by: referredBy || null,
        source: source || "Referral",
        client_group: clientGroup || null,
        auditor: auditor || "Saha & Associates",
        labels: labels || ["Corporate"],
        services: services || ["Statutory Audit", "GST Filing"],
        associate_partners: associatePartners || null,
        assigned_partner_id: assignedPartnerId || null,
        assigned_manager_id: assignedManagerId || null,
      })
      .select()
      .maybeSingle();

    let clientRecord = newClient;

    if (error || !clientRecord) {
      // Schema resilience: fallback to core schema columns if migration is pending
      const { data: coreClient, error: coreErr } = await supabase
        .from("clients")
        .insert({
          firm_id: firmId,
          client_code: code,
          trade_name: businessName,
          legal_name: legalName || businessName,
          entity_type: businessEntity,
          pan_number: pan || null,
          cin_number: registrationNo || null,
          primary_gstin: gstin || null,
          primary_email: primaryEmail || null,
          primary_phone: primaryPhone || null,
          assigned_partner_id: assignedPartnerId || null,
          assigned_manager_id: assignedManagerId || null,
          status: "active",
        })
        .select()
        .maybeSingle();

      if (!coreErr && coreClient) {
        clientRecord = coreClient;
      } else {
        console.error("Supabase insert client error:", error || coreErr);
        return NextResponse.json({ error: error?.message || coreErr?.message }, { status: 500 });
      }
    }

    // Also record primary GSTIN in client_gstins if provided
    if (gstin && clientRecord) {
      const stateCode = gstin.substring(0, 2);
      await supabase.from("client_gstins").insert({
        firm_id: firmId,
        client_id: clientRecord.id,
        gstin: gstin.toUpperCase(),
        state: state || "West Bengal",
        state_code: stateCode,
        principal_place: addressLine1 ? `${addressLine1}, ${city}` : undefined,
        is_primary: true,
      });
    }

    // Also record key contact in client_contacts if provided
    if (contactName && clientRecord) {
      await supabase.from("client_contacts").insert({
        firm_id: firmId,
        client_id: clientRecord.id,
        name: contactName,
        designation: "Director / Auth Signatory",
        email: primaryEmail || undefined,
        phone: primaryPhone || undefined,
        is_primary: true,
      });
    }

    const formatted: ClientItem = {
      id: clientRecord.id,
      clientCode: clientRecord.client_code,
      tradeName: clientRecord.trade_name,
      legalName: clientRecord.legal_name,
      contactName: (clientRecord as Record<string, unknown>).contact_name as string || contactName || "Authorized Director",
      email: clientRecord.primary_email || "",
      mobileNo: clientRecord.primary_phone || "",
      createdOn: new Date(clientRecord.created_at).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
      businessPan: clientRecord.pan_number || "",
      registrationNo: (clientRecord as Record<string, unknown>).registration_no as string || clientRecord.cin_number || "",
      businessEntity: clientRecord.entity_type,
      currency: (clientRecord as Record<string, unknown>).currency as string || currency || "INR",
      gstin: clientRecord.primary_gstin || "",
      placeOfSupply: (clientRecord as Record<string, unknown>).place_of_supply as string || placeOfSupply || "West Bengal (19)",
      addressLine1: addressLine1 || "",
      addressLine2: addressLine2 || "",
      city: city || "Kolkata",
      state: state || "West Bengal",
      country: country || "India",
      pincode: pincode || "",
      status: "active",
      services: services || ["Statutory Audit"],
      employeeList: "Assigned Practitioner",
      groups: clientGroup || "Primary Client",
      auditor: auditor || "Saha & Associates",
      labels: labels || ["Corporate"],
      associatePartners: associatePartners || "Senior Partner",
      referredBy: referredBy || "",
      source: source || "Referral",
    };

    return NextResponse.json({ success: true, client: formatted });
  } catch (error) {
    console.error("Error in POST /api/clients:", error);
    return NextResponse.json({ error: "Failed to create client" }, { status: 500 });
  }
}
