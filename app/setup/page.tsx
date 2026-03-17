'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function SetupPage() {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSetupDatabase = async () => {
    setLoading(true)
    setMessage('')
    setError('')

    try {
      // The database setup needs to be done manually in Supabase SQL editor
      // This page provides instructions
      setMessage('Database setup instructions have been displayed. Please follow the steps below.')
    } catch (err) {
      setError('An error occurred. Please check the instructions and try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <nav className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Link href="/" className="text-2xl font-bold text-[#1a2e5e]">
            Fenix Car Hire
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-[#1a2e5e] mb-4">Database Setup</h1>
          <p className="text-gray-600 text-lg mb-8">
            Follow these steps to initialize your Fenix Car Hire database in Supabase.
          </p>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="border-l-4 border-blue-600 pl-6 py-4">
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">Step 1: Access Supabase SQL Editor</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Log in to your Supabase project</li>
                <li>Navigate to SQL Editor from the left sidebar</li>
                <li>Click "New Query" to create a new SQL query</li>
              </ol>
            </div>

            {/* Step 2 */}
            <div className="border-l-4 border-blue-600 pl-6 py-4">
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">Step 2: Run the Migration SQL</h2>
              <p className="text-gray-700 mb-3">Copy and paste the SQL below into the Supabase SQL Editor:</p>
              <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto font-mono text-sm mb-4">
                <pre>{`-- Create users table (extended profile data alongside auth)
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

-- RLS Policy: Users can only view their own bookings
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
ON CONFLICT DO NOTHING;`}</pre>
              </div>
              <p className="text-gray-700">Click "Run" to execute the SQL and create all tables.</p>
            </div>

            {/* Step 3 */}
            <div className="border-l-4 border-blue-600 pl-6 py-4">
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">Step 3: Verify the Setup</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Check the "Authentication" tab to verify RLS is enabled</li>
                <li>Check the "Table Editor" to see all three tables created (users, cars, bookings)</li>
                <li>Verify that 5 sample cars are visible in the cars table</li>
              </ol>
            </div>

            {/* Step 4 */}
            <div className="border-l-4 border-blue-600 pl-6 py-4">
              <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">Step 4: Start Using the App</h2>
              <ol className="list-decimal list-inside space-y-2 text-gray-700">
                <li>Return to the app and sign up for an account</li>
                <li>Browse available cars in the fleet</li>
                <li>Create a booking and see it in your dashboard</li>
              </ol>
            </div>
          </div>

          <div className="mt-8 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
            <p className="text-blue-900">
              <strong>Note:</strong> This setup only needs to be done once. After creating the tables, you can proceed to use the application normally.
            </p>
          </div>

          <div className="mt-8 flex gap-4">
            <Link
              href="/"
              className="flex-1 text-center bg-[#1a2e5e] text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-900"
            >
              Back to Home
            </Link>
            <Link
              href="/login"
              className="flex-1 text-center bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition shadow-md"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
