const PRICING = [
  {
    id: 1,
    name: 'Double-Cab Pickup',
    price: 250,
    description: 'Perfect for cargo, upcountry trips, and groups.',
  },
  {
    id: 2,
    name: 'SUV / 4x4',
    price: 280,
    description: 'Spacious and rugged for families and adventures.',
  },
  {
    id: 3,
    name: 'Sedan',
    price: 180,
    description: 'Fuel-efficient for business and city travel.',
  },
  {
    id: 4,
    name: 'Chauffeur Service',
    price: 150,
    description: 'Add our professional drivers to any vehicle.',
    suffix: '/day',
  },
  {
    id: 5,
    name: 'Airport Transfer',
    price: 200,
    description: 'Meet & greet at KMIII Airport.',
    suffix: 'one-way',
  },
  {
    id: 6,
    name: 'Weekly Packages',
    price: 15,
    description: 'Long-term rentals (7+ days) qualify for discounts.',
    suffix: '% off',
  },
]

export default function Pricing() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-5xl font-bold text-center mb-4 text-primary">Pricing & Rates</h2>
        <p className="text-center text-gray-600 mb-12 text-lg">
          Competitive rates for all vehicle types
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PRICING.map(item => (
            <div
              key={item.id}
              className="bg-light p-8 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-2 transition-all"
            >
              <h3 className="text-2xl font-bold text-primary mb-3">
                {item.name}
              </h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-accent">
                  E {item.price}
                </span>
                {item.suffix && (
                  <span className="text-gray-600 text-sm ml-2">
                    /{item.suffix}
                  </span>
                )}
              </div>
              <p className="text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-12 p-8 bg-primary text-white rounded-xl text-center">
          <p className="text-lg font-semibold">
            All rates include basic insurance, fuel, and roadside assistance.
          </p>
          <p className="mt-2 text-white/90">
            Contact us for detailed quotes tailored to your needs.
          </p>
        </div>
      </div>
    </section>
  )
}
