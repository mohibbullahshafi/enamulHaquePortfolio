import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import contentRoutes from './routes/content.js';
import bookingRoutes from './routes/bookings.js';

const app = express();
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Personal Portfolio API is running.' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/bookings', bookingRoutes);

// Legacy contact endpoint redirect
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' });
  }
  // Forward to content route logic
  import('./middleware/db.js').then(({ readData, writeData }) => {
    const data = readData();
    if (!data.messages) data.messages = [];
    data.messages.push({
      id: Date.now().toString(),
      name, email, subject: subject || '', message,
      createdAt: new Date().toISOString(),
      read: false
    });
    writeData(data);
    res.json({ status: 'success', message: 'Contact form received' });
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
