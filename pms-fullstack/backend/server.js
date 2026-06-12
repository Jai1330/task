// backend/server.js

require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 5000;

// ── CORS Configuration ──────────────────────────────────────
const allowedOrigins = [
  'https://6a2bf189c9111b0afb7aea34--marvelous-klepon-d3f2dc.netlify.app'
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (Postman, mobile apps, etc.)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  })
);

// ── Middleware ──────────────────────────────────────────────
app.use(express.json());

// ── Routes ──────────────────────────────────────────────────
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

// ── Health Check ────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Server is running',
  });
});

// ── MongoDB Connection ──────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });