import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiBriefcase, FiMail, FiEye, FiBookOpen, FiSettings, FiCalendar } from 'react-icons/fi';
import { HiOutlineLightBulb } from 'react-icons/hi';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { apiFetch } = useAuth();
  const [stats, setStats] = useState({ messages: 0, unread: 0, services: 0, publications: 0, researchAreas: 0, bookings: 0, pendingBookings: 0 });

  useEffect(() => {
    async function load() {
      try {
        const [msgRes, svcRes, pubRes, areaRes, bookRes] = await Promise.all([
          apiFetch('/content/messages'),
          apiFetch('/content/services'),
          apiFetch('/content/publications'),
          apiFetch('/content/research-areas'),
          apiFetch('/bookings/all'),
        ]);
        const messages = await msgRes.json();
        const services = await svcRes.json();
        const publications = await pubRes.json();
        const researchAreas = await areaRes.json();
        const bookings = await bookRes.json();
        setStats({
          messages: messages.length,
          unread: messages.filter(m => !m.read).length,
          services: services.length,
          publications: publications.length,
          researchAreas: researchAreas.length,
          bookings: bookings.length,
          pendingBookings: bookings.filter(b => b.status === 'pending').length,
        });
      } catch {}
    }
    load();
  }, []);

  const cards = [
    { label: 'Profile', desc: 'Edit your bio & info', icon: FiUser, color: 'bg-blue-500', to: '/admin/profile' },
    { label: 'Publications', desc: `${stats.publications} publications`, icon: FiBookOpen, color: 'bg-indigo-500', to: '/admin/publications' },
    { label: 'Research Areas', desc: `${stats.researchAreas} areas`, icon: HiOutlineLightBulb, color: 'bg-teal-500', to: '/admin/research-areas' },
    { label: 'Services', desc: `${stats.services} services`, icon: FiBriefcase, color: 'bg-emerald-500', to: '/admin/services' },
    { label: 'Messages', desc: `${stats.unread} unread of ${stats.messages}`, icon: FiMail, color: 'bg-orange-500', to: '/admin/messages' },
    { label: 'Bookings', desc: `${stats.pendingBookings} pending of ${stats.bookings}`, icon: FiCalendar, color: 'bg-pink-500', to: '/admin/bookings' },
    { label: 'Settings', desc: 'Stats & overview', icon: FiSettings, color: 'bg-gray-600', to: '/admin/settings' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-primary font-heading mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map(c => (
          <Link
            key={c.label}
            to={c.to}
            className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition p-6 flex items-start gap-4"
          >
            <div className={`${c.color} text-white p-3 rounded-lg`}>
              <c.icon size={22} />
            </div>
            <div>
              <h3 className="font-semibold text-primary">{c.label}</h3>
              <p className="text-sm text-muted mt-0.5">{c.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      {stats.unread > 0 && (
        <div className="mt-8 bg-orange-50 border border-orange-200 rounded-xl p-4">
          <p className="text-orange-800 font-medium">
            You have {stats.unread} unread message{stats.unread > 1 ? 's' : ''}.{' '}
            <Link to="/admin/messages" className="underline">View messages →</Link>
          </p>
        </div>
      )}
    </div>
  );
}
