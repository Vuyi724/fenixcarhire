import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  try {
    console.log('Setting up database...');

    // Create tables
    const { error: tableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

        CREATE TABLE IF NOT EXISTS public.users (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          email VARCHAR(255) UNIQUE NOT NULL,
          full_name VARCHAR(255) NOT NULL,
          phone VARCHAR(20),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS public.cars (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          model VARCHAR(255) NOT NULL,
          brand VARCHAR(255) NOT NULL,
          year INTEGER NOT NULL,
          license_plate VARCHAR(50) UNIQUE NOT NULL,
          color VARCHAR(50),
          transmission VARCHAR(50),
          fuel_type VARCHAR(50),
          seats INTEGER NOT NULL,
          daily_rate DECIMAL(10, 2) NOT NULL,
          image_url VARCHAR(500),
          status VARCHAR(50) DEFAULT 'available',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS public.bookings (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
          car_id UUID NOT NULL REFERENCES public.cars(id) ON DELETE CASCADE,
          pickup_date DATE NOT NULL,
          return_date DATE NOT NULL,
          pickup_location VARCHAR(255) NOT NULL,
          return_location VARCHAR(255) NOT NULL,
          passenger_name VARCHAR(255) NOT NULL,
          passenger_email VARCHAR(255) NOT NULL,
          passenger_phone VARCHAR(20) NOT NULL,
          total_price DECIMAL(10, 2) NOT NULL,
          status VARCHAR(50) DEFAULT 'confirmed',
          payment_status VARCHAR(50) DEFAULT 'pending',
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );

        CREATE TABLE IF NOT EXISTS public.car_availability (
          id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
          car_id UUID NOT NULL REFERENCES public.cars(id) ON DELETE CASCADE,
          booking_date DATE NOT NULL,
          available_count INTEGER NOT NULL DEFAULT 1,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          UNIQUE(car_id, booking_date)
        );

        ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;
        ALTER TABLE public.car_availability ENABLE ROW LEVEL SECURITY;

        CREATE POLICY IF NOT EXISTS "Users can view their own data" ON public.users
          FOR SELECT USING (auth.uid()::text = id::text);

        CREATE POLICY IF NOT EXISTS "Users can update their own data" ON public.users
          FOR UPDATE USING (auth.uid()::text = id::text);

        CREATE POLICY IF NOT EXISTS "Everyone can view cars" ON public.cars
          FOR SELECT USING (true);

        CREATE POLICY IF NOT EXISTS "Users can view their own bookings" ON public.bookings
          FOR SELECT USING (auth.uid()::text = user_id::text);

        CREATE POLICY IF NOT EXISTS "Users can create bookings" ON public.bookings
          FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

        CREATE POLICY IF NOT EXISTS "Users can update their own bookings" ON public.bookings
          FOR UPDATE USING (auth.uid()::text = user_id::text);

        CREATE POLICY IF NOT EXISTS "Everyone can view car availability" ON public.car_availability
          FOR SELECT USING (true);

        CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
        CREATE INDEX IF NOT EXISTS idx_bookings_car_id ON public.bookings(car_id);
        CREATE INDEX IF NOT EXISTS idx_bookings_status ON public.bookings(status);
        CREATE INDEX IF NOT EXISTS idx_car_availability_car_id ON public.car_availability(car_id);
        CREATE INDEX IF NOT EXISTS idx_car_availability_date ON public.car_availability(booking_date);
      `
    });

    if (tableError) {
      console.log('Note: Tables may already exist or RPC not available');
    }

    // Insert sample cars
    console.log('Inserting sample cars...');
    const { data: existingCars } = await supabase
      .from('cars')
      .select('id')
      .limit(1);

    if (!existingCars || existingCars.length === 0) {
      const sampleCars = [
        {
          model: 'Civic',
          brand: 'Honda',
          year: 2023,
          license_plate: 'FX-001-AA',
          color: 'Black',
          transmission: 'Automatic',
          fuel_type: 'Petrol',
          seats: 5,
          daily_rate: 45.00,
          status: 'available',
          image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=400&fit=crop'
        },
        {
          model: 'Corolla',
          brand: 'Toyota',
          year: 2023,
          license_plate: 'FX-002-AA',
          color: 'Silver',
          transmission: 'Automatic',
          fuel_type: 'Hybrid',
          seats: 5,
          daily_rate: 50.00,
          status: 'available',
          image_url: 'https://images.unsplash.com/photo-1552519507-da3effff991c?w=500&h=400&fit=crop'
        },
        {
          model: 'Accord',
          brand: 'Honda',
          year: 2022,
          license_plate: 'FX-003-AA',
          color: 'White',
          transmission: 'Automatic',
          fuel_type: 'Petrol',
          seats: 5,
          daily_rate: 55.00,
          status: 'available',
          image_url: 'https://images.unsplash.com/photo-1606611013016-969b41f1ff7f?w=500&h=400&fit=crop'
        },
        {
          model: 'Camry',
          brand: 'Toyota',
          year: 2023,
          license_plate: 'FX-004-AA',
          color: 'Blue',
          transmission: 'Automatic',
          fuel_type: 'Petrol',
          seats: 5,
          daily_rate: 60.00,
          status: 'available',
          image_url: 'https://images.unsplash.com/photo-1609708536965-59ee35cfc584?w=500&h=400&fit=crop'
        },
        {
          model: 'CR-V',
          brand: 'Honda',
          year: 2023,
          license_plate: 'FX-005-AA',
          color: 'Black',
          transmission: 'Automatic',
          fuel_type: 'Petrol',
          seats: 5,
          daily_rate: 70.00,
          status: 'available',
          image_url: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500&h=400&fit=crop'
        },
        {
          model: 'RAV4',
          brand: 'Toyota',
          year: 2022,
          license_plate: 'FX-006-AA',
          color: 'Gray',
          transmission: 'Automatic',
          fuel_type: 'Hybrid',
          seats: 5,
          daily_rate: 75.00,
          status: 'available',
          image_url: 'https://images.unsplash.com/photo-1605559424843-9e4c3ca7603f?w=500&h=400&fit=crop'
        },
        {
          model: 'Altima',
          brand: 'Nissan',
          year: 2023,
          license_plate: 'FX-007-AA',
          color: 'Red',
          transmission: 'Automatic',
          fuel_type: 'Petrol',
          seats: 5,
          daily_rate: 48.00,
          status: 'available',
          image_url: 'https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=500&h=400&fit=crop'
        },
        {
          model: 'Murano',
          brand: 'Nissan',
          year: 2022,
          license_plate: 'FX-008-AA',
          color: 'Pearl',
          transmission: 'Automatic',
          fuel_type: 'Petrol',
          seats: 7,
          daily_rate: 80.00,
          status: 'available',
          image_url: 'https://images.unsplash.com/photo-1566023967268-70530c2c2a43?w=500&h=400&fit=crop'
        }
      ];

      const { data, error } = await supabase
        .from('cars')
        .insert(sampleCars);

      if (error) {
        console.error('Error inserting cars:', error);
      } else {
        console.log('Successfully inserted sample cars');
      }
    } else {
      console.log('Cars already exist in database');
    }

    console.log('Database setup complete!');
  } catch (error) {
    console.error('Setup error:', error);
    process.exit(1);
  }
}

setupDatabase();
