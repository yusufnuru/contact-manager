import { User } from '@supabase/supabase-js';
declare global {
  namespace Express {
    interface Request {
      cookies: {
        accessToken?: string;
        [key: string]: string;
      };
      userId: string;
      user: User;
    }
  }
}

export {};
