export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  const env = (event.context as any).cloudflare?.env;
  const processEnv = (globalThis as any).process?.env;
  const adminPassword = env?.ADMIN_PASSWORD || processEnv?.ADMIN_PASSWORD;
  const reqAdminPassword = getHeader(event, 'x-admin-password');

  if (!adminPassword || reqAdminPassword !== adminPassword) {
    setResponseStatus(event, 401);
    return { success: false, error: 'Unauthorized' };
  }

  if (!env || !env.DB || !env.BUCKET || !id) {
    return { success: false, error: 'Invalid context' };
  }

  try {
    const frame: any = await env.DB.prepare('SELECT image_key FROM frames WHERE id = ?').bind(id).first();
    if (frame && frame.image_key) {
      await env.BUCKET.delete(frame.image_key);
    }
    
    await env.DB.prepare('DELETE FROM frames WHERE id = ?').bind(id).run();
    
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Failed to delete frame' };
  }
});
