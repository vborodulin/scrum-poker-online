import { AuthSchemas, SUCCESS_VOID_RESULT } from '@chpokify/api-schemas';
import { transServer } from '@chpokify/i18n';
import {
  INVITE_USER_TO,
  TResetPasswordTokenPayload,
  TInviteRetroSessionTokenPayload,
  TUser,
} from '@chpokify/models-types';
import { TInvitePokerSessionTokenPayload } from '@chpokify/models-types/pokerSession';
import { routing } from '@chpokify/routing';
import config from 'config';
import { generateNonce } from 'siwe';

import { AuthService } from '@auth/services/AuthService';
import { keepmailService } from '@auth/services/KeepmailService';

import { appleAuth } from '@core/lib/appleAuth';
import {
  BadRequestError, ERROR_CODES, NotFoundError, UnauthorizedError,
} from '@core/lib/errors';
import { jwtToken } from '@core/lib/jwtToken';
import { createHandler } from '@core/middleware/createHandler';
import { TAppNext, TAppRequest, TAppResponse } from '@core/types';

import { mailService } from '@mail/service/mail';

import { SpaceModel } from '@models/space';
import { UserModel } from '@models/user';

import { routesHelpers } from '@routes/helpers';

import { SpaceService } from '@spaces/services';

import { UserService } from '@users/services';

const GOOGLE_WEB_CLIENT_ID = config.get('google.webClientId') as string;
const GOOGLE_IOS_CLIENT_ID = config.get('google.iOSClientId') as string;

const get = createHandler(async (
  req: TAppRequest,
  res: TAppResponse<AuthSchemas.TGetResResp>
) => {
  res.locals.result = {
    user: req.user,
    isLoggedIn: !!req.user,
  };
});

const getSession = createHandler(async (
  req,
  res
) => {
  res.locals.result = {
    session: req.session,
  };
});

const signIn = createHandler(async (req: TAppRequest<{}, AuthSchemas.TLogInBodyReq>, res) => {
  const authService = new AuthService(req, res);
  const user = await authService.signIn();

  const { inviteSpaceToken } = req.body;

  const { space } = await SpaceService.addParticipantByInvite(
    user._id,
    user.email,
    inviteSpaceToken
  );

  if (space) {
    await space.save();
  }

  res.locals.result = {
    user,
  };
});

const signInCrypto = createHandler(async (
  req: TAppRequest<{}, AuthSchemas.TSignInCryptoBodyReq>,
  res: TAppResponse<{ user: TUser }>
) => {
  const {
    message,
    signature,
    inviteSpaceToken,
  } = req.body;

  const authService = new AuthService(req, res);
  const messageInfo = await authService.validateSigningMessage(
    message,
    signature,
    // @ts-ignore
    req.session.nonce
  );

  if (!messageInfo) {
    throw new UnauthorizedError('Unauthorized');
  }

  const user = await UserModel.findOne({
    address: messageInfo.address,
  });

  if (!user) {
    throw new UnauthorizedError('Unauthorized');
  }

  if (inviteSpaceToken) {
    const { space } = await SpaceService.addParticipantByInvite(
      user._id,
      user.email,
      inviteSpaceToken
    );
    await space?.save();
  }

  await authService.logIn(user);

  res.locals.result = {
    user,
  };
});

const signUpCrypto = createHandler(async (
  req: TAppRequest<{}, AuthSchemas.TSignUpCryptoBodyReq>,
  res: TAppResponse<AuthSchemas.TSignUpCryptoResp>
) => {
  const {
    code,
    redirectUri,
    message,
    signature,
    inviteSpaceToken,
  } = req.body;

  const authService = new AuthService(req, res);
  const messageInfo = await authService.validateSigningMessage(
    message,
    signature,
    // @ts-ignore
    req.session.nonce
  );

  if (!messageInfo) {
    throw new UnauthorizedError('Unauthorized');
  }

  const { access_token: accessToken } = await keepmailService.getToken(code, redirectUri);
  const { email } = await keepmailService.getUserInfo(accessToken);

  const user = await authService.getCrypto(
    email,
    messageInfo.address
  );

  if (inviteSpaceToken) {
    const { space } = await SpaceService.addParticipantByInvite(
      user._id,
      user.email,
      inviteSpaceToken
    );
    await space?.save();
  }

  await authService.logIn(user);

  res.locals.result = {
    user,
  };
});

