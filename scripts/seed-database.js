import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('[v0] Missing Supabase credentials')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const sampleCars = [
  {
    brand: 'Toyota',
    model: 'Camry',
    year: 2023,
    seats: 5,
    transmission: 'Automatic',
    fuel_type: 'Petrol',
    daily_rate: 1500,
    license_plate: 'MR001TY',
    image_url: 'https://images.unsplash.com/photo-1566023967268-de80828e8f65?w=500&h=400&fit=crop',
  },
  {
    brand: 'Honda',
    model: 'Civic',
    year: 2023,
    seats: 5,
    transmission: 'Manual',
    fuel_type: 'Petrol',
    daily_rate: 1200,
    license_plate: 'MR002HN',
    image_url: 'https://images.unsplash.com/photo-1627454813175-2c5a98ed5a69?w=500&h=400&fit=crop',
  },
  {
    brand: 'BMW',
    model: '3 Series',
    year: 2023,
    seats: 5,
    transmission: 'Automatic',
    fuel_type: 'Diesel',
    daily_rate: 2500,
    license_plate: 'MR003BM',
    image_url: 'https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=500&h=400&fit=crop',
  },
  {
    brand: 'Mazda',
    model: 'CX-5',
    year: 2023,
    seats: 5,
    transmission: 'Automatic',
    fuel_type: 'Petrol',
    daily_rate: 1800,
    license_plate: 'MR004MZ',
    image_url: 'https://images.unsplash.com/photo-1606606401543-617e01c15e52?w=500&h=400&fit=crop',
  },
  {
    brand: 'Hyundai',
    model: 'Accent',
    year: 2023,
    seats: 5,
    transmission: 'Automatic',
    fuel_type: 'Petrol',
    daily_rate: 900,
    license_plate: 'MR005HY',
    image_url: 'https://images.unsplash.com/photo-1567818735868-e71b99932e29?w=500&h=400&fit=crop',
  },
  {
    brand: 'Ford',
    model: 'Ranger',
    year: 2023,
    seats: 5,
    transmission: 'Automatic',
    fuel_type: 'Diesel',
    daily_rate: 2000,
    license_plate: 'MR006FD',
    image_url: 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=500&h=400&fit=crop',
  },
  {
    brand: 'Nissan',
    model: 'Qashqai',
    year: 2023,
    seats: 5,
    transmission: 'Automatic',
    fuel_type: 'Petrol',
    daily_rate: 1400,
    license_plate: 'MR007NS',
    image_url: 'https://images.unsplash.com/photo-1550258987-920d5d8e5b8c?w=500&h=400&fit=crop',
  },
  {
    brand: 'Mercedes',
    model: 'C-Class',
    year: 2023,
    seats: 5,
    transmission: 'Automatic',
    fuel_type: 'Diesel',
    daily_rate: 3000,
    license_plate: 'MR008MB',
    image_url: 'https://images.unsplash.com/photo-1514162545848-a24eaf1d6362?w=500&h=400&fit=crop',
  },
]

async function seedDatabase() {
  try {
    console.log('[v0] Starting database seed...')
    
    // Try to insert cars
    const { data, error } = await supabase
      .from('cars')
      .insert(sampleCars)
      .select()
    
    if (error) {
      if (error.message && error.message.includes('does not exist')) {
        console.error('[v0] Cars table does not exist. Please create it in Supabase first.')
        console.log('[v0] Run this SQL in your Supabase SQL editor:')
        console.log(`
CREATE TABLE cars (
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
        `)
      } else {
        console.error('[v0] Error inserting cars:', error.message)
      }
      process.exit(1)
    }
    
    console.log('[v0] Successfully seeded', data?.length || sampleCars.length, 'cars')
    process.exit(0)
  } catch (error) {
    console.error('[v0] Unexpected error:', error)
    process.exit(1)
  }
}

seedDatabase()
