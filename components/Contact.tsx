export default function Contact() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-5xl font-bold text-center mb-12 text-primary">Get in Touch</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-bold text-primary mb-4">Phone & WhatsApp</h3>
              <p className="text-lg text-gray-600">
                <strong>Cell:</strong> <a href="tel:+2686829797" className="text-accent font-semibold hover:underline">(+268) 682 9797</a>
              </p>
              <p className="text-lg text-gray-600 mt-2">
                <strong>Tel:</strong> <a href="tel:+26824222104" className="text-accent font-semibold hover:underline">(+268) 2422 2104</a>
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-primary mb-4">Email</h3>
              <p className="text-gray-600">
                <a href="mailto:info@sempeerfi.co.sz" className="text-accent font-semibold hover:underline">
                  info@sempeerfi.co.sz
                </a>
              </p>
              <p className="text-gray-600 mt-2">
                <a href="mailto:fenixreception@sempeerfi.co.sz" className="text-accent font-semibold hover:underline">
                  fenixreception@sempeerfi.co.sz
                </a>
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-primary mb-4">Location</h3>
              <p className="text-gray-600 leading-relaxed">
                Lilunga Complex, Litsemba Street<br />
                Sidwashini, Mbabane<br />
                Eswatini
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-primary mb-4">Follow Us</h3>
              <a
                href="https://www.facebook.com/p/Fenix-Car-Hire-100088889572938"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-accent font-semibold hover:underline"
              >
                Facebook: Fenix Car Hire
              </a>
            </div>
          </div>

          <div className="bg-light p-8 rounded-xl">
            <h3 className="text-2xl font-bold text-primary mb-6">Office Hours</h3>
            <div className="space-y-3 text-gray-600">
              <div className="flex justify-between">
                <span>Monday - Friday</span>
                <span className="font-semibold">8:00 AM - 5:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday</span>
                <span className="font-semibold">9:00 AM - 2:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday & Holidays</span>
                <span className="font-semibold">By Appointment</span>
              </div>
            </div>

            <div className="mt-8 p-6 bg-primary text-white rounded-lg">
              <p className="font-semibold mb-2">24/7 Emergency Support</p>
              <p className="text-white/90">
                Available for roadside assistance and urgent rentals
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
