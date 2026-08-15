export default defineEventHandler(async (event) => {
  const key = event.context.params?.key;
  // @ts-expect-error
  const env = event.context.cloudflare?.env;
  if (!env || !env.BUCKET || !key) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' });
  }

  const object = await env.BUCKET.get(key);
  if (!object) {
    throw createError({ statusCode: 404, statusMessage: 'Image Not Found' });
  }

  setResponseHeader(event, 'Content-Type', object.httpMetadata?.contentType || 'image/png');
  setResponseHeader(event, 'Cache-Control', 'public, max-age=31536000');
  
  return object.body;
});
