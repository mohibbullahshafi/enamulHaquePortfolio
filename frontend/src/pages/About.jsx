import React, { useEffect, useState } from 'react';
import { HiOutlineAcademicCap, HiOutlineBriefcase, HiOutlineStar } from 'react-icons/hi';
import { FiAward, FiMapPin, FiBookOpen, FiUsers } from 'react-icons/fi';

const API = 'http://localhost:5001/api';

const iconMap = {
  0: <HiOutlineAcademicCap />,
  1: <HiOutlineBriefcase />,
  2: <FiMapPin />,
  3: <FiMapPin />,
  4: <HiOutlineBriefcase />,
  5: <FiAward />,
};

export default function About() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    fetch(`${API}/content/profile`).then(r => r.json()).then(setProfile).catch(() => {});
  }, []);

  const p = profile || {};
  const timeline = p.timeline || [];
  const awards = p.awards || [];
  const fieldsOfResearch = p.fieldsOfResearch || [];
  const stats = p.stats || {};

  return (
    <>
      <section className="bg-gradient-to-r from-primary to-slate-800 text-white">
        <div className="section-container text-center">
          <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">About Me</p>
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold mb-4">{p.name || 'Dr. Md Enamul Haque'}</h1>
          <p className="text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {p.title || 'Associate Professor in Electrical Engineering'} at {p.university || 'Deakin University'}, with {stats.years || '20+'} years of research and teaching experience across five countries.
          </p>
        </div>
      </section>

      <section className="section-container">
        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div>
            <h2 className="section-title">Background</h2>
            <p className="text-muted leading-relaxed mb-4">{p.bio || ''}</p>
            {p.detailedBio && <p className="text-muted leading-relaxed mb-4">{p.detailedBio}</p>}

            {/* Google Scholar Stats */}
            {stats.citations && (
              <div className="bg-accent/5 rounded-xl p-5 mb-6">
                <h3 className="font-heading font-semibold text-primary mb-3 text-sm">Google Scholar Metrics</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-accent">{stats.citations}</p>
                    <p className="text-xs text-muted">Citations</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-accent">{stats.hindex}</p>
                    <p className="text-xs text-muted">h-index</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-accent">{stats.i10index}</p>
                    <p className="text-xs text-muted">i10-index</p>
                  </div>
                </div>
                {stats.citationsSince2021 && (
                  <div className="grid grid-cols-3 gap-4 text-center mt-3 pt-3 border-t border-accent/10">
                    <div>
                      <p className="text-lg font-bold text-primary">{stats.citationsSince2021}</p>
                      <p className="text-[10px] text-muted">Since 2021</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-primary">{stats.hindexSince2021}</p>
                      <p className="text-[10px] text-muted">Since 2021</p>
                    </div>
                    <div>
                      <p className="text-lg font-bold text-primary">{stats.i10indexSince2021}</p>
                      <p className="text-[10px] text-muted">Since 2021</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Fields of Research */}
            {fieldsOfResearch.length > 0 && (
              <>
                <h3 className="font-heading font-semibold text-primary mt-8 mb-3 flex items-center gap-2"><FiBookOpen className="text-accent" /> Fields of Research</h3>
                <div className="flex flex-wrap gap-2">
                  {fieldsOfResearch.map(f => <span key={f} className="text-xs bg-accent/10 text-accent px-3 py-1.5 rounded-full font-medium">{f}</span>)}
                </div>
              </>
            )}
          </div>
          <div className="space-y-6">
            <h2 className="section-title">Career Timeline</h2>
            {timeline.map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center flex-shrink-0 text-lg">{iconMap[i] || <HiOutlineBriefcase />}</div>
                <div>
                  <p className="text-xs font-semibold text-accent uppercase tracking-wider">{item.year}</p>
                  <p className="font-semibold text-primary">{item.role}</p>
                  <p className="text-sm text-muted">{item.org}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {awards.length > 0 && (
        <section className="bg-surface">
          <div className="section-container">
            <h2 className="section-title text-center">Awards & Professional Roles</h2>
            <p className="section-subtitle mx-auto mb-8">Recognized for excellence in teaching, research, and professional leadership.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {awards.map((item, i) => (
                <div key={i} className="card flex gap-3 items-start">
                  <HiOutlineStar className="text-accent text-lg flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Availability */}
      <section className="section-container text-center">
        <div className="max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-accent/10 text-accent flex items-center justify-center mx-auto mb-4">
            <FiUsers className="text-2xl" />
          </div>
          <h2 className="section-title">Available for Supervision</h2>
          <p className="text-muted leading-relaxed mb-6">{p.name || 'Dr. Haque'} is available for Masters by Research and PhD supervision in the areas of renewable energy, electric vehicles, battery storage, smart grid, and power electronics.</p>
          <a href="/contact" className="btn-primary">Enquire About Supervision</a>
        </div>
      </section>
    </>
  );
}