import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiMenuAlt3, HiX } from 'react-icons/hi';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/projects', label: 'Projects' },
  { to: '/courses', label: 'Courses' },
  { to: '/consultancy', label: 'Consultancy' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <Link to="/" className="font-heading font-bold text-xl text-primary tracking-tight">
          Dr. Enamul<span className="text-accent">.</span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname === to
                    ? 'bg-accent/10 text-accent'
                    : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                }`}
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link to="/consultancy" className="hidden md:inline-flex btn-primary text-sm !px-4 !py-2">
          Book Consultation
        </Link>

        {/* Mobile toggle */}
        <button className="md:hidden text-2xl text-primary" onClick={() => setOpen(!open)}>
          {open ? <HiX /> : <HiMenuAlt3 />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4">
          <ul className="flex flex-col gap-1 pt-2">
            {navLinks.map(({ to, label }) => (
              <li key={to}>
                <Link
                  to={to}
                  onClick={() => setOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    pathname === to
                      ? 'bg-accent/10 text-accent'
                      : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            to="/consultancy"
            onClick={() => setOpen(false)}
            className="btn-primary text-sm !px-4 !py-2 mt-3 w-full justify-center"
          >
            Book Consultation
          </Link>
        </div>
      )}
    </nav>
  );
}
