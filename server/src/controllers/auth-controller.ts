import catchError from '../utils/cache-errors.js';
import { AuthService } from '../services/auth-service.js';
import { loginSchema, registerSchema } from '../schemas/auth-schema.js';
import { CREATED, NO_CONTENT, OK } from '../constants/http.js';
import { clearAuthCookies, setAuthCookies } from '../utils/cookies.js';
import { debug } from 'debug';

const log = debug('app:authController');

export const registerHandler = catchError(async (req, res) => {
  const request = registerSchema.parse({
    ...req.body,
  });

  const { user } = await AuthService.registerWithSupabase(request);

  res.status(CREATED).json({
    user: {
      id: user.id,
      email: user.email,
      emailConfirmed: user.email_confirmed_at !== null,
    },
    message: 'Account registered successfully. Please log in to continue.',
  });
});

export const loginHandler = catchError(async (req, res) => {
  const validatedRequest = loginSchema.parse(req.body);

  // call service
  const { user, session } = await AuthService.loginWithSupabase(validatedRequest);

  // return response
  setAuthCookies({ res, accessToken: session?.access_token, refreshToken: session?.refresh_token })
    .status(OK)
    .json({
      user: {
        id: user.id,
        email: user.email,
        emailConfirmed: user.email_confirmed_at !== null,
      },
      message: 'Login successful',
    });
});

export const logoutHandler = catchError(async (req, res) => {
  const accessToken = req.cookies.accessToken as string;

  if (accessToken) {
    await AuthService.logout();
  }

  clearAuthCookies(res).status(NO_CONTENT).json({
    message: 'Logged out successfully',
  });
});

export const getCurrentUserHandler = catchError((req, res) => {
  const user = req.user;
  log('Current user:', user);

  res.status(OK).json({
    user: {
      id: user.id,
      email: user.email,
      emailConfirmed: user.email_confirmed_at !== null,
      createdAt: user.created_at,
    },
  });
});
