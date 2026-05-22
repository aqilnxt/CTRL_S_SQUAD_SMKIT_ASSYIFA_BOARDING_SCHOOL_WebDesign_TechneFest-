import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://ipvrojthsgvymffgyjqk.supabase.co', 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwdnJvanRoc2d2eW1mZmd5anFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMzkyMDcsImV4cCI6MjA5NDgxNTIwN30.WWZbp72ZRA5O-TV4sK1mnAgvmDdT27yeZyvhtBOl84o'
)