import { retroSessionsSchemas, SUCCESS_VOID_RESULT, TSuccessVoidResult } from '@chpokify/api-schemas';
import { transServer } from '@chpokify/i18n';
import { TInviteRetroSessionTokenPayload } from '@chpokify/models-types';
import { routing } from '@chpokify/routing';
import { updateRetroCard } from '@domains/retroCards/service';
import { RetroRelationsService } from '@domains/retroRelations/services';
import { RetroSessionExporter } from '@domains/retroSessions/services/RetroSessionExporter';
import { RetroSessionService } from '@domains/retroSessions/services/RetroSessionService';
import { RetroTemplatesService } from '@domains/retroTemplates/services';

import { inviteTokenUsage } from '@auth/services/inviteTokenUsage';

import {
  BadRequestError, ERROR_CODES, NotFoundError,
} from '@core/lib/errors';
import { jwtToken } from '@core/lib/jwtToken';
import { createHandler } from '@core/middleware/createHandler';
import { TAppRequest, TAppResponse } from '@core/types';

import { RetroCardModel } from '@models/retroCard';
import { RetroRelationsModel } from '@models/retroRelations';
import { RetroSessionModel, TRetroSessionDocument } from '@models/retroSession';
import { RetroTemplateModel } from '@models/retroTemplate';
import { TSpaceDocument } from '@models/space';

import { routesHelpers } from '@routes/helpers';

const create = createHandler(async (
  req: TAppRequest<{}, retroSessionsSchemas.TCreateBodyReq>,
  res: TAppResponse<retroSessionsSchemas.TCreateResResp>
) => {
  const {
    body,
    user,
  } = req;
  const space = res.locals.get('space') as TSpaceDocument;
  const spaceId = space._id;

  const { templateType } = body;

  const retroTemplate = await RetroTemplateModel.createNew({
    type: templateType,
  });

  const retroTemplateService = new RetroTemplatesService(retroTemplate);

  retroTemplateService.createColumns(templateType);

  const retroSession = RetroSessionModel.createNew({
    ...body,
    spaceId,
    userId: user._id,
    templateId: retroTemplate._id,
  });

  await Promise.all([
    retroTemplate.save(),
    retroSession.save(),
    RetroRelationsService.createRelationsFromColumns(retroTemplate),
  ]);

  res.locals.result = {
    retroSession,
  };
});

const update = createHandler(async (
  req: TAppRequest<{}, retroSessionsSchemas.TUpdateBodyReq>,
  res: TAppResponse<retroSessionsSchemas.TUpdateResResp>
) => {
  const retroSession = res.locals.get('retroSession') as TRetroSessionDocument;

  retroSession.set(req.body);

  await retroSession.save();

  res.locals.result = {
    retroSession,
  };
});

const get = createHandler(async (
  req: TAppRequest<{}>,
  res: TAppResponse<retroSessionsSchemas.TGetResResp>
) => {
  const retroSession = res.locals.get('retroSession') as TRetroSessionDocument;

  res.locals.result = {
    retroSession,
  };
});

const getList = createHandler(async (
  req: TAppRequest<{}, {}, retroSessionsSchemas.TGetListQueryReq>,
  res: TAppResponse<retroSessionsSchemas.TGetListResResp>
) => {
  const { limit } = req.query;

  const space = res.locals.get('space') as TSpaceDocument;

  const findRetroSessions = RetroSessionModel.find({
    spaceId: space._id,
  }).sort({ createdAt: -1 });

  if (limit) {
    findRetroSessions.limit(Number(limit));
  }

  const retroSessions = await findRetroSessions;

  res.locals.result = {
    retroSessions,
  };
});

const remove = createHandler(async (
  req: TAppRequest,
  res: TAppResponse<retroSessionsSchemas.TRemoveResResp>
) => {
  const retroSession = res.locals.get('retroSession') as TRetroSessionDocument;

  const { templateId } = retroSession;

  const [retroTemplate, retroRelations] = await Promise.all([
    RetroTemplateModel.findById(templateId, ['_id']),
    RetroRelationsModel.find({ templateId }, ['cardsIds']),
  ]);

  const retroRelationsCards = RetroRelationsService.getCardsIdsFromRelations(retroRelations);

  if (retroRelationsCards.length) {
    await RetroCardModel.deleteMany({
      _id: {
        $in: retroRelationsCards,
      },
    });
  }

  if (retroRelations?.length) {
    await RetroRelationsModel.deleteMany({ templateId });
  }

  await Promise.all([
    retroSession.remove(),
    retroTemplate?.remove(),
  ]);

  res.locals.result = {
    retroSessionId: retroSession._id,
  };
});

