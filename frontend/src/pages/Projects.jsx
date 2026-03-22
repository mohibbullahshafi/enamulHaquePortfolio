import React, { useState, useEffect } from 'react';
import { FiExternalLink, FiBookOpen, FiFileText, FiFilter } from 'react-icons/fi';
import { HiOutlineLightBulb } from 'react-icons/hi';

const API = 'http://localhost:5001/api';

export default function Projects() {
  const [filter, setFilter] = useState('all');
  const [showAll, setShowAll] = useState(false);
  const [profile, setProfile] = useState(null);
  const [publications, setPublications] = useState([]);
  const [researchAreas, setResearchAreas] = useState([]);

  useEffect(() => {
    fetch(`${API}/content/profile`).then(r => r.json()).then(setProfile).catch(() => {});
    fetch(`${API}/content/publications`).then(r => r.json()).then(setPublications).catch(() => {});
    fetch(`${API}/content/research-areas`).then(r => r.json()).then(setResearchAreas).catch(() => {});
  }, []);

  const stats = profile?.stats || {};

  const years = [...new Set(publications.map(p => p.year))].sort((a, b) => b - a);
  const filtered = filter === 'all' ? publications : publications.filter(p => p.type === filter);
  const displayed = showAll ? filtered : filtered.slice(0, 12);

  const journalCount = publications.filter(p => p.type === 'journal').length;
  const confCount = publications.filter(p => p.type === 'conference').length;

  return (
    <>
      <section className="bg-gradient-to-r from-primary to-slate-800 text-white">
        <div className="section-container text-center">
          <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">Research & Publications</p>
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold mb-4">My Research</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">{stats.publications || '150+'} publications in leading international journals and conferences spanning energy systems, EVs, and intelligent grids.</p>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b">
        <div className="section-container !py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div><p className="text-3xl font-heading font-extrabold text-accent">{stats.publications || '150+'}</p><p className="text-sm text-muted">Total Publications</p></div>
            <div><p className="text-3xl font-heading font-extrabold text-accent">{stats.citations || '8165'}</p><p className="text-sm text-muted">Total Citations</p></div>
            <div><p className="text-3xl font-heading font-extrabold text-accent">{stats.hindex || '41'}</p><p className="text-sm text-muted">h-index</p></div>
            <div><p className="text-3xl font-heading font-extrabold text-accent">{stats.i10index || '120'}</p><p className="text-sm text-muted">i10-index</p></div>
          </div>
        </div>
      </section>

      {/* Research Areas */}
      <section className="section-container">
        <h2 className="section-title">Research Areas</h2>
        <p className="section-subtitle mx-auto mb-8">Core research domains driving innovation in sustainable energy systems.</p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {researchAreas.map(({ title, desc, tags }) => (
            <div key={title} className="card group flex flex-col">
              <div className="w-12 h-12 rounded-lg bg-accent/10 text-accent flex items-center justify-center mb-4 group-hover:bg-accent group-hover:text-white transition-colors">
                <HiOutlineLightBulb className="text-2xl" />
              </div>
              <h3 className="font-heading font-semibold text-primary mb-2">{title}</h3>
              <p className="text-sm text-muted leading-relaxed flex-1">{desc}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {tags.map(t => <span key={t} className="text-xs bg-accent/10 text-accent px-2 py-1 rounded-full font-medium">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Publications List */}
      <section className="bg-surface">
        <div className="section-container">
          <h2 className="section-title">Recent Publications</h2>
          <p className="section-subtitle mx-auto mb-8">Selected publications from 2024–2026. View full list on Google Scholar.</p>

          {/* Filter Tabs */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <button onClick={() => { setFilter('all'); setShowAll(false); }} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === 'all' ? 'bg-accent text-white' : 'bg-white text-muted border hover:border-accent hover:text-accent'}`}>
              All ({publications.length})
            </button>
            <button onClick={() => { setFilter('journal'); setShowAll(false); }} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${filter === 'journal' ? 'bg-accent text-white' : 'bg-white text-muted border hover:border-accent hover:text-accent'}`}>
              <FiBookOpen className="text-xs" /> Journals ({journalCount})
            </button>
            <button onClick={() => { setFilter('conference'); setShowAll(false); }} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${filter === 'conference' ? 'bg-accent text-white' : 'bg-white text-muted border hover:border-accent hover:text-accent'}`}>
              <FiFileText className="text-xs" /> Conferences ({confCount})
            </button>
          </div>

          {/* Publications by Year */}
          {years.map(year => {
            const yearPubs = displayed.filter(p => p.year === year);
            if (yearPubs.length === 0) return null;
            return (
              <div key={year} className="mb-8">
                <h3 className="text-xl font-heading font-bold text-primary mb-4 flex items-center gap-2">
                  <span className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center text-sm font-bold">{year}</span>
                  {yearPubs.length} publication{yearPubs.length > 1 ? 's' : ''}
                </h3>
                <div className="space-y-4">
                  {yearPubs.map((pub, i) => (
                    <div key={i} className="bg-white rounded-xl p-5 border border-gray-100 hover:border-accent/30 hover:shadow-md transition-all">
                      <div className="flex items-start gap-3">
                        <span className={`mt-1 px-2 py-0.5 rounded text-xs font-semibold uppercase ${pub.type === 'journal' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                          {pub.type === 'journal' ? 'Journal' : 'Conf'}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-primary leading-snug mb-1">{pub.title}</h4>
                          <p className="text-sm text-muted mb-2">{pub.authors}</p>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted">
                            <span className="font-medium text-accent">{pub.journal}</span>
                            <span>{pub.volume}</span>
                            <span>{pub.publisher}</span>
                            {pub.citations > 0 && <span className="text-green-600 font-medium">{pub.citations} citation{pub.citations > 1 ? 's' : ''}</span>}
                          </div>
                        </div>
                        <a href={`https://dx.doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer" className="shrink-0 w-8 h-8 rounded-full bg-accent/10 text-accent flex items-center justify-center hover:bg-accent hover:text-white transition-colors" title="View paper">
                          <FiExternalLink className="text-sm" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Show More / Less */}
          {filtered.length > 12 && (
            <div className="text-center mt-6">
              <button onClick={() => setShowAll(!showAll)} className="btn-outline">
                {showAll ? 'Show Less' : `Show All ${filtered.length} Publications`}
              </button>
            </div>
          )}

          {/* Google Scholar CTA */}
          <div className="text-center mt-10 p-8 bg-white rounded-2xl border">
            <p className="text-muted mb-4">This is a selection of recent publications. For the complete list of {stats.publications || '150+'} publications:</p>
            <a href={profile?.scholar || "https://scholar.google.com/citations?user=51tu5WEAAAAJ&hl=en"} className="btn-primary inline-flex items-center gap-2" target="_blank" rel="noopener noreferrer">
              View Full Profile on Google Scholar <FiExternalLink />
            </a>
          </div>
        </div>
      </section>
    </>
  );
}