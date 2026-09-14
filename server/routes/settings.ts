import { Router, Request, Response } from 'express';
import { db } from '../db/schema.js';
import { verifyToken, AuthenticatedRequest } from '../middleware/auth.js';

export const settingsRouter = Router();

// GET /api/settings/branding (Public)
settingsRouter.get(['/', '/branding'], (req: Request, res: Response) => {
  try {
    const row = db.prepare('SELECT value_json FROM settings WHERE key = ?').get('branding') as any;
    if (row && row.value_json) {
      return res.json({ branding: JSON.parse(row.value_json) });
    }
    return res.json({
      branding: {
        brandName: 'Speak India',
        tagline: 'Every Child Deserves the Confidence to Speak',
        contactEmail: 'admissions@speakindia.in',
        contactPhone: '+91 98765 43210',
        supportWhatsapp: '+91 98765 43210',
        primaryColor: '#1E293B',
        accentColor: '#D97706',
        flagshipPrice: 4999,
        currency: 'INR',
        demoDurationMinutes: 45,
        classBatchTargetSize: 8,
        classBatchMaxSize: 9,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve settings.' });
  }
});

// PUT /api/settings/branding (Admin)
settingsRouter.put('/branding', verifyToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const updatedValues = req.body;
    db.prepare(`
      INSERT INTO settings (key, value_json, updated_at)
      VALUES ('branding', ?, CURRENT_TIMESTAMP)
      ON CONFLICT(key) DO UPDATE SET value_json = excluded.value_json, updated_at = CURRENT_TIMESTAMP
    `).run(JSON.stringify(updatedValues));

    // Also update course price if flagshipPrice was changed
    if (updatedValues.flagshipPrice) {
      db.prepare(`
        UPDATE courses SET price_inr = ? WHERE is_flagship = 1
      `).run(parseInt(updatedValues.flagshipPrice, 10));
    }

    return res.json({ success: true, branding: updatedValues, message: 'Branding configuration updated.' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update branding configuration.' });
  }
});
