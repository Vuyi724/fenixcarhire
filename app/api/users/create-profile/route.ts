import { createClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { userId, email, fullName } = await request.json()

    if (!userId || !email) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return Response.json(
        { error: 'Missing Supabase credentials' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Create user profile in public users table
    const { error } = await supabase
      .from('users')
      .insert({
        id: userId,
        email,
        full_name: fullName || '',
      })
      .select()

    if (error && error.code !== '23505') { // 23505 = unique violation (already exists)
      console.error('Error creating user profile:', error)
      return Response.json(
        { error: 'Failed to create user profile' },
        { status: 500 }
      )
    }

    return Response.json(
      { success: true, message: 'User profile created' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
