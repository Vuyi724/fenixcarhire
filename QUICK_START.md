# Quick Start Guide - Fenix Car Hire

Get the Fenix Car Hire application running in 5 minutes!

## Prerequisites
✅ Supabase project created
✅ Environment variables set in project settings
✅ Node.js installed locally

## Step 1: Create Database Tables (2 minutes)

1. Go to your **Supabase Dashboard**
2. Open **SQL Editor**
3. Click **New Query**
4. Copy this entire SQL block and paste it:

```sql
-- Create users table
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_car_id ON bookings(car_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_cars_status ON cars(status);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view all cars" ON cars FOR SELECT USING (true);
CREATE POLICY "Users can view own bookings" ON bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own bookings" ON bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bookings" ON bookings FOR UPDATE USING (auth.uid() = user_id);

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

5. Click **Run** (or press Ctrl+Enter)
6. ✅ Wait for success message

## Step 2: Run the Application (1 minute)

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

The app will open at `http://localhost:3000`

## Step 3: Test It Out (2 minutes)

1. **Homepage** - Click "Book Now" or "Sign Up"
2. **Sign Up** - Create a test account with any email
3. **Browse Cars** - Click "Browse Cars" to see 5 sample vehicles
4. **Make a Booking** - Pick any car and complete a test booking
5. **Dashboard** - View your booking in the dashboard

## Key Features

🚗 **Browse Cars** - View fleet with images and pricing
📅 **Date Filtering** - Check availability for specific dates
💳 **Booking System** - Complete rental reservations
📊 **Dashboard** - Manage your bookings
🔒 **Secure Auth** - User accounts and data privacy
✨ **Animations** - Smooth image animations on homepage

## Common Issues & Fixes

**"Table does not exist"**
- Make sure SQL ran successfully
- Check SQL Editor for errors
- Try running the SQL again

**No cars showing**
- Go to Supabase → Table Editor → cars
- Verify 5 cars are there
- If empty, run the INSERT statement again

**Can't login**
- Make sure you signed up first
- Check that email/password match
- Try creating a new account

**Payment not working**
- It's a demo - use card: 4242 4242 4242 4242

## File Organization

```
Key Files:
- app/page.tsx              ← Homepage
- app/cars/page.tsx         ← Car listing
- app/booking/[id]/page.tsx ← Booking form
- app/dashboard/page.tsx    ← Your bookings
- DATABASE_SETUP.md         ← Full setup guide
```

## What's Included

✅ User authentication with Supabase
✅ Car inventory management
✅ Booking system with date filtering
✅ User dashboard with real-time updates
✅ Row Level Security for data protection
✅ Beautiful responsive UI
✅ Image animations
✅ API endpoints for cars and bookings

## Next Steps

1. **Deploy** - Push to GitHub and deploy on Vercel
2. **Payments** - Add Stripe integration
3. **Email** - Set up booking confirmations
4. **Admin** - Create admin dashboard for fleet management
5. **Images** - Replace sample images with real ones

## Get Help

- Full setup: Read `DATABASE_SETUP.md`
- Implementation details: Read `IMPLEMENTATION_SUMMARY.md`
- Supabase docs: https://supabase.com/docs

## Ready? Let's Go! 🚀

```bash
npm run dev
```

Then visit: **http://localhost:3000**

---

**Time to full setup**: ⏱️ ~5 minutes
**Status**: ✅ Ready to use
