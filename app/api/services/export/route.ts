import { NextResponse } from "next/server";
import { getTenantContext, createAdminClient } from "@/lib/supabase/server";
import * as XLSX from "xlsx";
import { OfficialServiceXlsxRow, OFFICIAL_SERVICE_COLUMNS } from "@/components/services/types";

export async function GET() {
  try {
    const tenant = await getTenantContext();
    if (!tenant || !tenant.firmId) {
      return NextResponse.json({ error: "Unauthorized or missing organization" }, { status: 401 });
    }
    const firmId = tenant.firmId;
    const supabase = createAdminClient();

    const { data: dbServices, error } = await supabase
      .from("services_master")
      .select("*")
      .eq("firm_id", firmId)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Error exporting services:", error);
      return NextResponse.json({ error: "Failed to export services" }, { status: 500 });
    }

    const rows: OfficialServiceXlsxRow[] = (dbServices || []).map((s) => ({
      "Service Name *": s.service_name,
      "Category": s.category,
      "Difficulty Level": s.difficulty_level || "Intermediate",
      "Description": s.description || "",
      "Frequency": s.recurrence_frequency || (s.is_recurring ? "Monthly" : "One Time"),
      "Recurring": s.is_recurring ? "Yes" : "No",
      "Due Timing": s.due_timing || "Within period",
      "Start Day": s.start_day || "Day 1",
      "Target Due Day": s.target_due_day || "Day 15",
      "End Day": s.end_day || "Day 20",
      "Professional Fee": Number(s.base_fee) || 0,
      "Tax Rate": `${s.gst_rate || 18}%`,
      "SAC Code": s.sac_code || "998231",
      "Exemption Reason": s.exemption_reason || "",
      "Out of Pocket Expenses": Number(s.out_of_pocket_budget) > 0 ? "Yes" : "No",
      "Maximum Budget": Number(s.out_of_pocket_budget) || 0,
      "TAT - in Days": Number(s.tat_days) || 7,
      "TAT - in Hrs (00:00)": s.tat_hours || "00:00",
    }));

    const workbook = XLSX.utils.book_new();

    // Sheet 1: Service Data
    const wsServiceData = XLSX.utils.json_to_sheet(rows, {
      header: [...OFFICIAL_SERVICE_COLUMNS],
    });
    XLSX.utils.book_append_sheet(workbook, wsServiceData, "Service Data");

    // Sheet 2: Instruction
    const instructions = [
      { "Field Name": "Service Name*", "Mandatory": "Mandatory", "Instruction": "Enter the statutory service title" },
      { "Field Name": "Category", "Mandatory": "Mandatory", "Instruction": "Direct Tax, Indirect Tax / GST, Statutory Audit, etc." },
      { "Field Name": "Professional Fee", "Mandatory": "Mandatory", "Instruction": "Base statutory fee in INR" },
      { "Field Name": "SAC Code", "Mandatory": "Mandatory", "Instruction": "6-digit SAC code for GST compliance (e.g. 998231)" },
    ];
    const wsInstruction = XLSX.utils.json_to_sheet(instructions);
    XLSX.utils.book_append_sheet(workbook, wsInstruction, "Instruction");

    // Sheet 3: Master
    const masterData = [
      { Category: "Direct Tax", "Tax Group": "18%", Frequency: "Monthly", "Difficulty Level": "Beginner", Recurring: "Yes" },
      { Category: "Indirect Tax / GST", "Tax Group": "18%", Frequency: "Quarterly", "Difficulty Level": "Intermediate", Recurring: "No" },
      { Category: "Statutory Audit", "Tax Group": "18%", Frequency: "Yearly", "Difficulty Level": "Advanced", Recurring: "Yes" },
      { Category: "Corporate Law / ROC", "Tax Group": "18%", Frequency: "One Time", "Difficulty Level": "Expert", Recurring: "No" },
    ];
    const wsMaster = XLSX.utils.json_to_sheet(masterData);
    XLSX.utils.book_append_sheet(workbook, wsMaster, "Master");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    const filename = `TURIA_Services_Catalog_${new Date().toISOString().slice(0, 10)}.xlsx`;

    return new Response(excelBuffer, {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    });
  } catch (error) {
    console.error("Error in GET /api/services/export:", error);
    return NextResponse.json({ error: "Failed to export services" }, { status: 500 });
  }
}
