import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const checkType = searchParams.get('check_type')

    let query = supabase
      .from('check_sheets')
      .select('*, bookings(id, vehicle_type), users(id, email)')
      .order('created_at', { ascending: false })

    if (checkType) {
      query = query.eq('check_type', checkType)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching check sheets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch check sheets' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      booking_id,
      check_type,
      car_condition,
      fuel_level,
      mileage,
      damage_report,
      checked_by,
    } = body

    const { data, error } = await supabase
      .from('check_sheets')
      .insert({
        booking_id,
        check_type,
        car_condition,
        fuel_level,
        mileage,
        damage_report,
        checked_by,
        checked_date: new Date().toISOString(),
        photos_urls: [],
      })
      .select()

    if (error) throw error

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error('Error creating check sheet:', error)
    return NextResponse.json(
      { error: 'Failed to create check sheet' },
      { status: 500 }
    )
  }
}
