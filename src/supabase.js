import { createClient } from '@supabase/supabase-js'

// ─── REPLACE THESE WITH YOUR OWN VALUES FROM SUPABASE ────────────────────────
// Go to: supabase.com → your project → Settings → API
const SUPABASE_URL  = "https://epipmfvviuqsrzxskjmu.supabase.co"
const SUPABASE_ANON = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVwaXBtZnZ2aXVxc3J6eHNram11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxOTQ3NTksImV4cCI6MjA4OTc3MDc1OX0.FkQ2ikCzEX76FuciBzqSHAvLAMftFG3f7xEVXObGArI"
// ─────────────────────────────────────────────────────────────────────────────

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON)

