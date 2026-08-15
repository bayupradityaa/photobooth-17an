export default defineEventHandler(async (event) => {
  // @ts-expect-error - Event context bindings
  const env = event.context.cloudflare?.env;
  if (!env || !env.DB) {
    return { active: true, maintenanceMessage: 'Studio Foto sedang dinonaktifkan', activeEventName: 'Event Spesial' };
  }
  try {
    const stmt = env.DB.prepare('SELECT * FROM settings WHERE id = ?').bind('global');
    const result = await stmt.first();
    if (result) {
      return {
        active: result.active === 1,
        maintenanceMessage: result.maintenanceMessage,
        activeEventName: result.activeEventName
      };
    }
    return { active: true, maintenanceMessage: '', activeEventName: '' };
  } catch(e) {
    return { active: true, maintenanceMessage: '', activeEventName: '' };
  }
});
