import { NextResponse } from "next/server";
import { getTenantContext, createAdminClient } from "@/lib/supabase/server";
import { ServiceItem, ServiceKpiData, ServiceSubtaskTemplate } from "@/components/services/types";

const STANDARD_INITIAL_SERVICES = [
  {
    service_code: "SRV-TAX-001",
    service_name: "TDS Payment & Monthly Compliances",
    category: "Direct Tax",
    sac_code: "998231",
    billing_type: "fixed",
    base_fee: 3500,
    gst_rate: 18,
    estimated_hours: 4,
    tat_days: 3,
    tat_hours: "04:00",
    is_recurring: true,
    recurrence_frequency: "Monthly",
    difficulty_level: "Beginner",
    description: "Monthly challan 281 TDS deduction, compilation, verification and IT portal challan generation.",
    due_timing: "Within period",
    start_day: "Day 1",
    target_due_day: "Day 5",
    end_day: "Day 7",
    exemption_reason: "",
    out_of_pocket_budget: 0,
    sop_count: 5,
    subtasks_count: 4,
    is_default: true,
    is_active: true,
  },
  {
    service_code: "SRV-GST-002",
    service_name: "GSTR-1 & GSTR-3B Return Filing",
    category: "Indirect Tax / GST",
    sac_code: "998231",
    billing_type: "fixed",
    base_fee: 4500,
    gst_rate: 18,
    estimated_hours: 6,
    tat_days: 5,
    tat_hours: "06:00",
    is_recurring: true,
    recurrence_frequency: "Monthly",
    difficulty_level: "Intermediate",
    description: "Outward supply matching, GSTR-2B ITC reconciliation, liability computation and return filing.",
    due_timing: "Within period",
    start_day: "Day 1",
    target_due_day: "Day 10",
    end_day: "Day 20",
    exemption_reason: "",
    out_of_pocket_budget: 0,
    sop_count: 6,
    subtasks_count: 5,
    is_default: true,
    is_active: true,
  },
  {
    service_code: "SRV-AUD-003",
    service_name: "Statutory Audit under Companies Act 2013",
    category: "Statutory Audit",
    sac_code: "998221",
    billing_type: "fixed",
    base_fee: 50000,
    gst_rate: 18,
    estimated_hours: 40,
    tat_days: 30,
    tat_hours: "40:00",
    is_recurring: false,
    recurrence_frequency: "Yearly",
    difficulty_level: "Advanced",
    description: "Comprehensive financial statements examination, CARO 2020 verification, IFC testing, and Audit Report generation.",
    due_timing: "Within period",
    start_day: "Day 1",
    target_due_day: "Day 25",
    end_day: "Day 30",
    exemption_reason: "",
    out_of_pocket_budget: 2500,
    sop_count: 12,
    subtasks_count: 8,
    is_default: true,
    is_active: true,
  },
  {
    service_code: "SRV-AUD-004",
    service_name: "Tax Audit u/s 44AB with Form 3CD",
    category: "Tax Audit 44AB",
    sac_code: "998221",
    billing_type: "fixed",
    base_fee: 35000,
    gst_rate: 18,
    estimated_hours: 25,
    tat_days: 20,
    tat_hours: "25:00",
    is_recurring: false,
    recurrence_frequency: "Yearly",
    difficulty_level: "Advanced",
    description: "Income Tax Audit report Form 3CA/3CB and 44 clause verification in Form 3CD with depreciation and 40A(2)(b) analysis.",
    due_timing: "Within period",
    start_day: "Day 1",
    target_due_day: "Day 15",
    end_day: "Day 20",
    exemption_reason: "",
    out_of_pocket_budget: 1000,
    sop_count: 10,
    subtasks_count: 7,
    is_default: true,
    is_active: true,
  },
  {
    service_code: "SRV-ROC-005",
    service_name: "ROC Annual Filing (AOC-4 & MGT-7)",
    category: "Corporate Law / ROC",
    sac_code: "998232",
    billing_type: "fixed",
    base_fee: 15000,
    gst_rate: 18,
    estimated_hours: 8,
    tat_days: 7,
    tat_hours: "08:00",
    is_recurring: true,
    recurrence_frequency: "Yearly",
    difficulty_level: "Intermediate",
    description: "MCA portal filing of financial statements (AOC-4/AOC-4 XBRL) and Annual Return (MGT-7/7A) with secretarial certs.",
    due_timing: "Within period",
    start_day: "Day 1",
    target_due_day: "Day 5",
    end_day: "Day 7",
    exemption_reason: "",
    out_of_pocket_budget: 1200,
    sop_count: 6,
    subtasks_count: 4,
    is_default: true,
    is_active: true,
  },
  {
    service_code: "SRV-ITR-006",
    service_name: "Corporate Income Tax Return (ITR-6)",
    category: "Direct Tax",
    sac_code: "998231",
    billing_type: "fixed",
    base_fee: 25000,
    gst_rate: 18,
    estimated_hours: 15,
    tat_days: 10,
    tat_hours: "15:00",
    is_recurring: true,
    recurrence_frequency: "Yearly",
    difficulty_level: "Advanced",
    description: "Computation of total income, MAT computation u/s 115JB, tax credit setoff and e-filing with DSC signature.",
    due_timing: "Within period",
    start_day: "Day 1",
    target_due_day: "Day 8",
    end_day: "Day 10",
    exemption_reason: "",
    out_of_pocket_budget: 0,
    sop_count: 8,
    subtasks_count: 6,
    is_default: true,
    is_active: true,
  },
  {
    service_code: "SRV-ADV-007",
    service_name: "Virtual CFO & Retainer Advisory",
    category: "Advisory & Virtual CFO",
    sac_code: "998239",
    billing_type: "fixed",
    base_fee: 75000,
    gst_rate: 18,
    estimated_hours: 50,
    tat_days: 30,
    tat_hours: "50:00",
    is_recurring: true,
    recurrence_frequency: "Monthly",
    difficulty_level: "Expert",
    description: "End-to-end strategic finance oversight, monthly MIS dashboards, board reviews, cash flow budgets, and regulatory structuring.",
    due_timing: "Within period",
    start_day: "Day 1",
    target_due_day: "Day 25",
    end_day: "Day 30",
    exemption_reason: "",
    out_of_pocket_budget: 5000,
    sop_count: 15,
    subtasks_count: 10,
    is_default: false,
    is_active: true,
  },
];

