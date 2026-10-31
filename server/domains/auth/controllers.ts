import { AuthSchemas, SUCCESS_VOID_RESULT } from '@chpokify/api-schemas';
import { isEqualsId } from '@chpokify/helpers';
import { transServer } from '@chpokify/i18n';
import {
  INVITE_USER_TO,
  TEntityID,
  TInviteRetroSessionTokenPayload,
  TTeam,
} from '@chpokify/models-types';
import { TInvitePokerSessionTokenPayload } from '@chpokify/models-types/pokerSession';
import config from 'config';

import { AuthService } from '@auth/services/AuthService';
import { inviteTokenUsage } from '@auth/services/inviteTokenUsage';

import { appleAuth } from '@core/lib/appleAuth';
import {
  BadRequestError, ERROR_CODES, NotFoundError,
} from '@core/lib/errors';
import { jwtToken } from '@core/lib/jwtToken';
import { createHandler } from '@core/middleware/createHandler';
import { TAppRequest, TAppResponse } from '@core/types';

import { SpaceModel } from '@models/space';

import { SpaceService } from '@spaces/services';

import { UserService } from '@users/services';

// standard claims added by jsonwebtoken
type TJwtPayload = {
  exp?: number;
};

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

const getGuestTeamId = (
  teams: TTeam[],
  teamId?: TEntityID
): TEntityID => {
  if (!teams.length) {
    throw new BadRequestError(ERROR_CODES.UNMET_CONDITIONS_ERROR, [
      {
        message: transServer.t('schemas.authGuest.teamId.string.empty'),
        path: ['body', 'teamId'],
      },
    ]);
  }

  if (!teamId) {
    if (teams.length === 1) {
      return teams[0]._id;
    }

    throw new BadRequestError(ERROR_CODES.PARAM_REQUIRED, [
      {
        message: transServer.t('schemas.authGuest.teamId.any.required'),
        path: ['body', 'teamId'],
      },
    ]);
  }

  // only teams chosen by admin for the invite link
  if (!teams.some((team) => isEqualsId(team._id, teamId))) {
    throw new BadRequestError(ERROR_CODES.INVALID_PARAM, [
      {
        message: transServer.t('schemas.authGuest.teamId.invalid'),
        path: ['body', 'teamId'],
      },
    ]);
  }

  return teamId;
};

/**
 * Guest joins poker / retro session by one-time invite link, entering only the name.
 * Guest has no email and password: it stays logged in by session cookie.
 */
const logInGuest = createHandler(async (
  req: TAppRequest<{}, AuthSchemas.TLogInGuestBodyReq>,
  res: TAppResponse<AuthSchemas.TLogInGuestResResp>
) => {
  const {
    username,
    teamId,
    inviteToken,
    inviteTo,
  } = req.body;

  const validateTokenRes = inviteTo === INVITE_USER_TO.POKER
    ? jwtToken.validateToken<TInvitePokerSessionTokenPayload & TJwtPayload>(inviteToken)
    : jwtToken.validateToken<TInviteRetroSessionTokenPayload & TJwtPayload>(inviteToken);

  if ('err' in validateTokenRes) {
    throw new BadRequestError(validateTokenRes.err.message, [
      {
        message: transServer.t('errors.pokerSession.invite.invalidToken'),
        path: ['body', 'token'],
      },
    ]);
  }

  const { spaceId, teams, exp } = validateTokenRes.data;
  const space = await SpaceModel.findById(spaceId);

  if (!space) {
    throw new NotFoundError(ERROR_CODES.NOT_FOUND, [{
      message: transServer.t('errors.space.notFound'),
      path: ['body'],
    }]);
  }

  const guestTeamId = getGuestTeamId(teams, teamId);

  // after all validations: a link is not burnt by a request with invalid data
  const isMarkedUsed = await inviteTokenUsage.markUsed(inviteToken, exp);

  if (!isMarkedUsed) {
    throw new BadRequestError(ERROR_CODES.UNMET_CONDITIONS_ERROR, [
      {
        message: transServer.t('errors.auth.guest.inviteUsed'),
        path: ['body', 'inviteToken'],
      },
    ]);
  }

  const authService = new AuthService(req, res);
  authService.signOut();

  const user = UserService.createGuest(username.trim());
  await user.save();

  const spaceService = new SpaceService(space);

  // saves space
  await spaceService.addParticipantByInvitePokerSession(
    user._id,
    guestTeamId
  );

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

const authController = {
  get,
  getSession,
  signIn,
  googleOauth,
  appleOauth,
  signUp,
  signOut,
  logInGuest,
};

export { authController };
