'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/app/auth-context'
import { supabase } from '@/lib/supabase'
import type { Booking, Car } from '@/lib/supabase'

interface BookingWithCar extends Booking {
  cars?: Car
}

export default function DashboardPage() {
  const router = useRouter()
  const { user, loading: authLoading, signOut } = useAuth()
  const [bookings, setBookings] = useState<BookingWithCar[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return

      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('*, cars(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        setBookings(data || [])

        // Subscribe to real-time updates
        const subscription = supabase
          .channel(`bookings-${user.id}`)
          .on(
            'postgres_changes',
            { event: '*', schema: 'public', table: 'bookings', filter: `user_id=eq.${user.id}` },
            (payload) => {
              console.log('[v0] Booking update:', payload)
              // Refetch bookings on any change
              fetchBookings()
            }
          )
          .subscribe()

        return () => {
          subscription.unsubscribe()
        }
      } catch (error) {
        console.error('[v0] Error fetching bookings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [user])

  const handleLogout = async () => {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('[v0] Logout error:', error)
    }
  }

  if (authLoading || !user || loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-blue-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Fenix Car Hire
          </Link>
          <div className="flex gap-4 items-center">
            <span className="text-gray-600">{user.email}</span>
            <Link href="/cars" className="text-blue-600 font-semibold hover:text-blue-800 transition">
              Browse Cars
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">My Bookings</h1>
          <p className="text-gray-600">View and manage all your car rental reservations</p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center border border-blue-100">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">No Bookings Yet</h2>
            <p className="text-gray-600 mb-6">
              You haven't made any car rental bookings. Browse our available cars and make your first booking!
            </p>
            <Link
              href="/cars"
              className="inline-block bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition shadow-md"
            >
              Browse Available Cars
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition border border-blue-100">
                <div className="flex flex-col md:flex-row">
                  {/* Car Image */}
                  {booking.cars && (
                    <div className="md:w-48 h-48 flex-shrink-0">
                      <img
                        src={booking.cars.image_url}
                        alt={`${booking.cars.brand} ${booking.cars.model}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Booking Details */}
                  <div className="flex-1 p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        {booking.cars && (
                          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                            {booking.cars.brand} {booking.cars.model}
                          </h3>
                        )}
                        <p className="text-gray-600 text-sm">
                          License Plate: {booking.cars?.license_plate}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Status</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                          booking.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-gray-600 uppercase mb-1">Pickup</p>
                        <p className="font-semibold text-gray-800">{booking.pickup_date}</p>
                        <p className="text-sm text-gray-600">{booking.pickup_location}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 uppercase mb-1">Return</p>
                        <p className="font-semibold text-gray-800">{booking.return_date}</p>
                        <p className="text-sm text-gray-600">{booking.return_location}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 uppercase mb-1">Passenger</p>
                        <p className="font-semibold text-gray-800">{booking.passenger_name}</p>
                        <p className="text-sm text-gray-600">{booking.passenger_phone}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-600 uppercase mb-1">Total Cost</p>
                        <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                          E${booking.total_price}
                        </p>
                      </div>
                    </div>

                    <div className="border-t border-blue-200 pt-4 flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600">Payment Status</p>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-1 ${
                          booking.payment_status === 'paid' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {booking.payment_status.charAt(0).toUpperCase() + booking.payment_status.slice(1)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Booked on {new Date(booking.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
