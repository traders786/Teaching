import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { seedDatabase } from '../server/db/seed.js';

import { authRouter } from '../server/routes/auth.js';
import { leadsRouter } from '../server/routes/leads.js';
import { demosRouter } from '../server/routes/demos.js';
import { studentsRouter } from '../server/routes/students.js';
import { batchesRouter } from '../server/routes/batches.js';
import { coursesRouter } from '../server/routes/courses.js';
import { teachersRouter } from '../server/routes/teachers.js';
import { paymentsRouter } from '../server/routes/payments.js';
import { settingsRouter } from '../server/routes/settings.js';
import { statsRouter } from '../server/routes/stats.js';
import { teacherPortalRouter } from '../server/routes/teacherPortal.js';
import { studentPortalRouter } from '../server/routes/studentPortal.js';
import { helpdeskRouter } from '../server/routes/helpdesk.js';
import { curriculumRouter } from '../server/routes/curriculum.js';
import { notificationsRouter } from '../server/routes/notifications.js';

dotenv.config();

const app = express();

try {
  seedDatabase();
} catch (err) {
  console.error('Database initialization error:', err);
}

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use(cookieParser());

// CORS Middleware for GitHub Pages & Web Clients
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', brand: 'upspeaq', time: new Date().toISOString() });
});

// Mount Routers
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
app.use('/api/teacher', teacherPortalRouter);
app.use('/api/student', studentPortalRouter);
app.use('/api/helpdesk', helpdeskRouter);
app.use('/api/curriculum', curriculumRouter);
app.use('/api/notifications', notificationsRouter);

export default app;
