import fs from 'fs';
import path from 'path';

export interface FlamesRecord {
  id: string;
  name1: string;
  name2: string;
  resultLetter: string;
  resultWord: string;
  resultEmoji: string;
  remainingCount: number;
  timestamp: number;
  clientInfo?: string;
  location?: string;
  device?: string;
  visitorId?: string;
  ref?: string;
}

// In-memory fallback cache (starts empty, only logs genuine user submissions)
let memoryCache: FlamesRecord[] = [];

// Determine writable file path
function getStorageFilePath(): string {
  // In serverless / Vercel, /tmp is writable
  const isVercel = process.env.VERCEL === '1' || process.env.AWS_LAMBDA_FUNCTION_NAME;
  if (isVercel) {
    return path.join('/tmp', 'flames_submissions.json');
  }

  // Local / EC2 environment
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    try {
      fs.mkdirSync(dataDir, { recursive: true });
    } catch {
      return path.join('/tmp', 'flames_submissions.json');
    }
  }
  return path.join(dataDir, 'flames_submissions.json');
}

// Check for Upstash / Vercel KV REST API configuration
const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

async function getFromKV(): Promise<FlamesRecord[] | null> {
  if (!kvUrl || !kvToken) return null;
  try {
    // 1. Try standard REST command POST ["GET", "flames_submissions"]
    const res = await fetch(kvUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${kvToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(['GET', 'flames_submissions']),
      cache: 'no-store',
    });

    if (res.ok) {
      const data = await res.json();
      if (data.result) {
        return typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
      }
      return [];
    }

    // 2. Fallback to GET /get/flames_submissions
    const fallbackRes = await fetch(`${kvUrl}/get/flames_submissions`, {
      headers: { Authorization: `Bearer ${kvToken}` },
      cache: 'no-store',
    });

    if (fallbackRes.ok) {
      const data = await fallbackRes.json();
      if (data.result) {
        return typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
      }
      return [];
    }

    return null;
  } catch (error) {
    console.error('Error reading from KV:', error);
    return null;
  }
}

async function saveToKV(records: FlamesRecord[]): Promise<boolean> {
  if (!kvUrl || !kvToken) return false;
  try {
    // 1. Try standard REST command POST ["SET", "flames_submissions", value]
    const res = await fetch(kvUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${kvToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(['SET', 'flames_submissions', JSON.stringify(records)]),
    });

    if (res.ok) return true;

    // 2. Fallback to POST /set/flames_submissions
    const fallbackRes = await fetch(`${kvUrl}/set/flames_submissions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${kvToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(JSON.stringify(records)),
    });

    return fallbackRes.ok;
  } catch (error) {
    console.error('Error saving to KV:', error);
    return false;
  }
}

/**
 * Retrieve all records from DB, newest first.
 */
export async function getRecords(): Promise<FlamesRecord[]> {
  // 1. Try Cloud KV (Vercel KV / Upstash) if configured
  const cloudRecords = await getFromKV();
  if (cloudRecords !== null) {
    memoryCache = cloudRecords;
    return cloudRecords;
  }

  // 2. Try Local File Storage
  try {
    const filePath = getStorageFilePath();
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) {
        memoryCache = parsed;
        return parsed;
      }
    }
  } catch (err) {
    console.warn('Could not read from file storage, using memory fallback:', err);
  }

  return memoryCache;
}

/**
 * Save a new calculation to the database.
 */
export async function saveRecord(
  data: Omit<FlamesRecord, 'id' | 'timestamp'>
): Promise<FlamesRecord> {
  const newRecord: FlamesRecord = {
    ...data,
    id: `rec-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: Date.now(),
  };

  const records = await getRecords();
  const updated = [newRecord, ...records].slice(0, 500); // Keep latest 500 records

  // Save to cloud KV if available
  const savedCloud = await saveToKV(updated);
  if (!savedCloud) {
    // Save to local file
    try {
      const filePath = getStorageFilePath();
      fs.writeFileSync(filePath, JSON.stringify(updated, null, 2), 'utf-8');
    } catch (err) {
      console.warn('Could not write to file storage, using memory fallback:', err);
    }
  }

  memoryCache = updated;
  return newRecord;
}

/**
 * Delete a specific record by ID (remove names from the database).
 */
export async function deleteRecord(id: string): Promise<boolean> {
  const records = await getRecords();
  const filtered = records.filter((r) => r.id !== id);

  const savedCloud = await saveToKV(filtered);
  if (!savedCloud) {
    try {
      const filePath = getStorageFilePath();
      fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2), 'utf-8');
    } catch (err) {
      console.warn('Could not write to file storage:', err);
    }
  }

  memoryCache = filtered;
  return true;
}

/**
 * Clear all records from the database.
 */
export async function clearAllRecords(): Promise<boolean> {
  const savedCloud = await saveToKV([]);
  if (!savedCloud) {
    try {
      const filePath = getStorageFilePath();
      fs.writeFileSync(filePath, JSON.stringify([], null, 2), 'utf-8');
    } catch (err) {
      console.warn('Could not write to file storage:', err);
    }
  }

  memoryCache = [];
  return true;
}
