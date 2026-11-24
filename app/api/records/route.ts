import { NextRequest, NextResponse } from 'next/server';
import {
  getRecords,
  saveRecord,
  deleteRecord,
  clearAllRecords,
} from '@/services/flames/lib/db';

export const dynamic = 'force-dynamic';

// GET all submissions
export async function GET() {
  try {
    const records = await getRecords();
    return NextResponse.json({ success: true, records });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch records' },
      { status: 500 }
    );
  }
}

// POST a new submission
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name1, name2, resultLetter, resultWord, resultEmoji, remainingCount } = body;

    if (!name1 || !name2) {
      return NextResponse.json(
        { success: false, error: 'Names are required' },
        { status: 400 }
      );
    }

    // Capture basic client header info (IP / location / browser)
    const forwardedFor = req.headers.get('x-forwarded-for') || '';
    const ip = forwardedFor.split(',')[0].trim() || req.headers.get('x-real-ip') || 'Unknown';
    const city = req.headers.get('x-vercel-ip-city') || '';
    const country = req.headers.get('x-vercel-ip-country') || '';
    const clientLocation = city && country ? `${city}, ${country}` : country || ip;

    const record = await saveRecord({
      name1: name1.trim(),
      name2: name2.trim(),
      resultLetter: resultLetter || '?',
      resultWord: resultWord || 'Unknown',
      resultEmoji: resultEmoji || '✨',
      remainingCount: Number(remainingCount) || 0,
      clientInfo: clientLocation !== 'Unknown' ? clientLocation : undefined,
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
