import 'dotenv/config';
const getEnv = (key: string, defaultValue?: string): string => {
  const value = process.env[key] || defaultValue;

  if (value === undefined) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
};

export const DB_URL = getEnv('DB_URL');
export const NODE_ENV = getEnv('NODE_ENV');
export const APP_ORIGIN = getEnv('APP_ORIGIN');
export const PORT = getEnv('PORT', '5000');
export const SUPABASE_URL = getEnv('SUPABASE_URL');
export const SUPABASE_SERVICE_ROLE_KEY = getEnv('SUPABASE_SERVICE_ROLE_KEY');
