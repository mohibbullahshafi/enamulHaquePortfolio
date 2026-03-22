import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiBookOpen, FiCalendar } from 'react-icons/fi';
import { HiOutlineAcademicCap, HiOutlineLightBulb, HiOutlineGlobeAlt } from 'react-icons/hi';

const API = 'http://localhost:5001/api';

const defaultInterests = [
  { icon: <HiOutlineLightBulb className="text-2xl" />, title: 'Renewable Energy', desc: 'Wind, Solar PV, and grid integration of distributed energy resources.' },
  { icon: <HiOutlineGlobeAlt className="text-2xl" />, title: 'Electric Vehicles', desc: 'EV powertrains, charging infrastructure, and vehicle-to-grid systems.' },
  { icon: <HiOutlineAcademicCap className="text-2xl" />, title: 'Battery & Storage', desc: 'Battery and supercapacitor energy storage for grid and mobility applications.' },
  { icon: <FiBookOpen className="text-2xl" />, title: 'Microgrid & Digital Twin', desc: 'Digital twin technologies for microgrid simulation and optimization.' },
  { icon: <FiCalendar className="text-2xl" />, title: 'Cybersecurity in Energy', desc: 'Securing smart grid and energy systems from cyber threats.' },
  { icon: <FiArrowRight className="text-2xl" />, title: 'Power Electronics', desc: 'Grid-forming inverters and power electronics for renewables and EVs.' },
];

export default function Home() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetch(`${API}/content/profile`).then(r => r.json()).then(setProfile).catch(() => {});
  }, []);

  const p = profile || {};
  const stats = p.stats || {};

  return (
    <>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary via-slate-800 to-slate-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.15),transparent_50%)]" />
        <div className="section-container relative z-10 flex flex-col md:flex-row items-center gap-12 py-24 md:py-32">
          <div className="flex-1 text-center md:text-left">
            <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-4">{p.title || 'Associate Professor'} · {p.university || 'Deakin University'}</p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold leading-tight mb-6">
              {(p.name || 'Dr. Md Enamul Haque').split(' ').slice(0, -1).join(' ')}<br />
              <span className="text-accent">{(p.name || 'Haque').split(' ').slice(-1)[0]}</span>
            </h1>
            <p className="text-lg text-gray-300 max-w-xl mb-8 leading-relaxed">
              {p.heroSubtitle || 'Researcher, educator, and consultant specializing in renewable energy, electric vehicles, battery storage, and smart grid systems.'}
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <Link to="/consultancy" className="btn-primary">
                Book Consultation <FiCalendar />
              </Link>
              <Link to="/courses" className="btn-outline !border-white/30 !text-white hover:!bg-white/10">
                View Courses <FiBookOpen />
              </Link>
            </div>
          </div>
          <div className="flex-shrink-0">
            <div className="w-64 h-64 md:w-72 md:h-72 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl shadow-accent/20">
              <img src="/profile.webp" alt={p.name || 'Profile'} className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: stats.citations || '8165', label: 'Citations' },
              { num: stats.hindex || '41', label: 'h-index' },
              { num: stats.i10index || '120', label: 'i10-index' },
              { num: stats.publications || '150+', label: 'Publications' },
            ].map(({ num, label }) => (
              <div key={label}>
                <p className="text-3xl font-heading font-bold text-accent">{num}</p>
                <p className="text-sm text-muted mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Research Interests */}
      <section className="section-container">
        <h2 className="section-title text-center">Research Interests</h2>
        <p className="section-subtitle text-center mx-auto">
          Advancing the frontiers of clean energy, transportation electrification, and intelligent grid systems.
        </p>

        {/* Scholar tags */}
        {p.research_interests && p.research_interests.length > 0 && (
          <div className="flex flex-wrap gap-3 justify-center mb-10">
            {p.research_interests.map(tag => (
              <span key={tag} className="bg-accent/10 text-accent px-4 py-2 rounded-full font-semibold text-sm">{tag}</span>
            ))}
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {defaultInterests.map(({ icon, title, desc }) => (
            <div key={title} className="card group">
              <div className="w-12 h-12 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-4 group-hover:bg-accent group-hover:text-white transition-colors">
                {icon}
              </div>
              <h3 className="font-heading font-semibold text-primary mb-2">{title}</h3>
              <p className="text-sm text-muted leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Top Publications */}
      {p.topPublications && p.topPublications.length > 0 && (
        <section className="bg-surface">
          <div className="section-container">
            <h2 className="section-title text-center">Top Cited Publications</h2>
            <p className="section-subtitle text-center mx-auto">Most impactful research contributions by citation count.</p>
            <div className="space-y-4 max-w-3xl mx-auto">
              {p.topPublications.map((pub, i) => (
                <div key={i} className="card flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-accent/10 text-accent flex items-center justify-center flex-shrink-0 font-heading font-bold">
                    {pub.citations}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-primary text-sm leading-snug">{pub.title}</h4>
                    <p className="text-xs text-muted mt-1">{pub.authors}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{pub.journal} · {pub.year}</p>
                  </div>
                </div>
              ))}
            </div>
            {p.scholar && (
              <div className="text-center mt-8">
                <a href={p.scholar} target="_blank" rel="noopener noreferrer" className="btn-outline text-sm">
                  View All on Google Scholar <FiArrowRight />
                </a>
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-accent/5">
        <div className="section-container text-center">
          <h2 className="section-title">Ready to Collaborate?</h2>
          <p className="section-subtitle mx-auto">
            Whether you need expert consultation, research collaboration, or professional training—let's connect.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/contact" className="btn-primary">
              Get in Touch <FiArrowRight />
            </Link>
            <Link to="/about" className="btn-outline">
              Learn More About Me
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}