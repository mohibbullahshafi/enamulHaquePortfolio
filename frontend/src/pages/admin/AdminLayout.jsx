import { Navigate, Outlet, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiHome, FiUser, FiBriefcase, FiMail, FiLogOut, FiBookOpen, FiSettings, FiCalendar } from 'react-icons/fi';
import { HiOutlineLightBulb } from 'react-icons/hi';

export default function AdminLayout() {
  const { isAuthenticated, user, logout } = useAuth();

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;

  const links = [
    { to: '/admin', label: 'Dashboard', icon: FiHome, end: true },
    { to: '/admin/profile', label: 'Profile', icon: FiUser },
    { to: '/admin/publications', label: 'Publications', icon: FiBookOpen },
    { to: '/admin/research-areas', label: 'Research Areas', icon: HiOutlineLightBulb },
    { to: '/admin/services', label: 'Services', icon: FiBriefcase },
    { to: '/admin/messages', label: 'Messages', icon: FiMail },
    { to: '/admin/bookings', label: 'Bookings', icon: FiCalendar },
    { to: '/admin/settings', label: 'Settings', icon: FiSettings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-primary text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-lg font-bold font-heading">Admin Panel</h2>
          <p className="text-sm text-gray-400 mt-1">Welcome, {user}</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive ? 'bg-accent text-white' : 'text-gray-300 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <l.icon size={18} />
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition w-full"
          >
            <FiLogOut size={18} />
            Logout
          </button>
          <NavLink to="/" className="block text-center text-xs text-gray-500 mt-3 hover:text-gray-300">
            ← Back to site
          </NavLink>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
