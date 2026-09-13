import { NextResponse } from "next/server";
import { getTenantContext, createAdminClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const tenant = await getTenantContext();
    if (!tenant || !tenant.firmId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createAdminClient();
    const { data: notes, error } = await supabase
      .from("quick_notes")
      .select("*")
      .eq("firm_id", tenant.firmId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching notes:", error);
      return NextResponse.json({ notes: [] });
    }

    return NextResponse.json({ notes: notes || [] });
  } catch (error) {
    console.error("Error in GET /api/notes:", error);
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const tenant = await getTenantContext();
    if (!tenant || !tenant.firmId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { title, content, tags, isPinned } = body;

    const supabase = createAdminClient();

    // Get firm user
    const { data: user } = await supabase
      .from("firm_users")
      .select("id")
      .eq("firm_id", tenant.firmId)
      .eq("clerk_user_id", tenant.userId)
      .single();

    if (!user) {
      return NextResponse.json({ error: "Firm user not found" }, { status: 404 });
    }

    const { data: newNote, error } = await supabase
      .from("quick_notes")
      .insert({
        firm_id: tenant.firmId,
        user_id: user.id,
        title: title || "Untitled Note",
        content: content || "",
        tags: tags || [],
        is_pinned: isPinned ?? false,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating note:", error);
      return NextResponse.json({ error: "Failed to save note" }, { status: 500 });
    }

    return NextResponse.json({ success: true, note: newNote });
  } catch (error) {
    console.error("Error in POST /api/notes:", error);
    return NextResponse.json({ error: "Failed to save note" }, { status: 500 });
  }
}