const googleOauth = createHandler(async (
  req: TAppRequest<{}, AuthSchemas.TGoogleOauthBodyReq>,
  res: TAppResponse
) => {
  const {
    idToken,
    googleId,
    inviteSpaceToken,
  } = req.body;
  const authService = new AuthService(req, res);

  const {
    payload,
    err,
  } = await authService.verifyOAuthIdToken(
    idToken,
    [
      GOOGLE_WEB_CLIENT_ID,
      GOOGLE_IOS_CLIENT_ID,
    ]
  );

  if (err) {
    throw new BadRequestError(ERROR_CODES.BROKEN_DATA);
  }

  if (!payload) {
    throw new BadRequestError(ERROR_CODES.BROKEN_DATA);
  }

  const user = await authService.getGoogleOAuthUser(googleId, payload);

  if (!user) {
    throw new BadRequestError(ERROR_CODES.BROKEN_DATA);
  }

  if (inviteSpaceToken) {
    const { space } = await SpaceService.addParticipantByInvite(
      user._id,
      user.email,
      inviteSpaceToken
    );
    await space?.save();
  }

  await authService.logIn(user);

  res.locals.result = {
    user,
  };
});

const appleOauth = createHandler(async (
  req: TAppRequest<{}, AuthSchemas.TAppleOauthBodyReq>,
  res: TAppResponse<AuthSchemas.TAppleOauthResp>
) => {
  const authService = new AuthService(req, res);

  const {
    idToken,
    inviteSpaceToken,
  } = req.body;

  const tokenType = await appleAuth.verifyIdToken(idToken);

  if (!tokenType || !tokenType.email) {
    throw new BadRequestError(ERROR_CODES.BROKEN_DATA);
  }

  const { email } = tokenType;

  const user = await authService.getAppleAOAuthUser(email);

  if (inviteSpaceToken) {
    const { space } = await SpaceService.addParticipantByInvite(
      user._id,
      user.email,
      inviteSpaceToken
    );
    await space?.save();
  }

  await authService.logIn(user);

  res.locals.result = {
    user,
  };
});

const logInGuest = createHandler(async (
  req: TAppRequest<{}, AuthSchemas.TLogInGuestBodyReq>,
  res: TAppResponse<AuthSchemas.TLogInGuestResResp>
) => {
  const {
    email,
    teamId,
    inviteToken,
    inviteTo,
  } = req.body;

  const validateTokenRes = inviteTo === INVITE_USER_TO.POKER
    ? jwtToken.validateToken<TInvitePokerSessionTokenPayload>(inviteToken)
    : jwtToken.validateToken<TInviteRetroSessionTokenPayload>(inviteToken);

  if ('err' in validateTokenRes) {
    throw new BadRequestError(validateTokenRes.err.message, [
      {
        message: transServer.t('errors.pokerSession.invite.invalidToken'),
        path: ['body', 'token'],
      },
    ]);
  }

  const { spaceId } = validateTokenRes.data;
  const space = await SpaceModel.findById(spaceId);

  if (!space) {
    throw new NotFoundError(ERROR_CODES.NOT_FOUND, [{
      message: transServer.t('errors.space.notFound'),
      path: ['body'],
    }]);
  }

  const authService = new AuthService(req, res);
  authService.signOut();

  const user = await UserService.createLocalGuest(
    email
  );

  const spaceService = new SpaceService(space);

  await spaceService.addParticipantByInvitePokerSession(
    user._id,
    teamId
  );

  await Promise.all([
    space.save(),
    user.save(),
  ]);

  await authService.logIn(user);

  res.locals.result = {
    user,
  };
});

