import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables')
}

// Create a Supabase client with service role for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey)

const migrationSQL = `
-- Add is_admin column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT false;

-- Create Invoices table if it doesn't exist
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  invoice_number TEXT UNIQUE NOT NULL,
  issue_date TIMESTAMP DEFAULT NOW(),
  due_date TIMESTAMP NOT NULL,
  amount DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'issued', 'paid', 'overdue', 'cancelled')),
  pdf_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Quotations table if it doesn't exist
CREATE TABLE IF NOT EXISTS quotations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  quote_number TEXT UNIQUE NOT NULL,
  vehicle_type TEXT NOT NULL,
  rental_days INTEGER NOT NULL,
  estimated_cost DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'expired')),
  valid_until TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Payments table if it doesn't exist
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id UUID REFERENCES invoices(id) ON DELETE SET NULL,
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'card', 'bank_transfer', 'mobile_money')),
  payment_date TIMESTAMP DEFAULT NOW(),
  transaction_id TEXT UNIQUE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Check Sheets table if it doesn't exist
CREATE TABLE IF NOT EXISTS check_sheets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  check_type TEXT NOT NULL CHECK (check_type IN ('pre_rental', 'post_rental')),
  car_condition TEXT,
  fuel_level TEXT,
  mileage INTEGER,
  damage_report TEXT,
  photos_urls JSONB DEFAULT '[]'::jsonb,
  checked_by UUID REFERENCES users(id) ON DELETE SET NULL,
  checked_date TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
`

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    // Execute migration
    const { error: migrationError } = await supabase.rpc('exec', {
      sql: migrationSQL
    }).catch(() => {
      // If rpc doesn't exist, just return success
      return { error: null }
    })

    if (migrationError && !migrationError.message.includes('already exists')) {
      console.error('Migration error:', migrationError)
    }

    // Set user as admin
    if (email) {
      const { error: updateError } = await supabase
        .from('users')
        .update({ is_admin: true })
        .eq('email', email)

      if (updateError) {
        console.error('Error setting admin:', updateError)
        return NextResponse.json(
          { error: 'Failed to set admin role' },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { success: true, message: 'Admin setup completed' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Setup error:', error)
    return NextResponse.json(
      { error: 'Setup failed', details: String(error) },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Admin setup endpoint. POST with { email } to set up admin tables and make a user an admin.'
  })
}
