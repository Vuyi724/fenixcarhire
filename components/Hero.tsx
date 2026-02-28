import Image from 'next/image'

interface HeroProps {
  onBookingClick: () => void
}

export default function Hero({ onBookingClick }: HeroProps) {
  return (
    <section className="relative h-96 md:h-screen flex items-center justify-center overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1502877338535-766e3a6052c0?auto=format&fit=crop&q=80&w=1600"
        alt="Luxury car rental"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-r from-primary/95 to-dark/85"></div>
      <div className="absolute inset-0 bg-radial-gradient pointer-events-none"></div>

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
