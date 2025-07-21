import { BAD_REQUEST, CONFLICT, UNAUTHORIZED } from '../constants/http.js';
import appAssert from '../utils/app-assert.js';
import { LoginSchema, RegisterSchema } from '../schemas/auth-schema.js';
import { supabase } from '../config/supabase-client.js';
import { AppErrorCode } from '../constants/app-error-code.js';

export const AuthService = {
  async registerWithSupabase(dto: RegisterSchema) {
    const { data, error } = await supabase.auth.signUp({
      email: dto.email,
      password: dto.password,
      options: {
        data: {
          first_name: dto.firstName,
          last_name: dto.lastName,
        },
      },
    });

    if (error) {
      // Handle specific Supabase auth errors
      if (error.message.includes('already registered')) {
        appAssert(false, CONFLICT, 'Email already registered', AppErrorCode.EmailAlreadyExists);
      }
      if (error.message.includes('Password')) {
        appAssert(
          false,
          BAD_REQUEST,
          'Password does not meet requirements',
          AppErrorCode.WeakPassword,
        );
      }
      appAssert(false, BAD_REQUEST, error.message, AppErrorCode.RegistrationFailed);
    }

    appAssert(data?.user, BAD_REQUEST, 'Registration failed - no user data returned');

    return {
      user: data.user,
    };
  },

  async loginWithSupabase(dto: LoginSchema) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: dto.email,
      password: dto.password,
    });

    if (error) {
      // Handle specific Supabase auth errors
      if (error.message.includes('Invalid login credentials')) {
        appAssert(
          false,
          UNAUTHORIZED,
          'Invalid email or password',
          AppErrorCode.InvalidCredentials,
        );
      }
      if (error.message.includes('Email not confirmed')) {
        appAssert(
          false,
          UNAUTHORIZED,
          'Please verify your email before logging in',
          AppErrorCode.EmailNotVerified,
        );
      }
      appAssert(false, UNAUTHORIZED, error.message, AppErrorCode.LoginFailed);
    }

    appAssert(data?.user && data?.session, UNAUTHORIZED, 'Login failed - no session created');

    return {
      user: data.user,
      session: data.session,
    };
  },

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      appAssert(false, BAD_REQUEST, 'Logout failed', AppErrorCode.LoginFailed);
    }
    return { message: 'Logged out successfully' };
  },

  async refreshToken(refreshToken: string) {
    const { data, error } = await supabase.auth.refreshSession({ refresh_token: refreshToken });

    appAssert(
      !error && data?.session,
      UNAUTHORIZED,
      error?.message || 'Failed to refresh token',
      AppErrorCode.InvalidAccessToken,
    );

    return {
      session: data.session,
      user: data.user,
    };
  },
};
