import { NextResponse } from "next/server";
import { getTenantContext, createAdminClient } from "@/lib/supabase/server";
import {
  TaskItem,
  SubTaskItem,
  TaskActivityItem,
  TaskKpiData,
  RecurringKpiData,
  TaskFormData,
} from "@/components/tasks/types";

const SEED_COMPLIANCE_TASKS: TaskItem[] = [
  {
    id: "task-001",
    taskCode: "TSK-GST-001",
    taskTitle: "GSTR-3B Monthly Return Filing (August 2026)",
    clientId: "client-001",
    clientName: "Reliance Retail Ltd",
    legalName: "Reliance Retail Limited",
    panNumber: "AABCR1234F",
    serviceId: "srv-002",
    serviceName: "GSTR-1 & GSTR-3B Return Filing",
    financialYear: "FY 2026 - 2027",
    period: "August 2026",
    startDate: "01/09/2026",
    targetDate: "18/09/2026",
    dueDate: "20/09/2026",
    assignedToId: "usr-001",
    assignedToName: "Archi Saha",
    assignedToInitials: "AS",
    reviewerId: "usr-002",
    reviewerName: "Rahul Sen (Partner)",
    priority: "high",
    stage: "in_progress",
    status: "in_progress",
    isBillable: true,
    billingStatus: "Billable",
    completionPercentage: 60,
    taskType: "Recurring",
    category: "Indirect Tax / GST",
    difficultyLevel: "Intermediate",
    department: "GST",
    recurrenceFrequency: "Monthly",
    createdAt: "01/09/2026",
  },
  {
    id: "task-002",
    taskCode: "TSK-GST-002",
    taskTitle: "GSTR-1 Outward Supplies Matching (August 2026)",
    clientId: "client-002",
    clientName: "Tata Consultancy Services",
    legalName: "Tata Consultancy Services Limited",
    panNumber: "AAACT1987M",
    serviceId: "srv-002",
    serviceName: "GSTR-1 & GSTR-3B Return Filing",
    financialYear: "FY 2026 - 2027",
    period: "August 2026",
    startDate: "01/09/2026",
    targetDate: "09/09/2026",
    dueDate: "10/09/2026",
    assignedToId: "usr-003",
    assignedToName: "Sneha Roy",
    assignedToInitials: "SR",
    reviewerId: "usr-001",
    reviewerName: "Archi Saha",
    priority: "urgent",
    stage: "not_started",
    status: "pending",
    isBillable: true,
    billingStatus: "Billable",
    completionPercentage: 20,
    taskType: "Recurring",
    category: "Indirect Tax / GST",
    difficultyLevel: "Intermediate",
    department: "GST",
    recurrenceFrequency: "Monthly",
    createdAt: "01/09/2026",
  },
  {
    id: "task-003",
    taskCode: "TSK-TAX-003",
    taskTitle: "TDS Challan 281 Payment & Verification (August 2026)",
    clientId: "client-003",
    clientName: "Infosys Technologies Ltd",
    legalName: "Infosys Limited",
    panNumber: "AAACI4432K",
    serviceId: "srv-001",
    serviceName: "TDS Payment & Monthly Compliances",
    financialYear: "FY 2026 - 2027",
    period: "August 2026",
    startDate: "01/09/2026",
    targetDate: "05/09/2026",
    dueDate: "07/09/2026",
    assignedToId: "usr-004",
    assignedToName: "Amitabh Ghosh",
    assignedToInitials: "AG",
    reviewerId: "usr-002",
    reviewerName: "Rahul Sen (Partner)",
    priority: "urgent",
    stage: "in_progress",
    status: "overdue",
    isBillable: true,
    billingStatus: "Billable",
    completionPercentage: 40,
    taskType: "Recurring",
    category: "Direct Tax",
    difficultyLevel: "Beginner",
    department: "Direct Tax",
    recurrenceFrequency: "Monthly",
    createdAt: "01/09/2026",
  },
  {
    id: "task-004",
    taskCode: "TSK-AUD-004",
    taskTitle: "Form 3CD Tax Audit Working Paper Verification",
    clientId: "client-004",
    clientName: "Larsen & Toubro Ltd",
    legalName: "Larsen and Toubro Limited",
    panNumber: "AAACL2201P",
    serviceId: "srv-003",
    serviceName: "Tax Audit u/s 44AB",
    financialYear: "FY 2026 - 2027",
    period: "Annual AY 26-27",
    startDate: "15/08/2026",
    targetDate: "25/09/2026",
    dueDate: "30/09/2026",
    assignedToId: "usr-001",
    assignedToName: "Archi Saha",
    assignedToInitials: "AS",
    reviewerId: "usr-002",
    reviewerName: "Rahul Sen (Partner)",
    priority: "high",
    stage: "under_review",
    status: "sent_for_review",
    isBillable: true,
    billingStatus: "Billable",
    completionPercentage: 85,
    taskType: "One-Time",
    category: "Audit & Assurance",
    difficultyLevel: "Advanced",
    department: "Audit",
    recurrenceFrequency: "Yearly",
    createdAt: "15/08/2026",
  },
  {
    id: "task-005",
    taskCode: "TSK-ROC-005",
    taskTitle: "ROC Annual Filing - Form AOC-4 Financial Statements",
    clientId: "client-005",
    clientName: "HDFC Bank Limited",
    legalName: "HDFC Bank Limited",
    panNumber: "AAACH8821B",
    serviceId: "srv-005",
    serviceName: "ROC Annual Filing (AOC-4 & MGT-7)",
    financialYear: "FY 2026 - 2027",
    period: "FY 2025-26",
    startDate: "01/09/2026",
    targetDate: "20/10/2026",
    dueDate: "30/10/2026",
    assignedToId: "usr-003",
    assignedToName: "Sneha Roy",
    assignedToInitials: "SR",
    reviewerId: "usr-001",
    reviewerName: "Archi Saha",
    priority: "normal",
    stage: "completed",
    status: "ready_to_bill",
    isBillable: true,
    billingStatus: "Billable",
    completionPercentage: 100,
    taskType: "Recurring",
    category: "Corporate Law / ROC",
    difficultyLevel: "Intermediate",
    department: "ROC",
    recurrenceFrequency: "Yearly",
    createdAt: "01/09/2026",
  },
  {
    id: "task-006",
    taskCode: "TSK-AUD-006",
    taskTitle: "Statutory Audit Physical Inventory Verification",
    clientId: "client-006",
    clientName: "ITC Limited",
    legalName: "ITC Limited",
    panNumber: "AAACI1122D",
    serviceId: "srv-003",
    serviceName: "Statutory Audit under Companies Act 2013",
    financialYear: "FY 2026 - 2027",
    period: "Q2 FY 26-27",
    startDate: "05/09/2026",
    targetDate: "14/09/2026",
    dueDate: "15/09/2026",
    assignedToId: "usr-004",
    assignedToName: "Amitabh Ghosh",
    assignedToInitials: "AG",
    reviewerId: "usr-002",
    reviewerName: "Rahul Sen (Partner)",
    priority: "normal",
    stage: "in_progress",
    status: "wip",
    isBillable: true,
    billingStatus: "Billable",
    completionPercentage: 50,
    taskType: "One-Time",
    category: "Audit & Assurance",
    difficultyLevel: "Advanced",
    department: "Audit",
    recurrenceFrequency: "Quarterly",
    createdAt: "05/09/2026",
  },
  {
    id: "task-007",
    taskCode: "TSK-ROC-007",
    taskTitle: "MCA Form MGT-7 Annual Return Drafting",
    clientId: "client-007",
    clientName: "Wipro Enterprises Pvt Ltd",
    legalName: "Wipro Enterprises Private Limited",
    panNumber: "AAACW9988G",
    serviceId: "srv-005",
    serviceName: "ROC Annual Filing (AOC-4 & MGT-7)",
    financialYear: "FY 2026 - 2027",
    period: "FY 2025-26",
    startDate: "10/09/2026",
    targetDate: "20/11/2026",
    dueDate: "29/11/2026",
    assignedToId: "usr-003",
    assignedToName: "Sneha Roy",
    assignedToInitials: "SR",
    reviewerId: "usr-001",
    reviewerName: "Archi Saha",
    priority: "low",
    stage: "on_hold",
    status: "on_hold",
    isBillable: false,
    billingStatus: "Non-Billable",
    completionPercentage: 10,
    taskType: "Recurring",
    category: "Corporate Law / ROC",
    difficultyLevel: "Intermediate",
    department: "ROC",
    recurrenceFrequency: "Yearly",
    createdAt: "10/09/2026",
  },
  {
    id: "task-008",
    taskCode: "TSK-ITR-008",
    taskTitle: "Corporate ITR-6 Computation & Section 115JB MAT",
    clientId: "client-008",
    clientName: "Sun Pharmaceutical Industries",
    legalName: "Sun Pharma Limited",
    panNumber: "AAACS5566T",
    serviceId: "srv-006",
    serviceName: "Corporate Income Tax Return (ITR-6)",
    financialYear: "FY 2026 - 2027",
    period: "AY 2026-27",
    startDate: "01/09/2026",
    targetDate: "25/10/2026",
    dueDate: "31/10/2026",
    assignedToId: "usr-001",
    assignedToName: "Archi Saha",
    assignedToInitials: "AS",
    reviewerId: "usr-002",
    reviewerName: "Rahul Sen (Partner)",
    priority: "high",
    stage: "clarification_needed",
    status: "request_changes",
    isBillable: true,
    billingStatus: "Billable",
    completionPercentage: 70,
    taskType: "Recurring",
    category: "Direct Tax",
    difficultyLevel: "Advanced",
    department: "Direct Tax",
    recurrenceFrequency: "Yearly",
    createdAt: "01/09/2026",
  },
  {
    id: "task-009",
    taskCode: "TSK-GST-009",
    taskTitle: "GST Annual Return GSTR-9 Reconciliation",
    clientId: "client-009",
    clientName: "Mahindra & Mahindra Ltd",
    legalName: "Mahindra and Mahindra Limited",
    panNumber: "AAACM3344J",
    serviceId: "srv-002",
    serviceName: "GSTR-9 & GSTR-9C Annual Audit",
    financialYear: "FY 2026 - 2027",
    period: "FY 2025-26",
    startDate: "01/08/2026",
    targetDate: "20/12/2026",
    dueDate: "31/12/2026",
    assignedToId: "usr-004",
    assignedToName: "Amitabh Ghosh",
    assignedToInitials: "AG",
    reviewerId: "usr-001",
    reviewerName: "Archi Saha",
    priority: "normal",
    stage: "completed",
    status: "completed",
    isBillable: true,
    billingStatus: "Billable",
    completionPercentage: 100,
    taskType: "One-Time",
    category: "Indirect Tax / GST",
    difficultyLevel: "Expert",
    department: "GST",
    recurrenceFrequency: "Yearly",
    createdAt: "01/08/2026",
  },
  {
    id: "task-010",
    taskCode: "TSK-TAX-010",
    taskTitle: "Quarterly TDS Return Form 24Q (Salary Q1)",
    clientId: "client-010",
    clientName: "Adani Ports & SEZ Ltd",
    legalName: "Adani Ports and Special Economic Zone Limited",
    panNumber: "AAACA7788P",
    serviceId: "srv-001",
    serviceName: "TDS Payment & Monthly Compliances",
    financialYear: "FY 2026 - 2027",
    period: "Q1 FY 26-27",
    startDate: "01/07/2026",
    targetDate: "25/07/2026",
    dueDate: "31/07/2026",
    assignedToId: "usr-003",
    assignedToName: "Sneha Roy",
    assignedToInitials: "SR",
    reviewerId: "usr-002",
    reviewerName: "Rahul Sen (Partner)",
    priority: "normal",
    stage: "cancelled",
    status: "cancelled",
    isBillable: false,
    billingStatus: "Non-Billable",
    completionPercentage: 0,
    taskType: "Recurring",
    category: "Direct Tax",
    difficultyLevel: "Beginner",
    department: "Direct Tax",
    recurrenceFrequency: "Quarterly",
    createdAt: "01/07/2026",
  },
];

