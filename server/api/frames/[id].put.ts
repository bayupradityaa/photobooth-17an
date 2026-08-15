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

  if (!env || !env.DB || !id) {
    return { success: false, error: 'Invalid context' };
  }

  try {
    const body = await readBody(event);
    if (body.name) {
      await env.DB.prepare('UPDATE frames SET name = ? WHERE id = ?').bind(body.name, id).run();
    }
    return { success: true };
  } catch (e) {
    return { success: false };
  }
});
