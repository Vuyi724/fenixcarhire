import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    let query = supabase
      .from('quotations')
      .select('*, users(id, email)')
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching quotations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quotations' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customer_id, vehicle_type, rental_days, estimated_cost } = body

    // Generate quote number
    const { count } = await supabase
      .from('quotations')
      .select('*', { count: 'exact', head: true })

    const quoteNumber = `QT-${new Date().getFullYear()}-${(count || 0) + 1}`
    const validUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now

    const { data, error } = await supabase
      .from('quotations')
      .insert({
        customer_id,
        quote_number: quoteNumber,
        vehicle_type,
        rental_days,
        estimated_cost,
        valid_until: validUntil.toISOString(),
        status: 'pending',
      })
      .select()

    if (error) throw error

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error('Error creating quotation:', error)
    return NextResponse.json(
      { error: 'Failed to create quotation' },
      { status: 500 }
    )
  }
}
