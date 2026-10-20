export function validateEnvironment(environment: Record<string, unknown>) {
  const port = Number(environment.PORT || 7777);
  const maxUploadBytes = Number(environment.MAX_UPLOAD_BYTES || 26214400);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT must be an integer between 1 and 65535');
  }
  if (!Number.isSafeInteger(maxUploadBytes) || maxUploadBytes <= 0) {
    throw new Error('MAX_UPLOAD_BYTES must be a positive integer');
  }
  const url = String(environment.SUPABASE_URL || '').trim();
  const key = String(environment.SUPABASE_SERVICE_ROLE_KEY || '').trim();
  if (Boolean(url) !== Boolean(key)) {
    throw new Error('Set both SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  }
  if (url && !/^https?:\/\//.test(url)) {
    throw new Error('SUPABASE_URL must be an HTTP(S) URL');
  }
  return {
    ...environment,
    PORT: port,
    MAX_UPLOAD_BYTES: maxUploadBytes,
    SUPABASE_URL: url,
    SUPABASE_SERVICE_ROLE_KEY: key,
    SUPABASE_BUCKET: environment.SUPABASE_BUCKET || 'models',
  };
}
