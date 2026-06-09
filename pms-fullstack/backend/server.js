// backend/server.js
require('dotenv').config();
const express   = require('express');
const mongoose  = require('mongoose');
const cors      = require('cors');

const projectRoutes = require('./routes/projects');
const taskRoutes    = require('./routes/tasks');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Middleware ──────────────────────────────────────────────
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// ── Routes ──────────────────────────────────────────────────
app.use('/api/projects', projectRoutes);
app.use('/api/tasks',    taskRoutes);

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// ── MongoDB Connection ───────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });
