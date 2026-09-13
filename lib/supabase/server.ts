import { createClient } from "@supabase/supabase-js";
import { auth, currentUser } from "@clerk/nextjs/server";
import { Database, UserRole } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://uoiodhmahcpwedwajdtd.supabase.co";
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

/**
 * Creates a server-side Supabase client with administrative service role key.
 * Used in server actions and route handlers for multi-tenant queries.
 */
export function createAdminClient() {
  return createClient<Database>(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export interface TenantContext {
  userId: string;
  orgId: string | null;
  firmId: string | null;
  role: UserRole;
  email: string;
  fullName: string;
}

/**
 * Resolves current tenant context from Clerk session and syncs with Supabase.
 */
export async function getTenantContext(): Promise<TenantContext | null> {
  const { userId, orgId } = await auth();
  if (!userId) return null;

  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress || "user@turia.in";
  const fullName = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Practitioner";

  const supabase = createAdminClient();

  // 1. If user has an active organization in Clerk
  if (orgId) {
    // Check if firm exists for this Clerk organization
    let { data: firm } = await supabase
      .from("firms")
      .select("id, brand_name")
      .eq("clerk_org_id", orgId)
      .maybeSingle();

    // If firm does not exist yet, provision it automatically
    if (!firm) {
      const { data: newFirm, error: firmError } = await supabase
        .from("firms")
        .insert({
          clerk_org_id: orgId,
          brand_name: "My CA Practice",
          legal_name: "Chartered Accountants & Co.",
          business_entity: "Partnership Firm",
          city: "Kolkata",
          state: "West Bengal",
          country: "India",
          onboarding_step: 1,
          onboarding_completed: false,
        })
        .select("id, brand_name")
        .single();

      if (!firmError && newFirm) {
        firm = newFirm;
      }
    }

    // Ensure firm_user exists
    if (firm) {
      const { data: firmUser } = await supabase
        .from("firm_users")
        .select("id, role")
        .eq("firm_id", firm.id)
        .eq("clerk_user_id", userId)
        .maybeSingle();

      if (!firmUser) {
        await supabase.from("firm_users").insert({
          firm_id: firm.id,
          clerk_user_id: userId,
          first_name: user?.firstName || "CA",
          last_name: user?.lastName || "Practitioner",
          full_name: fullName,
          email: email,
          role: "admin",
          designation: "Managing Partner",
          department: "Direct Tax",
          cost_per_hour: 500,
          billing_rate: 2500,
        });
      }

      return {
        userId,
        orgId,
        firmId: firm.id,
        role: (firmUser?.role as UserRole) || "admin",
        email,
        fullName,
      };
    }
  }

  // 2. If orgId is null (User logged into personal account without active Clerk org selection)
  // Check if this user is already linked to a firm via firm_users
  try {
    const { data: existingMembership } = await supabase
      .from("firm_users")
      .select("id, role, firm_id")
      .eq("clerk_user_id", userId)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (existingMembership?.firm_id) {
      return {
        userId,
        orgId: null,
        firmId: existingMembership.firm_id,
        role: (existingMembership.role as UserRole) || "admin",
        email,
        fullName,
      };
    }

    // Check if a personal firm was already created for this user
    const personalOrgId = `personal_${userId}`;
    let { data: personalFirm } = await supabase
      .from("firms")
      .select("id, brand_name")
      .eq("clerk_org_id", personalOrgId)
      .maybeSingle();

    // If still not found, check if ANY firm exists in the database (e.g. primary firm created during initial setup)
    if (!personalFirm) {
      const { data: anyFirm } = await supabase
        .from("firms")
        .select("id, brand_name")
        .order("created_at", { ascending: true })
        .limit(1)
        .maybeSingle();

      if (anyFirm) {
        personalFirm = anyFirm;
      }
    }

    // If still no firm in database, attempt to auto-provision one
    if (!personalFirm) {
      const { data: newPersonalFirm } = await supabase
        .from("firms")
        .insert({
          clerk_org_id: personalOrgId,
          brand_name: "Saha & Associates, Chartered Accountants",
          legal_name: "Saha & Associates LLP",
          business_entity: "Partnership Firm",
          city: "Kolkata",
          state: "West Bengal",
          country: "India",
          onboarding_step: 1,
          onboarding_completed: false,
        })
        .select("id, brand_name")
        .maybeSingle();

      if (newPersonalFirm) {
        personalFirm = newPersonalFirm;
      }
    }

    // Fallback deterministic firm UUID if database insert failed
    const resolvedFirmId = personalFirm?.id || "00000000-0000-0000-0000-000000000001";

    // Attempt to register firm_user relationship
    try {
      await supabase.from("firm_users").upsert(
        {
          firm_id: resolvedFirmId,
          clerk_user_id: userId,
          first_name: user?.firstName || "CA",
          last_name: user?.lastName || "Practitioner",
          full_name: fullName,
          email: email,
          role: "admin",
          designation: "Managing Partner",
          department: "Direct Tax",
          cost_per_hour: 500,
          billing_rate: 2500,
        },
        { onConflict: "firm_id, clerk_user_id" }
      );
    } catch {
      // ignore upsert errors during fallback
    }

    return {
      userId,
      orgId: null,
      firmId: resolvedFirmId,
      role: "admin",
      email,
      fullName,
    };
  } catch (err) {
    console.warn("Tenant resolution fallback in getTenantContext:", err);
    return {
      userId,
      orgId: null,
      firmId: "00000000-0000-0000-0000-000000000001",
      role: "admin",
      email,
      fullName,
    };
  }
}
