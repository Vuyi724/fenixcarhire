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

async function seedCars() {
  try {
    console.log('[v0] Seeding cars database...')
    
    // Check if cars already exist
    const { data: existingCars, error: selectError } = await supabase
      .from('cars')
      .select('id')
    
    if (selectError) {
      console.error('[v0] Error checking existing cars:', selectError)
      process.exit(1)
    }
    
    if (existingCars && existingCars.length > 0) {
      console.log('[v0] Cars already exist. Skipping seed.')
      process.exit(0)
    }
    
    // Insert sample cars
    const { data, error } = await supabase
      .from('cars')
      .insert(sampleCars)
    
    if (error) {
      console.error('[v0] Error inserting cars:', error)
      process.exit(1)
    }
    
    console.log('[v0] Successfully seeded', sampleCars.length, 'cars')
    process.exit(0)
  } catch (error) {
    console.error('[v0] Unexpected error:', error)
    process.exit(1)
  }
}

seedCars()
