export default defineEventHandler(async (event) => {
  // @ts-expect-error
  const env = event.context.cloudflare?.env;
  if (!env || !env.DB) {
    return [];
  }
  try {
    const { results } = await env.DB.prepare('SELECT * FROM frames ORDER BY created_at ASC').all();
    const frames = results.map((row: any) => {
      return {
        id: row.id,
        name: row.name,
        canvasWidth: row.canvasWidth,
        canvasHeight: row.canvasHeight,
        slots: JSON.parse(row.slots || '[]'),
        src: `/api/images/${row.image_key}`,
        thumbnail: `/api/images/${row.image_key}`
      };
    });
    return frames;
  } catch (e) {
    return [];
  }
});
