export default function Footer() {
  return (
    <footer className="bg-primary text-white py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h4 className="text-xl font-bold text-accent mb-4">Fenix Car Hire</h4>
            <p className="text-white/80">
              Rising stronger every day. For all your rental needs in Eswatini.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-white/80">
              <li><a href="#home" className="hover:text-accent transition">Home</a></li>
              <li><a href="#fleet" className="hover:text-accent transition">Fleet</a></li>
              <li><a href="#pricing" className="hover:text-accent transition">Pricing</a></li>
              <li><a href="#booking" className="hover:text-accent transition">Book Now</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-4">Contact Info</h4>
            <p className="text-white/80">
              <strong>Phone:</strong> +268 682 9797<br />
              <strong>Email:</strong> fenixreception@sempeerfi.co.sz
            </p>
          </div>
        </div>
        <div className="border-t border-white/20 pt-8 text-center text-white/70">
          <p>&copy; 2026 Fenix Car Hire. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
