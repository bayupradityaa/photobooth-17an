export default defineEventHandler(async (event) => {
  // @ts-expect-error - Event context bindings for CF are sometimes typed as any depending on setup
  const env = event.context.cloudflare?.env;
  
  if (!env || !env.DB || !env.BUCKET) {
    throw createError({ statusCode: 500, statusMessage: 'Cloudflare bindings not found. Ensure you are running with Wrangler or a proper Nitro CF setup.' });
  }

  const { DB, BUCKET } = env;
  
  try {
    const body = await readBody(event);
    const { imageBase64 } = body;

    if (!imageBase64) {
      throw createError({ statusCode: 400, statusMessage: 'Image is required' });
    }

    // Remove the data:image/png;base64, prefix
    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, '');
    
    // In workers, Buffer might not be globally available depending on compatibility flags.
    // However, Nitro polyfills it, or we can use Uint8Array natively.
    // Using native Uint8Array to avoid Buffer issues in workers:
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    const fileName = `photo-${Date.now()}.png`;

    // Upload to R2
    await BUCKET.put(fileName, bytes.buffer, {
      httpMetadata: { contentType: 'image/png' }
    });

    // Save to D1
    const sessionId = crypto.randomUUID();
    const photoUrls = JSON.stringify([fileName]);
    
    await DB.prepare('INSERT INTO sessions (id, photo_urls) VALUES (?, ?)')
      .bind(sessionId, photoUrls)
      .run();

    return { success: true, sessionId, fileName };
  } catch (error) {
    console.error('Error uploading:', error);
    throw createError({ statusCode: 500, statusMessage: 'Internal Server Error' });
  }
});
