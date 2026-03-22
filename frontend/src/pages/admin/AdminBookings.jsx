import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FiCalendar, FiClock, FiDollarSign, FiCheck, FiX, FiTrash2, FiPlus, FiMessageSquare } from 'react-icons/fi';

const DAYS = [
  { key: 'mon', label: 'Monday' },
  { key: 'tue', label: 'Tuesday' },
  { key: 'wed', label: 'Wednesday' },
  { key: 'thu', label: 'Thursday' },
  { key: 'fri', label: 'Friday' },
  { key: 'sat', label: 'Saturday' },
  { key: 'sun', label: 'Sunday' },
];

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

function formatTime(t) {
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${ampm}`;
}

export default function AdminBookings() {
  const { apiFetch } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('bookings'); // bookings | availability | services
  const [bookings, setBookings] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState('all');
  const [newBlockDate, setNewBlockDate] = useState('');

  useEffect(() => { loadAll(); }, []);

  async function loadAll() {
    try {
      const [bRes, sRes] = await Promise.all([
        apiFetch('/bookings/all'),
        apiFetch('/bookings/admin-settings'),
      ]);
      setBookings(await bRes.json());
      setSettings(await sRes.json());
    } catch {} finally { setLoading(false); }
  }

  async function updateStatus(id, status) {
    try {
      await apiFetch(`/bookings/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
      setBookings(prev => prev.map(b => b.id === id ? { ...b, status } : b));
      setMsg(`Booking ${status}!`);
    } catch { setMsg('Error updating status.'); }
  }

  async function deleteBooking(id) {
    if (!confirm('Delete this booking?')) return;
    try {
      await apiFetch(`/bookings/${id}`, { method: 'DELETE' });
      setBookings(prev => prev.filter(b => b.id !== id));
      setMsg('Booking deleted.');
    } catch { setMsg('Error deleting.'); }
  }

  async function saveSettings() {
    setSaving(true); setMsg('');
    try {
      const res = await apiFetch('/bookings/admin-settings', { method: 'PUT', body: JSON.stringify(settings) });
      if (res.ok) setMsg('Settings saved!');
      else setMsg('Failed to save.');
    } catch { setMsg('Error saving.'); }
    finally { setSaving(false); }
  }

  function updateDay(dayKey, field, value) {
    setSettings(s => ({
      ...s,
      weeklyAvailability: { ...s.weeklyAvailability, [dayKey]: { ...s.weeklyAvailability[dayKey], [field]: value } }
    }));
  }

  function addBlockDate() {
    if (!newBlockDate || settings.blockedDates.includes(newBlockDate)) return;
    setSettings(s => ({ ...s, blockedDates: [...s.blockedDates, newBlockDate].sort() }));
    setNewBlockDate('');
  }

  function removeBlockDate(d) {
    setSettings(s => ({ ...s, blockedDates: s.blockedDates.filter(x => x !== d) }));
  }

  function updateConsType(idx, field, value) {
    setSettings(s => ({
      ...s,
      consultationTypes: s.consultationTypes.map((ct, i) => i === idx ? { ...ct, [field]: value } : ct)
    }));
  }

  function addConsType() {
    setSettings(s => ({
      ...s,
      consultationTypes: [...s.consultationTypes, { id: Date.now().toString(), name: '', duration: 60, price: 0, description: '' }]
    }));
  }

  function removeConsType(idx) {
    setSettings(s => ({ ...s, consultationTypes: s.consultationTypes.filter((_, i) => i !== idx) }));
  }

  if (loading) return <p className="text-muted">Loading bookings...</p>;

  const filteredBookings = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);
  const sorted = [...filteredBookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const pendingCount = bookings.filter(b => b.status === 'pending').length;
  const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
  const completedCount = bookings.filter(b => b.status === 'completed').length;
  const totalEarnings = bookings.filter(b => b.status === 'completed').reduce((s, b) => s + (b.price || 0), 0);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-primary font-heading">Bookings</h1>
          <p className="text-sm text-muted mt-1">{bookings.length} total &middot; {pendingCount} pending &middot; ${totalEarnings} earned</p>
        </div>
      </div>

      {msg && (
        <div className={`rounded-lg p-3 mb-4 text-sm ${msg.includes('!') || msg.includes('deleted') ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
          {msg}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-yellow-50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-yellow-700">{pendingCount}</p>
          <p className="text-xs text-yellow-600 font-medium">Pending</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-blue-700">{confirmedCount}</p>
          <p className="text-xs text-blue-600 font-medium">Confirmed</p>
        </div>
        <div className="bg-green-50 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-green-700">{completedCount}</p>
          <p className="text-xs text-green-600 font-medium">Completed</p>
        </div>
        <div className="bg-accent/5 rounded-xl p-4 text-center">
          <p className="text-2xl font-bold text-accent">${totalEarnings}</p>
          <p className="text-xs text-accent font-medium">Total Earned</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-lg p-1 mb-6">
        {[
          { key: 'bookings', label: `Bookings (${bookings.length})` },
          { key: 'availability', label: 'Availability' },
          { key: 'services', label: 'Service Types' },
        ].map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`flex-1 py-2 rounded-md text-sm font-medium transition ${tab === t.key ? 'bg-white shadow-sm text-primary' : 'text-muted hover:text-primary'}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB: Bookings */}
      {tab === 'bookings' && (
        <>
          <div className="flex flex-wrap gap-2 mb-4">
            {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(f => (
              <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition ${filter === f ? 'bg-accent text-white' : 'bg-white border text-muted hover:border-accent'}`}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>

          {sorted.length === 0 ? (
            <div className="bg-white rounded-xl border p-8 text-center text-muted">
              <FiCalendar size={32} className="mx-auto mb-3 text-gray-300" />
              No bookings {filter !== 'all' ? `with status "${filter}"` : 'yet'}.
            </div>
          ) : (
            <div className="space-y-3">
              {sorted.map(b => (
                <div
                  key={b.id}
                  onClick={() => navigate(`/admin/bookings/${b.id}`)}
                  className={`bg-white rounded-xl border shadow-sm p-5 cursor-pointer hover:shadow-md hover:border-accent/30 transition ${b.status === 'pending' ? 'border-yellow-200' : 'border-gray-100'}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className="font-semibold text-primary">{b.name}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium uppercase ${STATUS_COLORS[b.status]}`}>{b.status}</span>
                        {(b.logs || []).length > 0 && (
                          <span className="flex items-center gap-1 text-[10px] text-gray-400"><FiMessageSquare size={10} />{(b.logs || []).length}</span>
                        )}
                      </div>
                      <p className="text-sm text-muted">{b.email}{b.phone ? ` • ${b.phone}` : ''}</p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted mt-2">
                        <span className="font-medium text-accent">{b.consultationName}</span>
                        <span className="flex items-center gap-1"><FiCalendar size={11} /> {new Date(b.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span className="flex items-center gap-1"><FiClock size={11} /> {formatTime(b.time)}</span>
                        <span className="flex items-center gap-1"><FiDollarSign size={11} /> ${b.price} {b.currency}</span>
                      </div>
                      {b.notes && <p className="text-xs text-gray-500 mt-2 bg-gray-50 rounded p-2">{b.notes}</p>}
                      <p className="text-[10px] text-gray-400 mt-1">Created: {new Date(b.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                      {b.status === 'pending' && (
                        <>
                          <button onClick={() => updateStatus(b.id, 'confirmed')} className="p-2 rounded-lg text-blue-500 hover:bg-blue-50 transition" title="Confirm"><FiCheck size={16} /></button>
                          <button onClick={() => updateStatus(b.id, 'cancelled')} className="p-2 rounded-lg text-red-400 hover:bg-red-50 transition" title="Cancel"><FiX size={16} /></button>
                        </>
                      )}
                      {b.status === 'confirmed' && (
                        <button onClick={() => updateStatus(b.id, 'completed')} className="p-2 rounded-lg text-green-500 hover:bg-green-50 transition" title="Mark Complete"><FiCheck size={16} /></button>
                      )}
                      <button onClick={() => deleteBooking(b.id)} className="p-2 rounded-lg text-red-400 hover:bg-red-50 transition" title="Delete"><FiTrash2 size={15} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* TAB: Availability */}
      {tab === 'availability' && settings && (
        <div className="space-y-6">
          {/* Slot Duration */}
          <div className="bg-white rounded-xl border shadow-sm p-5">
            <h3 className="font-heading font-semibold text-primary mb-3">General</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Slot Duration (min)</label>
                <input type="number" value={settings.slotDuration} onChange={e => setSettings(s => ({ ...s, slotDuration: parseInt(e.target.value) || 60 }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                <select value={settings.currency} onChange={e => setSettings(s => ({ ...s, currency: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition">
                  <option value="AUD">AUD</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                  <option value="BDT">BDT</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                <input type="text" value={settings.timezone} onChange={e => setSettings(s => ({ ...s, timezone: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition" />
              </div>
            </div>
          </div>

          {/* Weekly Schedule */}
          <div className="bg-white rounded-xl border shadow-sm p-5">
            <h3 className="font-heading font-semibold text-primary mb-3">Weekly Schedule</h3>
            <div className="space-y-3">
              {DAYS.map(({ key, label }) => {
                const day = settings.weeklyAvailability[key];
                return (
                  <div key={key} className={`flex items-center gap-4 p-3 rounded-lg transition ${day.enabled ? 'bg-green-50' : 'bg-gray-50'}`}>
                    <label className="flex items-center gap-2 w-32 shrink-0 cursor-pointer">
                      <input type="checkbox" checked={day.enabled} onChange={e => updateDay(key, 'enabled', e.target.checked)} className="rounded accent-accent" />
                      <span className={`text-sm font-medium ${day.enabled ? 'text-primary' : 'text-gray-400'}`}>{label}</span>
                    </label>
                    {day.enabled && (
                      <div className="flex items-center gap-2">
                        <input type="time" value={day.start} onChange={e => updateDay(key, 'start', e.target.value)} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-accent outline-none" />
                        <span className="text-muted text-sm">to</span>
                        <input type="time" value={day.end} onChange={e => updateDay(key, 'end', e.target.value)} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-accent outline-none" />
                      </div>
                    )}
                    {!day.enabled && <span className="text-xs text-gray-400">Closed</span>}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Blocked Dates */}
          <div className="bg-white rounded-xl border shadow-sm p-5">
            <h3 className="font-heading font-semibold text-primary mb-3">Blocked Dates</h3>
            <p className="text-sm text-muted mb-3">Block specific dates (holidays, travel, etc.)</p>
            <div className="flex items-center gap-3 mb-3">
              <input type="date" value={newBlockDate} onChange={e => setNewBlockDate(e.target.value)} className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-1 focus:ring-accent outline-none" />
              <button onClick={addBlockDate} className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg text-sm transition"><FiPlus size={14} /> Block</button>
            </div>
            {settings.blockedDates.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {settings.blockedDates.map(d => (
                  <span key={d} className="flex items-center gap-1 bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-medium">
                    {new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    <button onClick={() => removeBlockDate(d)} className="hover:text-red-900"><FiX size={12} /></button>
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400">No blocked dates.</p>
            )}
          </div>

          <button onClick={saveSettings} disabled={saving} className="bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-2.5 rounded-lg transition disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Availability Settings'}
          </button>
        </div>
      )}

      {/* TAB: Service Types / Pricing */}
      {tab === 'services' && settings && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted">Define consultation types with pricing. These appear on the booking page.</p>
            <button onClick={addConsType} className="flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-medium px-4 py-2 rounded-lg transition text-sm">
              <FiPlus size={16} /> Add Type
            </button>
          </div>

          <div className="space-y-4">
            {(settings.consultationTypes || []).map((ct, idx) => (
              <div key={ct.id || idx} className="bg-white rounded-xl border shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-muted">Type #{idx + 1}</span>
                  <button onClick={() => removeConsType(idx)} className="text-red-400 hover:text-red-600 transition"><FiTrash2 size={16} /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input type="text" value={ct.name} onChange={e => updateConsType(idx, 'name', e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
                      <input type="number" value={ct.duration} onChange={e => updateConsType(idx, 'duration', parseInt(e.target.value) || 0)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                      <input type="number" value={ct.price} onChange={e => updateConsType(idx, 'price', parseInt(e.target.value) || 0)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition" />
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea rows={2} value={ct.description} onChange={e => updateConsType(idx, 'description', e.target.value)} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition resize-y" />
                </div>
              </div>
            ))}
          </div>

          {settings.consultationTypes.length > 0 && (
            <button onClick={saveSettings} disabled={saving} className="mt-4 bg-accent hover:bg-accent-dark text-white font-semibold px-6 py-2.5 rounded-lg transition disabled:opacity-50">
              {saving ? 'Saving...' : 'Save Service Types'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
