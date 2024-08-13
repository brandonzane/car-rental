import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import "react-native-url-polyfill/auto";

const supabaseUrl = "https://affazurwubteoidklqgi.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFmZmF6dXJ3dWJ0ZW9pZGtscWdpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjMxMDk1NTEsImV4cCI6MjAzODY4NTU1MX0.1ONx9rytlXlDOtLboRyYjZQ4vuWzMUEWjTIhJ3ImRIQ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

console.log("Supabase client created:", supabase);
