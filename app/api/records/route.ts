import { NextRequest, NextResponse } from 'next/server';
import {
  getRecords,
  saveRecord,
  deleteRecord,
  clearAllRecords,
  getDbDiagnostics,
} from '@/services/flames/lib/db';

export const dynamic = 'force-dynamic';

// GET all submissions
export async function GET() {
  try {
    const records = await getRecords();
    const diagnostics = getDbDiagnostics();
    return NextResponse.json({ success: true, records, diagnostics });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch records' },
      { status: 500 }
    );
  }
}

function parseDevice(ua: string, clientHint?: string): string {
  if (clientHint) return clientHint;
  if (!ua) return 'Web Browser';

  let os = 'Unknown Device';
  if (/iPad/i.test(ua)) os = 'iPad';
  else if (/iPhone/i.test(ua)) os = 'iPhone';
  else if (/Android/i.test(ua)) os = 'Android';
  else if (/Macintosh|Mac OS X/i.test(ua)) os = 'Mac';
  else if (/Windows NT/i.test(ua)) os = 'Windows PC';
  else if (/Linux/i.test(ua)) os = 'Linux';

  let appOrBrowser = '';
  if (/Instagram/i.test(ua)) appOrBrowser = 'Instagram';
  else if (/WhatsApp/i.test(ua)) appOrBrowser = 'WhatsApp';
  else if (/Chrome|CriOS/i.test(ua) && !/Edg/i.test(ua)) appOrBrowser = 'Chrome';
  else if (/Safari/i.test(ua) && !/Chrome|CriOS/i.test(ua)) appOrBrowser = 'Safari';
  else if (/Firefox|FxiOS/i.test(ua)) appOrBrowser = 'Firefox';
  else if (/Edg/i.test(ua)) appOrBrowser = 'Edge';

  return appOrBrowser ? `${os} (${appOrBrowser})` : os;
}

// POST a new submission
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name1,
      name2,
      resultLetter,
      resultWord,
      resultEmoji,
      remainingCount,
      visitorId,
      ref,
      deviceHint,
    } = body;

    if (!name1 || !name2) {
      return NextResponse.json(
        { success: false, error: 'Names are required' },
        { status: 400 }
      );
    }

    // Capture location from Vercel edge headers
    const rawCity = req.headers.get('x-vercel-ip-city');
    const city = rawCity ? decodeURIComponent(rawCity) : '';
    const region = req.headers.get('x-vercel-ip-country-region') || '';
    const country = req.headers.get('x-vercel-ip-country') || '';
    const forwardedFor = req.headers.get('x-forwarded-for') || '';
    const ip = forwardedFor.split(',')[0].trim() || req.headers.get('x-real-ip') || '';

    let location = 'Local / Unknown';
    if (city && country) {
      location = region ? `${city}, ${region}, ${country}` : `${city}, ${country}`;
    } else if (country) {
      location = country;
    } else if (ip && ip !== '::1' && ip !== '127.0.0.1') {
      location = `IP: ${ip}`;
    }

    const userAgent = req.headers.get('user-agent') || '';
    const device = parseDevice(userAgent, deviceHint);

    const record = await saveRecord({
      name1: name1.trim(),
      name2: name2.trim(),
      resultLetter: resultLetter || '?',
      resultWord: resultWord || 'Unknown',
      resultEmoji: resultEmoji || '✨',
      remainingCount: Number(remainingCount) || 0,
      clientInfo: `${location} • ${device}`,
      location,
      device,
      visitorId: visitorId || undefined,
      ref: ref || undefined,
    });

    return NextResponse.json({ success: true, record });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to save record' },
      { status: 500 }
    );
  }
}

// DELETE a record by ID or clear all
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const idFromQuery = searchParams.get('id');
    const clearAll = searchParams.get('clearAll') === 'true';

    let id = idFromQuery;
    if (!id && !clearAll) {
      try {
        const body = await req.json();
        id = body.id;
      } catch {
        // Body might be empty
      }
    }

    if (clearAll) {
      await clearAllRecords();
      return NextResponse.json({ success: true, message: 'All records cleared' });
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Record ID is required for deletion' },
        { status: 400 }
      );
    }

    await deleteRecord(id);
    return NextResponse.json({ success: true, deletedId: id });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete record' },
      { status: 500 }
    );
  }
}
