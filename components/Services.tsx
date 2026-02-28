const SERVICES = [
  {
    id: 1,
    title: 'Self-Drive Rentals',
    description: 'Flexible rental periods, full insurance included.',
  },
  {
    id: 2,
    title: 'Chauffeur Service',
    description: 'Professional drivers for your peace of mind and comfort.',
  },
  {
    id: 3,
    title: 'Airport Transfers',
    description: 'Meet & greet at KMIII Airport, on-time guaranteed.',
  },
  {
    id: 4,
    title: 'Event Transportation',
    description: 'Weddings, conferences, tours, and special occasions.',
  },
  {
    id: 5,
    title: 'Upcountry Adventures',
    description: 'Explore Eswatini with our reliable 4x4 vehicles.',
  },
  {
    id: 6,
    title: 'Corporate & Long-Term',
    description: 'Contracts for businesses and NGOs with flexible terms.',
  },
]

export default function Services() {
  return (
    <section className="py-20 px-6 bg-light">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl font-bold text-center mb-4 text-primary">Our Services</h2>
        <p className="text-center text-gray-600 mb-12 text-lg">
          Comprehensive car rental solutions for all your needs
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map(service => (
            <div
              key={service.id}
              className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-2 transition-all border-l-4 border-accent"
            >
              <h3 className="text-2xl font-bold text-primary mb-3">
                {service.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