const SEED_SUBTASKS: SubTaskItem[] = [
  {
    id: "sub-001",
    taskId: "task-001",
    parentTaskTitle: "GSTR-3B Monthly Return Filing (August 2026)",
    clientName: "Reliance Retail Ltd",
    serviceName: "GSTR-1 & GSTR-3B Return Filing",
    title: "Download and Reconcile GSTR-2B with Purchase Register",
    assignedToName: "Archi Saha",
    assignedToId: "usr-001",
    reviewerName: "Rahul Sen",
    weightagePercentage: 30,
    dueDate: "15/09/2026",
    status: "completed",
    priority: "high",
    category: "Indirect Tax / GST",
  },
  {
    id: "sub-002",
    taskId: "task-001",
    parentTaskTitle: "GSTR-3B Monthly Return Filing (August 2026)",
    clientName: "Reliance Retail Ltd",
    serviceName: "GSTR-1 & GSTR-3B Return Filing",
    title: "Draft Output Tax Liability Matrix & Offset in Electronic Cash Ledger",
    assignedToName: "Archi Saha",
    assignedToId: "usr-001",
    reviewerName: "Rahul Sen",
    weightagePercentage: 40,
    dueDate: "18/09/2026",
    status: "in_progress",
    priority: "high",
    category: "Indirect Tax / GST",
  },
  {
    id: "sub-003",
    taskId: "task-002",
    parentTaskTitle: "GSTR-1 Outward Supplies Matching (August 2026)",
    clientName: "Tata Consultancy Services",
    serviceName: "GSTR-1 & GSTR-3B Return Filing",
    title: "Extract Sales B2B & Export Invoices from ERP to JSON",
    assignedToName: "Sneha Roy",
    assignedToId: "usr-003",
    reviewerName: "Archi Saha",
    weightagePercentage: 50,
    dueDate: "08/09/2026",
    status: "pending",
    priority: "urgent",
    category: "Indirect Tax / GST",
  },
  {
    id: "sub-004",
    taskId: "task-003",
    parentTaskTitle: "TDS Challan 281 Payment & Verification (August 2026)",
    clientName: "Infosys Technologies Ltd",
    serviceName: "TDS Payment & Monthly Compliances",
    title: "Generate IT Portal Challan 281 for Section 194C and 194J",
    assignedToName: "Amitabh Ghosh",
    assignedToId: "usr-004",
    reviewerName: "Rahul Sen",
    weightagePercentage: 100,
    dueDate: "07/09/2026",
    status: "overdue",
    priority: "urgent",
    category: "Direct Tax",
  },
  {
    id: "sub-005",
    taskId: "task-004",
    parentTaskTitle: "Form 3CD Tax Audit Working Paper Verification",
    clientName: "Larsen & Toubro Ltd",
    serviceName: "Tax Audit u/s 44AB",
    title: "Clause 34 TDS Compliance Check & Form 26AS Cross-Verification",
    assignedToName: "Archi Saha",
    assignedToId: "usr-001",
    reviewerName: "Rahul Sen",
    weightagePercentage: 50,
    dueDate: "20/09/2026",
    status: "sent_for_review",
    priority: "high",
    category: "Audit & Assurance",
  },
];

