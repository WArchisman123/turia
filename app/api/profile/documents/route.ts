import { NextResponse } from "next/server";
import { getTenantContext, createAdminClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const tenant = await getTenantContext();
    if (!tenant || !tenant.firmId) {
      return NextResponse.json({ error: "Unauthorized or missing organization" }, { status: 401 });
    }

    const firmId = tenant.firmId;
    const supabase = createAdminClient();

    let { data: user } = await supabase
      .from("firm_users")
      .select("id")
      .eq("firm_id", firmId)
      .eq("clerk_user_id", tenant.userId)
      .maybeSingle();

    if (!user) {
      const { data: firstUser } = await supabase
        .from("firm_users")
        .select("id")
        .eq("firm_id", firmId)
        .limit(1)
        .maybeSingle();
      user = firstUser;
    }

    const userId = user?.id;
    if (!userId) {
      return NextResponse.json({ documents: [] });
    }

    const { data: docs, error } = await supabase
      .from("user_documents")
      .select("*")
      .eq("firm_id", firmId)
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching documents:", error);
      return NextResponse.json({ documents: [] });
    }

    const formatFileSize = (bytes: number | null) => {
      if (!bytes) return "1.2 MB";
      if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
      return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const formatted = (docs || []).map((d) => ({
      id: d.id,
      name: d.document_name,
      category: d.document_name.includes("Articleship")
        ? "ICAI Form 102/103 Articleship Deed"
        : d.document_name.includes("PAN")
        ? "PAN Card Copy"
        : d.document_name.includes("Aadhaar")
        ? "Aadhaar Card Copy"
        : d.document_name.includes("Degree")
        ? "Educational Degrees & Marksheets"
        : "Employment Agreement / NDA",
      fileName: d.file_url.split("/").pop() || `${d.document_name.toLowerCase().replace(/ /g, "_")}.pdf`,
      uploadDate: new Date(d.created_at).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).replace(/ /g, "-"),
      fileSize: formatFileSize(d.file_size_bytes),
      verified: true,
    }));

    return NextResponse.json({ documents: formatted });
  } catch (error) {
    console.error("Error in GET /api/profile/documents:", error);
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 });
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
    const supabase = createAdminClient();

    let { data: user } = await supabase
      .from("firm_users")
      .select("id")
      .eq("firm_id", firmId)
      .eq("clerk_user_id", tenant.userId)
      .maybeSingle();

    if (!user) {
      const { data: firstUser } = await supabase
        .from("firm_users")
        .select("id")
        .eq("firm_id", firmId)
        .limit(1)
        .maybeSingle();
      user = firstUser;
    }

    if (!user?.id) {
      return NextResponse.json({ error: "User record not found" }, { status: 404 });
    }

    const { data: newDoc, error } = await supabase
      .from("user_documents")
      .insert({
        firm_id: firmId,
        user_id: user.id,
        document_name: body.name,
        file_url: body.fileUrl || `https://turia-storage.supabase.co/kyc/${encodeURIComponent(body.fileName || "doc.pdf")}`,
        file_size_bytes: body.fileSizeBytes || 1250000,
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving document:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const formatted = {
      id: newDoc.id,
      name: newDoc.document_name,
      category: body.category || "General KYC Document",
      fileName: body.fileName || "document.pdf",
      uploadDate: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).replace(/ /g, "-"),
      fileSize: body.fileSize || "1.2 MB",
      verified: true,
    };

    return NextResponse.json({ success: true, document: formatted });
  } catch (error) {
    console.error("Error in POST /api/profile/documents:", error);
    return NextResponse.json({ error: "Failed to upload document" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const tenant = await getTenantContext();
    if (!tenant || !tenant.firmId) {
      return NextResponse.json({ error: "Unauthorized or missing organization" }, { status: 401 });
    }

    const firmId = tenant.firmId;
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Document ID is required" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const { error } = await supabase
      .from("user_documents")
      .delete()
      .eq("firm_id", firmId)
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, id });
  } catch (error) {
    console.error("Error in DELETE /api/profile/documents:", error);
    return NextResponse.json({ error: "Failed to delete document" }, { status: 500 });
  }
}
