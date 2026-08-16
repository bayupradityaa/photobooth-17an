import { isAuthorizedAdmin, updateFrameNameById } from '../../utils/storage';

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;

  if (!isAuthorizedAdmin(event)) {
    setResponseStatus(event, 401);
    return { success: false, error: 'Unauthorized: Akses ditolak' };
  }

  if (!id) {
    setResponseStatus(event, 400);
    return { success: false, error: 'ID frame tidak ditemukan' };
  }

  try {
    const body = await readBody(event);
    if (!body?.name) {
      setResponseStatus(event, 400);
      return { success: false, error: 'Nama frame baru wajib diisi' };
    }

    const result = await updateFrameNameById(event, id, body.name);
    return { success: result.success };
  } catch (error: any) {
    setResponseStatus(event, 500);
    return { success: false, error: error.message };
  }
});
