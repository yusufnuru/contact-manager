import { NODE_ENV } from '../constants/env.js';
import { CookieOptions, Response } from 'express';
import { fifteenMinutesFromNow, sevenDaysFromNow } from './date.js';

const isDev = NODE_ENV === 'development';

const defaults: CookieOptions = {
  httpOnly: true,
  sameSite: isDev ? 'lax' : 'none',
  secure: !isDev,
};

export const getAccessTokenCookieOptions = (): CookieOptions => ({
  ...defaults,
  expires: fifteenMinutesFromNow(),
});

export const getRefreshTokenCookieOptions = (): CookieOptions => ({
  ...defaults,
  expires: sevenDaysFromNow(),
});

type Params = {
  res: Response;
  accessToken: string;
  refreshToken: string;
};

export const setAuthCookies = ({ res, accessToken, refreshToken }: Params) =>
  res
    .cookie('accessToken', accessToken, getAccessTokenCookieOptions())
    .cookie('refreshToken', refreshToken, getRefreshTokenCookieOptions());

export const clearAuthCookies = (res: Response) =>
  res.clearCookie('accessToken').clearCookie('refreshToken');
