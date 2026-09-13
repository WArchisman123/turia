import { NextResponse } from "next/server";
import { getTenantContext, createAdminClient } from "@/lib/supabase/server";
import * as XLSX from "xlsx";
import { OfficialServiceXlsxRow, ServiceItem } from "@/components/services/types";

export async function POST(req: Request) {
  try {
    const tenant = await getTenantContext();
    if (!tenant || !tenant.firmId) {
      return NextResponse.json({ error: "Unauthorized or missing organization" }, { status: 401 });
    }
    const firmId = tenant.firmId;
    const contentType = req.headers.get("content-type") || "";

    let rows: Partial<OfficialServiceXlsxRow>[] = [];

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      if (!file) {
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
      }

      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "buffer" });
      const sheetName = workbook.SheetNames.includes("Service Data")
        ? "Service Data"
        : workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      rows = XLSX.utils.sheet_to_json<Partial<OfficialServiceXlsxRow>>(worksheet);
    } else {
      const body = await req.json();
      rows = body.rows || [];
    }

    if (!rows || rows.length === 0) {
      return NextResponse.json({ error: "No service rows found in uploaded file" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const insertedServices: ServiceItem[] = [];
    let skippedCount = 0;

    for (const row of rows) {
      const serviceName = row["Service Name *"];
      if (!serviceName) {
        skippedCount++;
        continue;
      }

      const category = row["Category"] || "Direct Tax";
      const difficultyLevel = (row["Difficulty Level"] || "Intermediate") as ServiceItem["difficultyLevel"];
      const description = row["Description"] || "";
      const frequency = row["Frequency"] || "Monthly";
      const isRecurring = row["Recurring"]?.toLowerCase() === "yes" || row["Recurring"]?.toLowerCase() === "true";
      const dueTiming = row["Due Timing"] || "Within period";
      const startDay = row["Start Day"] || "Day 1";
      const targetDueDay = row["Target Due Day"] || "Day 15";
      const endDay = row["End Day"] || "Day 20";
      const professionalFee = Number(row["Professional Fee"]) || 0;
      const taxRate = Number(String(row["Tax Rate"] || "18").replace("%", "").trim()) || 18;
      const sacCode = row["SAC Code"] || "998231";
      const exemptionReason = row["Exemption Reason"] || "";
      const maxBudget = Number(row["Maximum Budget"]) || 0;
      const tatDays = Number(row["TAT - in Days"]) || 7;
      const tatHours = row["TAT - in Hrs (00:00)"] || "00:00";

      const serviceCode = `SRV-${category.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-4)}${Math.floor(Math.random() * 100)}`;

      const { data: inserted, error: insertError } = await supabase
        .from("services_master")
        .insert({
          firm_id: firmId,
          service_code: serviceCode,
          service_name: serviceName,
          category,
          sac_code: sacCode,
          billing_type: "fixed",
          base_fee: professionalFee,
          gst_rate: taxRate,
          estimated_hours: tatDays * 4 || 8,
          tat_days: tatDays,
          tat_hours: tatHours,
          is_recurring: isRecurring,
          recurrence_frequency: frequency,
          difficulty_level: difficultyLevel,
          description,
          due_timing: dueTiming,
          start_day: startDay,
          target_due_day: targetDueDay,
          end_day: endDay,
          exemption_reason: exemptionReason,
          out_of_pocket_budget: maxBudget,
          sop_count: 5,
          subtasks_count: 4,
          is_default: false,
          is_active: true,
        })
        .select()
        .single();

      if (insertError) {
        console.error("Row import error for", serviceName, insertError);
        skippedCount++;
      } else if (inserted) {
        insertedServices.push({
          id: inserted.id,
          serviceCode: inserted.service_code,
          serviceName: inserted.service_name,
          category: inserted.category,
          sacCode: inserted.sac_code,
          billingType: inserted.billing_type,
          baseFee: Number(inserted.base_fee) || 0,
          gstRate: Number(inserted.gst_rate) || 18,
          estimatedHours: Number(inserted.estimated_hours) || 0,
          tatDays: Number(inserted.tat_days) || 7,
          tatHours: inserted.tat_hours || "00:00",
          isRecurring: Boolean(inserted.is_recurring),
          recurrenceFrequency: inserted.recurrence_frequency || "Monthly",
          difficultyLevel: (inserted.difficulty_level || "Intermediate") as ServiceItem["difficultyLevel"],
          description: inserted.description || "",
          dueTiming: inserted.due_timing || "Within period",
          startDay: inserted.start_day || "Day 1",
          targetDueDay: inserted.target_due_day || "Day 15",
          endDay: inserted.end_day || "Day 20",
          exemptionReason: inserted.exemption_reason || "",
          outOfPocketBudget: Number(inserted.out_of_pocket_budget) || 0,
          sopCount: Number(inserted.sop_count) || 5,
          subtasksCount: Number(inserted.subtasks_count) || 4,
          isDefault: false,
          subtaskTemplates: [],
          checklistTemplates: [],
          isActive: true,
          createdOn: new Date(inserted.created_at).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
          updatedOn: new Date(inserted.updated_at || inserted.created_at).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
        });
      }
    }

    return NextResponse.json({
      success: true,
      insertedCount: insertedServices.length,
      skippedCount,
      services: insertedServices,
    });
  } catch (error) {
    console.error("Error in POST /api/services/import:", error);
    return NextResponse.json({ error: "Failed to import services" }, { status: 500 });
  }
}
