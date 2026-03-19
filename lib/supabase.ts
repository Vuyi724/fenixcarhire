import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}

// For backward compatibility with existing code
export const supabase = {
  get auth() {
    return createClient().auth
  },
  from(table: string) {
    return createClient().from(table)
  },
  rpc(fn: string, params?: any) {
    return createClient().rpc(fn, params)
  },
  channel(name: string) {
    return createClient().channel(name)
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
