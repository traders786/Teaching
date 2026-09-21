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
        brandName: 'upspeaq',
        tagline: 'Every Child Deserves the Confidence to Speak',
        contactEmail: 'upspeaqofficial@gmail.com',
        contactPhone: '+91 7004132088',
        supportWhatsapp: '+91 7004132088',
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

// GET /api/settings/meet (Admin - Google Meet settings)
settingsRouter.get(['/meet', '/zoom'], verifyToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const row = db.prepare('SELECT value_json FROM settings WHERE key = ?').get('google_meet_settings') as any;
    let saved = {
      defaultMeetingUrl: '',
      workspaceDomain: 'meet.google.com',
      defaultRoomPrefix: 'upspeaq-demo',
    };
    if (row && row.value_json) {
      saved = { ...saved, ...JSON.parse(row.value_json) };
    }

    return res.json({
      configured: true,
      provider: 'GOOGLE_MEET',
      defaultMeetingUrl: saved.defaultMeetingUrl,
      workspaceDomain: saved.workspaceDomain,
      defaultRoomPrefix: saved.defaultRoomPrefix,
      // Backward compatibility fields for legacy clients
      accountId: '',
      clientId: '',
      hasSecret: true,
      clientSecretMasked: '',
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to retrieve Google Meet settings.' });
  }
});

// PUT /api/settings/meet (Admin - save Google Meet settings)
settingsRouter.put(['/meet', '/zoom'], verifyToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { defaultMeetingUrl, workspaceDomain, defaultRoomPrefix } = req.body;
    const current = db.prepare('SELECT value_json FROM settings WHERE key = ?').get('google_meet_settings') as any;
    let existing = {
      defaultMeetingUrl: '',
      workspaceDomain: 'meet.google.com',
      defaultRoomPrefix: 'upspeaq-demo',
    };
    if (current && current.value_json) {
      existing = { ...existing, ...JSON.parse(current.value_json) };
    }

    const toSave = {
      defaultMeetingUrl: defaultMeetingUrl !== undefined ? defaultMeetingUrl.trim() : existing.defaultMeetingUrl,
      workspaceDomain: workspaceDomain !== undefined ? workspaceDomain.trim() : existing.workspaceDomain,
      defaultRoomPrefix: defaultRoomPrefix !== undefined ? defaultRoomPrefix.trim() : existing.defaultRoomPrefix,
    };

    db.prepare(`
      INSERT INTO settings (key, value_json, updated_at)
      VALUES ('google_meet_settings', ?, CURRENT_TIMESTAMP)
      ON CONFLICT(key) DO UPDATE SET value_json = excluded.value_json, updated_at = CURRENT_TIMESTAMP
    `).run(JSON.stringify(toSave));

    return res.json({
      success: true,
      message: 'Google Meet configuration updated successfully!',
      configured: true,
      settings: toSave,
    });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to update Google Meet settings.' });
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
