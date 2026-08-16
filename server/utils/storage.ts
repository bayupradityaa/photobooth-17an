import { existsSync, mkdirSync, readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { resolve, join } from 'node:path';

export interface FrameItem {
  id: string;
  name: string;
  canvasWidth: number;
  canvasHeight: number;
  slots: Array<{ x: number; y: number; width: number; height: number }>;
  src: string;
  thumbnail: string;
  image_key: string;
  created_at?: string;
}

export interface SettingsItem {
  active: boolean;
  maintenanceMessage: string;
  activeEventName: string;
}

// Local fallback storage directory
const DATA_DIR = resolve(process.cwd(), '.data');
const FRAMES_FILE = join(DATA_DIR, 'frames.json');
const SETTINGS_FILE = join(DATA_DIR, 'settings.json');
const CUSTOM_FRAMES_DIR = resolve(process.cwd(), 'public', 'custom-frames');

function ensureLocalDirs() {
  try {
    if (!existsSync(DATA_DIR)) {
      mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!existsSync(CUSTOM_FRAMES_DIR)) {
      mkdirSync(CUSTOM_FRAMES_DIR, { recursive: true });
    }
  } catch (e) {
    // Ignore in read-only environments
  }
}

export function getAdminPassword(event: any): string {
  const cfEnv = event.context?.cloudflare?.env;
  const processEnv = (globalThis as any).process?.env;
  return cfEnv?.ADMIN_PASSWORD || processEnv?.ADMIN_PASSWORD || 'uyabganteng';
}

export function isAuthorizedAdmin(event: any, customPassword?: string): boolean {
  const adminPassword = getAdminPassword(event);
  const reqHeaderPassword = getHeader(event, 'x-admin-password');
  
  if (customPassword && customPassword === adminPassword) {
    return true;
  }
  if (reqHeaderPassword && reqHeaderPassword === adminPassword) {
    return true;
  }
  return false;
}

// --- FRAMES STORAGE ---
export async function getAllFrames(event: any): Promise<FrameItem[]> {
  const env = event.context?.cloudflare?.env;
  
  // Cloudflare D1 mode
  if (env && env.DB) {
    try {
      const { results } = await env.DB.prepare('SELECT * FROM frames ORDER BY created_at ASC').all();
      return (results || []).map((row: any) => ({
        id: row.id,
        name: row.name,
        canvasWidth: Number(row.canvasWidth) || 800,
        canvasHeight: Number(row.canvasHeight) || 1200,
        slots: typeof row.slots === 'string' ? JSON.parse(row.slots || '[]') : (row.slots || []),
        src: `/api/images/${row.image_key}`,
        thumbnail: `/api/images/${row.image_key}`,
        image_key: row.image_key,
        created_at: row.created_at
      }));
    } catch (e) {
      console.error('Error fetching frames from D1:', e);
      return [];
    }
  }

  // Local fallback mode
  try {
    ensureLocalDirs();
    if (existsSync(FRAMES_FILE)) {
      const data = readFileSync(FRAMES_FILE, 'utf-8');
      return JSON.parse(data || '[]');
    }
  } catch (e) {
    console.error('Error reading local frames file:', e);
  }
  return [];
}

export async function saveNewFrame(event: any, frameData: {
  id: string;
  name: string;
  canvasWidth: number;
  canvasHeight: number;
  slots: any[];
  base64Image: string;
}): Promise<{ success: boolean; image_key?: string; error?: string }> {
  const { id, name, canvasWidth, canvasHeight, slots, base64Image } = frameData;
  const env = event.context?.cloudflare?.env;

  // Clean base64 string
  const cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, '').replace(/\s/g, '');
  const image_key = `frame-${Date.now()}-${(id || 'custom').slice(-6)}.png`;

  // Cloudflare R2 + D1 mode
  if (env && env.DB && env.BUCKET) {
    try {
      let imageBuffer: ArrayBuffer;
      if (typeof Buffer !== 'undefined') {
        const buf = Buffer.from(cleanBase64, 'base64');
        imageBuffer = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
      } else {
        const binaryString = atob(cleanBase64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        imageBuffer = bytes.buffer;
      }

      await env.BUCKET.put(image_key, imageBuffer, {
        httpMetadata: { contentType: 'image/png' }
      });

      await env.DB.prepare('INSERT INTO frames (id, name, canvasWidth, canvasHeight, slots, image_key) VALUES (?, ?, ?, ?, ?, ?)')
        .bind(id, name, canvasWidth, canvasHeight, JSON.stringify(slots), image_key)
        .run();

      return { success: true, image_key };
    } catch (e: any) {
      console.error('Error saving frame to Cloudflare D1/R2:', e);
      return { success: false, error: e.message || 'Failed to save frame to Cloudflare' };
    }
  }

  // Local fallback mode
  try {
    ensureLocalDirs();
    
    // Save image file
    const imagePath = join(CUSTOM_FRAMES_DIR, image_key);
    const buf = Buffer.from(cleanBase64, 'base64');
    writeFileSync(imagePath, buf);

    // Save metadata
    const frames = await getAllFrames(event);
    const newFrameItem: FrameItem = {
      id,
      name,
      canvasWidth,
      canvasHeight,
      slots,
      src: `/custom-frames/${image_key}`,
      thumbnail: `/custom-frames/${image_key}`,
      image_key,
      created_at: new Date().toISOString()
    };

    frames.push(newFrameItem);
    writeFileSync(FRAMES_FILE, JSON.stringify(frames, null, 2), 'utf-8');

    return { success: true, image_key };
  } catch (e: any) {
    console.error('Error saving local frame:', e);
    return { success: false, error: e.message || 'Failed to save local frame' };
  }
}

export async function deleteFrameById(event: any, id: string): Promise<{ success: boolean; error?: string }> {
  const env = event.context?.cloudflare?.env;

  // Cloudflare mode
  if (env && env.DB && env.BUCKET) {
    try {
      const frame: any = await env.DB.prepare('SELECT image_key FROM frames WHERE id = ?').bind(id).first();
      if (frame?.image_key) {
        await env.BUCKET.delete(frame.image_key);
      }
      await env.DB.prepare('DELETE FROM frames WHERE id = ?').bind(id).run();
      return { success: true };
    } catch (e: any) {
      console.error('Error deleting frame in Cloudflare:', e);
      return { success: false, error: e.message };
    }
  }

  // Local mode
  try {
    ensureLocalDirs();
    const frames = await getAllFrames(event);
    const target = frames.find(f => f.id === id);
    if (target?.image_key) {
      const imgPath = join(CUSTOM_FRAMES_DIR, target.image_key);
      if (existsSync(imgPath)) {
        unlinkSync(imgPath);
      }
    }
    const updated = frames.filter(f => f.id !== id);
    writeFileSync(FRAMES_FILE, JSON.stringify(updated, null, 2), 'utf-8');
    return { success: true };
  } catch (e: any) {
    console.error('Error deleting local frame:', e);
    return { success: false, error: e.message };
  }
}

export async function updateFrameNameById(event: any, id: string, name: string): Promise<{ success: boolean; error?: string }> {
  const env = event.context?.cloudflare?.env;

  // Cloudflare mode
  if (env && env.DB) {
    try {
      await env.DB.prepare('UPDATE frames SET name = ? WHERE id = ?').bind(name, id).run();
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  // Local mode
  try {
    ensureLocalDirs();
    const frames = await getAllFrames(event);
    const target = frames.find(f => f.id === id);
    if (target) {
      target.name = name;
      writeFileSync(FRAMES_FILE, JSON.stringify(frames, null, 2), 'utf-8');
    }
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}

// --- SETTINGS STORAGE ---
export async function getSiteSettings(event: any): Promise<SettingsItem> {
  const env = event.context?.cloudflare?.env;
  const defaultSettings: SettingsItem = {
    active: true,
    maintenanceMessage: 'Studio Foto sedang dinonaktifkan sementara. Nantikan event spesial berikutnya!',
    activeEventName: 'Peringatan HUT RI ke-81 Pesona Cilebut 1'
  };

  // Cloudflare D1
  if (env && env.DB) {
    try {
      const result: any = await env.DB.prepare('SELECT * FROM settings WHERE id = ?').bind('global').first();
      if (result) {
        return {
          active: result.active === 1,
          maintenanceMessage: result.maintenanceMessage || defaultSettings.maintenanceMessage,
          activeEventName: result.activeEventName || defaultSettings.activeEventName
        };
      }
    } catch (e) {
      console.error('Error fetching settings from D1:', e);
    }
  }

  // Local fallback
  try {
    ensureLocalDirs();
    if (existsSync(SETTINGS_FILE)) {
      const data = readFileSync(SETTINGS_FILE, 'utf-8');
      return { ...defaultSettings, ...JSON.parse(data || '{}') };
    }
  } catch (e) {
    // return defaults
  }
  return defaultSettings;
}

export async function saveSiteSettings(event: any, newSettings: Partial<SettingsItem>): Promise<{ success: boolean; error?: string }> {
  const env = event.context?.cloudflare?.env;

  // Cloudflare D1
  if (env && env.DB) {
    try {
      await env.DB.prepare('UPDATE settings SET active = ?, maintenanceMessage = ?, activeEventName = ? WHERE id = ?')
        .bind(
          newSettings.active ? 1 : 0,
          newSettings.maintenanceMessage || '',
          newSettings.activeEventName || '',
          'global'
        )
        .run();
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  }

  // Local fallback
  try {
    ensureLocalDirs();
    const current = await getSiteSettings(event);
    const merged = { ...current, ...newSettings };
    writeFileSync(SETTINGS_FILE, JSON.stringify(merged, null, 2), 'utf-8');
    return { success: true };
  } catch (e: any) {
    return { success: false, error: e.message };
  }
}
