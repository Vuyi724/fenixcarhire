'use client'

interface HeroProps {
  onBookingClick: () => void
}

export default function Hero({ onBookingClick }: HeroProps) {
  return (
    <section 
      className="relative h-96 md:h-screen flex items-center justify-center overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: 'linear-gradient(135deg, rgba(26, 46, 94, 0.95) 0%, rgba(13, 27, 61, 0.95) 100%), url("https://images.unsplash.com/photo-1502877338535-766e3a6052c0?auto=format&fit=crop&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1a2e5e]/50 to-[#0d1b3d]/90"></div>

      <div className="relative z-10 text-center text-white px-6 max-w-2xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight">
          Fenix Car Hire
        </h1>
        <p className="text-xl md:text-2xl mb-2 font-medium opacity-95">
          For All Your Rental Needs
        </p>
        <p className="text-lg mb-8 opacity-90 leading-relaxed">
          Reliable Toyota fleet • Self-drive • Chauffeur • Airport transfers • Upcountry trips in Eswatini
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button
            onClick={onBookingClick}
            className="inline-flex items-center justify-center bg-accent text-white px-8 py-4 rounded-lg font-semibold transition-all hover:bg-orange-600 hover:shadow-lg hover:-translate-y-1"
          >
            Book Now
          </button>
          <a
            href="https://wa.me/2686829797?text=Hello%20Fenix%20Car%20Hire%2C%20I%20need%20a%20rental..."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center bg-transparent text-white px-8 py-4 rounded-lg font-semibold border-2 border-white transition-all hover:bg-white hover:text-primary"
          >
            WhatsApp Us
          </a>
        </div>
      </div>
    </section>
  )
}
