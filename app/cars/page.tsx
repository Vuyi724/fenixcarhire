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
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
        <p className="text-gray-600">Loading...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Fenix Car Hire
          </Link>
          <div className="flex gap-4 items-center">
            <span className="text-sm text-gray-600">{user.email}</span>
            <Link href="/dashboard" className="text-blue-600 font-semibold hover:text-blue-800 transition">
              My Bookings
            </Link>
            <button
              onClick={() => {
                supabase.auth.signOut()
                router.push('/')
              }}
              className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-blue-800 transition shadow-md"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Background */}
      <div 
        className="relative py-12 bg-cover bg-center overflow-hidden"
        style={{
          backgroundImage: 'url(/images/car-bg.jpg)',
          backgroundColor: '#1e3a5f'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/70 via-blue-800/60 to-gray-900/50" />
        <div className="relative max-w-7xl mx-auto px-6">
          <h1 className="text-5xl font-bold text-white mb-2 text-balance">Premium Car Selection</h1>
          <p className="text-blue-100 text-lg">Choose from our latest fleet of luxury and reliable vehicles</p>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white border-b border-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Pickup Date
              </label>
              <input
                type="date"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Return Date
              </label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            <div className="flex items-end md:col-span-2">
              <button
                onClick={fetchCars}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-2.5 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition shadow-md"
              >
                Search Available Cars
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cars Grid */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        {loading ? (
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-gray-600 mt-4">Loading available cars...</p>
          </div>
        ) : cars.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No cars available for selected dates. Please try different dates.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.map((car) => (
              <div 
                key={car.id} 
                className="group bg-white rounded-xl shadow-md hover:shadow-xl overflow-hidden transition-all duration-300 transform hover:-translate-y-1"
              >
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                  <img
                    src={car.image_url}
                    alt={`${car.brand} ${car.model}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Available
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {car.brand} <span className="text-blue-600">{car.model}</span>
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">{car.year}</p>

                  {/* Specs Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 font-semibold">SEATS</p>
                      <p className="text-lg font-bold text-gray-900">{car.seats}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs text-gray-600 font-semibold">TRANSMISSION</p>
                      <p className="text-sm font-bold text-gray-900">{car.transmission}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 col-span-2">
                      <p className="text-xs text-gray-600 font-semibold">FUEL TYPE</p>
                      <p className="text-sm font-bold text-gray-900">{car.fuel_type}</p>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Daily Rate</p>
                      <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">
                        E${car.daily_rate}
                      </p>
                    </div>
                    <Link
                      href={`/booking/${car.id}`}
                      className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-5 py-2.5 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition shadow-md"
                    >
                      Book
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
