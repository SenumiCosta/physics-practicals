import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import simulationRoutes from './routes/simulationRoutes.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Routes
app.use('/api/simulations', simulationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  if (err.message === 'Only PDF files are allowed') {
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`\n[PhysicsLab AI] Server running on http://localhost:${PORT}`);
  console.log(`   POST /api/simulations/generate — Upload PDF and generate simulation`);
  console.log(`   GET  /api/simulations          — List all simulations`);
  console.log(`   GET  /api/simulations/:id       — Get a specific simulation\n`);
});
