-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create cars table
CREATE TABLE IF NOT EXISTS cars (
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

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
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

-- Create car_availability table for real-time tracking
CREATE TABLE IF NOT EXISTS car_availability (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  available_count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(car_id, booking_date)
);

-- Enable RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_availability ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update their own data" ON users
  FOR UPDATE USING (auth.uid()::text = id::text);

-- Create RLS policies for cars (public read)
CREATE POLICY "Everyone can view cars" ON cars
  FOR SELECT USING (true);

-- Create RLS policies for bookings
CREATE POLICY "Users can view their own bookings" ON bookings
  FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create bookings" ON bookings
  FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update their own bookings" ON bookings
  FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Create RLS policies for car_availability (public read)
CREATE POLICY "Everyone can view car availability" ON car_availability
  FOR SELECT USING (true);

-- Insert sample cars
INSERT INTO cars (model, brand, year, license_plate, color, transmission, fuel_type, seats, daily_rate, status, image_url) VALUES
('Civic', 'Honda', 2023, 'FX-001-AA', 'Black', 'Automatic', 'Petrol', 5, 45.00, 'available', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=400&fit=crop'),
('Corolla', 'Toyota', 2023, 'FX-002-AA', 'Silver', 'Automatic', 'Hybrid', 5, 50.00, 'available', 'https://images.unsplash.com/photo-1552519507-da3effff991c?w=500&h=400&fit=crop'),
('Accord', 'Honda', 2022, 'FX-003-AA', 'White', 'Automatic', 'Petrol', 5, 55.00, 'available', 'https://images.unsplash.com/photo-1606611013016-969b41f1ff7f?w=500&h=400&fit=crop'),
('Camry', 'Toyota', 2023, 'FX-004-AA', 'Blue', 'Automatic', 'Petrol', 5, 60.00, 'available', 'https://images.unsplash.com/photo-1609708536965-59ee35cfc584?w=500&h=400&fit=crop'),
('CR-V', 'Honda', 2023, 'FX-005-AA', 'Black', 'Automatic', 'Petrol', 5, 70.00, 'available', 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500&h=400&fit=crop'),
('RAV4', 'Toyota', 2022, 'FX-006-AA', 'Gray', 'Automatic', 'Hybrid', 5, 75.00, 'available', 'https://images.unsplash.com/photo-1605559424843-9e4c3ca7603f?w=500&h=400&fit=crop'),
('Altima', 'Nissan', 2023, 'FX-007-AA', 'Red', 'Automatic', 'Petrol', 5, 48.00, 'available', 'https://images.unsplash.com/photo-1580274455191-1c62238fa333?w=500&h=400&fit=crop'),
('Murano', 'Nissan', 2022, 'FX-008-AA', 'Pearl', 'Automatic', 'Petrol', 7, 80.00, 'available', 'https://images.unsplash.com/photo-1566023967268-70530c2c2a43?w=500&h=400&fit=crop');

-- Create indexes
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_car_id ON bookings(car_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_car_availability_car_id ON car_availability(car_id);
CREATE INDEX idx_car_availability_date ON car_availability(booking_date);
