import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { JWT_SECRET } from '../middleware/auth.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ADMIN_FILE = join(__dirname, '..', 'data', 'admin.json');

const router = Router();

function getAdmin() {
  if (!existsSync(ADMIN_FILE)) return null;
  return JSON.parse(readFileSync(ADMIN_FILE, 'utf-8'));
}

function saveAdmin(data) {
  writeFileSync(ADMIN_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// POST /api/auth/setup — one-time admin setup
router.post('/setup', async (req, res) => {
  if (getAdmin()) {
    return res.status(400).json({ error: 'Admin already exists' });
  }
  const { username, password } = req.body;
  if (!username || !password || password.length < 6) {
    return res.status(400).json({ error: 'Username and password (min 6 chars) required' });
  }
  const hash = await bcrypt.hash(password, 10);
  saveAdmin({ username, password: hash });
  res.json({ message: 'Admin created successfully' });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const admin = getAdmin();
  if (!admin) {
    return res.status(400).json({ error: 'Admin not set up. POST /api/auth/setup first.' });
  }
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  if (username !== admin.username || !(await bcrypt.compare(password, admin.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' });
  res.json({ token, username });
});

export default router;
