import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export function hasPublicSupabaseEnv() {
  return Boolean(supabaseUrl && publishableKey);
}

export function getPublicSupabase() {
  if (!supabaseUrl || !publishableKey) return null;
  return createClient(supabaseUrl, publishableKey);
}

export function getServiceSupabase() {
  if (!supabaseUrl || !serviceRoleKey) return null;
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false
    }
  });
}
