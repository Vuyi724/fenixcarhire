'use client'

import Link from 'next/link'
import { useAuth } from '@/app/auth-context'

export default function Home() {
  const { user } = useAuth()

  return (
    <main>
      <section className="bg-gradient-to-r from-[#1a2e5e] to-[#0d1b3d] text-white py-20 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Fenix Car Hire</h1>
          <p className="text-xl mb-8">For All Your Rental Needs in Eswatini</p>
          <div className="flex gap-4 justify-center flex-wrap">
            {user ? (
              <Link href="/cars" className="bg-[#ff7f00] text-white px-8 py-4 rounded-lg font-semibold hover:bg-orange-600">
                Browse Cars
              </Link>
            ) : (
              <>
                <Link href="/login" className="bg-[#ff7f00] text-white px-8 py-4 rounded-lg font-semibold hover:bg-orange-600">
                  Book Now
                </Link>
                <Link href="/signup" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-[#1a2e5e]">
                  Sign Up
                </Link>
              </>
            )}
            <a href="https://wa.me/2686829797" target="_blank" rel="noopener noreferrer" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-[#1a2e5e]">
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-8 text-[#1a2e5e]">About Fenix Car Hire</h2>
          <p className="text-center text-gray-700 max-w-2xl mx-auto text-lg leading-relaxed">
            Based in Sidwashini, Mbabane, Fenix Car Hire is a trusted rental service founded by Sikhumbuzo Nxumalo. 
            We offer well-maintained Toyota sedans, SUVs, vans, and double-cab pickups for business, family, events, or adventures.
          </p>
        </div>
      </section>

      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-[#1a2e5e]">Our Fleet</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Double-Cab Pickup', desc: 'Perfect for cargo and upcountry trips' },
              { name: 'SUV / 4x4', desc: 'Spacious and rugged for adventures' },
              { name: 'Sedan', desc: 'Fuel-efficient for city travel' },
              { name: 'Van', desc: 'Comfortable for large groups' },
              { name: 'Executive SUV', desc: 'Premium comfort for special occasions' },
              { name: 'Compact Car', desc: 'Affordable and easy to maneuver' },
            ].map((vehicle) => (
              <div key={vehicle.name} className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg">
                <h3 className="text-xl font-bold text-[#1a2e5e] mb-3">{vehicle.name}</h3>
                <p className="text-gray-600">{vehicle.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-[#1a2e5e]">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: 'Self-Drive', desc: 'Rent and drive yourself' },
              { title: 'Chauffeur Service', desc: 'Professional drivers available' },
              { title: 'Airport Transfers', desc: 'Meet & greet at KMIII' },
              { title: 'Corporate Packages', desc: 'Long-term contracts available' },
            ].map((service) => (
              <div key={service.title} className="p-8 border-l-4 border-[#ff7f00]">
                <h3 className="text-2xl font-bold text-[#1a2e5e] mb-3">{service.title}</h3>
                <p className="text-gray-600">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-[#1a2e5e]">Contact Us</h2>
          <div className="space-y-6 text-center">
            <div>
              <p className="text-gray-600">Cell: <span className="font-bold text-[#1a2e5e]">+268 682 9797</span></p>
              <p className="text-gray-600">Tel: <span className="font-bold text-[#1a2e5e]">+268 2422 1045</span></p>
            </div>
            <div>
              <p className="text-gray-600">Email: <span className="font-bold text-[#1a2e5e]">fenixreception@sempeerfi.co.sz</span></p>
            </div>
            <div>
              <p className="text-gray-600">Location: <span className="font-bold text-[#1a2e5e]">Sidwashini, Mbabane</span></p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
