-- Add is_admin column to users table
ALTER TABLE users ADD COLUMN is_admin BOOLEAN DEFAULT false;

-- Create Invoices table
CREATE TABLE invoices (
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

CREATE INDEX idx_invoices_booking_id ON invoices(booking_id);
CREATE INDEX idx_invoices_status ON invoices(status);

-- Create Quotations table
CREATE TABLE quotations (
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

CREATE INDEX idx_quotations_customer_id ON quotations(customer_id);
CREATE INDEX idx_quotations_status ON quotations(status);

-- Create Payments table
CREATE TABLE payments (
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

CREATE INDEX idx_payments_invoice_id ON payments(invoice_id);
CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_payments_status ON payments(status);

-- Create Check Sheets table
CREATE TABLE check_sheets (
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

CREATE INDEX idx_check_sheets_booking_id ON check_sheets(booking_id);
CREATE INDEX idx_check_sheets_type ON check_sheets(check_type);

-- Enable RLS for new tables
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotations ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_sheets ENABLE ROW LEVEL SECURITY;

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
