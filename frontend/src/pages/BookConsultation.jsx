import { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiDollarSign, FiCheck, FiChevronLeft, FiChevronRight, FiUser, FiMail, FiPhone, FiFileText } from 'react-icons/fi';

const API = 'http://localhost:5001/api';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAY_KEYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

function formatTime(t) {
  const [h, m] = t.split(':').map(Number);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const hr = h % 12 || 12;
  return `${hr}:${String(m).padStart(2, '0')} ${ampm}`;
}

export default function BookConsultation() {
  const [settings, setSettings] = useState(null);
  const [step, setStep] = useState(1); // 1=service, 2=date, 3=time, 4=details, 5=confirm, 6=success
  const [selectedType, setSelectedType] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  // Calendar state
  const today = new Date();
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [calYear, setCalYear] = useState(today.getFullYear());

  useEffect(() => {
    fetch(`${API}/bookings/settings`).then(r => r.json()).then(setSettings).catch(() => {});
  }, []);

  // Load time slots when date is selected
  useEffect(() => {
    if (!selectedDate) return;
    setSlotsLoading(true);
    fetch(`${API}/bookings/available-slots?date=${selectedDate}`)
      .then(r => r.json())
      .then(data => { setSlots(data.slots || []); setSlotsLoading(false); })
      .catch(() => setSlotsLoading(false));
  }, [selectedDate]);

  // Calendar helpers
  function getDaysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }
  function getFirstDay(y, m) { return new Date(y, m, 1).getDay(); }

  function isDateAvailable(dateStr) {
    if (!settings) return false;
    const d = new Date(dateStr + 'T00:00:00');
    const dayKey = DAY_KEYS[d.getDay()];
    const dayConf = settings.weeklyAvailability?.[dayKey];
    if (!dayConf?.enabled) return false;
    if (settings.blockedDates?.includes(dateStr)) return false;
    // Must be today or future
    const todayStr = today.toISOString().split('T')[0];
    return dateStr >= todayStr;
  }

  function prevMonth() {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
  }
  function nextMonth() {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
  }

  async function handleSubmit() {
    if (!form.name || !form.email) { setError('Name and email are required.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) { setError('Please enter a valid email.'); return; }
    setError('');
    setSubmitting(true);

    try {
      const res = await fetch(`${API}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          date: selectedDate,
          time: selectedTime,
          consultationType: selectedType.id,
          notes: form.notes,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data.booking);
      setStep(6);
    } catch (err) {
      setError(err.message || 'Booking failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  if (!settings) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted">Loading booking system...</div>
      </div>
    );
  }

  const currency = settings.currency || 'AUD';

  // Build calendar grid
  const daysInMonth = getDaysInMonth(calYear, calMonth);
  const firstDay = getFirstDay(calYear, calMonth);
  const calendarCells = [];
  for (let i = 0; i < firstDay; i++) calendarCells.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarCells.push(d);

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-r from-primary to-slate-800 text-white">
        <div className="section-container text-center">
          <p className="text-accent font-semibold text-sm uppercase tracking-widest mb-3">Book a Session</p>
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold mb-4">Schedule a Consultation</h1>
          <p className="text-gray-300 max-w-2xl mx-auto">Pick a service, choose a date & time, and book your session in just a few steps.</p>
        </div>
      </section>

      <section className="section-container">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {['Service', 'Date', 'Time', 'Details', 'Confirm'].map((label, i) => {
            const stepNum = i + 1;
            const active = step === stepNum;
            const done = step > stepNum;
            return (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${done ? 'bg-green-500 text-white' : active ? 'bg-accent text-white' : 'bg-gray-200 text-gray-500'}`}>
                  {done ? <FiCheck size={14} /> : stepNum}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${active ? 'text-accent' : done ? 'text-green-600' : 'text-gray-400'}`}>{label}</span>
                {i < 4 && <div className={`w-8 h-0.5 ${done ? 'bg-green-500' : 'bg-gray-200'}`} />}
              </div>
            );
          })}
        </div>

        {/* Step 1: Select Service */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-heading font-bold text-primary mb-2 text-center">Choose a Service</h2>
            <p className="text-sm text-muted text-center mb-8">Select the type of consultation you need.</p>
            <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {(settings.consultationTypes || []).map(ct => (
                <button
                  key={ct.id}
                  onClick={() => { setSelectedType(ct); setStep(2); }}
                  className={`text-left p-5 rounded-xl border-2 transition-all hover:shadow-md ${selectedType?.id === ct.id ? 'border-accent bg-accent/5' : 'border-gray-200 hover:border-accent/50'}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-heading font-semibold text-primary">{ct.name}</h3>
                    <span className="text-accent font-bold text-lg">${ct.price}</span>
                  </div>
                  <p className="text-sm text-muted mb-3">{ct.description}</p>
                  <div className="flex items-center gap-4 text-xs text-muted">
                    <span className="flex items-center gap-1"><FiClock size={12} /> {ct.duration} min</span>
                    <span className="flex items-center gap-1"><FiDollarSign size={12} /> {currency}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Pick Date */}
        {step === 2 && (
          <div className="max-w-md mx-auto">
            <h2 className="text-xl font-heading font-bold text-primary mb-2 text-center">Pick a Date</h2>
            <p className="text-sm text-muted text-center mb-6">Green dates are available for booking.</p>

            {/* Calendar */}
            <div className="bg-white rounded-2xl border shadow-sm p-5">
              {/* Month Nav */}
              <div className="flex items-center justify-between mb-4">
                <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-gray-100 transition"><FiChevronLeft /></button>
                <h3 className="font-heading font-semibold text-primary">{MONTHS[calMonth]} {calYear}</h3>
                <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-gray-100 transition"><FiChevronRight /></button>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {DAYS.map(d => <div key={d} className="text-center text-xs font-medium text-muted py-1">{d}</div>)}
              </div>

              {/* Days grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarCells.map((day, i) => {
                  if (!day) return <div key={`e-${i}`} />;
                  const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                  const available = isDateAvailable(dateStr);
                  const isSelected = selectedDate === dateStr;
                  const isToday = dateStr === today.toISOString().split('T')[0];

                  return (
                    <button
                      key={dateStr}
                      disabled={!available}
                      onClick={() => { setSelectedDate(dateStr); setSelectedTime(null); setStep(3); }}
                      className={`aspect-square rounded-lg text-sm font-medium transition-all flex items-center justify-center ${
                        isSelected ? 'bg-accent text-white ring-2 ring-accent/30' :
                        available ? 'bg-green-50 text-green-700 hover:bg-green-100 hover:shadow-sm cursor-pointer' :
                        'text-gray-300 cursor-not-allowed'
                      } ${isToday && !isSelected ? 'ring-2 ring-accent/40' : ''}`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center gap-4 mt-4 pt-3 border-t text-xs text-muted justify-center">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-green-50 border border-green-200" /> Available</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-100" /> Unavailable</span>
              </div>
            </div>

            <button onClick={() => setStep(1)} className="mt-4 text-sm text-accent hover:underline">← Change service</button>
          </div>
        )}

        {/* Step 3: Pick Time */}
        {step === 3 && (
          <div className="max-w-md mx-auto">
            <h2 className="text-xl font-heading font-bold text-primary mb-2 text-center">Pick a Time</h2>
            <p className="text-sm text-muted text-center mb-6">
              Available slots for <span className="font-medium text-primary">{new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
            </p>

            {slotsLoading ? (
              <div className="text-center py-8 text-muted animate-pulse">Loading available slots...</div>
            ) : slots.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted mb-3">No available slots for this date.</p>
                <button onClick={() => setStep(2)} className="text-sm text-accent hover:underline">← Pick another date</button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-3">
                  {slots.map(slot => (
                    <button
                      key={slot}
                      onClick={() => { setSelectedTime(slot); setStep(4); }}
                      className={`py-3 rounded-xl text-sm font-medium transition-all ${
                        selectedTime === slot ? 'bg-accent text-white shadow-md' : 'bg-white border border-gray-200 text-primary hover:border-accent hover:text-accent hover:shadow-sm'
                      }`}
                    >
                      {formatTime(slot)}
                    </button>
                  ))}
                </div>
                <button onClick={() => setStep(2)} className="mt-4 text-sm text-accent hover:underline">← Change date</button>
              </>
            )}
          </div>
        )}

        {/* Step 4: Your Details */}
        {step === 4 && (
          <div className="max-w-lg mx-auto">
            <h2 className="text-xl font-heading font-bold text-primary mb-2 text-center">Your Details</h2>
            <p className="text-sm text-muted text-center mb-6">Fill in your contact information.</p>

            {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">{error}</div>}

            <div className="bg-white rounded-2xl border shadow-sm p-6 space-y-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1"><FiUser size={14} /> Full Name *</label>
                <input type="text" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition" placeholder="Your full name" />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1"><FiMail size={14} /> Email *</label>
                <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition" placeholder="your@email.com" />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1"><FiPhone size={14} /> Phone</label>
                <input type="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition" placeholder="+61..." />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1"><FiFileText size={14} /> Notes (optional)</label>
                <textarea rows={3} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-accent outline-none transition resize-y" placeholder="Tell us about your consultation needs..." />
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <button onClick={() => setStep(3)} className="text-sm text-accent hover:underline">← Change time</button>
              <button onClick={() => { setError(''); setStep(5); }} className="btn-primary"><FiCheck className="mr-1" /> Review Booking</button>
            </div>
          </div>
        )}

        {/* Step 5: Confirm */}
        {step === 5 && (
          <div className="max-w-lg mx-auto">
            <h2 className="text-xl font-heading font-bold text-primary mb-2 text-center">Confirm Your Booking</h2>
            <p className="text-sm text-muted text-center mb-6">Review and confirm your consultation details.</p>

            {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">{error}</div>}

            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
              {/* Booking Summary */}
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">Service</span>
                  <span className="font-medium text-primary">{selectedType?.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">Date</span>
                  <span className="font-medium text-primary">{new Date(selectedDate + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">Time</span>
                  <span className="font-medium text-primary">{formatTime(selectedTime)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">Duration</span>
                  <span className="font-medium text-primary">{selectedType?.duration} minutes</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">Client</span>
                  <span className="font-medium text-primary">{form.name}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted">Email</span>
                  <span className="font-medium text-primary">{form.email}</span>
                </div>
                {form.phone && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted">Phone</span>
                    <span className="font-medium text-primary">{form.phone}</span>
                  </div>
                )}
                {form.notes && (
                  <div>
                    <span className="text-sm text-muted block mb-1">Notes</span>
                    <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3">{form.notes}</p>
                  </div>
                )}
              </div>

              {/* Total */}
              <div className="bg-accent/5 border-t p-6">
                <div className="flex items-center justify-between">
                  <span className="font-heading font-semibold text-primary">Total Amount</span>
                  <span className="text-2xl font-heading font-extrabold text-accent">${selectedType?.price} <span className="text-sm font-normal text-muted">{currency}</span></span>
                </div>
                <p className="text-xs text-muted mt-1">Payment details will be shared upon confirmation.</p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-6">
              <button onClick={() => setStep(4)} className="text-sm text-accent hover:underline">← Edit details</button>
              <button onClick={handleSubmit} disabled={submitting} className="btn-primary px-8">
                {submitting ? 'Submitting...' : 'Confirm Booking'}
              </button>
            </div>
          </div>
        )}

        {/* Step 6: Success */}
        {step === 6 && result && (
          <div className="max-w-md mx-auto text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCheck className="text-green-600" size={28} />
            </div>
            <h2 className="text-2xl font-heading font-bold text-primary mb-2">Booking Submitted!</h2>
            <p className="text-muted mb-6">Your consultation request has been received. You'll receive a confirmation email shortly.</p>

            <div className="bg-white rounded-2xl border shadow-sm p-6 text-left space-y-3 mb-6">
              <div className="flex justify-between"><span className="text-sm text-muted">Booking ID</span><span className="text-sm font-mono text-primary">#{result.id}</span></div>
              <div className="flex justify-between"><span className="text-sm text-muted">Service</span><span className="text-sm font-medium text-primary">{result.consultationName}</span></div>
              <div className="flex justify-between"><span className="text-sm text-muted">Date & Time</span><span className="text-sm font-medium text-primary">{new Date(result.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {formatTime(result.time)}</span></div>
              <div className="flex justify-between"><span className="text-sm text-muted">Amount</span><span className="text-sm font-bold text-accent">${result.price} {result.currency}</span></div>
              <div className="flex justify-between"><span className="text-sm text-muted">Status</span><span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-medium">Pending Confirmation</span></div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <a href="/consultancy" className="btn-outline text-sm">Back to Services</a>
              <button onClick={() => { setStep(1); setSelectedType(null); setSelectedDate(null); setSelectedTime(null); setForm({ name: '', email: '', phone: '', notes: '' }); setResult(null); }} className="btn-primary text-sm">Book Another</button>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
