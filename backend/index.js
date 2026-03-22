import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// Contact form endpoint (to be extended)
app.post('/api/contact', (req, res) => {
  // TODO: handle contact form submission
  res.json({ status: 'success', message: 'Contact form received (placeholder)' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
