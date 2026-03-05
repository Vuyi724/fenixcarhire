import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pickupDate = searchParams.get('pickup_date')
    const returnDate = searchParams.get('return_date')

    // Get all cars
    const { data: cars, error } = await supabase
      .from('cars')
      .select('*')
      .order('brand', { ascending: true })

    if (error) {
      console.error('[v0] Error fetching cars:', error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (!cars || cars.length === 0) {
      return NextResponse.json({ data: [] })
    }

    // If dates provided, filter available cars based on bookings
    if (pickupDate && returnDate) {
      // Check for conflicting bookings
      const { data: bookings } = await supabase
        .from('bookings')
        .select('car_id')
        .gte('return_date', pickupDate)
        .lte('pickup_date', returnDate)
        .in('status', ['confirmed', 'pending'])

      const bookedCarIds = bookings?.map(b => b.car_id) || []
      const availableCars = cars.filter(car => !bookedCarIds.includes(car.id))

      console.log('[v0] Found', availableCars.length, 'available cars for dates', pickupDate, 'to', returnDate)
      return NextResponse.json({ data: availableCars })
    }

    console.log('[v0] Returning all', cars.length, 'cars')
    return NextResponse.json({ data: cars })
  } catch (error) {
    console.error('[v0] Error in GET /api/cars:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cars' },
      { status: 500 }
    )
  }
}
