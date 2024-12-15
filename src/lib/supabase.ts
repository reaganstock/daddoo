import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wkokizrfxmehyfgbsaci.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indrb2tpenJmeG1laHlmZ2JzYWNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM3NDYxODksImV4cCI6MjA0OTMyMjE4OX0.ob5tbdsRP-qQSBZ5G6xss7l9TO7LPDsPOvn9WkbXsFA'

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})
