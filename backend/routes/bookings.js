import { Router } from 'express';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { authMiddleware } from '../middleware/auth.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const BOOKINGS_FILE = join(__dirname, '..', 'data', 'bookings.json');

function readBookings() {
  if (!existsSync(BOOKINGS_FILE)) {
    const init = { settings: defaultSettings(), bookings: [] };
    writeFileSync(BOOKINGS_FILE, JSON.stringify(init, null, 2));
    return init;
  }
  return JSON.parse(readFileSync(BOOKINGS_FILE, 'utf-8'));
}

function writeBookings(data) {
  writeFileSync(BOOKINGS_FILE, JSON.stringify(data, null, 2));
}

function defaultSettings() {
  return {
    slotDuration: 60,
    currency: 'AUD',
    timezone: 'Australia/Melbourne',
    weeklyAvailability: {
      mon: { enabled: true, start: '09:00', end: '17:00' },
      tue: { enabled: true, start: '09:00', end: '17:00' },
      wed: { enabled: true, start: '09:00', end: '17:00' },
      thu: { enabled: true, start: '09:00', end: '17:00' },
      fri: { enabled: true, start: '09:00', end: '17:00' },
      sat: { enabled: false, start: '09:00', end: '13:00' },
      sun: { enabled: false, start: '09:00', end: '13:00' },
    },
    blockedDates: [],
    consultationTypes: [
      { id: '1', name: 'Research Consultation', duration: 60, price: 150, description: 'One-on-one discussion about research projects, methodologies, and collaboration opportunities.' },
      { id: '2', name: 'Industry Consultation', duration: 90, price: 250, description: 'Technical advisory for renewable energy, EV systems, and smart grid projects.' },
      { id: '3', name: 'Academic Mentoring', duration: 45, price: 100, description: 'PhD/Masters student mentoring, research direction guidance, and academic career advice.' },
      { id: '4', name: 'Training Workshop', duration: 120, price: 400, description: 'Customized training on power electronics, renewable integration, or energy storage systems.' },
    ],
  };
}

const router = Router();

// ========== PUBLIC ROUTES ==========

// GET /api/bookings/settings — public booking settings (availability, types, etc)
router.get('/settings', (req, res) => {
  const data = readBookings();
  const s = data.settings || defaultSettings();
  res.json({
    slotDuration: s.slotDuration,
    currency: s.currency,
    timezone: s.timezone,
    weeklyAvailability: s.weeklyAvailability,
    blockedDates: s.blockedDates,
    consultationTypes: s.consultationTypes,
  });
});

// GET /api/bookings/available-slots?date=2026-03-25 — get available time slots for a date
router.get('/available-slots', (req, res) => {
  const { date } = req.query;
  if (!date) return res.status(400).json({ error: 'Date is required (YYYY-MM-DD)' });

  const data = readBookings();
  const settings = data.settings || defaultSettings();

  // Check if date is blocked
  if (settings.blockedDates.includes(date)) {
    return res.json({ date, slots: [], blocked: true });
  }

  // Get day of week
  const dayMap = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const d = new Date(date + 'T00:00:00');
  const dayKey = dayMap[d.getDay()];
  const dayConfig = settings.weeklyAvailability[dayKey];

  if (!dayConfig || !dayConfig.enabled) {
    return res.json({ date, slots: [], closed: true });
  }

  // Generate slots
  const [startH, startM] = dayConfig.start.split(':').map(Number);
  const [endH, endM] = dayConfig.end.split(':').map(Number);
  const startMin = startH * 60 + startM;
  const endMin = endH * 60 + endM;
  const duration = settings.slotDuration || 60;

  const allSlots = [];
  for (let m = startMin; m + duration <= endMin; m += duration) {
    const h = Math.floor(m / 60);
    const mi = m % 60;
    allSlots.push(`${String(h).padStart(2, '0')}:${String(mi).padStart(2, '0')}`);
  }

  // Remove already booked slots
  const bookedTimes = (data.bookings || [])
    .filter(b => b.date === date && b.status !== 'cancelled')
    .map(b => b.time);

  const available = allSlots.filter(s => !bookedTimes.includes(s));

  res.json({ date, slots: available, total: allSlots.length });
});

