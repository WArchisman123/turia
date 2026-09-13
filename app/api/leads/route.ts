import { NextResponse } from "next/server";
import { getTenantContext, createAdminClient } from "@/lib/supabase/server";
import { LeadItem } from "@/components/leads/types";

export async function GET() {
  try {
    const tenant = await getTenantContext();
    if (!tenant || !tenant.firmId) {
      return NextResponse.json({ error: "Unauthorized or missing organization" }, { status: 401 });
    }
    const firmId = tenant.firmId;

    const supabase = createAdminClient();

    // Fetch leads from Supabase for this firm
    const { data: dbLeads, error } = await supabase
      .from("leads")
      .select("*")
      .eq("firm_id", firmId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching leads from Supabase:", error);
      return NextResponse.json({ leads: [], source: "supabase" });
    }

    // Map database columns to LeadItem
    const formattedLeads: LeadItem[] = (dbLeads || []).map((l) => ({
      id: l.id,
      leadCode: l.lead_code,
      leadName: l.lead_name,
      contactPerson: l.contact_person,
      businessEntity: l.business_entity,
      dealValue: Number(l.deal_value) || 0,
      currency: l.currency || "INR",
      stage: l.stage as LeadItem["stage"],
      status: l.status as LeadItem["status"],
      score: l.score || 50,
      assignedTo: l.assigned_to || "archi",
      source: l.source as LeadItem["source"],
      serviceInterest: l.service_interest || "",
      createdDate: new Date(l.created_at).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).replace(/ /g, "-"),
      phone: l.phone || "",
      email: l.email || "",
      gstin: l.gstin || "",
      pan: l.pan || "",
      city: l.city || "",
      state: l.state || "",
      notes: l.notes || "",
    }));

    return NextResponse.json({
      leads: formattedLeads,
      source: "supabase",
    });
  } catch (error) {
    console.error("Error in GET /api/leads:", error);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
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
      leadName,
      contactPerson,
      businessEntity,
      dealValue,
      currency,
      stage,
      score,
      assignedTo,
      source,
      serviceInterest,
      phone,
      email,
      gstin,
      pan,
      city,
      state,
      notes,
    } = body;

    if (!leadName || !contactPerson) {
      return NextResponse.json(
        { error: "Lead Name and Contact Person are required" },
        { status: 400 }
      );
    }

    const leadCode = `LEAD-2026-${Date.now().toString().slice(-4)}`;
    const supabase = createAdminClient();

    const { data: newLead, error } = await supabase
      .from("leads")
      .insert({
        firm_id: firmId,
        lead_code: leadCode,
        lead_name: leadName,
        contact_person: contactPerson,
        business_entity: businessEntity || "Private Limited Company",
        deal_value: Number(dealValue) || 0,
        currency: currency || "INR",
        stage: stage || "New",
        status: "Open",
        score: Number(score) || 50,
        assigned_to: assignedTo || "archi",
        source: source || "Referral",
        service_interest: serviceInterest || "",
        phone: phone || "",
        email: email || "",
        gstin: gstin || "",
        pan: pan || "",
        city: city || "Kolkata",
        state: state || "West Bengal",
        notes: notes || "",
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert lead error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const formatted: LeadItem = {
      id: newLead.id,
      leadCode: newLead.lead_code,
      leadName: newLead.lead_name,
      contactPerson: newLead.contact_person,
      businessEntity: newLead.business_entity,
      dealValue: Number(newLead.deal_value) || 0,
      currency: newLead.currency || "INR",
      stage: newLead.stage as LeadItem["stage"],
      status: newLead.status as LeadItem["status"],
      score: newLead.score || 50,
      assignedTo: newLead.assigned_to || "archi",
      source: newLead.source as LeadItem["source"],
      serviceInterest: newLead.service_interest || "",
      createdDate: new Date(newLead.created_at).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).replace(/ /g, "-"),
      phone: newLead.phone || "",
      email: newLead.email || "",
      gstin: newLead.gstin || "",
      pan: newLead.pan || "",
      city: newLead.city || "",
      state: newLead.state || "",
      notes: newLead.notes || "",
    };

    return NextResponse.json({
      success: true,
      lead: formatted,
    });
  } catch (error) {
    console.error("Error in POST /api/leads:", error);
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
  }
}
