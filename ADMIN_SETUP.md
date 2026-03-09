# Admin Dashboard Setup Guide

## Overview

A comprehensive admin portal has been created for Fenix Car Hire to manage:
- Customer data
- Invoices
- Quotations
- Payments
- Check sheets (pre/post rental inspections)
- Financial reports and analytics

## Database Setup

The admin features require new database tables. Follow these steps:

### Step 1: Execute Migration in Supabase

1. Go to your Supabase Dashboard
2. Navigate to the SQL Editor
3. Create a new query and copy the contents from `/scripts/02-admin-tables.sql`
4. Execute the query

The migration will create:
- `invoices` table
- `quotations` table
- `payments` table
- `check_sheets` table
- `is_admin` column on `users` table
- Row Level Security (RLS) policies for all tables

### Step 2: Set Up Admin User

To make a user an admin, call the setup API endpoint:

```bash
curl -X POST http://localhost:3000/api/admin/setup \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@fenixcarhire.co.sz"}'
```

Or do this through the Supabase dashboard:
1. Go to the `users` table
2. Find your admin user
3. Set `is_admin` to `true`

## Accessing the Admin Dashboard

1. **Login as Admin**
   - Use the login page at `/login`
   - Enter admin email and password

2. **Access Admin Panel**
   - Navigate to `/admin`
   - You'll see the admin dashboard if you're an admin user
   - Non-admin users will be redirected to the home page

## Admin Features

### Dashboard (`/admin`)
- Overview statistics
- Customer count
- Booking count
- Invoice and payment tracking
- Quick action buttons

### Customers (`/admin/customers`)
- View all customers
- Search and filter customers
- Customer registration dates
- Contact information

### Invoices (`/admin/invoices`)
- Create new invoices
- Link invoices to bookings
- Track invoice status (draft, issued, paid, overdue, cancelled)
- View payment dates
- Auto-generated invoice numbers

### Quotations (`/admin/quotations`)
- Create customer quotations
- Specify vehicle type and rental duration
- Track quotation status (pending, accepted, rejected, expired)
- 30-day validity period by default

### Payments (`/admin/payments`)
- Record customer payments
- Multiple payment methods: cash, card, bank transfer, mobile money
- Track payment status (pending, completed, failed, refunded)
- Link payments to invoices and bookings
- Automatic invoice status updates when fully paid

### Check Sheets (`/admin/checksheets`)
- Pre-rental inspections
- Post-rental condition reports
- Document:
  - Fuel level
  - Mileage
  - Car condition
  - Damage reports
  - Photos (ready for integration)

### Reports (`/admin/reports`)
- Financial analytics
- Revenue tracking
- Outstanding payments
- Collection rate calculations
- Business metrics

## API Endpoints

All admin data operations use these API routes:

### Invoices
- `GET /api/invoices` - List all invoices
- `GET /api/invoices?status=issued` - Filter by status
- `POST /api/invoices` - Create new invoice

### Payments
- `GET /api/payments` - List all payments
- `POST /api/payments` - Record new payment

### Quotations
- `GET /api/quotations` - List all quotations
- `POST /api/quotations` - Create new quotation

### Check Sheets
- `GET /api/checksheets` - List all check sheets
- `POST /api/checksheets` - Create new check sheet

## Security

- Only users with `is_admin = true` can access admin pages
- Automatic redirection to home page for non-admin users
- Row Level Security (RLS) policies enforce database-level access control
- Admins can view all customer data
- Regular users can only view their own bookings and related documents

## Data Relationships

```
invoices → bookings → users
quotations → users
payments → invoices & bookings
check_sheets → bookings & users
```

## Next Steps

1. **Set up your first admin user** (see Step 2 above)
2. **Import existing customer data** if needed
3. **Create invoices and quotations** for pending bookings
4. **Record payments** as customers pay
5. **Run pre/post rental inspections** using check sheets
6. **Monitor reports** for financial insights

## Troubleshooting

### Can't access admin panel
- Verify you're logged in with an admin account
- Check that `is_admin = true` in the database
- Check browser console for error messages

### Forms not submitting
- Ensure all required fields are filled
- Check that database tables were created successfully
- Verify Supabase environment variables are set correctly

### Missing data
- Check that RLS policies are correctly applied
- Verify Supabase schema matches the migration
- Check admin user has proper permissions

## Future Enhancements

- PDF generation for invoices and quotations
- Email notifications for overdue payments
- SMS alerts
- Advanced filtering and sorting
- Bulk operations
- Custom report builder
- Audit logs
- Dashboard widgets customization
