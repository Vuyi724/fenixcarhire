import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const pickupDate = searchParams.get('pickup_date')
    const returnDate = searchParams.get('return_date')

    let query = supabase.from('cars').select('*')

    // If dates provided, filter available cars
    if (pickupDate && returnDate) {
      // Get cars that don't have conflicting bookings
      const { data: cars } = await query.eq('status', 'available')

      if (!cars) {
        return NextResponse.json({ data: [] })
      }

      // Check availability for each car
      const { data: bookings } = await supabase
        .from('bookings')
        .select('car_id')
        .gte('return_date', pickupDate)
        .lte('pickup_date', returnDate)
        .in('status', ['confirmed', 'pending'])

      const bookedCarIds = bookings?.map(b => b.car_id) || []
      const availableCars = cars.filter(car => !bookedCarIds.includes(car.id))

      return NextResponse.json({ data: availableCars })
    }

    const { data, error } = await query.eq('status', 'available')

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch cars' },
      { status: 500 }
    )
  }
}