const SEED_ACTIVITIES: TaskActivityItem[] = [
  {
    id: "act-001",
    taskId: "task-001",
    taskTitle: "GSTR-3B Monthly Return Filing (August 2026)",
    actionType: "Status Updated",
    description: "Status changed from Not Started to In Progress by Archi Saha",
    userName: "Archi Saha",
    userInitials: "AS",
    createdAt: "02/09/2026 11:20 AM",
    eventCategory: "status_changes",
  },
  {
    id: "act-002",
    taskId: "task-001",
    taskTitle: "GSTR-3B Monthly Return Filing (August 2026)",
    actionType: "Sub-Task Completed",
    description: "Reconciled GSTR-2B with purchase register (1,420 invoices matched)",
    userName: "Archi Saha",
    userInitials: "AS",
    createdAt: "03/09/2026 03:45 PM",
    eventCategory: "comments",
  },
  {
    id: "act-003",
    taskId: "task-004",
    taskTitle: "Form 3CD Tax Audit Working Paper Verification",
    actionType: "Review Requested",
    description: "Sent for partner signoff with Clause 44 expense breakdown draft attached",
    userName: "Archi Saha",
    userInitials: "AS",
    createdAt: "04/09/2026 05:10 PM",
    eventCategory: "status_changes",
  },
  {
    id: "act-004",
    taskId: "task-003",
    taskTitle: "TDS Challan 281 Payment & Verification (August 2026)",
    actionType: "Overdue Alert",
    description: "Statutory deadline of 07/09/2026 exceeded. Challan verification pending.",
    userName: "System Sentinel",
    userInitials: "SS",
    createdAt: "08/09/2026 12:01 AM",
    eventCategory: "status_changes",
  },
  {
    id: "act-005",
    taskId: "task-005",
    taskTitle: "ROC Annual Filing - Form AOC-4 Financial Statements",
    actionType: "Proforma Invoice Linked",
    description: "Draft proforma invoice PRF-2026-089 generated for ₹15,000 + 18% GST",
    userName: "Billing Bot",
    userInitials: "BB",
    createdAt: "08/09/2026 02:15 PM",
    eventCategory: "file_uploads",
  },
];

