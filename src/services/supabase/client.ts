import { createClient } from '@supabase/supabase-js'
import { Database } from './db'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
	throw new Error('Supabase URL e Anon Key são necessários')
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey) 