export async function GET() {
  try {
    const tenant = await getTenantContext();
    if (!tenant || !tenant.firmId) {
      return NextResponse.json({ error: "Unauthorized or missing organization" }, { status: 401 });
    }
    const firmId = tenant.firmId;
    const supabase = createAdminClient();

    // Fetch services for this firm
    const { data: initialDbServices, error } = await supabase
      .from("services_master")
      .select("*")
      .eq("firm_id", firmId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching services from Supabase:", error);
      return NextResponse.json({ services: [], kpi: { activeCount: 0, recurringCount: 0, nonRecurringCount: 0, defaultServicesCount: 0, inactiveCount: 0, totalServicesCount: 0 } });
    }

    let dbServices = initialDbServices;

    // Auto-seed standard default services if firm has 0 services yet
    if (!dbServices || dbServices.length === 0) {
      const inserts = STANDARD_INITIAL_SERVICES.map((s) => ({
        ...s,
        firm_id: firmId,
      }));
      const { data: seeded, error: seedError } = await supabase
        .from("services_master")
        .insert(inserts)
        .select("*");

      if (!seedError && seeded) {
        dbServices = seeded;
      }
    }

    let activeCount = 0;
    let recurringCount = 0;
    let nonRecurringCount = 0;
    let defaultServicesCount = 0;
    let inactiveCount = 0;

    const formattedServices: ServiceItem[] = (dbServices || []).map((s) => {
      if (s.is_active) activeCount++;
      else inactiveCount++;

      if (s.is_recurring) recurringCount++;
      else nonRecurringCount++;

      if (s.is_default) defaultServicesCount++;

      return {
        id: s.id,
        serviceCode: s.service_code,
        serviceName: s.service_name,
        category: s.category,
        sacCode: s.sac_code || "998231",
        billingType: s.billing_type || "fixed",
        baseFee: Number(s.base_fee) || 0,
        gstRate: Number(s.gst_rate) || 18,
        estimatedHours: Number(s.estimated_hours) || 0,
        tatDays: Number(s.tat_days) || 7,
        tatHours: s.tat_hours || "00:00",
        isRecurring: Boolean(s.is_recurring),
        recurrenceFrequency: s.recurrence_frequency || (s.is_recurring ? "Monthly" : "One Time"),
        difficultyLevel: (s.difficulty_level || "Intermediate") as ServiceItem["difficultyLevel"],
        description: s.description || "",
        dueTiming: s.due_timing || "Within period",
        startDay: s.start_day || "Day 1",
        targetDueDay: s.target_due_day || "Day 15",
        endDay: s.end_day || "Day 20",
        exemptionReason: s.exemption_reason || "",
        outOfPocketBudget: Number(s.out_of_pocket_budget) || 0,
        sopCount: Number(s.sop_count) || (s.is_recurring ? 5 : 8),
        subtasksCount: Number(s.subtasks_count) || (s.is_recurring ? 4 : 6),
        notes: s.notes || "",
        isDefault: Boolean(s.is_default),
        subtaskTemplates: Array.isArray(s.subtask_templates)
          ? (s.subtask_templates as unknown as ServiceSubtaskTemplate[])
          : [],
        checklistTemplates: Array.isArray(s.checklist_templates)
          ? (s.checklist_templates as unknown as string[])
          : [],
        isActive: Boolean(s.is_active),
        createdOn: new Date(s.created_at).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
        updatedOn: new Date(s.updated_at || s.created_at).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }),
      };
    });

    const kpi: ServiceKpiData = {
      activeCount,
      recurringCount,
      nonRecurringCount,
      defaultServicesCount,
      inactiveCount,
      totalServicesCount: formattedServices.length,
    };

    return NextResponse.json({
      services: formattedServices,
      kpi,
    });
  } catch (error) {
    console.error("Error in GET /api/services:", error);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
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
      serviceName,
      category,
      frequency,
      difficulty,
      description,
      isRecurring,
      professionalFee,
      taxRate,
      sacCode,
      exemptionReason,
      maxOopBudget,
      tatDays,
      tatHours,
      note,
      isDefault,
    } = body;

    if (!serviceName || !category) {
      return NextResponse.json(
        { error: "Service Name and Category are required" },
        { status: 400 }
      );
    }

    const code = `SRV-${category.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-3)}`;
    const supabase = createAdminClient();

    const richPayload = {
      firm_id: firmId,
      service_code: code,
      service_name: serviceName,
      category,
      sac_code: sacCode || "998231",
      billing_type: "fixed",
      base_fee: Number(professionalFee) || 0,
      gst_rate: Number(taxRate) || 18,
      estimated_hours: Number(tatDays) * 4 || 8,
      tat_days: Number(tatDays) || 7,
      tat_hours: tatHours || "00:00",
      is_recurring: Boolean(isRecurring),
      recurrence_frequency: frequency || (isRecurring ? "Monthly" : "One Time"),
      difficulty_level: difficulty || "Intermediate",
      description: description || "",
      due_timing: "Within period",
      start_day: "Day 1",
      target_due_day: `Day ${tatDays || 7}`,
      end_day: `Day ${tatDays ? Number(tatDays) + 3 : 10}`,
      exemption_reason: exemptionReason || "",
      out_of_pocket_budget: Number(maxOopBudget) || 0,
      sop_count: 5,
      subtasks_count: 4,
      notes: note || "",
      is_default: Boolean(isDefault),
      is_active: true,
    };

    const { data: newService, error } = await supabase
      .from("services_master")
      .insert(richPayload)
      .select()
      .maybeSingle();

    let serviceRecord = newService;

    if (error || !serviceRecord) {
      console.warn("Retrying service insert with core columns:", error?.message);
      const { data: coreService, error: coreErr } = await supabase
        .from("services_master")
        .insert({
          firm_id: firmId,
          service_code: code,
          service_name: serviceName,
          category,
          sac_code: sacCode || "998231",
          billing_type: "fixed",
          base_fee: Number(professionalFee) || 0,
          gst_rate: Number(taxRate) || 18,
          estimated_hours: Number(tatDays) * 4 || 8,
          tat_days: Number(tatDays) || 7,
          is_recurring: Boolean(isRecurring),
          recurrence_frequency: frequency || (isRecurring ? "Monthly" : "One Time"),
          is_active: true,
        })
        .select()
        .maybeSingle();

      if (!coreErr && coreService) {
        serviceRecord = coreService;
      } else {
        console.error("Supabase insert service error:", error || coreErr);
        return NextResponse.json({ error: error?.message || coreErr?.message }, { status: 500 });
      }
    }

    const rec = serviceRecord as Record<string, unknown>;
    const formatted: ServiceItem = {
      id: (rec.id as string) || `srv-${Date.now()}`,
      serviceCode: (rec.service_code as string) || code,
      serviceName: (rec.service_name as string) || serviceName,
      category: (rec.category as string) || category,
      sacCode: (rec.sac_code as string) || sacCode || "998231",
      billingType: (rec.billing_type as string) || "fixed",
      baseFee: Number(rec.base_fee) || Number(professionalFee) || 0,
      gstRate: Number(rec.gst_rate) || Number(taxRate) || 18,
      estimatedHours: Number(rec.estimated_hours) || (Number(tatDays) * 4) || 8,
      tatDays: Number(rec.tat_days) || Number(tatDays) || 7,
      tatHours: (rec.tat_hours as string) || tatHours || "00:00",
      isRecurring: rec.is_recurring !== undefined ? Boolean(rec.is_recurring) : Boolean(isRecurring),
      recurrenceFrequency: (rec.recurrence_frequency as string) || frequency || (isRecurring ? "Monthly" : "One Time"),
      difficultyLevel: ((rec.difficulty_level as string) || difficulty || "Intermediate") as ServiceItem["difficultyLevel"],
      description: (rec.description as string) || description || "",
      dueTiming: (rec.due_timing as string) || "Within period",
      startDay: (rec.start_day as string) || "Day 1",
      targetDueDay: (rec.target_due_day as string) || `Day ${tatDays || 7}`,
      endDay: (rec.end_day as string) || `Day ${tatDays ? Number(tatDays) + 3 : 10}`,
      exemptionReason: (rec.exemption_reason as string) || exemptionReason || "",
      outOfPocketBudget: Number(rec.out_of_pocket_budget) || Number(maxOopBudget) || 0,
      sopCount: Number(rec.sop_count) || 5,
      subtasksCount: Number(rec.subtasks_count) || 4,
      notes: (rec.notes as string) || note || "",
      isDefault: Boolean(rec.is_default ?? isDefault),
      subtaskTemplates: [],
      checklistTemplates: [],
      isActive: rec.is_active !== undefined ? Boolean(rec.is_active) : true,
      createdOn: rec.created_at
        ? new Date(rec.created_at as string).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : new Date().toLocaleDateString("en-GB"),
      updatedOn: rec.updated_at || rec.created_at
        ? new Date((rec.updated_at || rec.created_at) as string).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : new Date().toLocaleDateString("en-GB"),
    };

    return NextResponse.json({ success: true, service: formatted });
  } catch (error) {
    console.error("Error in POST /api/services:", error);
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}