// POST /api/bookings — create a booking (public)
router.post('/', (req, res) => {
  const { name, email, phone, date, time, consultationType, notes } = req.body;

  if (!name || !email || !date || !time || !consultationType) {
    return res.status(400).json({ error: 'Name, email, date, time, and consultation type are required' });
  }

  // Basic email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  const data = readBookings();
  const settings = data.settings || defaultSettings();

  // Check if slot is available
  const existing = (data.bookings || []).find(
    b => b.date === date && b.time === time && b.status !== 'cancelled'
  );
  if (existing) {
    return res.status(409).json({ error: 'This time slot is already booked' });
  }

  // Find consultation type details
  const typeInfo = (settings.consultationTypes || []).find(t => t.id === consultationType);
  if (!typeInfo) {
    return res.status(400).json({ error: 'Invalid consultation type' });
  }

  const booking = {
    id: Date.now().toString(),
    name,
    email,
    phone: phone || '',
    date,
    time,
    consultationType: typeInfo.id,
    consultationName: typeInfo.name,
    duration: typeInfo.duration,
    price: typeInfo.price,
    currency: settings.currency,
    notes: notes || '',
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  if (!data.bookings) data.bookings = [];
  data.bookings.push(booking);
  writeBookings(data);

  res.json({
    message: 'Booking request submitted successfully!',
    booking: {
      id: booking.id,
      date: booking.date,
      time: booking.time,
      consultationName: booking.consultationName,
      duration: booking.duration,
      price: booking.price,
      currency: booking.currency,
      status: booking.status,
    },
  });
});

// ========== ADMIN ROUTES ==========

// GET /api/bookings/all — all bookings (admin)
router.get('/all', authMiddleware, (req, res) => {
  const data = readBookings();
  res.json(data.bookings || []);
});

// PUT /api/bookings/:id/status — update booking status (admin)
router.put('/:id/status', authMiddleware, (req, res) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }

  const data = readBookings();
  const booking = (data.bookings || []).find(b => b.id === req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  const oldStatus = booking.status;
  booking.status = status;
  booking.updatedAt = new Date().toISOString();
  if (!booking.logs) booking.logs = [];
  booking.logs.push({ type: 'status', from: oldStatus, to: status, timestamp: new Date().toISOString() });
  writeBookings(data);
  res.json({ message: 'Booking status updated', booking });
});

// POST /api/bookings/:id/notes — add admin note to booking
router.post('/:id/notes', authMiddleware, (req, res) => {
  const { note } = req.body;
  if (!note || !note.trim()) return res.status(400).json({ error: 'Note text is required' });

  const data = readBookings();
  const booking = (data.bookings || []).find(b => b.id === req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  if (!booking.logs) booking.logs = [];
  booking.logs.push({ type: 'note', text: note.trim(), timestamp: new Date().toISOString() });
  booking.updatedAt = new Date().toISOString();
  writeBookings(data);
  res.json({ message: 'Note added', booking });
});

// DELETE /api/bookings/:id/notes/:index — delete a specific log entry
router.delete('/:id/notes/:index', authMiddleware, (req, res) => {
  const data = readBookings();
  const booking = (data.bookings || []).find(b => b.id === req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });

  const idx = parseInt(req.params.index);
  if (!booking.logs || idx < 0 || idx >= booking.logs.length) {
    return res.status(400).json({ error: 'Invalid log index' });
  }
  booking.logs.splice(idx, 1);
  booking.updatedAt = new Date().toISOString();
  writeBookings(data);
  res.json({ message: 'Log entry deleted', booking });
});

// DELETE /api/bookings/:id — delete a booking (admin)
router.delete('/:id', authMiddleware, (req, res) => {
  const data = readBookings();
  data.bookings = (data.bookings || []).filter(b => b.id !== req.params.id);
  writeBookings(data);
  res.json({ message: 'Booking deleted' });
});

// GET /api/bookings/admin-settings — full settings (admin)
router.get('/admin-settings', authMiddleware, (req, res) => {
  const data = readBookings();
  res.json(data.settings || defaultSettings());
});

// PUT /api/bookings/admin-settings — update settings (admin)
router.put('/admin-settings', authMiddleware, (req, res) => {
  const data = readBookings();
  data.settings = { ...(data.settings || defaultSettings()), ...req.body };
  writeBookings(data);
  res.json({ message: 'Settings updated', settings: data.settings });
});

export default router;
