export default defineEventHandler(async (event) => {
  const cfEnv = (event.context as any).cloudflare?.env;
  const processEnv = (globalThis as any).process?.env;
  const adminPassword = cfEnv?.ADMIN_PASSWORD || processEnv?.ADMIN_PASSWORD;

  if (!adminPassword) {
    return { success: false, error: 'Server misconfiguration: ADMIN_PASSWORD not set.' };
  }
  
  const body = await readBody(event);
  if (body?.password === adminPassword) {
    return { success: true };
  } else {
    setResponseStatus(event, 401);
    return { success: false, error: 'Kata sandi salah!' };
  }
});
