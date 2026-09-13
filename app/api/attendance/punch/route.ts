import { NextResponse } from "next/server";
import { getTenantContext, createAdminClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const tenant = await getTenantContext();
    if (!tenant || !tenant.firmId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { action, workLocation, inGeoCoords, distanceMeters } = body;

    const supabase = createAdminClient();

    // Get firm_user id
    const { data: user } = await supabase
      .from("firm_users")
      .select("id")
      .eq("firm_id", tenant.firmId)
      .eq("clerk_user_id", tenant.userId)
      .single();

    if (!user) {
      return NextResponse.json({ error: "Firm user not found" }, { status: 404 });
    }

    const todayDate = new Date().toISOString().slice(0, 10);
    const nowTimestamp = new Date().toISOString();

    if (action === "punch_in") {
      const { data: existingLog } = await supabase
        .from("attendance_logs")
        .select("id")
        .eq("firm_id", tenant.firmId)
        .eq("user_id", user.id)
        .eq("attendance_date", todayDate)
        .maybeSingle();

      if (existingLog) {
        await supabase
          .from("attendance_logs")
          .update({
            clock_in: nowTimestamp,
            work_location: workLocation || "At Office",
            in_geo_coords: inGeoCoords || "19.0760° N, 72.8777° E",
            distance_meters: distanceMeters || 18,
            status: "present",
          })
          .eq("id", existingLog.id);
      } else {
        await supabase.from("attendance_logs").insert({
          firm_id: tenant.firmId,
          user_id: user.id,
          attendance_date: todayDate,
          clock_in: nowTimestamp,
          work_location: workLocation || "At Office",
          in_geo_coords: inGeoCoords || "19.0760° N, 72.8777° E",
          distance_meters: distanceMeters || 18,
          status: "present",
        });
      }

      await supabase
        .from("firm_users")
        .update({ last_punch_in: nowTimestamp })
        .eq("id", user.id);

      return NextResponse.json({
        success: true,
        action: "punch_in",
        timestamp: nowTimestamp,
      });
    } else {
      // Punch out
      await supabase
        .from("attendance_logs")
        .update({
          clock_out: nowTimestamp,
          out_geo_coords: inGeoCoords || "19.0760° N, 72.8777° E",
        })
        .eq("firm_id", tenant.firmId)
        .eq("user_id", user.id)
        .eq("attendance_date", todayDate);

      return NextResponse.json({
        success: true,
        action: "punch_out",
        timestamp: nowTimestamp,
      });
    }
  } catch (error) {
    console.error("Error in POST /api/attendance/punch:", error);
    return NextResponse.json({ error: "Failed to process punch" }, { status: 500 });
  }
}
