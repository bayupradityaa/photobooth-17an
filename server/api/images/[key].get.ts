import { existsSync, readFileSync } from 'node:fs';
import { resolve, join } from 'node:path';

export default defineEventHandler(async (event) => {
  const key = event.context.params?.key;
  if (!key) {
    throw createError({ statusCode: 404, statusMessage: 'Key not specified' });
  }

  const env = (event.context as any).cloudflare?.env;

  // Cloudflare R2
  if (env && env.BUCKET) {
    const object = await env.BUCKET.get(key);
    if (!object) {
      throw createError({ statusCode: 404, statusMessage: 'Image Not Found' });
    }

    setResponseHeader(event, 'Content-Type', object.httpMetadata?.contentType || 'image/png');
    setResponseHeader(event, 'Cache-Control', 'public, max-age=31536000');
    return object.body;
  }

  // Local fallback
  const localFile = join(resolve(process.cwd(), 'public', 'custom-frames'), key);
  if (existsSync(localFile)) {
    const data = readFileSync(localFile);
    setResponseHeader(event, 'Content-Type', 'image/png');
    setResponseHeader(event, 'Cache-Control', 'public, max-age=31536000');
    return data;
  }

  throw createError({ statusCode: 404, statusMessage: 'Image Not Found' });
});
