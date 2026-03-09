import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null

function getSupabaseClient(): SupabaseClient {
  if (supabaseInstance) {
    return supabaseInstance
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key'

  try {
    supabaseInstance = createClient(supabaseUrl, supabaseKey)
  } catch (error) {
    console.error('[v0] Failed to initialize Supabase client:', error)
  }

  return supabaseInstance as SupabaseClient
}

export const supabase = {
  get auth() {
    return getSupabaseClient().auth
  },
  from(table: string) {
    return getSupabaseClient().from(table)
  },
  rpc(fn: string, params?: any) {
    return getSupabaseClient().rpc(fn, params)
  },
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
