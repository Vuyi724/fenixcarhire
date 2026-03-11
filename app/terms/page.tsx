'use client'

import Link from 'next/link'

export default function TermsPage() {
  return (
    <main className="bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            <h1>Fenix Car Hire</h1>
          </Link>
          <Link href="/" className="text-gray-700 font-semibold hover:text-gray-900 transition">
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Terms & Conditions Content */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Terms & Conditions</h1>
            <p className="text-gray-600 mb-8">Last updated: March 2025</p>

            <div className="prose prose-lg max-w-none text-gray-700 space-y-8">
              {/* Introduction */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Introduction</h2>
                <p>
                  Welcome to Fenix Car Hire ("we," "us," "our," or "Company"). These Terms and Conditions govern your use of our car rental services. By accessing our website, making a booking, or renting a vehicle from us, you agree to be bound by these terms. If you do not agree with any part of these terms, please do not proceed with your rental.
                </p>
              </section>

              {/* Eligibility */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Eligibility</h2>
                <p>To rent a vehicle from Fenix Car Hire, you must:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Be at least 21 years old</li>
                  <li>Possess a valid driver's license</li>
                  <li>Provide valid identification and proof of insurance</li>
                  <li>Have a valid payment method (credit/debit card)</li>
                  <li>Provide accurate and complete information during the booking process</li>
                </ul>
              </section>

              {/* Booking & Rental Agreement */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Booking & Rental Agreement</h2>
                <p>
                  All bookings made through our system or by contacting us directly are subject to our approval. We reserve the right to decline any booking at our discretion. Once a booking is confirmed, a rental agreement will be provided, which must be signed before the vehicle is released.
                </p>
                <p className="mt-4">
                  The renter is responsible for:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Carefully inspecting the vehicle before taking possession</li>
                  <li>Reporting any pre-existing damage on the check-in form</li>
                  <li>Operating the vehicle in accordance with all traffic laws</li>
                  <li>Maintaining the vehicle in good condition during the rental period</li>
                  <li>Returning the vehicle on time and in the same condition as rented</li>
                </ul>
              </section>

              {/* Payment Terms */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Payment Terms</h2>
                <p>
                  Payment is due at the time of booking or as agreed with the rental agent. We accept cash, bank transfers, and mobile money payments. A security deposit is required at the time of rental and will be refunded upon safe return of the vehicle, minus any applicable charges for damage or violations.
                </p>
                <p className="mt-4">
                  Additional charges may apply for:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Excess mileage beyond the agreed limit</li>
                  <li>Late return of the vehicle</li>
                  <li>Fuel (if vehicle is returned with less fuel than at pickup)</li>
                  <li>Damage to the vehicle</li>
                  <li>Traffic violations and parking fines</li>
                </ul>
              </section>

              {/* Vehicle Use & Restrictions */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Vehicle Use & Restrictions</h2>
                <p>The renter agrees to:</p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Use the vehicle only for legal purposes</li>
                  <li>Not sub-lease or loan the vehicle to any third party</li>
                  <li>Not drive outside of Eswatini unless prior written approval is obtained</li>
                  <li>Not use the vehicle for racing, towing, or commercial purposes</li>
                  <li>Not transport illegal items or hazardous materials</li>
                  <li>Not smoke or allow smoking in the vehicle</li>
                  <li>Maintain the vehicle's fuel level during the rental period</li>
                </ul>
              </section>

              {/* Damage & Liability */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Damage & Liability</h2>
                <p>
                  The renter is fully responsible for any damage to the vehicle during the rental period, including accidents, vandalism, and mechanical failure due to misuse. Fenix Car Hire is not responsible for:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Personal belongings left in the vehicle</li>
                  <li>Loss of use or consequential damages</li>
                  <li>Mechanical breakdowns resulting from negligence</li>
                </ul>
                <p className="mt-4">
                  The renter must maintain comprehensive insurance coverage on the vehicle during the rental period.
                </p>
              </section>

              {/* Insurance */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Insurance</h2>
                <p>
                  The renter is responsible for obtaining and maintaining valid motor vehicle insurance for the duration of the rental. Fenix Car Hire's vehicles are insured, but the renter must provide additional coverage as required by law. Our insurance does not cover the renter's personal liability, damages beyond the vehicle's value, or violations of these terms.
                </p>
              </section>

              {/* Late Return & Penalties */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Late Return & Penalties</h2>
                <p>
                  Late returns will be charged at the daily rate or portion thereof. If the vehicle is not returned within 24 hours of the scheduled return time, Fenix Car Hire reserves the right to:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-2">
                  <li>Charge a late fee of E500 per day</li>
                  <li>Report the vehicle as stolen to law enforcement</li>
                  <li>Pursue legal action to recover the vehicle and applicable fees</li>
                </ul>
              </section>

              {/* Cancellation Policy */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Cancellation Policy</h2>
                <p>
                  Cancellations must be made at least 24 hours prior to the rental start date for a full refund. Cancellations made within 24 hours of the rental start date will forfeit 50% of the rental fee. No refunds are issued for no-shows.
                </p>
              </section>

              {/* Privacy & Data Protection */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Privacy & Data Protection</h2>
                <p>
                  We collect personal information during the booking and rental process to process your reservation, manage payments, and comply with legal requirements. Your information will not be shared with third parties without your consent, except as required by law. We are committed to protecting your data in accordance with applicable privacy regulations.
                </p>
              </section>

              {/* Limitation of Liability */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Limitation of Liability</h2>
                <p>
                  To the fullest extent permitted by law, Fenix Car Hire shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services, even if advised of the possibility of such damages.
                </p>
              </section>

              {/* Changes to Terms */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Changes to Terms</h2>
                <p>
                  Fenix Car Hire reserves the right to modify these Terms & Conditions at any time without prior notice. Changes will be effective immediately upon posting to our website. Continued use of our services following any changes constitutes your acceptance of the new terms.
                </p>
              </section>

              {/* Contact Information */}
              <section>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Contact Information</h2>
                <p>For questions or concerns regarding these Terms & Conditions, please contact us:</p>
                <div className="mt-4 space-y-2">
                  <p><strong>Email:</strong> reception@fenix.co.sz</p>
                  <p><strong>Phone:</strong> (+268) 768 29797 / 798 46935</p>
                  <p><strong>Location:</strong> Sidwashini, Mbabane, Eswatini</p>
                </div>
              </section>

              {/* Acceptance */}
              <section className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Acceptance of Terms</h2>
                <p className="text-lg">
                  By proceeding with a rental from Fenix Car Hire, you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions. Thank you for choosing Fenix Car Hire for your transportation needs.
                </p>
              </section>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Fenix Car Hire</h3>
              <p className="text-gray-400">Your trusted partner for quality car rentals in Eswatini.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link href="/" className="hover:text-white transition">Home</Link></li>
                <li><Link href="/cars" className="hover:text-white transition">Our Fleet</Link></li>
                <li><Link href="/terms" className="hover:text-white transition">Terms & Conditions</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <p className="text-gray-400">Phone: (+268) 768 29797</p>
              <p className="text-gray-400">Email: reception@fenix.co.sz</p>
              <p className="text-gray-400">Location: Sidwashini, Mbabane</p>
            </div>
          </div>
          <div className="border-t border-gray-700 pt-8 text-center">
            <p className="text-gray-400">© 2025 Fenix Car Hire. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  )
}
