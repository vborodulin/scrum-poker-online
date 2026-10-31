import { AuthSchemas } from '@chpokify/api-schemas';
import { Router } from 'express';

import { authController } from '@auth/controllers';

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

authRouter.post(
  '/log-in',
  validateMiddleware(AuthSchemas.LogInReqSchema),
  authController.signIn
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

export { authRouter };
