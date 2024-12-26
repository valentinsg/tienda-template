import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tfufdiayyhcndcgncylf.supabase.co';
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRmdWZkaWF5eWhjbmRjZ25jeWxmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ4NzQ2MzUsImV4cCI6MjA1MDQ1MDYzNX0.uXcwIBMbNhPr5zpJ1KOEs5dmEbjgZFbEBPlUbdoKLNQ"
const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  const { data, error } = await supabase.from('your-table-name').select('*');
  
  if (error) {
    console.error('Error connecting to Supabase:', error);
  } else {
    console.log('Connection successful, data:', data);
  }
}

testConnection();