import { FRAMES_CONFIG } from '../utils/photobooth/frames';

const DEFAULT_SETTINGS = {
  active: true,
  maintenanceMessage: 'Studio Foto sedang dinonaktifkan sementara. Nantikan event spesial berikutnya!',
  activeEventName: 'Event Spesial',
  customFrames: []
};

const getAdminHeaders = (): Record<string, string> => {
  if (typeof sessionStorage !== 'undefined') {
    const pwd = sessionStorage.getItem('admin_authenticated');
    if (pwd) {
      return { 'x-admin-password': pwd };
    }
  }
  return {};
};

export const photoboothService = {
  async authenticate(password: string) {
    try {
      const res = await $fetch<any>('/api/auth', {
        method: 'POST',
        body: { password }
      });
      if (res && res.success) {
        sessionStorage.setItem('admin_authenticated', password);
        return { success: true };
      }
      return { success: false, error: res?.error || 'Kata sandi salah!' };
    } catch (err: any) {
      return { success: false, error: err.data?.error || err.message || 'Kata sandi salah!' };
    }
  },

  async getSettings() {
    try {
      const [settingsData, framesData] = await Promise.all([
        $fetch('/api/settings').catch(() => ({})),
        $fetch('/api/frames').catch(() => [])
      ]);
      return {
        ...DEFAULT_SETTINGS,
        ...settingsData,
        customFrames: framesData || []
      };
    } catch (err) {
      console.error('Error loading photobooth settings:', err);
      return DEFAULT_SETTINGS;
    }
  },

  async getFrames() {
    try {
      const frames = await $fetch('/api/frames').catch(() => []);
      return [...FRAMES_CONFIG, ...frames];
    } catch (err) {
      console.error('Error getting combined photobooth frames:', err);
      return FRAMES_CONFIG;
    }
  },

  async updateSettings(settings: any) {
    try {
      await $fetch('/api/settings', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: {
          active: settings.active,
          maintenanceMessage: settings.maintenanceMessage,
          activeEventName: settings.activeEventName
        }
      });
      
      // Also update frame names if changed
      const customFrames = settings.customFrames || [];
      for (const frame of customFrames) {
        if (frame.id) {
          await $fetch(`/api/frames/${frame.id}`, {
            method: 'PUT',
            headers: getAdminHeaders(),
            body: { name: frame.name }
          }).catch(e => console.error('Failed to update frame name:', e));
        }
      }
      
      return { success: true, data: settings };
    } catch (error: any) {
      console.error('Error updating photobooth settings:', error);
      return { success: false, error: error.message };
    }
  },

  async addCustomFrame(newFrame: any) {
    try {
      const res = await $fetch('/api/frames', {
        method: 'POST',
        headers: getAdminHeaders(),
        body: newFrame
      });
      return { success: true, image_key: (res as any).image_key };
    } catch (error: any) {
      console.error('Error adding custom frame:', error);
      return { success: false, error: error.message };
    }
  },

  async deleteCustomFrame(id: string) {
    try {
      await $fetch(`/api/frames/${id}`, {
        method: 'DELETE',
        headers: getAdminHeaders()
      });
      return { success: true };
    } catch (error: any) {
      console.error('Error deleting custom frame:', error);
      return { success: false, error: error.message };
    }
  }
};
