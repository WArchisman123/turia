import { NextResponse } from "next/server";
import { getTenantContext, createAdminClient } from "@/lib/supabase/server";
import { TaskActivityItem } from "@/components/tasks/types";

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

export async function GET() {
  try {
    const tenant = await getTenantContext();
    const firmId = tenant?.firmId;

    if (firmId) {
      const supabase = createAdminClient();
      const { data: dbActivities, error } = await supabase
        .from("task_activities")
        .select("*")
        .eq("firm_id", firmId)
        .order("created_at", { ascending: false })
        .limit(50);

      if (!error && dbActivities && dbActivities.length > 0) {
        const { data: users } = await supabase
          .from("firm_users")
          .select("id, full_name")
          .eq("firm_id", firmId);

        const { data: tasks } = await supabase
          .from("compliance_tasks")
          .select("id, task_title")
          .eq("firm_id", firmId);

        const userMap = new Map((users || []).map((u) => [u.id, u.full_name]));
        const taskMap = new Map((tasks || []).map((t) => [t.id, t.task_title]));

        const mapped: TaskActivityItem[] = dbActivities.map((act) => {
          const userName = (act.user_id ? userMap.get(act.user_id) : undefined) || "Practitioner";
          const initials = userName
            .split(" ")
            .map((s: string) => s[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

          return {
            id: act.id,
            taskId: act.task_id,
            taskTitle: taskMap.get(act.task_id) || "Compliance Task",
            actionType: act.action_type,
            description: act.description,
            userName,
            userInitials: initials,
            createdAt: new Date(act.created_at).toLocaleString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }),
            eventCategory: act.action_type.toLowerCase().includes("status")
              ? "status_changes"
              : act.action_type.toLowerCase().includes("upload")
              ? "file_uploads"
              : "comments",
          };
        });

        return NextResponse.json({ activities: mapped });
      }
    }

    return NextResponse.json({ activities: SEED_ACTIVITIES });
  } catch (err) {
    console.error("GET /api/tasks/activities error:", err);
    return NextResponse.json({ activities: SEED_ACTIVITIES });
  }
}
