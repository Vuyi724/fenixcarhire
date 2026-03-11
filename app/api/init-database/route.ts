import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export async function POST() {
  try {
    if (!supabaseUrl || !supabaseServiceKey) {
      return Response.json({ error: 'Missing Supabase credentials' }, { status: 400 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Create cars table
    const { error: tableError } = await supabase.rpc('exec', {
      sql: `
        CREATE TABLE IF NOT EXISTS cars (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          brand VARCHAR(100) NOT NULL,
          model VARCHAR(100) NOT NULL,
          year INTEGER NOT NULL,
          seats INTEGER NOT NULL,
          transmission VARCHAR(50) NOT NULL,
          fuel_type VARCHAR(50) NOT NULL,
          daily_rate DECIMAL(10, 2) NOT NULL,
          license_plate VARCHAR(50) UNIQUE NOT NULL,
          image_url VARCHAR(500),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

        CREATE POLICY "Allow authenticated users to view cars"
          ON cars
          FOR SELECT
          USING (auth.role() = 'authenticated');
      `
    })

    // Insert sample cars
    const cars = [
      {
        brand: 'Toyota',
        model: 'Corolla',
        year: 2023,
        seats: 5,
        transmission: 'Automatic',
        fuel_type: 'Petrol',
        daily_rate: 450,
        license_plate: 'TYT-001',
        image_url: 'https://images.unsplash.com/photo-1533473359331-35a52422e9d2?w=500&h=400&fit=crop'
      },
      {
        brand: 'Honda',
        model: 'Civic',
        year: 2023,
        seats: 5,
        transmission: 'Automatic',
        fuel_type: 'Petrol',
        daily_rate: 500,
        license_plate: 'HND-001',
        image_url: 'https://images.unsplash.com/photo-1559416523-140ddc3d238b?w=500&h=400&fit=crop'
      },
      {
        brand: 'BMW',
        model: '3 Series',
        year: 2022,
        seats: 5,
        transmission: 'Automatic',
        fuel_type: 'Petrol',
        daily_rate: 850,
        license_plate: 'BMW-001',
        image_url: 'https://images.unsplash.com/photo-1567818735868-e71b99932e29?w=500&h=400&fit=crop'
      },
      {
        brand: 'Mazda',
        model: 'CX-5',
        year: 2023,
        seats: 5,
        transmission: 'Automatic',
        fuel_type: 'Petrol',
        daily_rate: 600,
        license_plate: 'MZD-001',
        image_url: 'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?w=500&h=400&fit=crop'
      },
      {
        brand: 'Hyundai',
        model: 'Elantra',
        year: 2023,
        seats: 5,
        transmission: 'Automatic',
        fuel_type: 'Petrol',
        daily_rate: 400,
        license_plate: 'HYD-001',
        image_url: 'https://images.unsplash.com/photo-1609708536965-36dda2ebc588?w=500&h=400&fit=crop'
      },
      {
        brand: 'Ford',
        model: 'Ranger',
        year: 2022,
        seats: 5,
        transmission: 'Manual',
        fuel_type: 'Diesel',
        daily_rate: 550,
        license_plate: 'FRD-001',
        image_url: 'https://images.unsplash.com/photo-1605559424843-9e4c3ff86981?w=500&h=400&fit=crop'
      },
      {
        brand: 'Nissan',
        model: 'Altima',
        year: 2023,
        seats: 5,
        transmission: 'Automatic',
        fuel_type: 'Petrol',
        daily_rate: 480,
        license_plate: 'NSN-001',
        image_url: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=500&h=400&fit=crop'
      },
      {
        brand: 'Mercedes',
        model: 'C-Class',
        year: 2022,
        seats: 5,
        transmission: 'Automatic',
        fuel_type: 'Petrol',
        daily_rate: 950,
        license_plate: 'MRC-001',
        image_url: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=500&h=400&fit=crop'
      }
    ]

    const { error: insertError } = await supabase
      .from('cars')
      .insert(cars)

    if (insertError && insertError.code !== '23505') { // 23505 is duplicate key error
      console.error('Insert error:', insertError)
    }

    return Response.json({ 
      success: true, 
      message: 'Database initialized with sample cars'
    })
  } catch (error) {
    console.error('Database initialization error:', error)
    return Response.json({ error: 'Failed to initialize database' }, { status: 500 })
  }
}
