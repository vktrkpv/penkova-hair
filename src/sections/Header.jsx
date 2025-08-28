import { useState } from "react";
import { Link, NavLink } from "react-router-dom";

export default function Header() {
  const [open, setOpen] = useState(false);

  const nav = [
    { to: "/services", label: "Services" },
    { to: "/gallery",  label: "Gallery"  },
    { to: "/reviews",  label: "Reviews"  },
    { to: "/contact",  label: "Contact"  },
  ];

  const linkClass = ({ isActive }) =>
    `text-sm transition ${isActive ? "text-brand-primary" : "hover:text-brand-primary"}`;

  return (
    <header className="sticky top-0 z-50 border-b border-brand-accent/30 bg-brand-bg/80 backdrop-blur">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <div className="h-8 w-8 rounded-full bg-brand-primary" aria-hidden />
          <span className="font-semibold">Hair by <span className="text-brand-primary">Olexandra Penkova</span></span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {nav.map(i => (
            <NavLink key={i.to} to={i.to} className={linkClass}>
              {i.label}
            </NavLink>
          ))}
          <Link to="/book" className="btn ml-2">BOOK NOW</Link>
        </nav>

        <button
          className="md:hidden inline-flex items-center justify-center h-10 w-10 rounded-lg border border-brand-accent/50"
          aria-controls="mobile-nav"
          aria-expanded={open}
          onClick={() => setOpen(v => !v)}
        >
          <span className="sr-only">Toggle menu</span>
          <div className="space-y-1.5">
            <span className={`block h-0.5 w-5 bg-brand-ink transition ${open ? "rotate-45 translate-y-2" : ""}`}/>
            <span className={`block h-0.5 w-5 bg-brand-ink transition ${open ? "opacity-0" : ""}`}/>
            <span className={`block h-0.5 w-5 bg-brand-ink transition ${open ? "-rotate-45 -translate-y-2" : ""}`}/>
          </div>
        </button>
      </div>

      <div
        id="mobile-nav"
        className={`md:hidden border-t border-brand-accent/30 bg-brand-bg/95 backdrop-blur transition-[max-height,opacity] duration-300 overflow-hidden ${open ? "max-h-80 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="px-4 py-3 flex flex-col gap-3">
          {nav.map(i => (
            <NavLink
              key={i.to}
              to={i.to}
              className={({ isActive }) =>
                `py-2 text-base ${isActive ? "text-brand-primary" : "hover:text-brand-primary"}`
              }
              onClick={() => setOpen(false)}
            >
              {i.label}
            </NavLink>
          ))}
          <Link to="/book" className="btn w-full justify-center" onClick={() => setOpen(false)}>
            BOOK NOW
          </Link>
        </div>
      </div>
    </header>
  );
}
