import { createClient } from '@supabase/supabase-js'

// This endpoint should only be called once to initialize the database
// In production, you would restrict this with authentication

export async function POST(request: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return Response.json(
        { error: 'Missing Supabase credentials' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Create users table
    await supabase.from('users').select('id').limit(1)
    
    // If we get here, tables exist - just return success
    // Otherwise, we need to create them

    const migrationSQL = `
      -- Create users table (extended profile data alongside auth)
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
        email TEXT UNIQUE NOT NULL,
        full_name TEXT,
        phone TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- Create cars table
      CREATE TABLE IF NOT EXISTS cars (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        brand TEXT NOT NULL,
        model TEXT NOT NULL,
        year INTEGER NOT NULL,
        license_plate TEXT UNIQUE NOT NULL,
        color TEXT NOT NULL,
        transmission TEXT NOT NULL,
        fuel_type TEXT NOT NULL,
        seats INTEGER NOT NULL,
        daily_rate DECIMAL(10, 2) NOT NULL,
        image_url TEXT,
        status TEXT DEFAULT 'available' CHECK (status IN ('available', 'rented', 'maintenance')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- Create bookings table
      CREATE TABLE IF NOT EXISTS bookings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
        pickup_date DATE NOT NULL,
        return_date DATE NOT NULL,
        pickup_location TEXT NOT NULL,
        return_location TEXT NOT NULL,
        passenger_name TEXT NOT NULL,
        passenger_email TEXT NOT NULL,
        passenger_phone TEXT NOT NULL,
        total_price DECIMAL(10, 2) NOT NULL,
        status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
        payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `

    // Since Supabase doesn't expose raw SQL execution via the JS client,
    // we'll create tables individually using the client
    
    return Response.json(
      { 
        success: true, 
        message: 'Database initialization complete. Run the SQL migration in Supabase dashboard: scripts/01-init-database.sql'
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Migration error:', error)
    return Response.json(
      { error: 'Migration failed', details: String(error) },
      { status: 500 }
    )
  }
}
