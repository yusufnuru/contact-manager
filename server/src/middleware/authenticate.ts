import { NextFunction, Response, Request } from 'express';
import appAssert from '../utils/app-assert.js';
import { UNAUTHORIZED } from '../constants/http.js';
import { AppErrorCode } from '../constants/app-error-code.js';
import { supabase } from '../config/supabase-client.js';
import { setAuthCookies } from '../utils/cookies.js';

interface AuthenticatedRequest extends Request {
  cookies: {
    accessToken: string;
    [key: string]: string | undefined;
  };
}

export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;

    // If no access token, check if we have refresh token
    if (!accessToken) {
      if (!refreshToken) {
        return res.status(UNAUTHORIZED).json({
          message: 'Authentication required',
        });
      }

      // Try to refresh the session
      const refreshResult = await tryRefreshSession(refreshToken, res);
      appAssert(
        refreshResult.success,
        UNAUTHORIZED,
        'Failed to refresh session',
        AppErrorCode.RefreshFailed,
      );

      // Use the new access token and user from refresh
      req.userId = refreshResult.user.id;
      req.user = refreshResult.user;
      return next();
    }

    // Verify access token with Supabase
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(accessToken);

    if (error || !user) {
      // If access token is invalid, try refresh token
      if (refreshToken) {
        const refreshResult = await tryRefreshSession(refreshToken, res);
        if (refreshResult.success) {
          req.userId = refreshResult.user.id;
          req.user = refreshResult.user;
          return next();
        }
      }

      return res.status(UNAUTHORIZED).json({
        message: 'Invalid or expired session, please login again',
      });
    }

    // Valid access token
    req.userId = user.id;
    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    return res.status(UNAUTHORIZED).json({
      message: 'Authentication failed',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

// Internal helper function to handle token refresh
async function tryRefreshSession(refreshToken: string, res: Response) {
  const { data, error } = await supabase.auth.refreshSession({
    refresh_token: refreshToken,
  });

  appAssert(
    !error && data?.session && data?.user,
    UNAUTHORIZED,
    error?.message || 'Failed to refresh token',
    AppErrorCode.RefreshFailed,
  );
  // Set new cookies with refreshed tokens
  setAuthCookies({
    res,
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
  });

  return {
    success: true,
    user: data.user,
    session: data.session,
  };
}
