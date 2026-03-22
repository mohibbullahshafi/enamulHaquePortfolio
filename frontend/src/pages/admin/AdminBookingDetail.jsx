import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiArrowLeft, FiCalendar, FiClock, FiDollarSign, FiMail, FiPhone, FiUser,
  FiCheck, FiX, FiTrash2, FiSend, FiActivity, FiMessageSquare, FiFileText
} from 'react-icons/fi';

const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
  completed: 'bg-green-100 text-green-700 border-green-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
};

const STATUS_DOT = {
  pending: 'bg-yellow-500',
  confirmed: 'bg-blue-500',
  completed: 'bg-green-500',
  cancelled: 'bg-red-500',
};

function formatTime(t) {
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${ampm}`;
}

export default function AdminBookingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { apiFetch } = useAuth();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState('');
  const [noteText, setNoteText] = useState('');
  const [addingNote, setAddingNote] = useState(false);

  useEffect(() => { loadBooking(); }, [id]);

  async function loadBooking() {
    setLoading(true);
    try {
      const res = await apiFetch('/bookings/all');
      const all = await res.json();
      const found = all.find(b => b.id === id);
      if (found) setBooking(found);
    } catch {} finally { setLoading(false); }
  }

  async function updateStatus(status) {
    try {
      const res = await apiFetch(`/bookings/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
      if (res.ok) {
        const { booking: updated } = await res.json();
        setBooking(updated);
        setMsg(`Booking ${status}!`);
      }
    } catch { setMsg('Error updating status.'); }
  }

  async function deleteBooking() {
    if (!confirm('Delete this booking permanently?')) return;
    try {
      await apiFetch(`/bookings/${id}`, { method: 'DELETE' });
      navigate('/admin/bookings');
    } catch { setMsg('Error deleting.'); }
  }

  async function addNote() {
    if (!noteText.trim()) return;
    setAddingNote(true);
    try {
      const res = await apiFetch(`/bookings/${id}/notes`, { method: 'POST', body: JSON.stringify({ note: noteText }) });
      if (res.ok) {
        const { booking: updated } = await res.json();
        setBooking(updated);
        setNoteText('');
        setMsg('Note added!');
      }
    } catch { setMsg('Error adding note.'); }
    finally { setAddingNote(false); }
  }

  async function deleteLog(logIndex) {
    if (!confirm('Delete this log entry?')) return;
    try {
      const res = await apiFetch(`/bookings/${id}/notes/${logIndex}`, { method: 'DELETE' });
      if (res.ok) {
        const { booking: updated } = await res.json();
        setBooking(updated);
        setMsg('Log entry deleted.');
      }
    } catch { setMsg('Error deleting log.'); }
  }

  if (loading) return <p className="text-muted p-6">Loading booking details...</p>;
  if (!booking) return (
    <div className="text-center py-16">
      <p className="text-xl text-muted mb-4">Booking not found</p>
      <button onClick={() => navigate('/admin/bookings')} className="text-accent hover:underline">← Back to Bookings</button>
    </div>
  );

  const logs = booking.logs || [];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/admin/bookings')} className="p-2 rounded-lg hover:bg-gray-100 transition text-muted">
          <FiArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-primary font-heading">Booking Details</h1>
          <p className="text-xs text-muted mt-0.5">ID: {booking.id}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2.5 h-2.5 rounded-full ${STATUS_DOT[booking.status]}`} />
          <span className={`text-xs px-3 py-1 rounded-full font-semibold uppercase ${STATUS_COLORS[booking.status]}`}>{booking.status}</span>
        </div>
      </div>

      {msg && (
        <div className={`rounded-lg p-3 mb-4 text-sm ${msg.includes('!') ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
          {msg}
          <button onClick={() => setMsg('')} className="float-right text-current opacity-50 hover:opacity-100">×</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column — Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Info Card */}
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h2 className="font-heading font-semibold text-primary mb-4 flex items-center gap-2"><FiUser size={16} /> Client Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Name</label>
                <p className="text-sm font-semibold text-primary mt-0.5">{booking.name}</p>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Email</label>
                <p className="text-sm text-primary mt-0.5 flex items-center gap-1.5">
                  <FiMail size={12} className="text-muted" />
                  <a href={`mailto:${booking.email}`} className="hover:text-accent transition">{booking.email}</a>
                </p>
              </div>
              {booking.phone && (
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Phone</label>
                  <p className="text-sm text-primary mt-0.5 flex items-center gap-1.5">
                    <FiPhone size={12} className="text-muted" />
                    <a href={`tel:${booking.phone}`} className="hover:text-accent transition">{booking.phone}</a>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Consultation Details Card */}
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h2 className="font-heading font-semibold text-primary mb-4 flex items-center gap-2"><FiCalendar size={16} /> Consultation Details</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-accent/5 rounded-lg p-3 text-center">
                <FiFileText size={18} className="mx-auto text-accent mb-1" />
                <p className="text-[10px] text-gray-400 uppercase">Type</p>
                <p className="text-xs font-semibold text-primary mt-0.5">{booking.consultationName}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 text-center">
                <FiCalendar size={18} className="mx-auto text-blue-500 mb-1" />
                <p className="text-[10px] text-gray-400 uppercase">Date</p>
                <p className="text-xs font-semibold text-primary mt-0.5">{new Date(booking.date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 text-center">
                <FiClock size={18} className="mx-auto text-purple-500 mb-1" />
                <p className="text-[10px] text-gray-400 uppercase">Time</p>
                <p className="text-xs font-semibold text-primary mt-0.5">{formatTime(booking.time)}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3 text-center">
                <FiDollarSign size={18} className="mx-auto text-green-500 mb-1" />
                <p className="text-[10px] text-gray-400 uppercase">Price</p>
                <p className="text-xs font-semibold text-primary mt-0.5">${booking.price} {booking.currency}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-4 text-xs text-muted">
              <span>Duration: <strong>{booking.duration} min</strong></span>
              <span>•</span>
              <span>Created: {new Date(booking.createdAt).toLocaleString()}</span>
              {booking.updatedAt && <><span>•</span><span>Updated: {new Date(booking.updatedAt).toLocaleString()}</span></>}
            </div>
          </div>

          {/* Client Notes (from booking form) */}
          {booking.notes && (
            <div className="bg-white rounded-xl border shadow-sm p-6">
              <h2 className="font-heading font-semibold text-primary mb-3 flex items-center gap-2"><FiFileText size={16} /> Client's Notes</h2>
              <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-4 leading-relaxed">{booking.notes}</p>
            </div>
          )}

          {/* Notes & Activity Log */}
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h2 className="font-heading font-semibold text-primary mb-4 flex items-center gap-2">
              <FiMessageSquare size={16} /> Notes & Activity Log
              <span className="text-xs bg-gray-100 text-muted px-2 py-0.5 rounded-full ml-1">{logs.length}</span>
            </h2>

            {/* Add Note */}
            <div className="flex gap-2 mb-5">
              <input
                type="text"
                placeholder="Add an admin note, follow-up, or detail..."
                value={noteText}
                onChange={e => setNoteText(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addNote()}
                className="flex-1 px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition"
              />
              <button
                onClick={addNote}
                disabled={addingNote || !noteText.trim()}
                className="flex items-center gap-2 bg-accent hover:bg-accent-dark text-white px-5 py-2.5 rounded-lg text-sm font-medium transition disabled:opacity-50"
              >
                <FiSend size={14} />
                {addingNote ? 'Adding...' : 'Add Note'}
              </button>
            </div>

            {/* Timeline */}
            {logs.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <FiMessageSquare size={28} className="mx-auto mb-2 opacity-30" />
                <p className="text-sm">No notes or activity yet</p>
                <p className="text-xs mt-1">Add a note above to start tracking.</p>
              </div>
            ) : (
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gray-200" />

                <div className="space-y-4">
                  {[...logs].reverse().map((log, i) => {
                    const realIdx = logs.length - 1 - i;
                    return (
                      <div key={i} className="flex items-start gap-4 group relative">
                        <div className={`relative z-10 mt-0.5 w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${log.type === 'status' ? 'bg-blue-100 text-blue-600' : 'bg-amber-100 text-amber-600'}`}>
                          {log.type === 'status' ? <FiActivity size={14} /> : <FiMessageSquare size={14} />}
                        </div>
                        <div className="flex-1 min-w-0 pb-1">
                          {log.type === 'status' ? (
                            <div className="bg-blue-50/50 border border-blue-100 rounded-lg px-4 py-3">
                              <p className="text-sm text-gray-700">
                                Status changed from{' '}
                                <span className={`inline-block font-medium text-xs px-2 py-0.5 rounded ${STATUS_COLORS[log.from] || 'bg-gray-100 text-gray-600'}`}>{log.from}</span>
                                {' '}→{' '}
                                <span className={`inline-block font-medium text-xs px-2 py-0.5 rounded ${STATUS_COLORS[log.to] || 'bg-gray-100 text-gray-600'}`}>{log.to}</span>
                              </p>
                              <p className="text-[10px] text-gray-400 mt-1">{new Date(log.timestamp).toLocaleString()}</p>
                            </div>
                          ) : (
                            <div className="bg-white border rounded-lg px-4 py-3 shadow-sm">
                              <p className="text-sm text-gray-700 leading-relaxed">{log.text}</p>
                              <div className="flex items-center justify-between mt-2">
                                <p className="text-[10px] text-gray-400">{new Date(log.timestamp).toLocaleString()}</p>
                                <button
                                  onClick={() => deleteLog(realIdx)}
                                  className="p-1 rounded text-gray-300 hover:text-red-500 hover:bg-red-50 transition opacity-0 group-hover:opacity-100"
                                  title="Delete note"
                                >
                                  <FiTrash2 size={12} />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column — Actions & Summary */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="font-heading font-semibold text-primary mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {booking.status === 'pending' && (
                <>
                  <button onClick={() => updateStatus('confirmed')} className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition">
                    <FiCheck size={16} /> Confirm Booking
                  </button>
                  <button onClick={() => updateStatus('cancelled')} className="w-full flex items-center justify-center gap-2 bg-white border border-red-300 text-red-500 hover:bg-red-50 px-4 py-2.5 rounded-lg text-sm font-medium transition">
                    <FiX size={16} /> Cancel Booking
                  </button>
                </>
              )}
              {booking.status === 'confirmed' && (
                <button onClick={() => updateStatus('completed')} className="w-full flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition">
                  <FiCheck size={16} /> Mark as Completed
                </button>
              )}
              {(booking.status === 'cancelled' || booking.status === 'completed') && (
                <button onClick={() => updateStatus('pending')} className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-600 hover:bg-gray-50 px-4 py-2.5 rounded-lg text-sm font-medium transition">
                  Reopen as Pending
                </button>
              )}
              <hr className="my-2" />
              <button onClick={deleteBooking} className="w-full flex items-center justify-center gap-2 text-red-400 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg text-sm transition">
                <FiTrash2 size={14} /> Delete Booking
              </button>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="font-heading font-semibold text-primary mb-4">Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Consultation</span>
                <span className="font-medium text-primary">{booking.consultationName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Duration</span>
                <span className="font-medium text-primary">{booking.duration} min</span>
              </div>
              <hr />
              <div className="flex justify-between">
                <span className="text-muted">Amount</span>
                <span className="font-bold text-lg text-accent">${booking.price} {booking.currency}</span>
              </div>
            </div>
          </div>

          {/* Timeline Stats */}
          <div className="bg-white rounded-xl border shadow-sm p-6">
            <h3 className="font-heading font-semibold text-primary mb-4">Activity Stats</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted">Admin Notes</span>
                <span className="font-medium text-primary">{logs.filter(l => l.type === 'note').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Status Changes</span>
                <span className="font-medium text-primary">{logs.filter(l => l.type === 'status').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Total Activity</span>
                <span className="font-medium text-primary">{logs.length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
