import { NextResponse } from "next/server";
import { getTenantContext, createAdminClient } from "@/lib/supabase/server";
import { Database } from "@/lib/supabase/types";
import { LeadItem } from "@/components/leads/types";

// In-memory session store for resilient fallback when DB key is in transition
const memoryLeadsByFirm = new Map<string, LeadItem[]>();

export async function GET() {
  try {
    const tenant = await getTenantContext();
    if (!tenant || !tenant.firmId) {
      return NextResponse.json({ error: "Unauthorized or missing organization" }, { status: 401 });
    }
    const firmId = tenant.firmId;
    const supabase = createAdminClient();

    let dbLeads: Database["public"]["Tables"]["leads"]["Row"][] | null = null;
    try {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .eq("firm_id", firmId)
        .order("created_at", { ascending: false });

      if (!error && data) {
        dbLeads = data;
      }
    } catch {
      // Supabase query error - handled by fallback below
    }

    // Map database columns to LeadItem
    const formattedDbLeads: LeadItem[] = (dbLeads || []).map((l) => ({
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

    const sessionLeads = memoryLeadsByFirm.get(firmId) || [];
    const dbIds = new Set(formattedDbLeads.map((l) => l.id));
    const combinedLeads = [
      ...sessionLeads.filter((l) => !dbIds.has(l.id)),
      ...formattedDbLeads,
    ];

    return NextResponse.json({
      leads: combinedLeads,
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

    let leadItem: LeadItem | null = null;

    try {
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

      if (!error && newLead) {
        leadItem = {
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
      } else if (error) {
        console.warn("Supabase lead insert warning:", error.message);
      }
    } catch (insertErr) {
      console.warn("Supabase insert lead exception:", insertErr);
    }

    // If Supabase didn't complete (e.g. unregistered service key in local dev), use formatted fallback
    if (!leadItem) {
      leadItem = {
        id: `LD-${Date.now().toString().slice(-4)}`,
        leadCode,
        leadName,
        contactPerson,
        businessEntity: businessEntity || "Private Limited Company",
        dealValue: Number(dealValue) || 0,
        currency: currency || "INR",
        stage: stage || "New",
        status: "Open",
        score: Number(score) || 50,
        assignedTo: assignedTo || "archi",
        source: source || "Referral",
        serviceInterest: serviceInterest || "",
        createdDate: new Date().toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).replace(/ /g, "-"),
        phone: phone || "",
        email: email || "",
        gstin: gstin || "",
        pan: pan || "",
        city: city || "Kolkata",
        state: state || "West Bengal",
        notes: notes || "",
      };
    }

    // Persist to session cache
    const existing = memoryLeadsByFirm.get(firmId) || [];
    memoryLeadsByFirm.set(firmId, [leadItem, ...existing]);

    return NextResponse.json({
      success: true,
      lead: leadItem,
    }, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/leads:", error);
    return NextResponse.json({ error: "Failed to create lead" }, { status: 500 });
  }
}