function calculateKpis(tasks: TaskItem[]): TaskKpiData {
  return {
    wip: tasks.filter((t) => t.status === "wip").length,
    pending: tasks.filter((t) => t.status === "pending").length,
    inProgress: tasks.filter((t) => t.status === "in_progress").length,
    sentForReview: tasks.filter((t) => t.status === "sent_for_review").length,
    requestChanges: tasks.filter((t) => t.status === "request_changes").length,
    overdue: tasks.filter((t) => t.status === "overdue").length,
    completed: tasks.filter((t) => t.status === "completed").length,
    readyToBill: tasks.filter((t) => t.status === "ready_to_bill").length,
    onHold: tasks.filter((t) => t.status === "on_hold").length,
    cancelled: tasks.filter((t) => t.status === "cancelled").length,
    allTasks: tasks.length,
  };
}

function calculateRecurringKpis(tasks: TaskItem[]): RecurringKpiData {
  const recurring = tasks.filter((t) => t.taskType === "Recurring");
  return {
    total: recurring.length,
    monthly: recurring.filter((t) => t.recurrenceFrequency === "Monthly").length,
    quarterly: recurring.filter((t) => t.recurrenceFrequency === "Quarterly").length,
    halfYear: recurring.filter((t) => t.recurrenceFrequency === "Half-Yearly").length,
    yearly: recurring.filter((t) => t.recurrenceFrequency === "Yearly").length,
  };
}

