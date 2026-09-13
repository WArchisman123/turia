import * as XLSX from "xlsx";
import { OfficialServiceXlsxRow, OFFICIAL_SERVICE_COLUMNS } from "@/components/services/types";

export async function GET() {
  const sampleRows: OfficialServiceXlsxRow[] = [
    {
      "Service Name *": "TDS Payment (Monthly)",
      "Category": "Direct Tax",
      "Difficulty Level": "Beginner",
      "Description": "Monthly TDS Challan 281 compilation and filing",
      "Frequency": "Monthly",
      "Recurring": "Yes",
      "Due Timing": "Within period",
      "Start Day": "Day 1",
      "Target Due Day": "Day 5",
      "End Day": "Day 7",
      "Professional Fee": 3500,
      "Tax Rate": "18%",
      "SAC Code": "998231",
      "Exemption Reason": "",
      "Out of Pocket Expenses": "No",
      "Maximum Budget": 0,
      "TAT - in Days": 3,
      "TAT - in Hrs (00:00)": "04:00",
    },
    {
      "Service Name *": "GSTR-1 & GSTR-3B Monthly Filing",
      "Category": "Indirect Tax / GST",
      "Difficulty Level": "Intermediate",
      "Description": "GSTR-1 outward invoice entry and 3B summary tax filing with ITC reconciliation",
      "Frequency": "Monthly",
      "Recurring": "Yes",
      "Due Timing": "Within period",
      "Start Day": "Day 1",
      "Target Due Day": "Day 10",
      "End Day": "Day 20",
      "Professional Fee": 4500,
      "Tax Rate": "18%",
      "SAC Code": "998231",
      "Exemption Reason": "",
      "Out of Pocket Expenses": "No",
      "Maximum Budget": 0,
      "TAT - in Days": 5,
      "TAT - in Hrs (00:00)": "06:00",
    },
    {
      "Service Name *": "Statutory Audit under Companies Act 2013",
      "Category": "Statutory Audit",
      "Difficulty Level": "Advanced",
      "Description": "Independent Auditor Report with CARO 2020 verification and IFC testing",
      "Frequency": "Yearly",
      "Recurring": "No",
      "Due Timing": "Within period",
      "Start Day": "Day 1",
      "Target Due Day": "Day 25",
      "End Day": "Day 30",
      "Professional Fee": 50000,
      "Tax Rate": "18%",
      "SAC Code": "998221",
      "Exemption Reason": "",
      "Out of Pocket Expenses": "Yes",
      "Maximum Budget": 2500,
      "TAT - in Days": 30,
      "TAT - in Hrs (00:00)": "40:00",
    },
  ];

  const workbook = XLSX.utils.book_new();

  // Sheet 1: Service Data
  const wsServiceData = XLSX.utils.json_to_sheet(sampleRows, {
    header: [...OFFICIAL_SERVICE_COLUMNS],
  });
  XLSX.utils.book_append_sheet(workbook, wsServiceData, "Service Data");

  // Sheet 2: Instruction
  const instructions = [
    { "Field Name": "Service Name*", "Mandatory": "Mandatory", "Instruction": "Enter the name of the service you are offering." },
    { "Field Name": "Category", "Mandatory": "Mandatory", "Instruction": "Select from standard categories: Direct Tax, Indirect Tax / GST, Statutory Audit, Corporate Law / ROC, etc." },
    { "Field Name": "Difficulty Level", "Mandatory": "Optional", "Instruction": "Beginner, Intermediate, Advanced, Expert" },
    { "Field Name": "Recurring", "Mandatory": "Mandatory", "Instruction": "Yes or No" },
    { "Field Name": "Professional Fee", "Mandatory": "Mandatory", "Instruction": "Standard base professional fee in INR" },
    { "Field Name": "SAC Code", "Mandatory": "Mandatory", "Instruction": "6-digit SAC Code (e.g. 998231 for accounting/tax, 998221 for audit)" },
  ];
  const wsInstruction = XLSX.utils.json_to_sheet(instructions);
  XLSX.utils.book_append_sheet(workbook, wsInstruction, "Instruction");

  // Sheet 3: Master
  const masterData = [
    { Category: "Direct Tax", "Tax Group": "18%", Frequency: "Monthly", "Difficulty Level": "Beginner", Recurring: "Yes" },
    { Category: "Indirect Tax / GST", "Tax Group": "18%", Frequency: "Quarterly", "Difficulty Level": "Intermediate", Recurring: "No" },
    { Category: "Statutory Audit", "Tax Group": "18%", Frequency: "Yearly", "Difficulty Level": "Advanced", Recurring: "Yes" },
    { Category: "Corporate Law / ROC", "Tax Group": "18%", Frequency: "One Time", "Difficulty Level": "Expert", Recurring: "No" },
    { Category: "Transfer Pricing", "Tax Group": "18%", Frequency: "Half Yearly", "Difficulty Level": "Expert", Recurring: "No" },
  ];
  const wsMaster = XLSX.utils.json_to_sheet(masterData);
  XLSX.utils.book_append_sheet(workbook, wsMaster, "Master");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
  const filename = "Service_SampleData.xlsx";

  return new Response(excelBuffer, {
    status: 200,
    headers: {
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  });
}