const inviteGen = createHandler(async (
  req: TAppRequest<{}, retroSessionsSchemas.TGenInviteBodyReq>,
  res: TAppResponse<retroSessionsSchemas.TGenInviteResResp>
) => {
  const {
    teamsIds,
    locale,
  } = req.body;

  const space = res.locals.get('space') as TSpaceDocument;

  const retroSession = res.locals.get('retroSession') as TRetroSessionDocument;

  const retroSessionService = new RetroSessionService(retroSession);

  const token = retroSessionService.genInviteToken(space, teamsIds);

  const urlRaw: string = `/${locale}${routing.getInviteToRetroSessionUrl(token)}`;

  res.locals.result = {
    url: routesHelpers.getUrl(urlRaw),
  };
});

const inviteValidate = createHandler(async (
  req: TAppRequest<{}, retroSessionsSchemas.TValidateInviteBodyReq>,
  res: TAppResponse<retroSessionsSchemas.TValidateInviteResResp>
) => {
  const { token } = req.body;

  const validateTokenRes = jwtToken.validateToken<TInviteRetroSessionTokenPayload>(token);

  if ('err' in validateTokenRes) {
    throw new BadRequestError(validateTokenRes.err.message, [
      {
        message: transServer.t('errors.retroSession.invite.invalidToken'),
        path: ['body', 'token'],
      },
    ]);
  }

  // used one-time link shows the error only to new guests:
  // logged in users (including the guest who used it) are just redirected to the session
  if (!req.user && await inviteTokenUsage.isUsed(token)) {
    throw new BadRequestError(ERROR_CODES.UNMET_CONDITIONS_ERROR, [
      {
        message: transServer.t('errors.auth.guest.inviteUsed'),
        path: ['body', 'token'],
      },
    ]);
  }

  res.locals.result = {
    inviteTokenPayload: validateTokenRes.data,
  };
});

const resetVotes = createHandler(async (
  req: TAppRequest<{}>,
  res: TAppResponse<TSuccessVoidResult>
) => {
  const retroSession = res.locals.get('retroSession') as TRetroSessionDocument;

  const { templateId } = retroSession;

  const retroRelations = await RetroRelationsModel.find({ templateId }, ['cardsIds']);

  if (!retroRelations.length) {
    throw new NotFoundError(ERROR_CODES.NOT_FOUND, [
      {
        path: ['params', 'retroSessionId'],
        message: transServer.t('errors.retroRelations.notFound'),
      },
    ]);
  }

  const retroRelationsCards = RetroRelationsService.getCardsIdsFromRelations(retroRelations);

  const retroCards = await RetroCardModel.find({ _id: { $in: retroRelationsCards } });

  if (!retroCards.length) {
    throw new BadRequestError(ERROR_CODES.BROKEN_DATA, [
      {
        path: ['params', 'retroSessionId'],
        message: transServer.t('errors.retroRelations.cards.notFound'),
      },
    ]);
  }

  // per card with retry: bulkSave skips cards changed concurrently (version mismatch) without error
  await Promise.all(retroCards.map((retroCard) => updateRetroCard(retroCard, (doc) => {
    doc.votes = [];
  })));

  res.locals.result = SUCCESS_VOID_RESULT;
});

const exportCSV = async (req: TAppRequest, res: TAppResponse) => {
  const retroSession = res.locals.get('retroSession') as TRetroSessionDocument;

  const exporter = new RetroSessionExporter(
    retroSession
  );

  res.locals.result = SUCCESS_VOID_RESULT;
  res.setHeader('Content-disposition', `attachment; filename=${exporter.getFilename('csv')}`);
  res.writeHead(200, { 'Content-Type': 'text/csv' });

  await exporter.exportCSV(res);
};

const getCountAll = createHandler(async (
  req: TAppRequest<{}>,
  res: TAppResponse<retroSessionsSchemas.TGetCountResResp>
) => {
  const space = res.locals.get('space') as TSpaceDocument;

  const count = await RetroSessionModel.count({
    spaceId: space._id,
  });

  res.locals.result = {
    count,
  };
});

export const retroSessionsControllers = {
  create,
  update,
  get,
  getList,
  remove,
  inviteGen,
  inviteValidate,
  resetVotes,
  exportCSV,
  getCountAll,
};
