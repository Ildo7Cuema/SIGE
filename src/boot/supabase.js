import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kecibuqowuqprbfokouy.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtlY2lidXFvd3VxcHJiZm9rb3V5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDA3NTM0MTksImV4cCI6MjAxNjMyOTQxOX0.geKyNoJ8JA4eqOw6m2OXBz5h-Q8TcdSDSUgJZFomr-o'

export const supabase = createClient(supabaseUrl, supabaseKey)

export default function useSupabase () {
  return { supabase }
}