import { isAuthorizedAdmin, saveSiteSettings } from '../utils/storage';

export default defineEventHandler(async (event) => {
  if (!isAuthorizedAdmin(event)) {
    setResponseStatus(event, 401);
    return { success: false, error: 'Unauthorized: Akses ditolak' };
  }

  try {
    const body = await readBody(event);
    if (!body) {
      setResponseStatus(event, 400);
      return { success: false, error: 'Data request tidak valid' };
    }

    const { active, maintenanceMessage, activeEventName } = body;
    const result = await saveSiteSettings(event, {
      active: Boolean(active),
      maintenanceMessage: String(maintenanceMessage || ''),
      activeEventName: String(activeEventName || '')
    });

    if (!result.success) {
      setResponseStatus(event, 500);
      return { success: false, error: result.error || 'Gagal menyimpan pengaturan' };
    }

    return { success: true };
  } catch (error: any) {
    setResponseStatus(event, 500);
    return { success: false, error: error.message };
  }
});
