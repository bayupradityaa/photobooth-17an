import { getAllFrames } from '../utils/storage';

export default defineEventHandler(async (event) => {
  try {
    const frames = await getAllFrames(event);
    return frames;
  } catch (error) {
    console.error('Error in GET /api/frames:', error);
    return [];
  }
});