const signUp = createHandler(async (
  req: TAppRequest<{}, AuthSchemas.TSignUpBodyReq>,
  res: TAppResponse<AuthSchemas.TSignUpResResp>
) => {
  const authService = new AuthService(req, res);
  authService.signOut();

  const {
    email,
    username,
    password,
    inviteSpaceToken,
  } = req.body;

  const userService = new UserService();
  const user = await userService.createLocal(
    email,
    username,
    password
  );

  const { space } = await SpaceService.addParticipantByInvite(
    user._id,
    user.email,
    inviteSpaceToken
  );

  if (space) {
    await space?.save();
  }

  await user.save();

  await authService.logIn(user);

  res.locals.result = {
    user,
  };
});

const signOut = createHandler(async (
  req: TAppRequest,
  res: TAppResponse<AuthSchemas.TSignOutResResp>
) => {
  const authService = new AuthService(req, res);
  authService.signOut();

  res.locals.result = SUCCESS_VOID_RESULT;
});

const restorePassword = createHandler(async (
  req: TAppRequest<{}, AuthSchemas.TRestorePasswordBodyReq>,
  res: TAppResponse<AuthSchemas.TRestorePasswordResResp>
) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new NotFoundError(ERROR_CODES.NOT_FOUND, [
      {
        path: ['body', 'email'],
        message: transServer.t('errors.user.notFound'),
      },
    ]);
  }

  const token = user.signResetPasswordToken();
  await mailService.sendRestorePasswordEmail(
    user.username,
    email,
    routesHelpers.getUrl(routing.getResetPasswordUrl(token))
  );

  res.locals.result = SUCCESS_VOID_RESULT;
});

const resetPassword = createHandler(async (
  req: TAppRequest<{}, AuthSchemas.TResetPasswordBodyReq>,
  res: TAppResponse<AuthSchemas.TResetPasswordResResp>
) => {
  const {
    token,
    password,
  } = req.body;
  const result = UserModel.validateToken<TResetPasswordTokenPayload>(token);

  if ('err' in result) {
    throw new BadRequestError(result.err.message, [
      {
        message: transServer.t('errors.auth.resetPassword.invalidToken'),
        path: ['body', 'token'],
      },
    ]);
  }

  const { data: { email } } = result;
  const user = await UserModel.findOne({ email });

  if (!user) {
    throw new NotFoundError(
      ERROR_CODES.NOT_FOUND,
      [
        {
          message: transServer.t('errors.auth.resetPassword.tokenUserNotFound'),
          path: ['body', 'token', 'email'],
        },
      ]
    );
  }

  user.set({ password });
  await user.save();

  res.locals.result = SUCCESS_VOID_RESULT;
});

const validateResetPasswordToken = createHandler(async (
  req: TAppRequest<{}, AuthSchemas.TValidateResetPasswordTokenBodyReq>,
  res: TAppResponse<AuthSchemas.TValidateResetPasswordTokenResResp>
) => {
  const { token } = req.body;
  const result = UserModel.validateToken<TResetPasswordTokenPayload>(token);

  if ('err' in result) {
    throw new BadRequestError(result.err.message, [
      {
        message: transServer.t('errors.auth.validateResetPasswordToken.invalidToken'),
        path: ['body', 'token'],
      },
    ]);
  }

  res.locals.result = {
    resetPasswordTokenPayload: result.data,
  };
});

const getNonce = async (
  req: TAppRequest, res: TAppResponse<{}>, next: TAppNext
) => {
  const nonce = generateNonce();
  // @ts-ignore
  req.session.nonce = nonce;

  await req.session.save((err) => {
    if (err) {
      return next(err);
    }

    res.send({
      result: {
        nonce,
      },
    });
  });
};

const authController = {
  get,
  getSession,
  signIn,
  signInCrypto,
  signUpCrypto,
  googleOauth,
  appleOauth,
  signUp,
  signOut,
  restorePassword,
  resetPassword,
  validateResetPasswordToken,
  logInGuest,
  getNonce,
};

export { authController };
