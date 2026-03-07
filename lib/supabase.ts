import { createClient } from '@supabase/supabase-js'

let supabaseClient: ReturnType<typeof createClient> | null = null

function getSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
  }

  if (!supabaseKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
  }

  supabaseClient = createClient(supabaseUrl, supabaseKey)
  return supabaseClient
}

export const supabase = {
  auth: {
    signUp: async (args: any) => getSupabaseClient().auth.signUp(args),
    signIn: async (args: any) => getSupabaseClient().auth.signIn(args),
    signOut: async () => getSupabaseClient().auth.signOut(),
    getSession: async () => getSupabaseClient().auth.getSession(),
    onAuthStateChange: (callback: any) => getSupabaseClient().auth.onAuthStateChange(callback),
  },
  from: (table: string) => getSupabaseClient().from(table),
  rpc: (fn: string, args?: any) => getSupabaseClient().rpc(fn, args),
}

export type Car = {
  id: string
  model: string
  brand: string
  year: number
  license_plate: string
  color: string
  transmission: string
  fuel_type: string
  seats: number
  daily_rate: number
  image_url: string
  status: string
  created_at: string
  updated_at: string
}

export type Booking = {
  id: string
  user_id: string
  car_id: string
  pickup_date: string
  return_date: string
  pickup_location: string
  return_location: string
  passenger_name: string
  passenger_email: string
  passenger_phone: string
  total_price: number
  status: string
  payment_status: string
  created_at: string
  updated_at: string
}

export type User = {
  id: string
  email: string
  full_name: string
  phone: string
  created_at: string
  updated_at: string
}
