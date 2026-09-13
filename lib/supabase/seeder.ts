import { createAdminClient } from "./server";
import { Database } from "./types";
import { MOCK_LEADS } from "@/lib/data/mock-data";

export interface SeedingResult {
  success: boolean;
  message: string;
  counts: {
    firmUsers: number;
    clients: number;
    services: number;
    tasks: number;
    invoices: number;
    receipts: number;
    attendance: number;
    timesheet: number;
    notes: number;
    leads: number;
    dsc: number;
    documents: number;
    leaves: number;
    expenses: number;
  };
}

export async function seedTenantDatabase(firmId: string, currentUserId: string): Promise<SeedingResult> {
  const supabase = createAdminClient();

  const counts = {
    firmUsers: 0,
    clients: 0,
    services: 0,
    tasks: 0,
    invoices: 0,
    receipts: 0,
    attendance: 0,
    timesheet: 0,
    notes: 0,
    leads: 0,
    dsc: 0,
    documents: 0,
    leaves: 0,
    expenses: 0,
  };

  try {
    // 1. Update Firm Details
    await supabase
      .from("firms")
      .update({
        brand_name: "Saha & Sons",
        legal_name: "Saha & Sons Chartered Accountants",
        business_entity: "Partnership Firm",
        pan_number: "AACFS1234F",
        gstin: "19AACFS1234F1Z8",
        cin_number: "AAJ-8899",
        tan_number: "CALA12345B",
        onboarding_step: 5,
        onboarding_completed: true,
        city: "Kolkata",
        state: "West Bengal",
        address_line_1: "Suite 402, Trinity Tower, Topsia Road",
        pin_code: "700046",
        phone: "+91 33 2288 4400",
        email: "contact@sahaandsons.in",
        website: "https://sahaandsons.in",
      })
      .eq("id", firmId);

    // 2. Seed Team Hierarchy (firm_users)
    // First: Managing Partner (Super Admin)
    const { data: leadPartner } = await supabase
      .from("firm_users")
      .upsert(
        {
          firm_id: firmId,
          clerk_user_id: `user_managing_partner_${firmId.slice(0, 8)}`,
          employee_id: "TURIA-EMP-000",
          first_name: "Vikram",
          last_name: "Saha, FCA",
          full_name: "Vikram Saha, FCA",
          email: "vikram@sahaandsons.in",
          phone: "+91 98300 00111",
          role: "admin" as const,
          designation: "Founder & Managing Partner",
          department: "Practice Leadership",
          cost_per_hour: 800,
          billing_rate: 4000,
          is_active: true,
          city: "Kolkata",
          state: "West Bengal",
          pan_number: "AAAPS1122F",
          salary: 150000,
        },
        { onConflict: "firm_id,clerk_user_id" }
      )
      .select("id")
      .single();

    const managingPartnerId = leadPartner?.id;

    // Second: Current User (Senior Partner / Admin)
    const { data: primaryUser } = await supabase
      .from("firm_users")
      .upsert(
        {
          firm_id: firmId,
          clerk_user_id: currentUserId,
          employee_id: "TURIA-EMP-001",
          first_name: "archi",
          last_name: "",
          full_name: "archi",
          email: "arch.sas.123@gmail.com",
          phone: "+91 87774 31358",
          role: "admin" as const,
          designation: "Senior Partner & Tax Lead",
          department: "Direct Tax & Corporate Audit",
          reporting_to_id: managingPartnerId || null,
          shift: "General (10 AM - 7 PM)",
          joining_date: "2024-04-01",
          confirmation_date: "2024-07-01",
          dob: "1996-08-14",
          gender: "Male",
          pan_number: "ABCDE1234F",
          aadhaar_number: "987654321098",
          icai_member_number: "FCA-445588",
          address_line_1: "44 Park Street, Flat 3B",
          city: "Kolkata",
          state: "West Bengal",
          pin_code: "700016",
          salary: 85000,
          cost_per_hour: 350,
          billing_rate: 1500,
          work_experience: "8 Years Post Qualification",
          employment_status: "confirmed",
          is_active: true,
        },
        { onConflict: "firm_id,clerk_user_id" }
      )
      .select("id")
      .single();

    const currentFirmUserId = primaryUser?.id;
    counts.firmUsers += 2;

    // Third: Manager
    const { data: managerUser } = await supabase
      .from("firm_users")
      .upsert(
        {
          firm_id: firmId,
          clerk_user_id: `user_manager_${firmId.slice(0, 8)}`,
          employee_id: "TURIA-EMP-002",
          first_name: "Priya",
          last_name: "Mukherjee, ACA",
          full_name: "Priya Mukherjee, ACA",
          email: "priya.m@sahaandsons.in",
          phone: "+91 98302 33445",
          role: "manager" as const,
          designation: "Senior Audit & GST Manager",
          department: "Statutory Audit & Indirect Tax",
          reporting_to_id: managingPartnerId || null,
          cost_per_hour: 450,
          billing_rate: 2000,
          is_active: true,
          city: "Kolkata",
          state: "West Bengal",
          salary: 65000,
        },
        { onConflict: "firm_id,clerk_user_id" }
      )
      .select("id")
      .single();

    const managerUserId = managerUser?.id;
    counts.firmUsers++;

    // Fourth: Senior Associate
    const { data: associateUser } = await supabase
      .from("firm_users")
      .upsert(
        {
          firm_id: firmId,
          clerk_user_id: `user_associate_${firmId.slice(0, 8)}`,
          employee_id: "TURIA-EMP-003",
          first_name: "Rahul",
          last_name: "Verma",
          full_name: "Rahul Verma",
          email: "rahul.v@sahaandsons.in",
          phone: "+91 98301 66554",
          role: "senior_associate" as const,
          designation: "Direct Tax Senior Associate",
          department: "Income Tax & Assessment",
          reporting_to_id: currentFirmUserId || null,
          cost_per_hour: 280,
          billing_rate: 1200,
          is_active: true,
          city: "Kolkata",
          state: "West Bengal",
          salary: 42000,
        },
        { onConflict: "firm_id,clerk_user_id" }
      )
      .select("id")
      .single();

    const associateUserId = associateUser?.id;
    counts.firmUsers++;

    // Fifth: Article Trainee
    await supabase.from("firm_users").upsert(
      {
        firm_id: firmId,
        clerk_user_id: `user_trainee_${firmId.slice(0, 8)}`,
        employee_id: "TURIA-EMP-004",
        first_name: "Ananya",
        last_name: "Sen",
        full_name: "Ananya Sen",
        email: "ananya.s@sahaandsons.in",
        phone: "+91 98303 88990",
        role: "article_trainee" as const,
        designation: "Article Trainee (Year 2)",
        department: "Direct Tax & ROC",
        reporting_to_id: associateUserId || null,
        cost_per_hour: 120,
        billing_rate: 600,
        is_active: true,
        city: "Kolkata",
        state: "West Bengal",
        salary: 12000,
      },
      { onConflict: "firm_id,clerk_user_id" }
    );
    counts.firmUsers++;

    // 3. Seed Clients (clients)
    const demoClients: Database["public"]["Tables"]["clients"]["Insert"][] = [
      {
        firm_id: firmId,
        client_code: "ACM-001",
        trade_name: "Acme Global Logistics Pvt Ltd",
        legal_name: "Acme Global Logistics Private Limited",
        entity_type: "Private Limited Company",
        pan_number: "AAACA1122B",
        cin_number: "U60200WB2018PTC224455",
        primary_gstin: "19AAACA1122B1Z4",
        primary_email: "accounts@acmelogistics.in",
        primary_phone: "+91 98310 99881",
        assigned_partner_id: currentFirmUserId || null,
        assigned_manager_id: managerUserId || null,
        status: "active",
      },
      {
        firm_id: firmId,
        client_code: "REL-002",
        trade_name: "Reliance Retail Distributors LLP",
        legal_name: "Reliance Retail Distributors Limited Liability Partnership",
        entity_type: "Limited Liability Partnership",
        pan_number: "AAACR9988C",
        cin_number: "AAA-4499",
        primary_gstin: "27AAACR9988C1Z6",
        primary_email: "taxation@relianceretail.com",
        primary_phone: "+91 98300 44552",
        assigned_partner_id: currentFirmUserId || null,
        assigned_manager_id: managerUserId || null,
        status: "active",
      },
      {
        firm_id: firmId,
        client_code: "APX-003",
        trade_name: "Apex FinTech Solutions India Ltd",
        legal_name: "Apex FinTech Solutions India Limited",
        entity_type: "Public Limited Company",
        pan_number: "AAACT5544D",
        cin_number: "L15491WB1962PLC031425",
        primary_gstin: "19AAACT5544D1Z8",
        primary_email: "corp.tax@apexfintech.com",
        primary_phone: "+91 98201 11223",
        assigned_partner_id: currentFirmUserId || null,
        assigned_manager_id: managerUserId || null,
        status: "active",
      },
      {
        firm_id: firmId,
        client_code: "TAT-004",
        trade_name: "Tata Steel Logistics Branch Kolkata",
        legal_name: "Tata Steel Logistics Branch Limited",
        entity_type: "Branch Entity",
        pan_number: "AAACH8877E",
        cin_number: "L65110MH2000PLC128245",
        primary_gstin: "19AAACH8877E1Z1",
        primary_email: "stat.audit@tatasteel.com",
        primary_phone: "+91 98311 77665",
        assigned_partner_id: currentFirmUserId || null,
        assigned_manager_id: managerUserId || null,
        status: "active",
      },
      {
        firm_id: firmId,
        client_code: "INX-005",
        trade_name: "Inox Pharma Healthcare Sole Prop",
        legal_name: "Inox Pharma Healthcare",
        entity_type: "Sole Proprietorship",
        pan_number: "AAAPK9988M",
        cin_number: null,
        primary_gstin: "19AAAPK9988M1Z3",
        primary_email: "klb@inoxpharma.in",
        primary_phone: "+91 98322 33441",
        assigned_partner_id: currentFirmUserId || null,
        assigned_manager_id: null,
        status: "active",
      },
    ];

    const insertedClientIds: string[] = [];
    for (const client of demoClients) {
      const { data: savedClient } = await supabase
        .from("clients")
        .insert(client)
        .select("id")
        .single();

      if (savedClient) {
        insertedClientIds.push(savedClient.id);
        counts.clients++;
      }
    }

    const firstClientId = insertedClientIds[0];
    const secondClientId = insertedClientIds[1] || firstClientId;

    // 4. Seed Services Master
    const demoServices: Database["public"]["Tables"]["services_master"]["Insert"][] = [
      {
        firm_id: firmId,
        service_code: "SRV-001",
        service_name: "Statutory & Tax Audit (Sec 44AB)",
        category: "Auditing & Assurance",
        sac_code: "998231",
        billing_type: "fixed",
        base_fee: 45000,
        gst_rate: 18,
        estimated_hours: 40,
        tat_days: 15,
        is_recurring: false,
        is_active: true,
      },
      {
        firm_id: firmId,
        service_code: "SRV-002",
        service_name: "GST Compliance & Return Filing (GSTR-3B/1)",
        category: "Indirect Tax",
        sac_code: "998232",
        billing_type: "fixed",
        base_fee: 15000,
        gst_rate: 18,
        estimated_hours: 12,
        tat_days: 5,
        is_recurring: true,
        recurrence_frequency: "Monthly",
        is_active: true,
      },
      {
        firm_id: firmId,
        service_code: "SRV-003",
        service_name: "ROC & MCA Annual Filings (AOC-4 / MGT-7)",
        category: "Corporate Secretarial",
        sac_code: "998233",
        billing_type: "fixed",
        base_fee: 25000,
        gst_rate: 18,
        estimated_hours: 20,
        tat_days: 10,
        is_recurring: true,
        recurrence_frequency: "Annually",
        is_active: true,
      },
      {
        firm_id: firmId,
        service_code: "SRV-004",
        service_name: "Direct Tax Litigation & CIT(A) Appeals",
        category: "Direct Tax",
        sac_code: "998234",
        billing_type: "hourly",
        base_fee: 35000,
        gst_rate: 18,
        estimated_hours: 30,
        tat_days: 20,
        is_recurring: false,
        is_active: true,
      },
      {
        firm_id: firmId,
        service_code: "SRV-005",
        service_name: "Transfer Pricing & Cross-Border Advisory",
        category: "International Tax",
        sac_code: "998235",
        billing_type: "fixed",
        base_fee: 60000,
        gst_rate: 18,
        estimated_hours: 50,
        tat_days: 30,
        is_recurring: false,
        is_active: true,
      },
    ];

    const insertedServiceIds: string[] = [];
    for (const srv of demoServices) {
      const { data: savedSrv } = await supabase
        .from("services_master")
        .upsert(srv, { onConflict: "id" })
        .select("id")
        .single();
      if (savedSrv) {
        insertedServiceIds.push(savedSrv.id);
        counts.services++;
      }
    }

    const firstServiceId = insertedServiceIds[0];
    const secondServiceId = insertedServiceIds[1] || firstServiceId;

    // 5. Seed Compliance Tasks
    if (firstClientId) {
      const demoTasks = [
        {
          firm_id: firmId,
          client_id: firstClientId,
          service_id: secondServiceId || null,
          task_code: "TSK-301",
          task_title: "GSTR-3B Monthly Return & 2B ITC Reco",
          financial_year: "2026-27",
          period: "Aug 2026",
          start_date: "2026-09-01",
          target_date: "2026-09-18",
          due_date: "2026-09-20",
          assigned_to_id: currentFirmUserId || null,
          reviewer_id: managingPartnerId || null,
          priority: "high",
          stage: "in_progress",
          status: "open",
        },
        {
          firm_id: firmId,
          client_id: secondClientId || firstClientId,
          service_id: firstServiceId || null,
          task_code: "TSK-302",
          task_title: "Tax Audit 44AB Form 3CD Clause 34 TDS Reconciliation",
          financial_year: "2025-26",
          period: "Annual",
          start_date: "2026-08-15",
          target_date: "2026-09-25",
          due_date: "2026-09-30",
          assigned_to_id: currentFirmUserId || null,
          reviewer_id: managerUserId || null,
          priority: "high",
          stage: "in_progress",
          status: "open",
        },
        {
          firm_id: firmId,
          client_id: firstClientId,
          service_id: insertedServiceIds[2] || firstServiceId,
          task_code: "TSK-303",
          task_title: "MCA Form AOC-4 Financial Statements Filing",
          financial_year: "2025-26",
          period: "Annual",
          start_date: "2026-09-01",
          target_date: "2026-09-20",
          due_date: "2026-09-25",
          assigned_to_id: currentFirmUserId || null,
          reviewer_id: managingPartnerId || null,
          priority: "medium",
          stage: "review",
          status: "open",
        },
        {
          firm_id: firmId,
          client_id: secondClientId || firstClientId,
          service_id: insertedServiceIds[3] || firstServiceId,
          task_code: "TSK-304",
          task_title: "Advance Tax Q2 Computation & Challan ITNS-280",
          financial_year: "2026-27",
          period: "Q2",
          start_date: "2026-09-01",
          target_date: "2026-09-12",
          due_date: "2026-09-15",
          assigned_to_id: currentFirmUserId || null,
          reviewer_id: managerUserId || null,
          priority: "high",
          stage: "pending_client",
          status: "open",
        },
      ];

      for (const t of demoTasks) {
        await supabase.from("compliance_tasks").insert(t);
        counts.tasks++;
      }
    }

    // 6. Seed Invoices & Receipts
    if (firstClientId) {
      const demoInvoices: Database["public"]["Tables"]["invoices"]["Insert"][] = [
        {
          firm_id: firmId,
          client_id: firstClientId,
          invoice_type: "tax_invoice" as const,
          invoice_number: "INV-2026-0041",
          invoice_date: "2026-08-15",
          due_date: "2026-08-30",
          subtotal: 45000,
          cgst_amount: 4050,
          sgst_amount: 4050,
          igst_amount: 0,
          total_tax: 8100,
          total_amount: 53100,
          paid_amount: 53100,
          tds_amount: 4500,
          balance_due: 0,
          status: "paid",
        },
        {
          firm_id: firmId,
          client_id: secondClientId || firstClientId,
          invoice_type: "tax_invoice" as const,
          invoice_number: "INV-2026-0042",
          invoice_date: "2026-08-25",
          due_date: "2026-09-10",
          subtotal: 25000,
          cgst_amount: 0,
          sgst_amount: 0,
          igst_amount: 4500,
          total_tax: 4500,
          total_amount: 29500,
          paid_amount: 0,
          tds_amount: 0,
          balance_due: 29500,
          status: "unpaid",
        },
      ];

      for (const inv of demoInvoices) {
        const { data: savedInv } = await supabase
          .from("invoices")
          .insert(inv)
          .select("id")
          .single();

        if (savedInv) {
          counts.invoices++;
          if (inv.status === "paid") {
            await supabase.from("payment_receipts").insert({
              firm_id: firmId,
              invoice_id: savedInv.id,
              client_id: inv.client_id,
              receipt_number: `REC-2026-${Date.now().toString().slice(-4)}`,
              receipt_date: "2026-08-28",
              amount_received: 48600,
              tds_deducted: 4500,
              payment_mode: "NEFT / RTGS",
              utr_reference: "HDFCN26240988112",
            });
            counts.receipts++;
          }
        }
      }
    }

    // 7. Seed Monthly Attendance Matrix (Sep 1 to Sep 8, 2026)
    if (currentFirmUserId) {
      // Clear existing attendance for this user for Sep 2026 to avoid duplicates
      await supabase
        .from("attendance_logs")
        .delete()
        .eq("firm_id", firmId)
        .eq("user_id", currentFirmUserId);

      const attendanceRecords = [
        { date: "2026-09-01", status: "present", in: "10:02", out: "19:15", mins: 553 },
        { date: "2026-09-02", status: "holiday", in: "00:00", out: "00:00", mins: 0 },
        { date: "2026-09-03", status: "present", in: "09:55", out: "19:30", mins: 575 },
        { date: "2026-09-04", status: "absent", in: "00:00", out: "00:00", mins: 0 },
        { date: "2026-09-05", status: "week_off", in: "00:00", out: "00:00", mins: 0 },
        { date: "2026-09-06", status: "week_off", in: "00:00", out: "00:00", mins: 0 },
        { date: "2026-09-07", status: "present", in: "10:05", out: "19:20", mins: 555 },
        { date: "2026-09-08", status: "present", in: "09:48", out: null, mins: 0 },
      ];

      for (const rec of attendanceRecords) {
        await supabase.from("attendance_logs").insert({
          firm_id: firmId,
          user_id: currentFirmUserId,
          attendance_date: rec.date,
          clock_in: `${rec.date}T${rec.in || "10:00"}:00.000Z`,
          clock_out: rec.out ? `${rec.date}T${rec.out}:00.000Z` : null,
          total_minutes: rec.mins,
          work_location: "Office",
          status: rec.status,
        });
        counts.attendance++;
      }
    }

    // 8. Seed Timesheet Entries
    if (currentFirmUserId && firstClientId) {
      await supabase.from("timesheet_entries").delete().eq("firm_id", firmId).eq("user_id", currentFirmUserId);

      const demoTimesheets = [
        {
          firm_id: firmId,
          user_id: currentFirmUserId,
          client_id: firstClientId,
          entry_date: "2026-09-08",
          hours_spent: 2.5,
          hourly_rate: 1500,
          cost_rate: 350,
          is_billable: true,
          work_description: "Sec 16(2) ITC purchase register verification against GSTR-2B",
        },
        {
          firm_id: firmId,
          user_id: currentFirmUserId,
          client_id: firstClientId,
          entry_date: "2026-09-08",
          hours_spent: 3.0,
          hourly_rate: 1500,
          cost_rate: 350,
          is_billable: true,
          work_description: "Advance tax liability calculation and draft computation",
        },
      ];

      for (const ts of demoTimesheets) {
        await supabase.from("timesheet_entries").insert(ts);
        counts.timesheet++;
      }
    }

    // 9. Seed Quick Notes
    if (currentFirmUserId) {
      await supabase.from("quick_notes").delete().eq("firm_id", firmId).eq("user_id", currentFirmUserId);

      const demoNotes = [
        {
          firm_id: firmId,
          user_id: currentFirmUserId,
          title: "Advance Tax Q2 Payment Deadlines",
          content: "1. 15% due by June 15\n2. 45% cumulative due by September 15\n3. 75% cumulative due by December 15\n4. 100% due by March 15",
          tags: ["Direct Tax", "Challan 280", "Compliance"],
          is_pinned: true,
        },
        {
          firm_id: firmId,
          user_id: currentFirmUserId,
          title: "GSTR-9 Annual Return Verification Checklist",
          content: "1. Reconcile Table 4 outward supplies with audited financials\n2. Check Table 6 ITC availed vs GSTR-2B\n3. HSN Table 17 & 18 mandatory reporting",
          tags: ["GST", "GSTR-9", "Audit Checklist"],
          is_pinned: false,
        },
      ];

      for (const note of demoNotes) {
        await supabase.from("quick_notes").insert(note);
        counts.notes++;
      }
    }

    // 10. Seed KYC Documents (user_documents)
    if (currentFirmUserId) {
      await supabase.from("user_documents").delete().eq("firm_id", firmId).eq("user_id", currentFirmUserId);

      const demoDocs = [
        {
          firm_id: firmId,
          user_id: currentFirmUserId,
          document_name: "ICAI Form 103 Articleship Registration Deed",
          file_url: "https://turia-storage.supabase.co/kyc/icai_form_103_registered_deed_signed.pdf",
          file_size_bytes: 2516582, // 2.4 MB
        },
        {
          firm_id: firmId,
          user_id: currentFirmUserId,
          document_name: "Permanent Account Number (PAN Card)",
          file_url: "https://turia-storage.supabase.co/kyc/pan_card_colored_scan.pdf",
          file_size_bytes: 870400, // 850 KB
        },
        {
          firm_id: firmId,
          user_id: currentFirmUserId,
          document_name: "Aadhaar Card (Masked UIDAI Copy)",
          file_url: "https://turia-storage.supabase.co/kyc/aadhaar_masked_identity.pdf",
          file_size_bytes: 1153433, // 1.1 MB
        },
        {
          firm_id: firmId,
          user_id: currentFirmUserId,
          document_name: "B.Com (Honours in Accountancy & Finance) Degree",
          file_url: "https://turia-storage.supabase.co/kyc/calcutta_university_bcom_degree.pdf",
          file_size_bytes: 3355443, // 3.2 MB
        },
        {
          firm_id: firmId,
          user_id: currentFirmUserId,
          document_name: "Partner Association & Practice Confidentiality NDA",
          file_url: "https://turia-storage.supabase.co/kyc/turia_partner_confidentiality_deed.pdf",
          file_size_bytes: 1572864, // 1.5 MB
        },
      ];

      for (const doc of demoDocs) {
        await supabase.from("user_documents").insert(doc);
        counts.documents++;
      }
    }

    // 11. Seed Leave Applications & Balances
    if (currentFirmUserId) {
      await supabase.from("leave_applications").delete().eq("firm_id", firmId).eq("user_id", currentFirmUserId);
      await supabase.from("leave_balances").delete().eq("firm_id", firmId).eq("user_id", currentFirmUserId);

      // Balances
      await supabase.from("leave_balances").insert({
        firm_id: firmId,
        user_id: currentFirmUserId,
        financial_year: "2026-27",
        casual_leave_quota: 12,
        casual_leave_taken: 2,
        sick_leave_quota: 10,
        sick_leave_taken: 0,
        exam_leave_quota: 90,
        exam_leave_taken: 8,
      });

      // Applications
      const demoLeaves = [
        {
          firm_id: firmId,
          user_id: currentFirmUserId,
          leave_type: "CA Exam Study Leave",
          from_date: "2026-09-15",
          to_date: "2026-09-22",
          days_count: 8,
          reason: "ICAI CA Final Group 1 exam revision (Paper 1 & Paper 2)",
          status: "approved",
          reviewer_id: managingPartnerId || null,
        },
        {
          firm_id: firmId,
          user_id: currentFirmUserId,
          leave_type: "Casual Leave",
          from_date: "2026-08-10",
          to_date: "2026-08-11",
          days_count: 2,
          reason: "Family engagement ceremony",
          status: "approved",
          reviewer_id: managingPartnerId || null,
        },
      ];

      for (const lv of demoLeaves) {
        await supabase.from("leave_applications").insert(lv);
        counts.leaves++;
      }
    }

    // 12. Seed Employee Expense Claims (Reimbursements)
    if (currentFirmUserId) {
      await supabase.from("employee_expense_claims").delete().eq("firm_id", firmId).eq("user_id", currentFirmUserId);

      const demoExpenses: Database["public"]["Tables"]["employee_expense_claims"]["Insert"][] = [
        {
          firm_id: firmId,
          user_id: currentFirmUserId,
          claim_date: "2026-09-04",
          reason: "Statutory Audit physical stock count conveyance - Acme Global Plant",
          amount: 1450,
          receipt_url: "https://turia-storage.supabase.co/receipts/uber_acme_audit_trip.pdf",
          status: "approved",
          is_settled: false,
          settled_at: null,
        },
        {
          firm_id: firmId,
          user_id: currentFirmUserId,
          claim_date: "2026-09-02",
          reason: "ROC MCA e-Stamp Challan for Form MGT-14 filing",
          amount: 600,
          receipt_url: "https://turia-storage.supabase.co/receipts/mca_challan_stamp_receipt.pdf",
          status: "approved",
          is_settled: false,
          settled_at: null,
        },
        {
          firm_id: firmId,
          user_id: currentFirmUserId,
          claim_date: "2026-08-28",
          reason: "Client audit engagement meeting working lunch with Reliance finance team",
          amount: 2200,
          receipt_url: "https://turia-storage.supabase.co/receipts/restaurant_tax_invoice.pdf",
          status: "settled",
          is_settled: true,
          settled_at: "2026-08-30T10:00:00.000Z",
        },
        {
          firm_id: firmId,
          user_id: currentFirmUserId,
          claim_date: "2026-08-22",
          reason: "Courier dispatch of physical signed Tax Audit 3CD reports",
          amount: 350,
          receipt_url: "https://turia-storage.supabase.co/receipts/blue_dart_consignment_note.pdf",
          status: "settled",
          is_settled: true,
          settled_at: "2026-08-25T11:30:00.000Z",
        },
      ];

      for (const exp of demoExpenses) {
        await supabase.from("employee_expense_claims").insert(exp);
        counts.expenses++;
      }
    }

    // 13. Seed Leads Pipeline
    for (const lead of MOCK_LEADS) {
      const { data: existingLead } = await supabase
        .from("leads")
        .select("id")
        .eq("firm_id", firmId)
        .eq("lead_code", lead.leadCode)
        .maybeSingle();

      if (!existingLead) {
        await supabase.from("leads").insert({
          firm_id: firmId,
          lead_code: lead.leadCode,
          lead_name: lead.leadName,
          contact_person: lead.contactPerson,
          business_entity: lead.businessEntity,
          deal_value: lead.dealValue,
          currency: lead.currency,
          stage: lead.stage,
          status: lead.status,
          score: lead.score,
          assigned_to: lead.assignedTo,
          source: lead.source,
          service_interest: lead.serviceInterest,
          phone: lead.phone,
          email: lead.email,
          gstin: lead.gstin,
          pan: lead.pan,
          city: lead.city,
          state: lead.state,
          notes: lead.notes,
        });
        counts.leads++;
      }
    }

    // 14. Seed DSC Physical Vault with dynamic expiry relative to today
    const now = new Date();
    const fmtDate = (offsetDays: number) => {
      const d = new Date(now);
      d.setDate(d.getDate() + offsetDays);
      return d.toISOString().slice(0, 10);
    };

    const demoDscTokens: Database["public"]["Tables"]["dsc_register"]["Insert"][] = [
      {
        firm_id: firmId,
        dsc_code: "DSC-1001",
        business_name: "Acme Global Logistics Pvt Ltd",
        legal_name: "Acme Global Logistics Private Limited",
        signatory_name: "Rajesh Singhania (Director)",
        pan_number: "AAACA1122B",
        din_number: "08441122",
        vendor: "eMudhra",
        dsc_class: "Class 3",
        issued_date: fmtDate(-700),
        expiry_date: fmtDate(420),
        location: "ca_office" as const,
        bin_number: "BIN-A12",
        status: "active" as const,
        email: "rajesh@acmelogistics.in",
        phone: "+91 98310 99881",
        token_hardware_model: "ePass2003",
        notes: "Primary MCA filing token for Acme Logistics board.",
      },
      {
        firm_id: firmId,
        dsc_code: "DSC-1002",
        business_name: "Reliance Retail Ventures Ltd",
        legal_name: "Reliance Retail Ventures Limited",
        signatory_name: "Mukesh Agarwal (Authorized Signatory)",
        pan_number: "AAACR9988C",
        din_number: "01998877",
        vendor: "Capricorn",
        dsc_class: "Class 3",
        issued_date: fmtDate(-720),
        expiry_date: fmtDate(8), // Expiring in 8 days (<15d)
        location: "ca_office" as const,
        bin_number: "BIN-B04",
        status: "active" as const,
        email: "magarwal@relianceretail.com",
        phone: "+91 98200 44332",
        token_hardware_model: "ProxKey",
        notes: "Urgent renewal KYC documents requested from client.",
      },
      {
        firm_id: firmId,
        dsc_code: "DSC-1003",
        business_name: "Sun Pharma Laboratories",
        legal_name: "Sun Pharmaceutical Laboratories Ltd",
        signatory_name: "Dr. Dilip Shanghvi (Managing Director)",
        pan_number: "AAACS5544D",
        din_number: "00005544",
        vendor: "VSign",
        dsc_class: "Class 3",
        issued_date: fmtDate(-710),
        expiry_date: fmtDate(14), // Expiring in 14 days (<15d)
        location: "cs_office" as const,
        bin_number: "BIN-A03",
        status: "active" as const,
        email: "dilip.shanghvi@sunpharma.com",
        phone: "+91 98210 11223",
        token_hardware_model: "Watchdata",
        notes: "In custody of CS Rohit Sen for AGM compliance filings.",
      },
      {
        firm_id: firmId,
        dsc_code: "DSC-1004",
        business_name: "Zomato Media Pvt Ltd",
        legal_name: "Zomato Media Private Limited",
        signatory_name: "Deepinder Goyal (CEO & Director)",
        pan_number: "AAACZ8877K",
        din_number: "02611887",
        vendor: "Pantasign",
        dsc_class: "Class 3",
        issued_date: fmtDate(-705),
        expiry_date: fmtDate(22), // Expiring in 22 days (<30d)
        location: "ca_office" as const,
        bin_number: "BIN-C02",
        status: "active" as const,
        email: "deepinder@zomato.com",
        phone: "+91 98110 55443",
        token_hardware_model: "ePass2003",
        notes: "Renewal quote sent to company secretary.",
      },
      {
        firm_id: firmId,
        dsc_code: "DSC-1005",
        business_name: "Tata Consumer Products",
        legal_name: "Tata Consumer Products Limited",
        signatory_name: "Sunil D'Souza (Managing Director)",
        pan_number: "AAACT1234T",
        din_number: "07112233",
        vendor: "eMudhra",
        dsc_class: "Class 3",
        issued_date: fmtDate(-750),
        expiry_date: fmtDate(-10), // Expired 10 days ago
        location: "ca_office" as const,
        bin_number: "BIN-A08",
        status: "expired" as const,
        email: "sunil.dsouza@tataconsumer.com",
        phone: "+91 98201 99887",
        token_hardware_model: "ProxKey",
        notes: "Expired token. Renewal pending client Aadhaar OTP verification.",
      },
      {
        firm_id: firmId,
        dsc_code: "DSC-1006",
        business_name: "Infosys Technologies BPO",
        legal_name: "Infosys BPM Limited",
        signatory_name: "Salil Parekh (CEO & MD)",
        pan_number: "AAACI4433P",
        din_number: "01876543",
        vendor: "Sify",
        dsc_class: "Class 3",
        issued_date: fmtDate(-300),
        expiry_date: fmtDate(430),
        location: "client_office" as const,
        bin_number: "VAULT-02",
        status: "active" as const,
        email: "salil.parekh@infosys.com",
        phone: "+91 98450 12345",
        token_hardware_model: "mToken",
        notes: "Handed over to Bangalore HQ finance department on 12/01/2026.",
      },
      {
        firm_id: firmId,
        dsc_code: "DSC-1007",
        business_name: "Wipro Enterprises Ltd",
        legal_name: "Wipro Enterprises Private Limited",
        signatory_name: "Azim Premji (Chairman)",
        pan_number: "AAACW6655Q",
        din_number: "00006655",
        vendor: "eMudhra",
        dsc_class: "Class 3",
        issued_date: fmtDate(-400),
        expiry_date: fmtDate(330),
        location: "missing" as const,
        bin_number: "BIN-B01",
        status: "active" as const,
        email: "azim.premji@wipro.com",
        phone: "+91 98451 99880",
        token_hardware_model: "ProxKey",
        notes: "Physical verification flag: Token not found in BIN-B01 during monthly vault audit.",
      },
      {
        firm_id: firmId,
        dsc_code: "DSC-1008",
        business_name: "HDFC Life Insurance",
        legal_name: "HDFC Life Insurance Company Limited",
        signatory_name: "Vibha Padalkar (MD & CEO)",
        pan_number: "AAACH9900H",
        din_number: "01682810",
        vendor: "Capricorn",
        dsc_class: "Class 3",
        issued_date: fmtDate(-100),
        expiry_date: fmtDate(630),
        location: "ca_office" as const,
        bin_number: "BIN-A01",
        status: "active" as const,
        email: "vibha@hdfclife.com",
        phone: "+91 98205 77665",
        token_hardware_model: "ePass2003",
        notes: "In regular custody in safe vault drawer A.",
      },
    ];

    for (const dsc of demoDscTokens) {
      const { data: existingDsc } = await supabase
        .from("dsc_register")
        .select("id")
        .eq("firm_id", firmId)
        .eq("dsc_code", dsc.dsc_code)
        .maybeSingle();

      if (!existingDsc) {
        await supabase.from("dsc_register").insert(dsc);
        counts.dsc++;
      }
    }

    // 15. Seed Client Statutory Licenses (FSSAI, IEC, Trade, Shop)
    const { data: clientList } = await supabase
      .from("clients")
      .select("id, trade_name")
      .eq("firm_id", firmId)
      .limit(5);

    if (clientList && clientList.length > 0) {
      const demoLicenses = [
        {
          firm_id: firmId,
          client_id: clientList[0].id,
          license_name: "FSSAI Central Food License",
          license_number: "10020031004567",
          issuing_authority: "Food Safety and Standards Authority of India",
          issue_date: fmtDate(-300),
          expiry_date: fmtDate(25), // Expiring in 25 days
          status: "active",
        },
        {
          firm_id: firmId,
          client_id: clientList[1] ? clientList[1].id : clientList[0].id,
          license_name: "Import Export Code (IEC)",
          license_number: "0319088765",
          issuing_authority: "Directorate General of Foreign Trade (DGFT)",
          issue_date: fmtDate(-800),
          expiry_date: fmtDate(450),
          status: "active",
        },
        {
          firm_id: firmId,
          client_id: clientList[2] ? clientList[2].id : clientList[0].id,
          license_name: "Kolkata Municipal Trade License",
          license_number: "KMC/TL/2025/99812",
          issuing_authority: "Kolkata Municipal Corporation",
          issue_date: fmtDate(-360),
          expiry_date: fmtDate(5), // Expiring in 5 days!
          status: "active",
        },
        {
          firm_id: firmId,
          client_id: clientList[0].id,
          license_name: "West Bengal Shops & Establishments Registration",
          license_number: "WB/SE/KOL/54432",
          issuing_authority: "Labour Department, West Bengal",
          issue_date: fmtDate(-600),
          expiry_date: fmtDate(-20), // Expired
          status: "expired",
        },
      ];

      for (const lic of demoLicenses) {
        const { data: existingLic } = await supabase
          .from("client_licenses")
          .select("id")
          .eq("firm_id", firmId)
          .eq("license_number", lic.license_number)
          .maybeSingle();

        if (!existingLic) {
          await supabase.from("client_licenses").insert(lic);
        }
      }
    }

    return {
      success: true,
      message: "Database seeded successfully with comprehensive CA practice data.",
      counts,
    };
  } catch (error) {
    console.error("Database seeding error:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Database seeding failed",
      counts,
    };
  }
}
