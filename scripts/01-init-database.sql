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

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_car_id ON bookings(car_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_cars_status ON cars(status);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only view their own profile
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policy: Users can view all cars (no filtering needed)
CREATE POLICY "Users can view all cars" ON cars
  FOR SELECT USING (true);

-- RLS Policy: Admins can update cars (requires is_admin claim - optional, skip for now)
CREATE POLICY "Users can only view their own bookings" ON bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can only create bookings for themselves" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own bookings" ON bookings
  FOR UPDATE USING (auth.uid() = user_id);

-- Insert sample cars
INSERT INTO cars (brand, model, year, license_plate, color, transmission, fuel_type, seats, daily_rate, image_url, status)
VALUES
  ('Toyota', 'Corolla', 2023, 'ABC123', 'Silver', 'Automatic', 'Petrol', 5, 45.00, 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image14-2nvNFBW9aTPOM7FOC39RaA6UFHuGd6.jpeg', 'available'),
  ('Honda', 'Civic', 2023, 'XYZ789', 'Black', 'Automatic', 'Petrol', 5, 50.00, 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image15-jgLAy9QGHOtRi04fW4CU8YS3oOwPmT.jpeg', 'available'),
  ('Toyota', 'Highlander', 2022, 'DEF456', 'White', 'Automatic', 'Petrol', 7, 65.00, 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image4-pQgukUB90sia9D6yugX6tme7hpCyEi.jpeg', 'available'),
  ('BMW', 'X5', 2023, 'GHI789', 'Blue', 'Automatic', 'Petrol', 7, 90.00, 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-N8U7H5Z2kL9pM3xQ1wE4r6tY8uI2oP5s.png', 'available'),
  ('Mercedes', 'C-Class', 2023, 'JKL012', 'Gray', 'Automatic', 'Petrol', 5, 75.00, 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-a9B2cD5eF8gH1iJ4kL7mN0oP3qR6sTu.png', 'available')
ON CONFLICT DO NOTHING;
