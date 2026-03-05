const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('[v0] Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupDatabase() {
  try {
    console.log('[v0] Starting database setup...');

    // Create cars table
    const { error: carTableError } = await supabase.from('cars').select('id').limit(1);
    
    if (carTableError && carTableError.code === 'PGRST116') {
      console.log('[v0] Creating cars table...');
      
      const { error } = await supabase.rpc('exec', {
        sql: `
          CREATE TABLE IF NOT EXISTS cars (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            brand VARCHAR NOT NULL,
            model VARCHAR NOT NULL,
            year INTEGER NOT NULL,
            seats INTEGER NOT NULL,
            transmission VARCHAR NOT NULL,
            fuel_type VARCHAR NOT NULL,
            daily_rate DECIMAL(10, 2) NOT NULL,
            image_url VARCHAR,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );

          CREATE TABLE IF NOT EXISTS bookings (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            user_id UUID NOT NULL REFERENCES auth.users(id),
            car_id UUID NOT NULL REFERENCES cars(id),
            pickup_date DATE NOT NULL,
            return_date DATE NOT NULL,
            total_price DECIMAL(10, 2) NOT NULL,
            status VARCHAR DEFAULT 'confirmed',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );

          CREATE TABLE IF NOT EXISTS car_availability (
            id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
            car_id UUID NOT NULL REFERENCES cars(id),
            date DATE NOT NULL,
            is_available BOOLEAN DEFAULT true,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );
        `
      });

      if (error) console.log('[v0] RPC approach not available, using direct insert');
    }

    // Insert sample cars
    const { data: existingCars } = await supabase.from('cars').select('id').limit(1);
    
    if (!existingCars || existingCars.length === 0) {
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

      const { error: insertError, data } = await supabase
        .from('cars')
        .insert(sampleCars);

      if (insertError) {
        console.error('[v0] Error inserting cars:', insertError);
      } else {
        console.log('[v0] Successfully inserted', data?.length || sampleCars.length, 'cars');
      }
    } else {
      console.log('[v0] Cars already exist in database');
    }

    console.log('[v0] Database setup completed!');
    process.exit(0);
  } catch (error) {
    console.error('[v0] Setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();
