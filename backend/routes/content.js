import { Router } from 'express';
import { readData, writeData } from '../middleware/db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

// ========== PUBLIC ROUTES ==========

// GET /api/content/profile
router.get('/profile', (req, res) => {
  const data = readData();
  res.json(data.profile || {});
});

// GET /api/content/services
router.get('/services', (req, res) => {
  const data = readData();
  res.json(data.services || []);
});

// GET /api/content/publications
router.get('/publications', (req, res) => {
  const data = readData();
  res.json(data.publications || []);
});

// GET /api/content/research-areas
router.get('/research-areas', (req, res) => {
  const data = readData();
  res.json(data.researchAreas || []);
});

// GET /api/content/all — all public content
router.get('/all', (req, res) => {
  const data = readData();
  const { messages, ...publicData } = data;
  res.json(publicData);
});

// POST /api/content/contact — public contact form
router.post('/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }
  const data = readData();
  if (!data.messages) data.messages = [];
  data.messages.push({
    id: Date.now().toString(),
    name,
    email,
    subject: subject || '',
    message,
    createdAt: new Date().toISOString(),
    read: false
  });
  writeData(data);
  res.json({ status: 'success', message: 'Message received' });
});

// ========== ADMIN ROUTES (protected) ==========

// PUT /api/content/profile — update profile
router.put('/profile', authMiddleware, (req, res) => {
  const data = readData();
  data.profile = { ...data.profile, ...req.body };
  writeData(data);
  res.json({ message: 'Profile updated', profile: data.profile });
});

// PUT /api/content/services — update all services
router.put('/services', authMiddleware, (req, res) => {
  const data = readData();
  data.services = req.body;
  writeData(data);
  res.json({ message: 'Services updated', services: data.services });
});

// PUT /api/content/services/:id — update one service
router.put('/services/:id', authMiddleware, (req, res) => {
  const data = readData();
  const idx = (data.services || []).findIndex(s => s.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Service not found' });
  data.services[idx] = { ...data.services[idx], ...req.body };
  writeData(data);
  res.json({ message: 'Service updated', service: data.services[idx] });
});

// PUT /api/content/publications — replace all publications
router.put('/publications', authMiddleware, (req, res) => {
  const data = readData();
  data.publications = req.body;
  writeData(data);
  res.json({ message: 'Publications updated', count: data.publications.length });
});

// POST /api/content/publications — add a single publication
router.post('/publications', authMiddleware, (req, res) => {
  const data = readData();
  if (!data.publications) data.publications = [];
  const pub = { id: Date.now().toString(), ...req.body };
  data.publications.push(pub);
  writeData(data);
  res.json({ message: 'Publication added', publication: pub });
});

// PUT /api/content/publications/:id — update one publication
router.put('/publications/:id', authMiddleware, (req, res) => {
  const data = readData();
  const idx = (data.publications || []).findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Publication not found' });
  data.publications[idx] = { ...data.publications[idx], ...req.body };
  writeData(data);
  res.json({ message: 'Publication updated', publication: data.publications[idx] });
});

// DELETE /api/content/publications/:id — delete one publication
router.delete('/publications/:id', authMiddleware, (req, res) => {
  const data = readData();
  data.publications = (data.publications || []).filter(p => p.id !== req.params.id);
  writeData(data);
  res.json({ message: 'Publication deleted' });
});

// PUT /api/content/research-areas — replace all research areas
router.put('/research-areas', authMiddleware, (req, res) => {
  const data = readData();
  data.researchAreas = req.body;
  writeData(data);
  res.json({ message: 'Research areas updated', count: data.researchAreas.length });
});

// GET /api/content/messages — admin only
router.get('/messages', authMiddleware, (req, res) => {
  const data = readData();
  res.json(data.messages || []);
});

// PUT /api/content/messages/:id/read — mark message read
router.put('/messages/:id/read', authMiddleware, (req, res) => {
  const data = readData();
  const msg = (data.messages || []).find(m => m.id === req.params.id);
  if (!msg) return res.status(404).json({ error: 'Message not found' });
  msg.read = true;
  writeData(data);
  res.json({ message: 'Marked as read' });
});

// DELETE /api/content/messages/:id — delete message
router.delete('/messages/:id', authMiddleware, (req, res) => {
  const data = readData();
  data.messages = (data.messages || []).filter(m => m.id !== req.params.id);
  writeData(data);
  res.json({ message: 'Message deleted' });
});

export default router;
