-- Create cars table
CREATE TABLE IF NOT EXISTS public.cars (
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

-- Create index for license plate lookup
CREATE INDEX IF NOT EXISTS idx_cars_license_plate ON public.cars(license_plate);

-- Grant permissions
ALTER TABLE public.cars ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view cars
CREATE POLICY "Allow authenticated users to view cars"
  ON public.cars
  FOR SELECT
  USING (auth.role() = 'authenticated');
