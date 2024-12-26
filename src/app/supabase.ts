import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://tfufdiayyhcndcgncylf.supabase.co';
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmdWZkaWF5eWhjbmRjZ25jeWxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4NzQ2MzUsImV4cCI6MjA1MDQ1MDYzNX0.uXcwIBMbNhPr5zpJ1KOEs5dmEbjgZFbEBPlUbdoKLNQ"

export const supabase = createClient(supabaseUrl, supabaseKey);