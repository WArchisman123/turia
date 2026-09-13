import { NextResponse } from "next/server";
import { getTenantContext, createAdminClient } from "@/lib/supabase/server";

interface OrgNode {
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  designation: string;
  department: string;
  level: string;
  role: string;
  email: string;
  isOnline: boolean;
  children?: OrgNode[];
}

export async function GET() {
  try {
    const tenant = await getTenantContext();
    if (!tenant || !tenant.firmId) {
      return NextResponse.json({ error: "Unauthorized or missing organization" }, { status: 401 });
    }

    const firmId = tenant.firmId;
    const supabase = createAdminClient();

    const { data: users, error } = await supabase
      .from("firm_users")
      .select("id, full_name, email, role, designation, department, reporting_to_id, is_active")
      .eq("firm_id", firmId)
      .eq("is_active", true);

    if (error || !users || users.length === 0) {
      return NextResponse.json({ tree: null });
    }

    // Role styling helpers
    const getAvatarColor = (role: string) => {
      switch (role) {
        case "admin":
          return "bg-indigo-700";
        case "partner":
          return "bg-indigo-600";
        case "manager":
          return "bg-emerald-700";
        case "senior_associate":
          return "bg-purple-600";
        case "article_trainee":
          return "bg-amber-600";
        default:
          return "bg-slate-600";
      }
    };

    const getLevelText = (role: string) => {
      switch (role) {
        case "admin":
          return "Level 1 - Super Admin";
        case "partner":
          return "Level 2 - Partner";
        case "manager":
          return "Level 2 - Manager";
        case "senior_associate":
          return "Level 3 - Associate";
        case "article_trainee":
          return "Level 4 - Article Intern";
        default:
          return "Level 5 - Staff";
      }
    };

    const getInitials = (name: string) => {
      const parts = name.trim().split(" ");
      if (parts.length >= 2) {
        return (parts[0][0] + parts[1][0]).toUpperCase();
      }
      return name.slice(0, 2).toUpperCase();
    };

    // Build node map
    const nodeMap = new Map<string, OrgNode>();
    for (const u of users) {
      nodeMap.set(u.id, {
        id: u.id,
        name: u.full_name,
        initials: getInitials(u.full_name),
        avatarColor: getAvatarColor(u.role || "staff"),
        designation: u.designation || "Staff Member",
        department: u.department || "Direct Tax",
        level: getLevelText(u.role || "staff"),
        role: u.role || "Staff",
        email: u.email,
        isOnline: true,
        children: [],
      });
    }

    // Build tree
    let rootNode: OrgNode | null = null;
    for (const u of users) {
      const node = nodeMap.get(u.id);
      if (!node) continue;

      if (u.reporting_to_id && nodeMap.has(u.reporting_to_id) && u.reporting_to_id !== u.id) {
        const parent = nodeMap.get(u.reporting_to_id);
        parent?.children?.push(node);
      } else if (!rootNode) {
        rootNode = node;
      } else {
        rootNode.children?.push(node);
      }
    }

    return NextResponse.json({ tree: rootNode });
  } catch (error) {
    console.error("Error in GET /api/profile/org-tree:", error);
    return NextResponse.json({ error: "Failed to fetch organization tree" }, { status: 500 });
  }
}
