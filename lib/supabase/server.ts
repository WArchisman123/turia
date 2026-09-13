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

  // If user has an active organization in Clerk
  if (orgId) {
    // Check if firm exists
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

  return {
    userId,
    orgId: null,
    firmId: null,
    role: "admin",
    email,
    fullName,
  };
}
