import { isAuthorizedAdmin, deleteFrameById } from '../../utils/storage';

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
    const result = await deleteFrameById(event, id);
    if (!result.success) {
      setResponseStatus(event, 500);
      return { success: false, error: result.error || 'Gagal menghapus template' };
    }
    return { success: true };
  } catch (error: any) {
    setResponseStatus(event, 500);
    return { success: false, error: error.message };
  }
});
