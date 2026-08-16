import { getSiteSettings } from '../utils/storage';

export default defineEventHandler(async (event) => {
  try {
    const settings = await getSiteSettings(event);
    return settings;
  } catch (error) {
    console.error('Error in GET /api/settings:', error);
    return {
      active: true,
      maintenanceMessage: 'Studio Foto sedang dinonaktifkan sementara. Nantikan event spesial berikutnya!',
      activeEventName: 'Peringatan HUT RI ke-81 Pesona Cilebut 1'
    };
  }
});
