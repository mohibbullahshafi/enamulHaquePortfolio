import React, { useEffect, useState } from 'react';
import { FiCheckCircle, FiClock, FiDollarSign, FiCalendar } from 'react-icons/fi';
import { HiOutlineLightBulb, HiOutlineAcademicCap, HiOutlineBriefcase } from 'react-icons/hi';

const API = 'http://localhost:5001/api';

const iconComponents = {
  lightbulb: <HiOutlineLightBulb className="text-2xl" />,
  academic: <HiOutlineAcademicCap className="text-2xl" />,
  briefcase: <HiOutlineBriefcase className="text-2xl" />,
};

export default function Consultancy() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    fetch(`${API}/content/services`).then(r => r.json()).then(setServices).catch(() => {});
  }, []);

  return (
    <>
      <section className="bg-gradient-to-r from-primary to-slate-800 text-white">
        <div className="section-container text-center">
          <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">Services</p>
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold mb-4">Consultancy & Booking</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">Leverage 20+ years of expertise in energy systems and smart grid technologies.</p>
        </div>
      </section>

      <section className="section-container">
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((svc) => (
            <div key={svc.id} className="card flex flex-col">
              <div className="w-12 h-12 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-4">
                {iconComponents[svc.icon] || <HiOutlineBriefcase className="text-2xl" />}
              </div>
              <h3 className="font-heading font-semibold text-primary mb-2">{svc.title}</h3>
              <p className="text-sm text-muted leading-relaxed mb-4 flex-1">{svc.description}</p>
              {svc.features && (
                <ul className="space-y-2">
                  {svc.features.map(f => <li key={f} className="flex items-center gap-2 text-sm text-gray-600"><FiCheckCircle className="text-green-500 flex-shrink-0" /> {f}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="bg-accent/5">
        <div className="section-container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="section-title">Book a Session</h2>
            <p className="section-subtitle mx-auto">Schedule a consultation for your project, research, or training needs.</p>
            <div className="card max-w-md mx-auto">
              <div className="flex items-center justify-center gap-6 text-sm text-muted mb-6">
                <span className="flex items-center gap-1"><FiClock className="text-accent" /> 45–120 min sessions</span>
                <span className="flex items-center gap-1"><FiDollarSign className="text-accent" /> From $100 AUD</span>
              </div>
              <a href="/book" className="btn-primary w-full justify-center"><FiCalendar /> Book a Consultation</a>
              <p className="text-xs text-gray-400 mt-3">Pick a service, choose your date & time, and confirm instantly.</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}