import * as XLSX from "xlsx";
import { OfficialClientXlsxRow, OFFICIAL_XLSX_COLUMNS } from "@/components/clients/types";

export async function GET() {
  const sampleRows: OfficialClientXlsxRow[] = [
    {
      "Client ID": "ACM-001",
      "Business Name": "Acme Global Logistics Pvt Ltd",
      "Legal Name": "Acme Global Logistics Private Limited",
      "Contact Name": "Rajesh Aggarwal",
      "Email": "accounts@acmelogistics.in",
      "Mobile No": "+91 98310 99881",
      "Created On": "03/09/2026",
      "Business PAN": "AAACA1122B",
      "Registration No": "U60200WB2018PTC224455",
      "Business Entity": "Private Limited Company",
      "Currency": "INR",
      "GSTIN": "19AAACA1122B1Z4",
      "Place Of Supply": "West Bengal (19)",
      "Address Line 1": "Plot 42, Sector V, Salt Lake",
      "Address Line 2": "Bidhannagar",
      "City": "Kolkata",
      "State": "West Bengal",
      "Country": "India",
      "Pin code": "700091",
      "Status": "Active",
      "Services": "Statutory Audit, Tax Audit 44AB, GST Return Filing",
      "Employee List": "Archi Saha (Partner)",
      "Groups": "Acme Group Entities",
      "Associate Partners": "Senior Partner",
    },
    {
      "Client ID": "REL-002",
      "Business Name": "Reliance Retail Distributors LLP",
      "Legal Name": "Reliance Retail Distributors Limited Liability Partnership",
      "Contact Name": "Pooja Mehta",
      "Email": "taxation@relianceretail.com",
      "Mobile No": "+91 98300 44552",
      "Created On": "03/09/2026",
      "Business PAN": "AAACR9988C",
      "Registration No": "AAA-4499",
      "Business Entity": "Limited Liability Partnership (LLP)",
      "Currency": "INR",
      "GSTIN": "27AAACR9988C1Z6",
      "Place Of Supply": "Maharashtra (27)",
      "Address Line 1": "Bandra Kurla Complex, Bandra East",
      "Address Line 2": "Tower B, Level 12",
      "City": "Mumbai",
      "State": "Maharashtra",
      "Country": "India",
      "Pin code": "400051",
      "Status": "Active",
      "Services": "Transfer Pricing 3CEB, GST Audit, TDS Compliance",
      "Employee List": "Archi Saha (Partner)",
      "Groups": "Reliance Regional Network",
      "Associate Partners": "Tax Counsel",
    },
  ];

  const worksheet = XLSX.utils.json_to_sheet(sampleRows, {
    header: [...OFFICIAL_XLSX_COLUMNS],
  });

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
  const filename = "Clients_SampleData_Template.xlsx";

  return new Response(excelBuffer, {
    status: 200,
    headers: {
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    },
  });
}
