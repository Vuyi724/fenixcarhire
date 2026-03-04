# Fenix Car Hire - Deployment Guide

## Features Built

✅ **Real-time Live Cars Listing** - Browse available cars with real-time updates via Supabase subscriptions
✅ **User Authentication** - Sign up and sign in with Supabase Auth
✅ **Advanced Booking System** - Complete booking flow with date selection and passenger details
✅ **Mock Payment Integration** - Demo payment processing (ready for Stripe integration)
✅ **User Dashboard** - View all bookings and rental history
✅ **Row-Level Security (RLS)** - Secure database access with Supabase policies
✅ **Responsive Design** - Mobile-friendly interface

## Prerequisites

- Supabase project connected (already configured via v0)
- Vercel account for deployment

## Database Setup

The database schema has been created with the following tables:
- `users` - User accounts
- `cars` - Vehicle inventory
- `bookings` - Rental reservations
- `car_availability` - Real-time availability tracking

RLS policies ensure users can only view/modify their own data.

### Initialize Database

If not already initialized, run the migration:

```bash
npm run init-db
```

Or use Supabase SQL editor to run the SQL from `scripts/001-init-schema.sql`

## Environment Variables

All required environment variables are automatically configured through Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`

## Deployment to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Add online booking system with payments"
   git push origin online-deployment
   ```

2. **Deploy on Vercel**
   - Go to https://vercel.com/dashboard
   - Click "Add New" > "Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js
   - Click "Deploy"

3. **Environment Variables in Vercel**
   - Vercel Dashboard → Project Settings → Environment Variables
   - Add all Supabase environment variables
   - Redeploy after adding variables

## Usage

### User Flows

**For Customers:**
1. Visit homepage
2. Click "Book Now" or "Sign Up"
3. Create account or login
4. Browse available cars (filtered by dates)
5. Select a car and fill booking details
6. Complete mock payment
7. View confirmation and booking in dashboard

**For Testing:**
- Test Account: demo@test.com / password123
- Mock Card: 4242 4242 4242 4242 | 12/26 | 123

## Real-time Features

- **Live Car Updates**: When a car is booked, availability updates in real-time for all users
- **Booking Confirmations**: Instant booking confirmation with email notification
- **Dashboard Updates**: Real-time dashboard updates when new bookings are made

## Payment Integration

Currently using mock/demo payments. To upgrade to real payments:

1. **Stripe Integration**
   - Add `@stripe/stripe-js` and `stripe` packages
   - Update `/app/api/bookings/route.ts` to create Stripe payment intents
   - Replace mock payment UI with Stripe Checkout

2. **Add Stripe Keys**
   - Get Stripe keys from dashboard.stripe.com
   - Add to Vercel environment variables:
     - `STRIPE_PUBLIC_KEY`
     - `STRIPE_SECRET_KEY`
     - `STRIPE_WEBHOOK_SECRET`

## Scaling Considerations

- **Database Backups**: Enable automated backups in Supabase
- **Auth**: Consider adding email verification
- **Rate Limiting**: Add rate limiting on booking API
- **Images**: Move car images to Vercel Blob for better performance
- **Notifications**: Integrate email service for booking confirmations

## Support

- **Supabase Issues**: Check Supabase status page
- **Vercel Issues**: Check Vercel status page
- **Local Testing**: Run `npm run dev` for local development

---

**Built with Next.js 16, Supabase, and Tailwind CSS**
