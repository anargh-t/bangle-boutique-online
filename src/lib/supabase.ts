import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Log environment variables for debugging
console.log('Environment check:', {
  VITE_SUPABASE_URL: supabaseUrl ? '✓ Set' : '✗ Missing',
  VITE_SUPABASE_ANON_KEY: supabaseAnonKey ? '✓ Set' : '✗ Missing',
  NODE_ENV: import.meta.env.MODE,
});

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

// Create the Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Test the connection
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.warn('Supabase connection warning:', error.message);
  } else {
    console.log('Supabase connected successfully');
  }
}).catch((err) => {
  console.error('Supabase connection error:', err);
});

export { supabase };
