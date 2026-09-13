import { createClient } from "@supabase/supabase-js";
import { Database } from "./types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://uoiodhmahcpwedwajdtd.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "sb_publishable_IPmbLUsHSQdDFwvfKYv7Pg_DNuYlsaB";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
