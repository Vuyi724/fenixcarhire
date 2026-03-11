'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/app/auth-context'
import { supabase } from '@/lib/supabase'
import type { Car } from '@/lib/supabase'

export default function BookingPage() {
  const router = useRouter()
  const params = useParams()
  const carId = params.id as string
  const { user, loading: authLoading } = useAuth()
  
  const [car, setCar] = useState<Car | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [paymentStep, setPaymentStep] = useState<'details' | 'payment' | 'confirmation'>('details')
  
  const [formData, setFormData] = useState({
    passengerName: '',
    passengerEmail: '',
    passengerPhone: '',
    pickupDate: '',
    returnDate: '',
    pickupLocation: '',
    returnLocation: '',
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  useEffect(() => {
    const fetchCar = async () => {
      try {
        const { data, error } = await supabase
          .from('cars')
          .select('*')
          .eq('id', carId)
          .single()

        if (error) throw error
        setCar(data)
      } catch (error) {
        console.error('[v0] Error fetching car:', error)
      } finally {
        setLoading(false)
      }
    }

    if (carId) {
      fetchCar()
    }
  }, [carId])

  const calculateDays = () => {
    if (!formData.pickupDate || !formData.returnDate) return 0
    const pickup = new Date(formData.pickupDate)
    const returnDate = new Date(formData.returnDate)
    return Math.ceil((returnDate.getTime() - pickup.getTime()) / (1000 * 60 * 60 * 24))
  }

  const calculateTotal = () => {
    if (!car) return 0
    return calculateDays() * car.daily_rate
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePaymentClick = () => {
    if (!formData.passengerName || !formData.passengerEmail || !formData.passengerPhone || 
        !formData.pickupDate || !formData.returnDate || !formData.pickupLocation || !formData.returnLocation) {
      alert('Please fill in all details')
      return
    }
    setPaymentStep('payment')
  }

  const handleMockPayment = async () => {
    setPaymentStep('confirmation')
    
    // Simulate payment processing
    setSubmitting(true)
    try {
      // Simulate payment delay
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Create booking in database
      const { data, error } = await supabase
        .from('bookings')
        .insert([
          {
            user_id: user?.id,
            car_id: carId,
            pickup_date: formData.pickupDate,
            return_date: formData.returnDate,
            pickup_location: formData.pickupLocation,
            return_location: formData.returnLocation,
            passenger_name: formData.passengerName,
            passenger_email: formData.passengerEmail,
            passenger_phone: formData.passengerPhone,
            total_price: calculateTotal(),
            status: 'confirmed',
            payment_status: 'paid',
          },
        ])
        .select()

      if (error) throw error

      console.log('[v0] Booking created:', data)
      setPaymentStep('confirmation')
    } catch (error) {
      console.error('[v0] Booking error:', error)
      alert('Failed to create booking')
      setPaymentStep('payment')
    } finally {
      setSubmitting(false)
    }
  }

  if (authLoading || !user || loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </main>
    )
  }

  if (!car) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <p>Car not found</p>
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
            <Link href="/cars" className="text-blue-600 font-semibold hover:text-blue-800 transition">
              ← Back to Cars
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Car Details */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-6 border-t-4 border-blue-600">
              <img
                src={car.image_url}
                alt={`${car.brand} ${car.model}`}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {car.brand} <span className="text-blue-600">{car.model}</span>
                </h2>
                <div className="space-y-2 text-gray-600 mb-6 text-sm">
                  <p>Year: {car.year}</p>
                  <p>Seats: {car.seats}</p>
                  <p>Transmission: {car.transmission}</p>
                  <p>Fuel: {car.fuel_type}</p>
                  <p>License: {car.license_plate}</p>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-gray-50 p-4 rounded-lg border border-blue-100">
                  <p className="text-gray-600 text-sm mb-2">Daily Rate</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent mb-4">
                    E${car.daily_rate}
                  </p>
                  
                  {calculateDays() > 0 && (
                    <>
                      <div className="border-t border-gray-200 pt-4">
                        <p className="text-gray-600 text-sm">Duration: {calculateDays()} days</p>
                        <p className="text-2xl font-bold text-gray-900 mt-2">
                          Total: E${calculateTotal()}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-8 border-t-4 border-gray-400">
              {paymentStep === 'details' && (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking Details</h2>
                  
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="passengerName"
                          value={formData.passengerName}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="passengerEmail"
                          value={formData.passengerEmail}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          name="passengerPhone"
                          value={formData.passengerPhone}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Rental Details</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Pickup Date *
                          </label>
                          <input
                            type="date"
                            name="pickupDate"
                            value={formData.pickupDate}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Return Date *
                          </label>
                          <input
                            type="date"
                            name="returnDate"
                            value={formData.returnDate}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            required
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Pickup Location *
                          </label>
                          <input
                            type="text"
                            name="pickupLocation"
                            value={formData.pickupLocation}
                            onChange={handleInputChange}
                            placeholder="e.g., Airport, Hotel"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Return Location *
                          </label>
                          <input
                            type="text"
                            name="returnLocation"
                            value={formData.returnLocation}
                            onChange={handleInputChange}
                            placeholder="e.g., Airport, Hotel"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handlePaymentClick}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition shadow-md"
                    >
                      Continue to Payment
                    </button>
                  </form>
                </>
              )}

              {paymentStep === 'payment' && (
                <>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment (Demo)</h2>
                  
                  <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-6 mb-6">
                    <p className="text-blue-900 font-medium mb-2">Demo Payment Mode</p>
                    <p className="text-blue-800 text-sm">
                      This is a demo payment. Use any card details to proceed:
                    </p>
                    <p className="text-blue-800 text-sm mt-2">
                      Card: 4242 4242 4242 4242 | Exp: 12/26 | CVC: 123
                    </p>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between text-gray-600">
                      <span>Daily Rate:</span>
                      <span>E${car.daily_rate} × {calculateDays()} days</span>
                    </div>
                    <div className="border-t pt-4 flex justify-between items-center font-bold text-lg">
                      <span>Total Amount:</span>
                      <span className="bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent">E${calculateTotal()}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <button
                      onClick={handleMockPayment}
                      disabled={submitting}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Processing Payment...' : 'Complete Payment'}
                    </button>
                    <button
                      onClick={() => setPaymentStep('details')}
                      className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
                    >
                      Back
                    </button>
                  </div>
                </>
              )}

              {paymentStep === 'confirmation' && (
                <>
                  <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                      <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
                    <p className="text-gray-600">Your car rental has been successfully booked.</p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-gray-50 rounded-lg p-6 mb-6 border border-blue-100">
                    <h3 className="font-semibold text-gray-900 mb-4">Booking Summary</h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="text-gray-600">Car:</span>
                        <span className="font-semibold text-gray-900"> {car.brand} {car.model}</span>
                      </p>
                      <p>
                        <span className="text-gray-600">Pickup:</span>
                        <span className="font-semibold text-gray-900"> {formData.pickupDate} at {formData.pickupLocation}</span>
                      </p>
                      <p>
                        <span className="text-gray-600">Return:</span>
                        <span className="font-semibold text-gray-900"> {formData.returnDate} at {formData.returnLocation}</span>
                      </p>
                      <p className="border-t border-blue-200 pt-2 mt-2">
                        <span className="text-gray-600">Total Paid:</span>
                        <span className="font-bold bg-gradient-to-r from-blue-600 to-blue-700 bg-clip-text text-transparent"> E${calculateTotal()}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Link
                      href="/dashboard"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition shadow-md text-center"
                    >
                      View My Bookings
                    </Link>
                    <Link
                      href="/cars"
                      className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition text-center"
                    >
                      Book Another Car
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
