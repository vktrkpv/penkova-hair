import { Link } from "react-router-dom";

export default function Footer() {
  // функція для scrollToTop
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="mt-20 border-t border-brand-accent/40 bg-brand-bg">
      <div className="container mx-auto px-4 py-12 grid gap-10 md:grid-cols-3">
        {/* Brand / About */}
        <div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-brand-primary" aria-hidden />
            <div className="text-lg font-semibold text-brand-ink">
              Hair by <span className="text-brand-primary">Oleksandra</span>
            </div>
          </div>
          <p className="mt-4 text-sm text-brand-ink/70 leading-relaxed">
            Elegant, healthy hair with modern techniques.
            Precision cuts, soft blonding & effortless styling.
          </p>

          {/* Socials */}
          <div className="mt-4 flex items-center gap-3">
            <a href="https://instagram.com/yourprofile" target="_blank" rel="noreferrer"
               className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-brand-accent/60 hover:bg-brand-accent/30 transition"
               aria-label="Instagram">
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-brand-ink" fill="currentColor">
                <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5a5.5 5.5 0 1 1 0 11.001A5.5 5.5 0 0 1 12 7.5zm0 2a3.5 3.5 0 1 0 .001 7.001A3.5 3.5 0 0 0 12 9.5zM17.5 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Navigation */}
        <div className="grid grid-cols-2 gap-6 md:pl-6">
          <div>
            <h4 className="text-sm font-semibold text-brand-ink">Explore</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/services" className="hover:text-brand-primary">Services</Link></li>
              <li><Link to="/gallery"  className="hover:text-brand-primary">Gallery</Link></li>
              <li><Link to="/reviews"  className="hover:text-brand-primary">Reviews</Link></li>
              <li><Link to="/aboutus"  className="hover:text-brand-primary">About</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-brand-ink">Booking</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link to="/book"    className="hover:text-brand-primary">Book now</Link></li>
              <li><Link to="/prices"  className="hover:text-brand-primary">Prices</Link></li>
              <li><Link to="/contact" className="hover:text-brand-primary">Contact</Link></li>
            </ul>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-sm font-semibold text-brand-ink">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm text-brand-ink/80">
            <li>📍 Halifax, NS</li>
            <li>📞 <a href="tel:+10000000000" className="hover:text-brand-primary">+1 (000) 000-0000</a></li>
            <li>✉️ <a href="mailto:hello@hairbyoleksandra.com" className="hover:text-brand-primary">hello@hairbyoleksandra.com</a></li>
            <li className="pt-2">
              <Link to="/book" className="btn">BOOK NOW</Link>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-brand-accent/40">
        <div className="container mx-auto px-4 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between text-xs text-brand-ink/60">
          <div>© {new Date().getFullYear()} Hair by Oleksandra. All rights reserved.</div>

          <div className="flex gap-4 items-center">
            <Link to="/terms" className="hover:text-brand-primary">Terms</Link>
            <Link to="/privacy" className="hover:text-brand-primary">Privacy</Link>

  
         

            {/* Admin login */}
            <Link
              to="/login"
              className="ml-2 inline-flex items-center rounded-full border border-brand-accent/60 px-3 py-1 text-xs hover:bg-brand-accent/30 transition"
            >
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
