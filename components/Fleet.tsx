const VEHICLES = [
  {
    id: 1,
    name: 'Double-Cab Pickup',
    description: 'Perfect for cargo, upcountry trips, and groups. Spacious and reliable.',
    image: 'https://images.unsplash.com/photo-1605559424843-9e4c3ff86981?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 2,
    name: 'SUV / 4x4',
    description: 'Spacious and rugged. Ideal for families and adventures on Eswatini roads.',
    image: 'https://images.unsplash.com/photo-1605559424843-9e4c3ff86981?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 3,
    name: 'Sedan',
    description: 'Fuel-efficient and comfortable for business and city travel.',
    image: 'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 4,
    name: 'Van',
    description: 'Comfortable seating for large groups and tour operators.',
    image: 'https://images.unsplash.com/photo-1578519603509-a9d7a5e35e8a?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 5,
    name: 'Executive SUV',
    description: 'Premium comfort for corporate clients and special occasions.',
    image: 'https://images.unsplash.com/photo-1605559424843-9e4c3ff86981?auto=format&fit=crop&q=80&w=600',
  },
  {
    id: 6,
    name: 'Compact Car',
    description: 'Affordable and easy to maneuver for city exploration.',
    image: 'https://images.unsplash.com/photo-1552820728-8ac41f1ce891?auto=format&fit=crop&q=80&w=600',
  },
]

export default function Fleet() {
  return (
    <section className="py-20 px-6 bg-light">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl font-bold text-center mb-4 text-primary">Our Fleet</h2>
        <p className="text-center text-gray-600 mb-12 text-lg">
          Well-maintained Toyota vehicles for every occasion
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {VEHICLES.map(vehicle => (
            <div
              key={vehicle.id}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-2 transition-all"
            >
              <img
                src={vehicle.image}
                alt={vehicle.name}
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-primary mb-3">
                  {vehicle.name}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {vehicle.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
