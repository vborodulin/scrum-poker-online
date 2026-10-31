import { spacesSchemas } from '@chpokify/api-schemas';
import { transServer } from '@chpokify/i18n';
import { routing } from '@chpokify/routing';

import { BadRequestError, ERROR_CODES, ForbiddenError } from '@core/lib/errors';
import { jwtToken } from '@core/lib/jwtToken';
import { createHandler } from '@core/middleware/createHandler';
import { TAppRequest, TAppResponse } from '@core/types';

import {
  SpaceModel, TInviteTokenPayload, TSpaceDocument,
} from '@models/space';

import { routesHelpers } from '@routes/helpers';

import { SpaceService } from '@spaces/services';

const get = createHandler(async (
  req: TAppRequest,
  res: TAppResponse<spacesSchemas.TGetResResp>
) => {
  const space = res.locals.get('space') as TSpaceDocument;

  res.locals.result = {
    space,
  };
});

const getMyList = createHandler(async (
  req: TAppRequest,
  res: TAppResponse<spacesSchemas.TMyListResResp>
) => {
  const { user } = req;
  const spaces = await SpaceModel.findWhereParticipant(user._id);

  res.locals.result = {
    spaces,
  };
});

const create = createHandler(async (
  req: TAppRequest<{}, spacesSchemas.TCreateBodyReq>,
  res: TAppResponse<spacesSchemas.TCreateResResp>
) => {
  const {
    user,
    body: { name },
  } = req;

  if (user.isGuest) {
    throw new ForbiddenError(ERROR_CODES.INVALID_PERMISSIONS, [
      {
        message: transServer.t('errors.forbidden'),
        path: ['body', 'name'],
      },
    ]);
  }

  const space = SpaceModel.createNew(user._id, name);
  await space.save();

  res.locals.result = {
    space,
  };
});

const update = createHandler(async (
  req: TAppRequest<{}, spacesSchemas.TUpdateBodyReq>,
  res: TAppResponse<spacesSchemas.TUpdateResResp>
) => {
  const space = res.locals.get('space') as TSpaceDocument;

  space.set(req.body);

  await space.save();

  res.locals.result = {
    space,
  };
});

const remove = createHandler(async (
  req: TAppRequest,
  res: TAppResponse<spacesSchemas.TDeleteResResp>
) => {
  const space = res.locals.get('space') as TSpaceDocument;
  await space.remove();

  res.locals.result = {
    space,
  };
});

const inviteValidate = createHandler(async (
  req: TAppRequest<{}, spacesSchemas.TValidateInviteBodyReq>,
  res: TAppResponse<spacesSchemas.TValidateInviteResResp>
) => {
  const { token } = req.body;

  const validateTokenRes = jwtToken.validateToken<TInviteTokenPayload>(token);

  if ('err' in validateTokenRes) {
    throw new BadRequestError(validateTokenRes.err.message, [
      {
        message: transServer.t('errors.space.invite.invalidToken'),
        path: ['body', 'token'],
      },
    ]);
  }

  res.locals.result = {
    inviteTokenPayload: validateTokenRes.data,
  };
});

const inviteAccept = createHandler(async (
  req: TAppRequest<{}, spacesSchemas.TValidateInviteBodyReq>,
  res: TAppResponse<spacesSchemas.TInviteAcceptResResp>
) => {
  const {
    user,
    body: { token },
  } = req;

  const { space } = await SpaceService.addParticipantByInvite(
    user._id,
    user.email,
    token
  );

  if (!space) {
    throw new BadRequestError(ERROR_CODES.INVALID_PARAM, [
      {
        message: transServer.t('errors.space.invite.invalidToken'),
        path: ['body', 'token'],
      },
    ]);
  }

  res.locals.result = {
    space,
  };
});

const inviteGen = createHandler(async (
  req: TAppRequest,
  res: TAppResponse<spacesSchemas.TGenInviteResResp>
) => {
  const space = res.locals.get('space') as TSpaceDocument;

  const spaceService = new SpaceService(space);

  const token = spaceService.genInviteToken('');

  res.locals.result = {
    url: routesHelpers.getUrl(routing.getInviteToSpaceUrl(token)),
  };
});

const getStat = createHandler(async (
  req: TAppRequest,
  res: TAppResponse<spacesSchemas.TGetStatResResp>
) => {
  const space = res.locals.get('space') as TSpaceDocument;
  const spaceService = new SpaceService(space);

  res.locals.result = await spaceService.getStat();
});

export const spacesControllers = {
  get,
  getMyList,
  create,
  update,
  remove,
  inviteValidate,
  inviteAccept,
  inviteGen,
  getStat,
};
