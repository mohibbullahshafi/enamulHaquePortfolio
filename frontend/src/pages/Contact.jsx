import React, { useState, useEffect } from 'react';
import { FiSend, FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import { FaLinkedinIn, FaGoogleScholar } from 'react-icons/fa6';

const API = 'http://localhost:5001/api';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [status, setStatus] = useState('');
  const [profile, setProfile] = useState({});

  useEffect(() => {
    fetch(`${API}/content/profile`).then(r => r.json()).then(setProfile).catch(() => {});
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch(`${API}/content/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) { setStatus('success'); setForm({ name: '', email: '', subject: '', message: '' }); }
      else setStatus('error');
    } catch { setStatus('error'); }
  };

  return (
    <>
      <section className="bg-gradient-to-r from-primary to-slate-800 text-white">
        <div className="section-container text-center">
          <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">Get in Touch</p>
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold mb-4">Contact</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">Have a question, want to collaborate, or need consultation? Drop me a message.</p>
        </div>
      </section>

      <section className="section-container">
        <div className="grid md:grid-cols-3 gap-12">
          <div className="space-y-6">
            <h2 className="font-heading font-bold text-xl text-primary">Contact Information</h2>
            <div className="space-y-4">
              {[
                { icon: <FiMail />, label: 'Email', value: profile.email || 'enamul.haque@deakin.edu.au', href: `mailto:${profile.email || 'enamul.haque@deakin.edu.au'}` },
                { icon: <FiMapPin />, label: 'Location', value: profile.location || 'School of Engineering, Deakin University, Geelong, Victoria, Australia' },
                { icon: <FiPhone />, label: 'Phone', value: profile.phone || '+61 3 5227 2896' },
              ].map(({ icon, label, value, href }) => (
                <div key={label} className="flex gap-3 items-start">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 text-accent flex items-center justify-center flex-shrink-0">{icon}</div>
                  <div><p className="text-sm font-medium text-primary">{label}</p>{href ? <a href={href} className="text-sm text-accent hover:underline">{value}</a> : <p className="text-sm text-muted">{value}</p>}</div>
                </div>
              ))}
            </div>
            <div>
              <p className="text-sm font-medium text-primary mb-2">Connect</p>
              <div className="flex gap-3">
                {profile.linkedin && (
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-accent/10 text-accent hover:bg-accent hover:text-white flex items-center justify-center transition-colors" aria-label="LinkedIn"><FaLinkedinIn /></a>
                )}
                {profile.scholar && (
                  <a href={profile.scholar} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-lg bg-accent/10 text-accent hover:bg-accent hover:text-white flex items-center justify-center transition-colors" aria-label="Google Scholar"><FaGoogleScholar /></a>
                )}
              </div>
            </div>
          </div>

          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div><label className="block text-sm font-medium text-primary mb-1">Name</label><input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors" placeholder="Your name" /></div>
                <div><label className="block text-sm font-medium text-primary mb-1">Email</label><input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors" placeholder="your@email.com" /></div>
              </div>
              <div><label className="block text-sm font-medium text-primary mb-1">Subject</label><input type="text" name="subject" value={form.subject} onChange={handleChange} className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors" placeholder="Subject" /></div>
              <div><label className="block text-sm font-medium text-primary mb-1">Message</label><textarea name="message" value={form.message} onChange={handleChange} required rows={5} className="w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors resize-none" placeholder="Your message..." /></div>
              <button type="submit" className="btn-primary" disabled={status === 'sending'}>{status === 'sending' ? 'Sending...' : <><FiSend /> Send Message</>}</button>
              {status === 'success' && <p className="text-green-600 text-sm mt-2">Message sent successfully!</p>}
              {status === 'error' && <p className="text-red-500 text-sm mt-2">Failed to send. Please try again.</p>}
            </form>
          </div>
        </div>
      </section>
    </>
  );
}