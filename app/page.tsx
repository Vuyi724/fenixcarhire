'use client'

import { useState, useRef } from 'react'
import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import About from '@/components/About'
import Fleet from '@/components/Fleet'
import Services from '@/components/Services'
import Pricing from '@/components/Pricing'
import BookingForm from '@/components/BookingForm'
import Contact from '@/components/Contact'
import Footer from '@/components/Footer'

export default function Home() {
  const [activeTab, setActiveTab] = useState('home')
  const bookingRef = useRef<HTMLDivElement>(null)

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    if (tabId === 'booking' && bookingRef.current) {
      setTimeout(() => {
        bookingRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 0)
    }
  }

  const handleBookingClick = () => {
    setActiveTab('booking')
    if (bookingRef.current) {
      setTimeout(() => {
        bookingRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 0)
    }
  }

  return (
    <>
      <Navigation activeTab={activeTab} onTabChange={handleTabChange} />

      {activeTab === 'home' && (
        <>
          <Hero onBookingClick={handleBookingClick} />
          <About />
        </>
      )}

      {activeTab === 'fleet' && <Fleet />}

      {activeTab === 'services' && <Services />}

      {activeTab === 'pricing' && <Pricing />}

      {activeTab === 'booking' && (
        <div ref={bookingRef}>
          <BookingForm />
        </div>
      )}

      {activeTab === 'contact' && <Contact />}

      <Footer />
    </>
  )
}
