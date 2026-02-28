'use client'

import { useState } from 'react'

const TABS = [
  { id: 'home', label: 'Home' },
  { id: 'fleet', label: 'Fleet' },
  { id: 'services', label: 'Services' },
  { id: 'pricing', label: 'Pricing & Rates' },
  { id: 'booking', label: 'Booking' },
  { id: 'contact', label: 'Contact' },
]

interface NavigationProps {
  activeTab: string
  onTabChange: (tabId: string) => void
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  return (
    <nav className="sticky top-0 z-50 bg-primary shadow-lg">
      <div className="max-w-6xl mx-auto px-5 flex items-center">
        <a href="#home" className="text-2xl font-bold text-accent mr-12 py-4 no-underline">
          Fenix Car Hire
        </a>
        <div className="flex gap-0 flex-1 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-5 py-4 font-medium text-sm whitespace-nowrap transition-all border-b-4 ${
                activeTab === tab.id
                  ? 'text-accent border-accent'
                  : 'text-white/80 border-transparent hover:text-white hover:border-accent'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  )
}
