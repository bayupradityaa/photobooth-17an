import { isAuthorizedAdmin, saveNewFrame } from '../utils/storage';

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

    const { id, name, canvasWidth, canvasHeight, slots, thumbnail, src, base64Image: rawBase64 } = body;
    const base64Image = rawBase64 || thumbnail || src;

    if (!name || !base64Image) {
      setResponseStatus(event, 400);
      return { success: false, error: 'Nama dan gambar template wajib diisi' };
    }

    const result = await saveNewFrame(event, {
      id: id || `custom-frame-${Date.now()}`,
      name: String(name).trim(),
      canvasWidth: Number(canvasWidth) || 800,
      canvasHeight: Number(canvasHeight) || 1200,
      slots: Array.isArray(slots) ? slots : [],
      base64Image
    });

    if (!result.success) {
      setResponseStatus(event, 500);
      return { success: false, error: result.error || 'Gagal menyimpan template' };
    }

    return { success: true, image_key: result.image_key };
  } catch (error: any) {
    console.error('Error in POST /api/frames:', error);
    setResponseStatus(event, 500);
    return { success: false, error: error.message || 'Terjadi kesalahan internal server' };
  }
});
