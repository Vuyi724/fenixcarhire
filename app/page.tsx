'use client'

import Link from 'next/link'
import { useAuth } from '@/app/auth-context'

export default function Home() {
  const { user } = useAuth()

  return (
    <main className="bg-gradient-to-b from-white via-blue-50 to-gray-100">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md shadow-sm border-b border-blue-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Fenix Car Hire
          </Link>
          <div className="flex gap-4">
            {user && (
              <Link href="/dashboard" className="text-blue-600 font-semibold hover:text-blue-800 transition">
                Dashboard
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-24 px-6">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-blue-400 to-gray-400 opacity-10 blur-3xl" />
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center relative z-10">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-transparent bg-gradient-to-r from-blue-600 via-blue-700 to-gray-800 bg-clip-text leading-tight">
              Premium Car Rentals
            </h1>
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              Experience luxury and reliability with Fenix Car Hire. Rent from our premium fleet of well-maintained vehicles for all your transportation needs.
            </p>
            <div className="flex gap-4 flex-wrap">
              {user ? (
                <Link href="/cars" className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3.5 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition shadow-lg">
                  Browse Cars
                </Link>
              ) : (
                <>
                  <Link href="/login" className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3.5 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition shadow-lg">
                    Book Now
                  </Link>
                  <Link href="/signup" className="border-2 border-blue-600 text-blue-600 px-8 py-3.5 rounded-lg font-semibold hover:bg-blue-50 transition">
                    Sign Up
                  </Link>
                </>
              )}
              <a href="https://wa.me/2686829797" target="_blank" rel="noopener noreferrer" className="border-2 border-gray-400 text-gray-700 px-8 py-3.5 rounded-lg font-semibold hover:bg-gray-50 transition">
                WhatsApp
              </a>
            </div>
          </div>
          <div className="relative h-96 md:h-full min-h-96">
            <img
              src="/images/car-hero.jpg"
              alt="Premium car"
              className="w-full h-full object-cover rounded-2xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-6 bg-white border-t border-blue-100">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative h-80">
            <img
              src="/images/car-sedan.jpg"
              alt="Sedan car"
              className="w-full h-full object-cover rounded-xl shadow-xl"
            />
          </div>
          <div>
            <h2 className="text-4xl font-bold mb-6 text-gray-900">About Fenix Car Hire</h2>
            <p className="text-gray-700 text-lg leading-relaxed mb-6">
              Based in Sidwashini, Mbabane, Fenix Car Hire is a trusted rental service founded by Sikhumbuzo Nxumalo. 
            </p>
            <p className="text-gray-700 text-lg leading-relaxed">
              We offer well-maintained Toyota sedans, SUVs, vans, and double-cab pickups for business, family, events, or adventures. Our commitment to quality and customer service ensures a smooth rental experience every time.
            </p>
          </div>
        </div>
      </section>

      {/* Fleet Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-blue-50 to-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Our Premium Fleet</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Double-Cab Pickup', desc: 'Perfect for cargo and upcountry trips', icon: '🚚' },
              { name: 'SUV / 4x4', desc: 'Spacious and rugged for adventures', icon: '🚙' },
              { name: 'Sedan', desc: 'Fuel-efficient for city travel', icon: '🚗' },
              { name: 'Van', desc: 'Comfortable for large groups', icon: '🚐' },
              { name: 'Executive SUV', desc: 'Premium comfort for special occasions', icon: '🏎️' },
              { name: 'Compact Car', desc: 'Affordable and easy to maneuver', icon: '🚘' },
            ].map((vehicle) => (
              <div key={vehicle.name} className="bg-white p-8 rounded-xl shadow-md hover:shadow-xl transition-all hover:-translate-y-1 border border-blue-100">
                <div className="text-4xl mb-4">{vehicle.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{vehicle.name}</h3>
                <p className="text-gray-600">{vehicle.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: 'Self-Drive', desc: 'Rent and drive yourself at your own pace', icon: '🔑' },
              { title: 'Chauffeur Service', desc: 'Professional drivers available for comfort', icon: '👔' },
              { title: 'Airport Transfers', desc: 'Meet & greet at KMIII Airport', icon: '✈️' },
              { title: 'Corporate Packages', desc: 'Long-term contracts available', icon: '💼' },
            ].map((service) => (
              <div key={service.title} className="p-8 rounded-xl bg-gradient-to-br from-blue-50 to-gray-50 border-l-4 border-blue-600 hover:shadow-lg transition">
                <div className="text-3xl mb-3">{service.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Decoration Car Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-blue-600 to-gray-700 text-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6">Ready to Book?</h2>
            <p className="text-blue-100 text-lg mb-8 leading-relaxed">
              Join thousands of satisfied customers who trust Fenix Car Hire for their transportation needs. Browse our fleet today and find the perfect vehicle for your journey.
            </p>
            <Link href={user ? "/cars" : "/login"} className="inline-block bg-white text-blue-700 px-8 py-3.5 rounded-lg font-semibold hover:bg-gray-100 transition shadow-lg">
              Start Your Journey
            </Link>
          </div>
          <div className="relative h-96">
            <img
              src="/images/car-suv.jpg"
              alt="SUV car"
              className="w-full h-full object-cover rounded-xl shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">Contact Us</h2>
          <div className="space-y-6 text-center">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100">
              <p className="text-gray-600 mb-2">Cell:</p>
              <p className="text-2xl font-bold text-blue-600">+268 682 9797</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100">
              <p className="text-gray-600 mb-2">Tel:</p>
              <p className="text-2xl font-bold text-blue-600">+268 2422 1045</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100">
              <p className="text-gray-600 mb-2">Email:</p>
              <p className="text-lg font-bold text-blue-600">fenixreception@sempeerfi.co.sz</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-blue-100">
              <p className="text-gray-600 mb-2">Location:</p>
              <p className="text-lg font-bold text-gray-900">Sidwashini, Mbabane</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
