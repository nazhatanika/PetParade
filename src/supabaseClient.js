import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://idnjhfqzhwklrkeycsmh.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkbmpoZnF6aHdrbHJrZXljc21oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NDg0MDIsImV4cCI6MjA3MDAyNDQwMn0._oyN_sNH1sCwtQn_yaiYS6bPir9xHYyhlBWpS4VX2f0";

export const supabase = createClient(supabaseUrl, supabaseKey);