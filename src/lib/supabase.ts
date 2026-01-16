import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Use service role key if available for server-side operations to bypass RLS if needed,
// but for this simple public counter, anon key might suffice if RLS is set up for it.
// However, since we are doing logic in API routes, service role is safer for 'increment' if we want to secure it.
// The user has 'SUPABASE_SERVICE_ROLE_KEY' usually in .env for backend.
// Let's assume standard env vars.

export const supabase = createClient(supabaseUrl, supabaseKey);
