import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')

    let query = supabase
      .from('payments')
      .select('*, invoices(id, invoice_number), bookings(id, vehicle_type)')
      .order('created_at', { ascending: false })

    if (status) {
      query = query.eq('status', status)
    }

    const { data, error } = await query

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching payments:', error)
    return NextResponse.json(
      { error: 'Failed to fetch payments' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { invoice_id, booking_id, amount, payment_method, transaction_id } = body

    const { data, error } = await supabase
      .from('payments')
      .insert({
        invoice_id,
        booking_id,
        amount,
        payment_method,
        transaction_id,
        status: 'completed',
        payment_date: new Date().toISOString(),
      })
      .select()

    if (error) throw error

    // Update invoice status if fully paid
    if (invoice_id) {
      const { data: invoiceData } = await supabase
        .from('invoices')
        .select('amount')
        .eq('id', invoice_id)
        .single()

      if (invoiceData && invoiceData.amount === amount) {
        await supabase
          .from('invoices')
          .update({ status: 'paid' })
          .eq('id', invoice_id)
      }
    }

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    console.error('Error creating payment:', error)
    return NextResponse.json(
      { error: 'Failed to create payment' },
      { status: 500 }
    )
  }
}
