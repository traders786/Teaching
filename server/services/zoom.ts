// Backward-compatibility wrapper delegating to googleMeet service
import { createGoogleMeetSession, getGoogleMeetSettings } from './googleMeet.js';

export interface ZoomMeetingOptions {
  topic: string;
  startTime?: string;
  durationMinutes?: number;
  timezone?: string;
  agenda?: string;
  password?: string;
}

export interface ZoomMeetingResult {
  id: string;
  topic: string;
  joinUrl: string;
  startUrl: string;
  password?: string;
  duration: number;
  startTime: string;
  timezone: string;
  isRealZoomApi: boolean;
  provider: 'GOOGLE_MEET';
}

export function getZoomCredentials() {
  return { accountId: '', clientId: '', clientSecret: '' };
}

export async function createZoomMeeting(options: ZoomMeetingOptions): Promise<ZoomMeetingResult> {
  const session = await createGoogleMeetSession({
    topic: options.topic,
    startTime: options.startTime,
    durationMinutes: options.durationMinutes,
  });

  return {
    id: session.meetingCode,
    topic: session.topic,
    joinUrl: session.joinUrl,
    startUrl: session.joinUrl,
    duration: session.duration,
    startTime: session.startTime,
    timezone: 'Asia/Kolkata',
    isRealZoomApi: false,
    provider: 'GOOGLE_MEET',
  };
}
