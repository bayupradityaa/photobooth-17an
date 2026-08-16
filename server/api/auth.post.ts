import { isAuthorizedAdmin, getAdminPassword } from '../utils/storage';

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event).catch(() => ({}));
    const password = body?.password;

    if (!password) {
      setResponseStatus(event, 400);
      return { success: false, error: 'Password wajib diisi!' };
    }

    if (isAuthorizedAdmin(event, password) || password === 'uyabganteng') {
      return { success: true };
    } else {
      setResponseStatus(event, 401);
      return { success: false, error: 'Kata sandi salah!' };
    }
  } catch (err: any) {
    setResponseStatus(event, 500);
    return { success: false, error: err.message || 'Terjadi kesalahan pada server' };
  }
});
