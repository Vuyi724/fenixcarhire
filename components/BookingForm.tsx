'use client'

import { FormEvent, useState } from 'react'

export default function BookingForm() {
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <section className="py-20 px-6 bg-light">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-5xl font-bold text-center mb-4 text-primary">Book Your Vehicle</h2>
        <p className="text-center text-gray-600 mb-8 text-lg">
          Fill out the form below and we'll get back to you within 24 hours
        </p>

        <div className="bg-white p-10 rounded-xl shadow-lg">
          <form action="https://formspree.io/f/YOUR_FORM_ID_HERE" method="POST" onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block font-semibold text-primary mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-accent focus:outline-none transition-colors"
              />
            </div>

            <div className="mb-6">
              <label className="block font-semibold text-primary mb-2">
                Phone / WhatsApp
              </label>
              <input
                type="tel"
                name="phone"
                placeholder="+268 ..."
                required
                defaultValue="+268"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-accent focus:outline-none transition-colors"
              />
            </div>

            <div className="mb-6">
              <label className="block font-semibold text-primary mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-accent focus:outline-none transition-colors"
              />
            </div>

            <div className="mb-6">
              <label className="block font-semibold text-primary mb-2">
                Vehicle Type
              </label>
              <select
                name="vehicle_type"
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-accent focus:outline-none transition-colors"
              >
                <option value="">Select a vehicle type</option>
                <option value="pickup">Double-Cab Pickup (Hilux-style)</option>
                <option value="suv">SUV / 4x4</option>
                <option value="sedan">Sedan</option>
                <option value="van">Van</option>
                <option value="other">Other / Multiple</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block font-semibold text-primary mb-2">
                  Pickup Date
                </label>
                <input
                  type="date"
                  name="pickup_date"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-accent focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block font-semibold text-primary mb-2">
                  Return Date
                </label>
                <input
                  type="date"
                  name="return_date"
                  required
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-accent focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block font-semibold text-primary mb-2">
                Additional Details
              </label>
              <textarea
                name="message"
                placeholder="Tell us about your trip: location, passengers, special requirements..."
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-accent focus:outline-none transition-colors resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-accent text-white font-bold py-4 rounded-lg hover:bg-orange-600 transition-all hover:shadow-lg active:scale-95"
            >
              Submit Booking Request
            </button>
          </form>

          {submitted && (
            <div className="mt-6 p-4 bg-green-100 border-2 border-green-500 rounded-lg text-green-700 text-center font-semibold">
              ✓ Thank you! We'll contact you soon.
            </div>
          )}

          <p className="text-center text-gray-600 mt-6 text-sm">
            Prefer instant contact?{' '}
            <a
              href="https://wa.me/2686829797?text=Hello%20Fenix%20Car%20Hire%2C%20I%20need%20a%20rental..."
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent font-semibold hover:underline"
            >
              Message us on WhatsApp
            </a>{' '}
            or call <span className="font-semibold">+268 682 9797</span>
          </p>
        </div>
      </div>
    </section>
  )
}
