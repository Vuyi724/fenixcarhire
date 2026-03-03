'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/app/auth-context'
import { supabase } from '@/lib/supabase'
import type { Car } from '@/lib/supabase'

export default function CarsPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [cars, setCars] = useState<Car[]>([])
  const [loading, setLoading] = useState(true)
  const [pickupDate, setPickupDate] = useState('')
  const [returnDate, setReturnDate] = useState('')

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    fetchCars()
    
    // Subscribe to real-time updates
    const subscription = supabase
      .channel('cars-updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'cars' },
        (payload) => {
          console.log('[v0] Car update received:', payload)
          fetchCars()
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [pickupDate, returnDate])

  const fetchCars = async () => {
    setLoading(true)
    try {
      let url = '/api/cars'
      if (pickupDate && returnDate) {
        url += `?pickup_date=${pickupDate}&return_date=${returnDate}`
      }

      const response = await fetch(url)
      const { data } = await response.json()
      setCars(data || [])
    } catch (error) {
      console.error('[v0] Error fetching cars:', error)
    } finally {
      setLoading(false)
    }
  }

  if (authLoading || !user) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-[#1a2e5e]">
            Fenix Car Hire
          </Link>
          <div className="flex gap-4 items-center">
            <span className="text-gray-600">{user.email}</span>
            <Link href="/dashboard" className="text-[#ff7f00] font-semibold hover:underline">
              My Bookings
            </Link>
            <button
              onClick={() => {
                supabase.auth.signOut()
                router.push('/')
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Filters */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-bold text-[#1a2e5e] mb-6">Available Cars</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pickup Date
              </label>
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Return Date
              </label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchCars}
                className="w-full bg-[#ff7f00] text-white py-2 rounded-lg font-semibold hover:bg-orange-600"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cars Grid */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        {loading ? (
          <p className="text-center text-gray-600">Loading cars...</p>
        ) : cars.length === 0 ? (
          <p className="text-center text-gray-600">No cars available for selected dates</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.map((car) => (
              <div key={car.id} className="bg-white rounded-lg shadow-md hover:shadow-lg overflow-hidden">
                <img
                  src={car.image_url}
                  alt={`${car.brand} ${car.model}`}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-[#1a2e5e] mb-2">
                    {car.brand} {car.model}
                  </h3>
                  <div className="space-y-2 text-gray-600 mb-4 text-sm">
                    <p>Year: {car.year}</p>
                    <p>Seats: {car.seats}</p>
                    <p>Transmission: {car.transmission}</p>
                    <p>Fuel: {car.fuel_type}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-2xl font-bold text-[#ff7f00]">
                      E${car.daily_rate}/day
                    </div>
                    <Link
                      href={`/booking/${car.id}`}
                      className="bg-[#ff7f00] text-white px-4 py-2 rounded-lg font-semibold hover:bg-orange-600"
                    >
                      Book Now
                    </Link>
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
