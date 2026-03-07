'use client'

import Link from 'next/link'
import { useAuth } from '@/app/auth-context'
import { useState, useEffect } from 'react'

export default function Home() {
  const { user } = useAuth()
  const [currentSlide, setCurrentSlide] = useState(0)

  const carSlides = [
    { name: 'Double-Cab Pickup', desc: 'Perfect for cargo and upcountry trips', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%203-mje93k6c5ZS3CnpfhugUoTpJtbzlez.jpeg' },
    { name: 'SUV / 4x4', desc: 'Spacious and rugged for adventures', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image11-gtoVct7GyBYxjL939xouZSrrunpi3r.jpeg' },
    { name: 'Sedan', desc: 'Fuel-efficient and comfortable', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image16-r5MBKZYUfwvGome3vU64KLthxNMKBD.jpeg' },
    { name: 'Van', desc: 'Comfortable for large groups', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image7-V3mhI5AxN7a0zQTCHO5NVpPCtOLhMU.jpeg' },
    { name: 'Executive SUV', desc: 'Premium comfort for special occasions', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image%202-r1Dj77iGb3vNLOUN5CpgDFtAiVXTot.jpeg' },
    { name: 'Compact Car', desc: 'Affordable and easy to maneuver', image: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image5-hXIHuFYbODkXB9FT9QQQVPC2bWL0Ta.jpeg' },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [carSlides.length])

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % carSlides.length)
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + carSlides.length) % carSlides.length)

  return (
    <main className="bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-3xl font-bold text-gray-900">
            Fenix Car Hire
          </Link>
          <div className="flex gap-6 items-center">
            <a href="https://www.facebook.com/profile.php?id=100088818806884" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Follow
            </a>
            {user && (
              <Link href="/dashboard" className="text-gray-700 font-semibold hover:text-gray-900 transition">
                Dashboard
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section with Carousel */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        {/* Carousel */}
        <div className="absolute inset-0 w-full h-full">
          {carSlides.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                idx === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            >
              <img
                src={slide.image}
                alt={slide.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />
            </div>
          ))}
        </div>

        {/* Carousel Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white p-3 rounded-full transition shadow-lg"
        >
          <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-white/80 hover:bg-white p-3 rounded-full transition shadow-lg"
        >
          <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {carSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`w-3 h-3 rounded-full transition ${
                idx === currentSlide ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Premium Car Rentals
          </h1>
          <p className="text-xl md:text-2xl text-gray-100 mb-8 leading-relaxed">
            {carSlides[currentSlide]?.name} - {carSlides[currentSlide]?.desc}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
            {user ? (
              <Link href="/cars" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition shadow-xl">
                Browse Our Fleet
              </Link>
            ) : (
              <>
                <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold text-lg transition shadow-xl">
                  Book Now
                </Link>
                <Link href="/signup" className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-gray-900 transition">
                  Sign Up
                </Link>
              </>
            )}
            <a href="https://wa.me/26876829797" target="_blank" rel="noopener noreferrer" className="border-2 border-white text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-white hover:text-gray-900 transition">
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-24 px-6 bg-gradient-to-r from-gray-50 to-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image14-2nvNFBW9aTPOM7FOC39RaA6UFHuGd6.jpeg"
              alt="Sedan car"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-5xl font-bold mb-6 text-gray-900 leading-tight">About Fenix Car Hire</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-6">
              Based in Sidwashini, Mbabane, Fenix Car Hire is a trusted rental service founded by Sikhumbuzo Nxumalo with a commitment to excellence and customer satisfaction.
            </p>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              We offer well-maintained Toyota sedans, SUVs, vans, and double-cab pickups for business, family, events, or adventures. Our commitment to quality and customer service ensures a smooth rental experience every time.
            </p>
            <a href="https://www.facebook.com/profile.php?id=100088818806884" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-600 font-bold text-lg hover:text-blue-700">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Follow us on Facebook
            </a>
          </div>
        </div>
      </section>

      {/* Fleet Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">Our Premium Fleet</h2>
            <p className="text-gray-600 text-xl">Explore our diverse collection of well-maintained vehicles</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {carSlides.map((vehicle) => (
              <div key={vehicle.name} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-gray-100 overflow-hidden group">
                <div className="relative h-64 bg-gray-200 overflow-hidden">
                  <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{vehicle.name}</h3>
                  <p className="text-gray-600 mb-4">{vehicle.desc}</p>
                  <Link href={user ? "/cars" : "/login"} className="inline-block text-blue-600 font-bold hover:text-blue-700 transition">
                    View & Book →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-gray-600 text-xl">Tailored solutions for all your car rental needs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              { title: 'Self-Drive', desc: 'Rent and drive yourself at your own pace', icon: '🚗' },
              { title: 'Chauffeur Service', desc: 'Professional drivers available for comfort', icon: '🧑‍💼' },
              { title: 'Airport Transfers', desc: 'Meet & greet at KMIII Airport', icon: '✈️' },
              { title: 'Corporate Packages', desc: 'Long-term contracts available', icon: '🏢' },
            ].map((service) => (
              <div key={service.title} className="p-8 rounded-2xl bg-white border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="text-5xl mb-4">{service.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-5xl font-bold mb-6 leading-tight">Ready to Book Your Ride?</h2>
            <p className="text-gray-200 text-lg mb-8 leading-relaxed">
              Join thousands of satisfied customers who trust Fenix Car Hire for their transportation needs. Browse our fleet today and find the perfect vehicle for your journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={user ? "/cars" : "/login"} className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-bold transition shadow-lg">
                Start Your Journey
              </Link>
              <a href="https://www.facebook.com/profile.php?id=100088818806884" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 border border-white text-white px-8 py-4 rounded-lg font-bold hover:bg-white/10 transition">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Join Our Page
              </a>
            </div>
          </div>
          <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image4-pQgukUB90sia9D6yugX6tme7hpCyEi.jpeg"
              alt="SUV car"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-gray-900 mb-4">Get In Touch</h2>
            <p className="text-gray-600 text-xl">We're here to help with all your rental inquiries</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
              <svg className="w-10 h-10 text-blue-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Phone</h3>
              <p className="text-gray-600 mb-4">(+268) 768 29797</p>
              <p className="text-gray-600 mb-4">(+268) 798 46935</p>
              <a href="tel:+26876829797" className="inline-block text-blue-600 font-bold hover:text-blue-700">
                Call Now →
              </a>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
              <svg className="w-10 h-10 text-blue-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Email</h3>
              <p className="text-gray-600 mb-4">reception@fenix.co.sz</p>
              <a href="mailto:reception@fenix.co.sz" className="inline-block text-blue-600 font-bold hover:text-blue-700">
                Send Email →
              </a>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
              <svg className="w-10 h-10 text-blue-600 mb-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-4.781 1.158l-.386.214-4.011-.959.976 3.826a9.05 9.05 0 00-.458 4.719c.8 4.83 4.783 8.521 9.616 8.524h.004c5.316 0 9.711-4.343 9.88-10.044.12-4.993-3.997-9.26-8.906-9.434"/></svg>
              <h3 className="text-xl font-bold text-gray-900 mb-3">WhatsApp</h3>
              <p className="text-gray-600 mb-4">(+268) 768 29797</p>
              <a href="https://wa.me/26876829797" target="_blank" rel="noopener noreferrer" className="inline-block text-blue-600 font-bold hover:text-blue-700">
                Message Us →
              </a>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
              <svg className="w-10 h-10 text-blue-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Location</h3>
              <p className="text-gray-600">Sidwashini, Mbabane</p>
              <p className="text-gray-600">Eswatini</p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
              <svg className="w-10 h-10 text-blue-600 mb-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Facebook</h3>
              <p className="text-gray-600 mb-4">Fenix Car Hire</p>
              <a href="https://www.facebook.com/profile.php?id=100088818806884" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:text-blue-700">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Visit Page →
              </a>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl transition-all hover:-translate-y-1">
              <svg className="w-10 h-10 text-blue-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 2m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Hours</h3>
              <p className="text-gray-600">Monday - Sunday</p>
              <p className="text-gray-600">Available 24/7</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="mb-4">&copy; 2026 Fenix Car Hire. All rights reserved.</p>
          <div className="flex justify-center gap-6 mb-6">
            <a href="https://www.facebook.com/profile.php?id=100088818806884" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
          </div>
          <p className="text-sm">Designed with passion for your rental experience</p>
        </div>
      </footer>
    </main>
  )
}
