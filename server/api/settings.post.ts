export default defineEventHandler(async (event) => {
  const env = (event.context as any).cloudflare?.env;
  const processEnv = (globalThis as any).process?.env;
  const adminPassword = env?.ADMIN_PASSWORD || processEnv?.ADMIN_PASSWORD;
  const reqAdminPassword = getHeader(event, 'x-admin-password');

  if (!adminPassword || reqAdminPassword !== adminPassword) {
    setResponseStatus(event, 401);
    return { success: false, error: 'Unauthorized' };
  }

  if (!env || !env.DB) {
    return { success: false, error: 'DB binding missing' };
  }
  try {
    const body = await readBody(event);
    const { active, maintenanceMessage, activeEventName } = body;
    
    await env.DB.prepare('UPDATE settings SET active = ?, maintenanceMessage = ?, activeEventName = ? WHERE id = ?')
      .bind(active ? 1 : 0, maintenanceMessage || '', activeEventName || '', 'global')
      .run();
    return { success: true };
  } catch (error) {
    return { success: false, error: 'Database error' };
  }
});
