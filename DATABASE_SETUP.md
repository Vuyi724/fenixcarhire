# Fenix Car Hire - Database Setup Guide

This document outlines how to set up the Supabase database for the Fenix Car Hire application.

## Prerequisites

- Supabase project already created and connected
- Environment variables configured in `.env.local`:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`

## Setup Instructions

### Step 1: Access Supabase SQL Editor

1. Log in to your [Supabase dashboard](https://supabase.com)
2. Select your project
3. Navigate to the **SQL Editor** from the left sidebar
4. Click **New Query** to create a new SQL query

### Step 2: Run the Migration SQL

Copy and paste the entire SQL script below into the SQL editor and click **Run**.

The script will:
- Create the `users` table for user profiles
- Create the `cars` table for vehicle inventory
- Create the `bookings` table for rental reservations
- Set up Row Level Security (RLS) policies
- Insert 5 sample vehicles

```sql
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
ON CONFLICT DO NOTHING;
```

### Step 3: Verify the Setup

After running the SQL, verify everything is set up correctly:

1. **Check Tables**: Go to **Table Editor** and confirm you see three new tables:
   - `users`
   - `cars`
   - `bookings`

2. **Check Sample Data**: Click on the `cars` table and verify 5 vehicles are present

3. **Check RLS**: Go to **Authentication** → **Policies** and verify the policies are created

### Step 4: Test the Application

1. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. Navigate to `http://localhost:3000`

3. Sign up for a new account

4. Browse available cars at `/cars`

5. Create a booking by clicking "Book" on a vehicle

6. View your bookings at `/dashboard`

## Database Schema

### Users Table
Stores user profile information linked to Supabase Auth.
- `id` - UUID, references auth.users
- `email` - User's email address
- `full_name` - User's full name
- `phone` - User's phone number
- `created_at` / `updated_at` - Timestamps

### Cars Table
Inventory of vehicles available for rental.
- `id` - UUID, primary key
- `brand` / `model` / `year` - Vehicle details
- `license_plate` - Unique license plate
- `color` - Vehicle color
- `transmission` / `fuel_type` - Technical specs
- `seats` - Number of seats
- `daily_rate` - Rental price per day
- `image_url` - Vehicle image URL
- `status` - Availability status (available, rented, maintenance)
- `created_at` / `updated_at` - Timestamps

### Bookings Table
Records of car rental reservations.
- `id` - UUID, primary key
- `user_id` - Foreign key to users
- `car_id` - Foreign key to cars
- `pickup_date` / `return_date` - Rental period
- `pickup_location` / `return_location` - Locations
- `passenger_name` / `passenger_email` / `passenger_phone` - Renter info
- `total_price` - Booking cost
- `status` - Booking status (pending, confirmed, cancelled, completed)
- `payment_status` - Payment status (pending, paid, refunded)
- `created_at` / `updated_at` - Timestamps

## Row Level Security (RLS)

The application uses RLS to ensure data security:

- **Users**: Can only view and update their own profile
- **Cars**: All authenticated users can view cars
- **Bookings**: Users can only see, create, and update their own bookings

## API Endpoints

### GET `/api/cars`
Fetch available cars with optional date filtering.
- Query params: `pickup_date`, `return_date`
- Returns: Array of car objects

### GET `/api/bookings`
Fetch user's bookings (requires authentication).
- Headers: `Authorization: Bearer <token>`
- Returns: Array of booking objects with car details

### POST `/api/bookings`
Create a new booking (requires authentication).
- Headers: `Authorization: Bearer <token>`
- Body: Booking details
- Returns: Created booking object

### POST `/api/users/create-profile`
Create user profile after signup.
- Body: `{ userId, email, fullName }`
- Returns: Success confirmation

## Troubleshooting

**Error: "Table does not exist"**
- Run the SQL migration script again
- Check that all tables appear in Table Editor

**Error: "RLS policy violation"**
- Ensure you're logged in with the correct user
- Check that RLS policies are correctly set up

**No cars showing**
- Verify the 5 sample cars were inserted
- Check the cars table in Table Editor

**Bookings not saving**
- Ensure the users table has your profile
- Check that RLS policies are enabled

## Support

For issues or questions, contact the development team or check the Supabase documentation at https://supabase.com/docs
