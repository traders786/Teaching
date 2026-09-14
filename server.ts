import express from 'express';
import cookieParser from 'cookie-parser';
import path from 'node:path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { seedDatabase } from './server/db/seed.js';

// Import API routers
import { authRouter } from './server/routes/auth.js';
import { leadsRouter } from './server/routes/leads.js';
import { demosRouter } from './server/routes/demos.js';
import { studentsRouter } from './server/routes/students.js';
import { batchesRouter } from './server/routes/batches.js';
import { coursesRouter } from './server/routes/courses.js';
import { teachersRouter } from './server/routes/teachers.js';
import { paymentsRouter } from './server/routes/payments.js';
import { settingsRouter } from './server/routes/settings.js';
import { statsRouter } from './server/routes/stats.js';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Initialize DB & seeds
  try {
    seedDatabase();
  } catch (err) {
    console.error('Database initialization error:', err);
  }

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // API Health Check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Mount API Routers
  app.use('/api/auth', authRouter);
  app.use('/api/leads', leadsRouter);
  app.use('/api/demos', demosRouter);
  app.use('/api/students', studentsRouter);
  app.use('/api/batches', batchesRouter);
  app.use('/api/courses', coursesRouter);
  app.use('/api/teachers', teachersRouter);
  app.use('/api/payments', paymentsRouter);
  app.use('/api/settings', settingsRouter);
  app.use('/api/stats', statsRouter);

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Speak India Full-Stack Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
