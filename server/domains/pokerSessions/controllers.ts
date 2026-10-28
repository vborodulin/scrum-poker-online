import { SUCCESS_VOID_RESULT } from '@chpokify/api-schemas';
import { pokerSessionsSchemas } from '@chpokify/api-schemas/pokerSessionsSchemas';
import { transServer } from '@chpokify/i18n';
import { TInvitePokerSessionTokenPayload } from '@chpokify/models-types/pokerSession';
import { routing } from '@chpokify/routing';
import { PokerSessionService } from '@pokerSessions/services/PokerSession';
import { PokerSessionExporter } from '@pokerSessions/services/PokerSessionExporter';
import { updatePokerSession } from '@pokerSessions/services/updatePokerSession';
import { io } from '@socket';

import { BadRequestError } from '@core/lib/errors';
import { jwtToken } from '@core/lib/jwtToken';
import { createHandler } from '@core/middleware/createHandler';
import { TAppRequest, TAppResponse } from '@core/types';

import { PokerSessionModel, TPokerSessionDocument } from '@models/pokerSession';
import { TSpaceDocument } from '@models/space';

import { routesHelpers } from '@routes/helpers';

import { usersInSessions } from './components/UsersInSessions';

const create = createHandler(async (
  req: TAppRequest<{}, pokerSessionsSchemas.TCreateBodyReq>,
  res: TAppResponse<pokerSessionsSchemas.TCreateResResp>
) => {
  const { body } = req;
  const space = res.locals.get('space') as TSpaceDocument;

  const pokerSession = PokerSessionModel.createNew({
    ...body,
    spaceId: space._id,
  });

  await pokerSession.save();

  res.locals.result = {
    pokerSession,
  };
});

const getList = createHandler(async (
  req: TAppRequest,
  res: TAppResponse<pokerSessionsSchemas.TGetListResResp>
) => {
  const space = res.locals.get('space') as TSpaceDocument;
  const pokerSessions = await PokerSessionModel.find({
    spaceId: space._id,
  });
  res.locals.result = {
    pokerSessions,
  };
});

const get = createHandler(async (
  req: TAppRequest,
  res: TAppResponse<pokerSessionsSchemas.TGetResResp>
) => {
  const pokerSession = res.locals.get('pokerSession') as TPokerSessionDocument;
  res.locals.result = {
    pokerSession,
  };
});

const openRatingModal = createHandler(async (
  req: TAppRequest,
  res: TAppResponse
) => {
  const pokerSession = res.locals.get('pokerSession') as TPokerSessionDocument;

  const pokerSessionId = pokerSession._id.toString();

  const roomId = `pokerSessionRatingModal:${pokerSessionId}`;
  const eventName = roomId;

  io.to(roomId)
    .emit(eventName);
  res.locals.result = {};
});

const setRatingModal = createHandler(async (
  req: TAppRequest<{}, pokerSessionsSchemas.TSetRatingBodyReq>,
  res: TAppResponse<pokerSessionsSchemas.TUpdateResResp>
) => {
  const {
    body,
    user,
  } = req;
  const {
    rating,
  } = body;

  // many users rate at the same time
  const pokerSession = await updatePokerSession(
    res.locals.get('pokerSession') as TPokerSessionDocument,
    (_, pokerSessionService) => pokerSessionService.setRating(rating, user._id)
  );

  res.locals.result = {
    pokerSession,
  };
});

const setInSession = createHandler(async (
  req: TAppRequest,
  res: TAppResponse<pokerSessionsSchemas.TSetInSessionResResp>
) => {
  const { user } = req;
  const pokerSession = res.locals.get('pokerSession') as TPokerSessionDocument;

  await usersInSessions.setInSession(pokerSession, user._id);

  res.locals.result = SUCCESS_VOID_RESULT;
});

const leaveSession = createHandler(async (
  req: TAppRequest,
  res: TAppResponse<pokerSessionsSchemas.TSetInSessionResResp>
) => {
  const { user } = req;
  const pokerSession = res.locals.get('pokerSession') as TPokerSessionDocument;

  usersInSessions.leaveSession(pokerSession._id, user._id);

  res.locals.result = SUCCESS_VOID_RESULT;
});

const exportCSV = async (req: TAppRequest, res: TAppResponse) => {
  const pokerSession = res.locals.get('pokerSession') as TPokerSessionDocument;
  const space = res.locals.get('space') as TSpaceDocument;

  const exporter = new PokerSessionExporter(
    pokerSession,
    space
  );

  res.locals.result = SUCCESS_VOID_RESULT;
  res.setHeader('Content-disposition', `attachment; filename=${exporter.getFilename('csv')}`);
  res.writeHead(200, { 'Content-Type': 'text/csv' });

  await exporter.exportCSV(res);
};

const inviteGen = createHandler(async (
  req: TAppRequest<{}, pokerSessionsSchemas.TGenInviteBodyReq>,
  res: TAppResponse<pokerSessionsSchemas.TGenInviteResResp>
) => {
  const { teamsIds, locale } = req.body;
  const space = res.locals.get('space') as TSpaceDocument;

  const pokerSession = res.locals.get('pokerSession') as TPokerSessionDocument;

  const pokerSessionService = new PokerSessionService(pokerSession);

  const token = pokerSessionService.genInviteToken(space, teamsIds);

  const urlRaw:string = `/${locale}${routing.getInviteToPokerSessionUrl(token)}`;

  res.locals.result = {
    url: routesHelpers.getUrl(urlRaw),
  };
});

const inviteValidate = createHandler(async (
  req: TAppRequest<{}, pokerSessionsSchemas.TValidateInviteBodyReq>,
  res: TAppResponse<pokerSessionsSchemas.TValidateInviteResResp>
) => {
  const { token } = req.body;

  const validateTokenRes = jwtToken.validateToken<TInvitePokerSessionTokenPayload>(token);

  if ('err' in validateTokenRes) {
    throw new BadRequestError(validateTokenRes.err.message, [
      {
        message: transServer.t('errors.pokerSession.invite.invalidToken'),
        path: ['body', 'token'],
      },
    ]);
  }

  res.locals.result = {
    inviteTokenPayload: validateTokenRes.data,
  };
});

export const pokerSessionsControllers = {
  create,
  get,
  openRatingModal,
  setRatingModal,
  getList,
  setInSession,
  leaveSession,
  exportCSV,
  inviteGen,
  inviteValidate,
};
