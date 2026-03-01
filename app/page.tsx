'use client'

import { useState } from 'react'
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

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleBookingClick = () => {
    setActiveTab('booking')
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 0)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation activeTab={activeTab} onTabChange={handleTabChange} />

      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            <Hero onBookingClick={handleBookingClick} />
            <About />
          </>
        )}

        {activeTab === 'fleet' && <Fleet />}

        {activeTab === 'services' && <Services />}

        {activeTab === 'pricing' && <Pricing />}

        {activeTab === 'booking' && <BookingForm />}

        {activeTab === 'contact' && <Contact />}
      </main>

      <Footer />
    </div>
  )
}
