-- Drop existing objects to avoid conflicts
DROP TABLE IF EXISTS check_sheets CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS quotations CASCADE;
DROP TABLE IF EXISTS invoices CASCADE;
DROP TABLE IF EXISTS car_availability CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS cars CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table (extended profile data alongside auth)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  is_admin BOOLEAN DEFAULT false,
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

-- Create car_availability table
CREATE TABLE IF NOT EXISTS car_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  available_count INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(car_id, booking_date)
);

-- Create Invoices table
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

-- Create Quotations table
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

-- Create Payments table
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

-- Create Check Sheets table
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

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_car_id ON bookings(car_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_cars_status ON cars(status);
CREATE INDEX IF NOT EXISTS idx_car_availability_car_id ON car_availability(car_id);
CREATE INDEX IF NOT EXISTS idx_car_availability_date ON car_availability(booking_date);
CREATE INDEX IF NOT EXISTS idx_invoices_booking_id ON invoices(booking_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_quotations_customer_id ON quotations(customer_id);
CREATE INDEX IF NOT EXISTS idx_quotations_status ON quotations(status);
CREATE INDEX IF NOT EXISTS idx_payments_invoice_id ON payments(invoice_id);
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_check_sheets_booking_id ON check_sheets(booking_id);
CREATE INDEX IF NOT EXISTS idx_check_sheets_type ON check_sheets(check_type);

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_sheets ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
DROP POLICY IF EXISTS "Users can update their own profile" ON users;
DROP POLICY IF EXISTS "Users can view all cars" ON cars;
DROP POLICY IF EXISTS "Users can only view their own bookings" ON bookings;
DROP POLICY IF EXISTS "Users can only create bookings for themselves" ON bookings;
DROP POLICY IF EXISTS "Users can only update their own bookings" ON bookings;
DROP POLICY IF EXISTS "Everyone can view car availability" ON car_availability;
DROP POLICY IF EXISTS "admins_view_all_invoices" ON invoices;
DROP POLICY IF EXISTS "users_view_their_invoices" ON invoices;
DROP POLICY IF EXISTS "admins_manage_quotations" ON quotations;
DROP POLICY IF EXISTS "users_view_their_quotations" ON quotations;
DROP POLICY IF EXISTS "admins_manage_payments" ON payments;
DROP POLICY IF EXISTS "users_view_their_payments" ON payments;
DROP POLICY IF EXISTS "admins_manage_check_sheets" ON check_sheets;
DROP POLICY IF EXISTS "users_view_their_check_sheets" ON check_sheets;

-- RLS Policy: Users can only view their own profile
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- RLS Policy: Users can view all cars (no filtering needed)
CREATE POLICY "Users can view all cars" ON cars
  FOR SELECT USING (true);

-- RLS Policy: Car Availability
CREATE POLICY "Everyone can view car availability" ON car_availability
  FOR SELECT USING (true);

-- RLS Policy: Bookings
CREATE POLICY "Users can only view their own bookings" ON bookings
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can only create bookings for themselves" ON bookings
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can only update their own bookings" ON bookings
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies for invoices - admins can view all, users can view their own
CREATE POLICY "admins_view_all_invoices" ON invoices
  FOR SELECT USING (auth.uid() IN (SELECT id FROM users WHERE is_admin = true));

CREATE POLICY "users_view_their_invoices" ON invoices
  FOR SELECT USING (
    booking_id IN (SELECT id FROM bookings WHERE user_id = auth.uid())
  );

-- RLS Policies for quotations - admins can manage all, users can view their own
CREATE POLICY "admins_manage_quotations" ON quotations
  FOR ALL USING (auth.uid() IN (SELECT id FROM users WHERE is_admin = true));

CREATE POLICY "users_view_their_quotations" ON quotations
  FOR SELECT USING (customer_id = auth.uid());

-- RLS Policies for payments - admins can manage all, users can view their own
CREATE POLICY "admins_manage_payments" ON payments
  FOR ALL USING (auth.uid() IN (SELECT id FROM users WHERE is_admin = true));

CREATE POLICY "users_view_their_payments" ON payments
  FOR SELECT USING (
    booking_id IN (SELECT id FROM bookings WHERE user_id = auth.uid())
  );

-- RLS Policies for check sheets - admins can manage all, users can view their own
CREATE POLICY "admins_manage_check_sheets" ON check_sheets
  FOR ALL USING (auth.uid() IN (SELECT id FROM users WHERE is_admin = true));

CREATE POLICY "users_view_their_check_sheets" ON check_sheets
  FOR SELECT USING (
    booking_id IN (SELECT id FROM bookings WHERE user_id = auth.uid())
  );

-- Insert sample cars if none exist
INSERT INTO cars (brand, model, year, license_plate, color, transmission, fuel_type, seats, daily_rate, image_url, status)
VALUES
  ('Toyota', 'Corolla', 2023, 'ABC123', 'Silver', 'Automatic', 'Petrol', 5, 45.00, 'https://images.unsplash.com/photo-1552519507-da3effff991c?w=500&h=400&fit=crop', 'available'),
  ('Honda', 'Civic', 2023, 'XYZ789', 'Black', 'Automatic', 'Petrol', 5, 50.00, 'https://images.unsplash.com/photo-1606611013016-969b41f1ff7f?w=500&h=400&fit=crop', 'available'),
  ('Toyota', 'Highlander', 2022, 'DEF456', 'White', 'Automatic', 'Petrol', 7, 65.00, 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=500&h=400&fit=crop', 'available'),
  ('BMW', 'X5', 2023, 'GHI789', 'Blue', 'Automatic', 'Petrol', 7, 90.00, 'https://images.unsplash.com/photo-1609708536965-59ee35cfc584?w=500&h=400&fit=crop', 'available'),
  ('Mercedes', 'C-Class', 2023, 'JKL012', 'Gray', 'Automatic', 'Petrol', 5, 75.00, 'https://images.unsplash.com/photo-1605559424843-9e4c3ca7603f?w=500&h=400&fit=crop', 'available')
ON CONFLICT DO NOTHING;
