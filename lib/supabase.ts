import { createClient } from "@supabase/supabase-js";

// Ensure your env variables are set in .env.local
// NEXT_PUBLIC_SUPABASE_URL=your_url
// NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
