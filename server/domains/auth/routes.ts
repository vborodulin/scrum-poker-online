import { AuthSchemas } from '@chpokify/api-schemas';
import { Router } from 'express';

import { authController } from '@auth/controllers';

import { rateLimitMiddleware } from '@core/middleware/rateLimit';
import { validateMiddleware } from '@core/middleware/validate';

const authRouter = Router();

authRouter.get(
  '/',
  authController.get
);

authRouter.get(
  '/session',
  authController.getSession
);

authRouter.get(
  '/nonce',
  authController.getNonce
);

authRouter.post(
  '/log-in',
  validateMiddleware(AuthSchemas.LogInReqSchema),
  authController.signIn
);

authRouter.post(
  '/crypto/login',
  validateMiddleware(AuthSchemas.SignInCryptoReqSchema),
  authController.signInCrypto
);

authRouter.post(
  '/crypto/signup',
  validateMiddleware(AuthSchemas.SignUpCryptoReqSchema),
  authController.signUpCrypto
);

authRouter.post(
  '/google',
  authController.googleOauth
);

authRouter.post(
  '/apple',
  authController.appleOauth
);

authRouter.post(
  '/sign-up',
  validateMiddleware(AuthSchemas.SignUpReqSchema),
  authController.signUp
);

authRouter.post(
  '/log-in-guest',
  validateMiddleware(AuthSchemas.LogInGuestSchema),
  authController.logInGuest
);

authRouter.post(
  '/sign-out',
  authController.signOut
);

authRouter.post(
  '/password/restore',
  rateLimitMiddleware({
    windowMs: 1.5 * 60 * 1000,
    max: 1,
    skipFailedRequests: true,
  }),
  validateMiddleware(AuthSchemas.RestorePasswordReqSchema),
  authController.restorePassword
);

authRouter.post(
  '/password/reset',
  validateMiddleware(AuthSchemas.ResetPasswordReqSchema),
  authController.resetPassword
);

authRouter.post(
  '/password/reset/validate',
  validateMiddleware(AuthSchemas.ValidateResetPasswordTokenReqSchema),
  authController.validateResetPasswordToken
);

export { authRouter };