export async function GET() {
  try {
    const tenant = await getTenantContext();
    if (!tenant || !tenant.firmId) {
      // Fallback for unauthenticated dev mode
      return NextResponse.json({
        tasks: SEED_COMPLIANCE_TASKS,
        subtasks: SEED_SUBTASKS,
        activities: SEED_ACTIVITIES,
        kpi: calculateKpis(SEED_COMPLIANCE_TASKS),
        recurringKpi: calculateRecurringKpis(SEED_COMPLIANCE_TASKS),
      });
    }

    const firmId = tenant.firmId;
    const supabase = createAdminClient();

    const { data: dbTasks, error } = await supabase
      .from("compliance_tasks")
      .select("*")
      .eq("firm_id", firmId)
      .order("created_at", { ascending: false });

    if (error || !dbTasks || dbTasks.length === 0) {
      return NextResponse.json({
        tasks: SEED_COMPLIANCE_TASKS,
        subtasks: SEED_SUBTASKS,
        activities: SEED_ACTIVITIES,
        kpi: calculateKpis(SEED_COMPLIANCE_TASKS),
        recurringKpi: calculateRecurringKpis(SEED_COMPLIANCE_TASKS),
      });
    }

    // Fetch related metadata
    const { data: clients } = await supabase
      .from("clients")
      .select("id, trade_name, legal_name, pan_number")
      .eq("firm_id", firmId);

    const { data: services } = await supabase
      .from("services_master")
      .select("id, service_name, category, difficulty_level")
      .eq("firm_id", firmId);

    const { data: users } = await supabase
      .from("firm_users")
      .select("id, full_name")
      .eq("firm_id", firmId);

    const clientMap = new Map((clients || []).map((c) => [c.id, c]));
    const serviceMap = new Map((services || []).map((s) => [s.id, s]));
    const userMap = new Map((users || []).map((u) => [u.id, u]));

    // Map DB items to TaskItem
    const mappedTasks: TaskItem[] = dbTasks.map((t) => {
      const client = clientMap.get(t.client_id);
      const service = t.service_id ? serviceMap.get(t.service_id) : undefined;
      const assignee = t.assigned_to_id ? userMap.get(t.assigned_to_id) : undefined;
      const reviewer = t.reviewer_id ? userMap.get(t.reviewer_id) : undefined;

      const assigneeName = assignee?.full_name || "Unassigned";
      const initials = assigneeName
        .split(" ")
        .map((p: string) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

      return {
        id: t.id,
        taskCode: t.task_code || `TSK-${t.id.slice(0, 6).toUpperCase()}`,
        taskTitle: t.task_title,
        clientId: client?.id || t.client_id,
        clientName: client?.trade_name || "Client",
        legalName: client?.legal_name || client?.trade_name || "",
        panNumber: client?.pan_number || "",
        serviceId: service?.id || t.service_id || "",
        serviceName: service?.service_name || "Compliance Service",
        financialYear: t.financial_year || "FY 2026 - 2027",
        period: t.period || "Current Period",
        startDate: t.start_date || "",
        targetDate: t.target_date,
        dueDate: t.due_date,
        assignedToId: assignee?.id,
        assignedToName: assigneeName,
        assignedToInitials: initials,
        reviewerId: reviewer?.id,
        reviewerName: reviewer?.full_name || "Reviewer",
        priority: (t.priority as TaskItem["priority"]) || "normal",
        stage: (t.stage as TaskItem["stage"]) || "not_started",
        status: (t.status as TaskItem["status"]) || "pending",
        isBillable: Boolean(t.is_billable),
        billingStatus: t.is_billable ? "Billable" : "Non-Billable",
        completionPercentage: t.stage === "completed" ? 100 : t.stage === "in_progress" ? 50 : 0,
        taskType: "Recurring",
        category: service?.category || "General Compliance",
        difficultyLevel: (service?.difficulty_level as TaskItem["difficultyLevel"]) || "Intermediate",
        department: service?.category || "Tax",
        proformaInvoiceId: t.proforma_invoice_id,
        createdAt: t.created_at ? new Date(t.created_at).toLocaleDateString("en-GB") : "",
      };
    });

    return NextResponse.json({
      tasks: mappedTasks,
      subtasks: SEED_SUBTASKS,
      activities: SEED_ACTIVITIES,
      kpi: calculateKpis(mappedTasks),
      recurringKpi: calculateRecurringKpis(mappedTasks),
    });
  } catch (err) {
    console.error("GET /api/tasks error:", err);
    return NextResponse.json({
      tasks: SEED_COMPLIANCE_TASKS,
      subtasks: SEED_SUBTASKS,
      activities: SEED_ACTIVITIES,
      kpi: calculateKpis(SEED_COMPLIANCE_TASKS),
      recurringKpi: calculateRecurringKpis(SEED_COMPLIANCE_TASKS),
    });
  }
}

export async function POST(req: Request) {
  try {
    const tenant = await getTenantContext();
    const firmId = tenant?.firmId;
    const body: TaskFormData = await req.json();

    const taskCode = `TSK-${Date.now().toString().slice(-4)}`;

    let proformaId: string | null = null;
    const supabase = createAdminClient();

    // 1-Click Proforma Invoice Creation if checked
    if (body.createProformaInvoice && firmId && body.clientId) {
      try {
        const { data: proforma } = await supabase
          .from("invoices")
          .insert({
            firm_id: firmId,
            client_id: body.clientId,
            invoice_type: "proforma",
            invoice_number: `PRF-${new Date().getFullYear()}-${Date.now().toString().slice(-3)}`,
            invoice_date: new Date().toISOString().slice(0, 10),
            due_date: body.targetDueDate || new Date().toISOString().slice(0, 10),
            status: "unpaid",
            notes: `Draft Proforma Invoice auto-generated for Task: ${body.taskName}`,
          })
          .select("id")
          .single();

        if (proforma) {
          proformaId = proforma.id;
        }
      } catch (invoiceErr) {
        console.warn("Could not auto-create proforma invoice:", invoiceErr);
      }
    }

    if (firmId) {
      const { data: newTask, error } = await supabase
        .from("compliance_tasks")
        .insert({
          firm_id: firmId,
          client_id: body.clientId,
          service_id: body.serviceId || null,
          task_code: taskCode,
          task_title: body.taskName,
          financial_year: body.financialYear || "FY 2026 - 2027",
          period: body.selectPeriod,
          start_date: body.startDate || new Date().toISOString().slice(0, 10),
          target_date: body.targetDueDate || new Date().toISOString().slice(0, 10),
          due_date: body.endDate || new Date().toISOString().slice(0, 10),
          assigned_to_id: body.assigneeId || null,
          reviewer_id: body.reviewerId || null,
          priority: body.priority,
          stage: "not_started",
          status: "pending",
          is_billable: body.billingType === "Billable",
          proforma_invoice_id: proformaId,
        })
        .select()
        .single();

      if (!error && newTask) {
        // Record Activity Log safely
        try {
          await supabase.from("task_activities").insert({
            firm_id: firmId,
            task_id: newTask.id,
            action_type: "Task Created",
            description: `Compliance Task "${body.taskName}" created and assigned to ${body.assigneeName || "team"}`,
          });
        } catch (actErr) {
          console.warn("Could not record task activity log:", actErr);
        }

        const createdItem: TaskItem = {
          id: newTask.id,
          taskCode: newTask.task_code || taskCode,
          taskTitle: newTask.task_title,
          clientId: body.clientId,
          clientName: body.clientName || "Client",
          serviceId: body.serviceId,
          serviceName: body.serviceName || "Service",
          financialYear: newTask.financial_year,
          period: newTask.period || "Current",
          startDate: newTask.start_date || "",
          targetDate: newTask.target_date,
          dueDate: newTask.due_date,
          assignedToId: body.assigneeId,
          assignedToName: body.assigneeName || "Assignee",
          assignedToInitials: (body.assigneeName || "AR").slice(0, 2).toUpperCase(),
          reviewerId: body.reviewerId,
          reviewerName: body.reviewerName || "Reviewer",
          priority: body.priority,
          stage: "not_started",
          status: "pending",
          isBillable: body.billingType === "Billable",
          billingStatus: body.billingType === "Billable" ? "Billable" : "Non-Billable",
          completionPercentage: 0,
          taskType: body.frequency === "One-Time" ? "One-Time" : "Recurring",
          category: body.department || "Compliance",
          difficultyLevel: "Intermediate",
          department: body.department,
          recurrenceFrequency: body.frequency,
          proformaInvoiceId: proformaId,
          createdAt: new Date().toLocaleDateString("en-GB"),
        };

        return NextResponse.json({ task: createdItem }, { status: 201 });
      }
    }

    // Fallback in-memory response
    const fallbackItem: TaskItem = {
      id: `task-${Date.now()}`,
      taskCode: taskCode,
      taskTitle: body.taskName,
      clientId: body.clientId,
      clientName: body.clientName || "Client Entity",
      serviceId: body.serviceId,
      serviceName: body.serviceName || "Compliance Master",
      financialYear: body.financialYear || "FY 2026 - 2027",
      period: body.selectPeriod,
      startDate: body.startDate || "01/09/2026",
      targetDate: body.targetDueDate || "15/09/2026",
      dueDate: body.endDate || "20/09/2026",
      assignedToId: body.assigneeId,
      assignedToName: body.assigneeName || "Archi Saha",
      assignedToInitials: "AS",
      reviewerId: body.reviewerId,
      reviewerName: body.reviewerName || "Rahul Sen",
      priority: body.priority,
      stage: "not_started",
      status: "pending",
      isBillable: body.billingType === "Billable",
      billingStatus: body.billingType === "Billable" ? "Billable" : "Non-Billable",
      completionPercentage: 0,
      taskType: body.frequency === "One-Time" ? "One-Time" : "Recurring",
      category: body.department,
      difficultyLevel: "Intermediate",
      department: body.department,
      recurrenceFrequency: body.frequency,
      proformaInvoiceId: proformaId,
      createdAt: new Date().toLocaleDateString("en-GB"),
    };

    return NextResponse.json({ task: fallbackItem }, { status: 201 });
  } catch (err) {
    console.error("POST /api/tasks error:", err);
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
