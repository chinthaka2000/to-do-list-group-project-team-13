import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wheloquwmgysvwdwnnqk.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndoZWxvcXV3bWd5c3Z3ZHdubnFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjUzOTA3NjMsImV4cCI6MjA0MDk2Njc2M30.Fh--Myv4UZcdm8GgBXsb3HfURx9DxqSGwdXW5b-XBno';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})