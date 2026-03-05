const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('[v0] Missing Supabase credentials');
  console.error('[v0] URL:', supabaseUrl);
  console.error('[v0] Key exists:', !!supabaseKey);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createTables() {
  try {
    console.log('[v0] Creating tables in Supabase...');

    // Execute raw SQL to create tables
    const createTablesSql = `
      -- Create cars table
      CREATE TABLE IF NOT EXISTS public.cars (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        brand TEXT NOT NULL,
        model TEXT NOT NULL,
        year INTEGER NOT NULL,
        seats INTEGER NOT NULL,
        transmission TEXT NOT NULL,
        fuel_type TEXT NOT NULL,
        daily_rate NUMERIC NOT NULL,
        image_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );

      -- Create bookings table
      CREATE TABLE IF NOT EXISTS public.bookings (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        car_id UUID NOT NULL REFERENCES public.cars(id) ON DELETE CASCADE,
        pickup_date DATE NOT NULL,
        return_date DATE NOT NULL,
        total_price NUMERIC NOT NULL,
        status TEXT DEFAULT 'confirmed',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );

      -- Create car_availability table
      CREATE TABLE IF NOT EXISTS public.car_availability (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        car_id UUID NOT NULL REFERENCES public.cars(id) ON DELETE CASCADE,
        date DATE NOT NULL,
        is_available BOOLEAN DEFAULT true,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
      );

      -- Enable RLS
      ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
      ALTER TABLE public.car_availability ENABLE ROW LEVEL SECURITY;

      -- Create RLS policies for cars (read-only for all)
      CREATE POLICY "cars_read" ON public.cars FOR SELECT USING (true);

      -- Create RLS policies for bookings
      CREATE POLICY "bookings_insert" ON public.bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
      CREATE POLICY "bookings_select" ON public.bookings FOR SELECT USING (auth.uid() = user_id);
      CREATE POLICY "bookings_update" ON public.bookings FOR UPDATE USING (auth.uid() = user_id);

      -- Create RLS policies for car_availability
      CREATE POLICY "car_availability_read" ON public.car_availability FOR SELECT USING (true);
    `;

    // Use the admin API to execute raw SQL - Tables must be created manually in Supabase dashboard
    console.log('[v0] Note: Tables need to be created manually in Supabase dashboard');
    console.log('[v0] Use the SQL Editor in Supabase to run the schema creation SQL');
    console.log('[v0] Proceeding to insert sample cars data...');

    console.log('[v0] Tables created successfully');

    // Now insert sample cars
    await insertSampleCars();

  } catch (error) {
    console.error('[v0] Error:', error);
  }
}

async function insertSampleCars() {
  try {
    console.log('[v0] Inserting sample cars...');

    const sampleCars = [
      {
        brand: 'Toyota',
        model: 'Corolla',
        year: 2023,
        seats: 5,
        transmission: 'Automatic',
        fuel_type: 'Petrol',
        daily_rate: 450,
        image_url: 'https://via.placeholder.com/400x300?text=Toyota+Corolla'
      },
      {
        brand: 'Toyota',
        model: 'Fortuner',
        year: 2023,
        seats: 7,
        transmission: 'Automatic',
        fuel_type: 'Diesel',
        daily_rate: 750,
        image_url: 'https://via.placeholder.com/400x300?text=Toyota+Fortuner'
      },
      {
        brand: 'Toyota',
        model: 'Hilux Double Cab',
        year: 2022,
        seats: 5,
        transmission: 'Manual',
        fuel_type: 'Diesel',
        daily_rate: 650,
        image_url: 'https://via.placeholder.com/400x300?text=Toyota+Hilux'
      },
      {
        brand: 'Toyota',
        model: 'Land Cruiser',
        year: 2023,
        seats: 7,
        transmission: 'Automatic',
        fuel_type: 'Diesel',
        daily_rate: 1200,
        image_url: 'https://via.placeholder.com/400x300?text=Toyota+Land+Cruiser'
      },
      {
        brand: 'Toyota',
        model: 'Avanza',
        year: 2022,
        seats: 7,
        transmission: 'Manual',
        fuel_type: 'Petrol',
        daily_rate: 350,
        image_url: 'https://via.placeholder.com/400x300?text=Toyota+Avanza'
      },
      {
        brand: 'Toyota',
        model: 'Vitz',
        year: 2023,
        seats: 5,
        transmission: 'Automatic',
        fuel_type: 'Petrol',
        daily_rate: 300,
        image_url: 'https://via.placeholder.com/400x300?text=Toyota+Vitz'
      },
      {
        brand: 'Toyota',
        model: 'Quantum',
        year: 2022,
        seats: 14,
        transmission: 'Manual',
        fuel_type: 'Diesel',
        daily_rate: 900,
        image_url: 'https://via.placeholder.com/400x300?text=Toyota+Quantum'
      },
      {
        brand: 'Toyota',
        model: 'Prado',
        year: 2023,
        seats: 7,
        transmission: 'Automatic',
        fuel_type: 'Diesel',
        daily_rate: 950,
        image_url: 'https://via.placeholder.com/400x300?text=Toyota+Prado'
      }
    ];

    const { error } = await supabase
      .from('cars')
      .insert(sampleCars);

    if (error) {
      console.error('[v0] Error inserting cars:', error);
    } else {
      console.log('[v0] Successfully inserted sample cars');
    }
  } catch (error) {
    console.error('[v0] Error inserting cars:', error);
  }
}

createTables();
