import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaLinkedinIn, FaGoogleScholar, FaEnvelope } from 'react-icons/fa6';

const API = 'http://localhost:5001/api';

export default function Footer() {
  const [profile, setProfile] = useState({});

  useEffect(() => {
    fetch(`${API}/content/profile`).then(r => r.json()).then(setProfile).catch(() => {});
  }, []);

  return (
    <footer className="bg-primary text-gray-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="font-heading font-bold text-white text-lg mb-2">
              Dr. Enamul<span className="text-accent">.</span>
            </h3>
            <p className="text-sm text-gray-400 leading-relaxed">
              {profile.title || 'Associate Professor in Electrical Engineering'} at {profile.university || 'Deakin University'}. 
              Researcher, educator, and consultant in renewable energy and electric vehicles.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              {[
                { to: '/about', label: 'About' },
                { to: '/projects', label: 'Research' },
                { to: '/courses', label: 'Courses' },
                { to: '/consultancy', label: 'Consultancy' },
                { to: '/contact', label: 'Contact' },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="hover:text-white transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="font-semibold text-white mb-3 text-sm uppercase tracking-wider">Connect</h4>
            <div className="flex gap-3">
              {profile.linkedin && (
                <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-white/10 hover:bg-accent flex items-center justify-center transition-colors" aria-label="LinkedIn">
                  <FaLinkedinIn className="text-lg" />
                </a>
              )}
              {profile.scholar && (
                <a href={profile.scholar} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-white/10 hover:bg-accent flex items-center justify-center transition-colors" aria-label="Google Scholar">
                  <FaGoogleScholar className="text-lg" />
                </a>
              )}
              {profile.email && (
                <a href={`mailto:${profile.email}`} className="w-10 h-10 rounded-lg bg-white/10 hover:bg-accent flex items-center justify-center transition-colors" aria-label="Email">
                  <FaEnvelope className="text-lg" />
                </a>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-4">{profile.location || 'School of Engineering, Deakin University, Geelong, Australia'}</p>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} {profile.name || 'Dr. Md Enamul Haque'}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
