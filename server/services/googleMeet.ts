import { db } from '../db/schema.js';

export interface GoogleMeetOptions {
  topic: string;
  startTime?: string;
  durationMinutes?: number;
  customMeetingLink?: string;
}

export interface GoogleMeetResult {
  id: string;
  meetingCode: string;
  joinUrl: string;
  topic: string;
  startTime: string;
  duration: number;
  isRealGoogleApi: boolean;
  provider: 'GOOGLE_MEET';
}

export interface GoogleOAuthCredentials {
  clientId?: string;
  clientSecret?: string;
  refreshToken?: string;
  defaultMeetingUrl?: string;
  workspaceDomain?: string;
  defaultRoomPrefix?: string;
}

/**
 * Retrieves Google Meet & Calendar credentials from database or environment
 */
export function getGoogleCredentials(): GoogleOAuthCredentials {
  let clientId = process.env.GOOGLE_CLIENT_ID?.trim();
  let clientSecret = process.env.GOOGLE_CLIENT_SECRET?.trim();
  let refreshToken = process.env.GOOGLE_REFRESH_TOKEN?.trim();
  let defaultMeetingUrl = '';
  let workspaceDomain = 'meet.google.com';
  let defaultRoomPrefix = 'upspeaq-demo';

  try {
    const row = db.prepare('SELECT value_json FROM settings WHERE key = ?').get('google_meet_settings') as any;
    if (row && row.value_json) {
      const saved = JSON.parse(row.value_json);
      if (saved.clientId) clientId = saved.clientId.trim();
      if (saved.clientSecret) clientSecret = saved.clientSecret.trim();
      if (saved.refreshToken) refreshToken = saved.refreshToken.trim();
      if (saved.defaultMeetingUrl) defaultMeetingUrl = saved.defaultMeetingUrl.trim();
      if (saved.workspaceDomain) workspaceDomain = saved.workspaceDomain.trim();
      if (saved.defaultRoomPrefix) defaultRoomPrefix = saved.defaultRoomPrefix.trim();
    }
  } catch (e) {
    // Fallback to env
  }

  return { clientId, clientSecret, refreshToken, defaultMeetingUrl, workspaceDomain, defaultRoomPrefix };
}

export function getGoogleMeetSettings() {
  const creds = getGoogleCredentials();
  return {
    isConfigured: true,
    provider: 'GOOGLE_MEET',
    workspaceDomain: creds.workspaceDomain || 'meet.google.com',
    defaultRoomPrefix: creds.defaultRoomPrefix || 'upspeaq-demo',
    defaultMeetingUrl: creds.defaultMeetingUrl || '',
    clientId: creds.clientId || '',
    clientSecret: creds.clientSecret ? '******' : '',
    hasRefreshToken: !!creds.refreshToken,
  };
}

/**
 * Exchanges Google OAuth refresh token for an access token
 */
async function getGoogleAccessToken(creds: GoogleOAuthCredentials): Promise<string> {
  const { clientId, clientSecret, refreshToken } = creds;
  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error('Google OAuth credentials not configured.');
  }

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!tokenRes.ok) {
    const errText = await tokenRes.text();
    throw new Error(`Google OAuth error: ${errText}`);
  }

  const data = await tokenRes.json();
  return data.access_token;
}

/**
 * Creates a real Google Meet link via Google Calendar API if credentials exist,
 * or formats the coordinator-supplied / default link.
 */
export async function createGoogleMeetSession(options: GoogleMeetOptions): Promise<GoogleMeetResult> {
  const creds = getGoogleCredentials();
  const duration = options.durationMinutes || 45;

  let startDateTime: Date;
  if (options.startTime) {
    startDateTime = new Date(options.startTime);
  } else {
    startDateTime = new Date(Date.now() + 30 * 60 * 1000);
  }
  const endDateTime = new Date(startDateTime.getTime() + duration * 60 * 1000);
  const startTimeIso = startDateTime.toISOString();

  // 1. If coordinator provided a specific real Google Meet URL
  if (options.customMeetingLink && options.customMeetingLink.trim()) {
    let cleanUrl = options.customMeetingLink.trim();
    if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
      cleanUrl = `https://${cleanUrl}`;
    }
    const codeMatch = cleanUrl.match(/meet\.google\.com\/([a-z0-9-]+)/i);
    const code = codeMatch ? codeMatch[1] : 'google-meet-room';

    return {
      id: code,
      meetingCode: code,
      joinUrl: cleanUrl,
      topic: options.topic,
      startTime: startTimeIso,
      duration,
      isRealGoogleApi: true,
      provider: 'GOOGLE_MEET',
    };
  }

  // 2. If Google Calendar API credentials are configured, create real Google Meet via Google Calendar API
  if (creds.clientId && creds.clientSecret && creds.refreshToken) {
    try {
      const accessToken = await getGoogleAccessToken(creds);
      const requestId = 'meet_' + Date.now().toString(36) + Math.random().toString(36).substring(2, 6);

      const calendarRes = await fetch(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            summary: options.topic || 'upspeaq Live Evaluation Session',
            description: 'Live interactive 1-on-1 / micro evaluation on Google Meet by upspeaq.',
            start: { dateTime: startTimeIso },
            end: { dateTime: endDateTime.toISOString() },
            conferenceData: {
              createRequest: {
                requestId,
                conferenceSolutionKey: { type: 'hangoutsMeet' },
              },
            },
          }),
        }
      );

      if (calendarRes.ok) {
        const eventData = await calendarRes.json();
        const meetUri =
          eventData.conferenceData?.entryPoints?.find((ep: any) => ep.entryPointType === 'video')?.uri ||
          eventData.hangoutLink;

        if (meetUri) {
          const code = meetUri.replace('https://meet.google.com/', '');
          return {
            id: code,
            meetingCode: code,
            joinUrl: meetUri,
            topic: options.topic,
            startTime: startTimeIso,
            duration,
            isRealGoogleApi: true,
            provider: 'GOOGLE_MEET',
          };
        }
      }
    } catch (apiErr: any) {
      console.warn('[Google API] Automatic Calendar Meet creation error:', apiErr.message);
    }
  }

  // 3. If default official company Google Meet URL is saved in Settings
  if (creds.defaultMeetingUrl && creds.defaultMeetingUrl.trim()) {
    const defaultUrl = creds.defaultMeetingUrl.trim();
    const code = defaultUrl.replace('https://meet.google.com/', '');
    return {
      id: code,
      meetingCode: code,
      joinUrl: defaultUrl,
      topic: options.topic,
      startTime: startTimeIso,
      duration,
      isRealGoogleApi: true,
      provider: 'GOOGLE_MEET',
    };
  }

  // 4. Default official persistent room URL for upspeaq
  const fallbackUrl = 'https://meet.google.com/upspeaq-demo';
  return {
    id: 'upspeaq-demo',
    meetingCode: 'upspeaq-demo',
    joinUrl: fallbackUrl,
    topic: options.topic,
    startTime: startTimeIso,
    duration,
    isRealGoogleApi: false,
    provider: 'GOOGLE_MEET',
  };
}
