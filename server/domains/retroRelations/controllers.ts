import {
  retroRelationsSchemas,
  SUCCESS_VOID_RESULT,
  TSuccessVoidResult,
} from '@chpokify/api-schemas';
import { isEqualsId } from '@chpokify/helpers';
import { transServer } from '@chpokify/i18n';
import { updateRetroCard } from '@domains/retroCards/service';
import { updateRetroRelation } from '@domains/retroRelations/services';
import { RetroTemplatesService } from '@domains/retroTemplates/services';
import { ObjectID } from 'bson';

import { markSoftDeleted } from '@core/lib/db/plugins';
import { ERROR_CODES, NotFoundError } from '@core/lib/errors';
import { log } from '@core/lib/logger';
import { createHandler } from '@core/middleware/createHandler';
import { TAppRequest, TAppResponse } from '@core/types';

import { RetroCardModel, TRetroCardDocument } from '@models/retroCard';
import { RetroRelationsModel, TRetroRelationsDocument } from '@models/retroRelations';
import { TRetroTemplateDocument } from '@models/retroTemplate';
import { TSpaceDocument } from '@models/space';

const cardNotInColumnError = () => new NotFoundError(ERROR_CODES.NOT_FOUND, [
  {
    message: transServer.t('errors.retroCard.notFound'),
    path: ['body', 'cardId'],
  },
]);

/**
 * Card document is saved before it is added to column: clients receive the card before the column
 * references it. If adding to column fails, the card is removed so it does not stay orphaned.
 */
const saveCardToColumn = async (
  card: TRetroCardDocument,
  retroRelation: TRetroRelationsDocument,
  isTopCreate?: boolean
) => {
  await card.save();

  try {
    await updateRetroRelation(retroRelation, (_, service) => {
      service.addCard(card._id, isTopCreate);
    });
  } catch (err) {
    await RetroCardModel.deleteOne({ _id: card._id });
    throw err;
  }
};

const getListByTemplatesIds = createHandler(async (
  req: TAppRequest<{}, retroRelationsSchemas.TGetListByTemplatesIdsBodyReq>,
  res: TAppResponse<retroRelationsSchemas.TGetListByTemplatesIdsResResp>
) => {
  const { ids } = req.body;

  const objectIdIds = ids.map((id) => new ObjectID(id));

  const retroRelations = await RetroRelationsModel.find({
    templateId: {
      $in: objectIdIds,
    },
  },
  [
    'cardsIds',
    'templateId',
    'columnId',
    'isDeleted',
  ]);

  res.locals.result = {
    retroRelations,
  };
});

const getListByTemplateId = createHandler(async (
  req: TAppRequest<{}>,
  res: TAppResponse<retroRelationsSchemas.TGetListResResp>
) => {
  const retroTemplate = res.locals.get('retroTemplate') as TRetroTemplateDocument;

  const retroRelations = await RetroRelationsModel.find({
    templateId: retroTemplate._id,
  },
  [
    'cardsIds',
    'templateId',
    'columnId',
    'isDeleted',
  ]);

  res.locals.result = {
    retroRelations,
  };
});

const createCard = createHandler(async (
  req: TAppRequest<{}, retroRelationsSchemas.TCreateCardBodyReq>,
  res: TAppResponse<retroRelationsSchemas.TCreateCardResResp>
) => {
  const {
    user,
    body,
  } = req;
  const { isTopCreate, title, description } = body;

  const retroRelation = res.locals.get('retroRelation') as TRetroRelationsDocument;
  const space = res.locals.get('space') as TSpaceDocument;

  const card = RetroCardModel.createNew({
    title,
    description,
    userId: user._id,
    spaceId: space._id,
  });

  await saveCardToColumn(card, retroRelation, isTopCreate);

  res.locals.result = {};
});

const moveCardInColumn = createHandler(async (
  req: TAppRequest<{}, retroRelationsSchemas.TMoveCardInColumnBodyReq>,
  res: TAppResponse<TSuccessVoidResult>
) => {
  const {
    cardId,
    cardFinishIdx,
  } = req.body;
  const retroRelation = res.locals.get('retroRelation') as TRetroRelationsDocument;

  await updateRetroRelation(retroRelation, (_, service) => {
    if (!service.moveCardInColumn(cardId, cardFinishIdx)) {
      throw cardNotInColumnError();
    }
  });

  res.locals.result = SUCCESS_VOID_RESULT;
});

const moveCardBetweenColumns = createHandler(async (
  req: TAppRequest<{}, retroRelationsSchemas.TMoveCardBetweenColumnsBodyReq>,
  res: TAppResponse<TSuccessVoidResult>
) => {
  const {
    columnStartId,
    columnFinishId,
    cardStartIdx,
    cardFinishIdx,
    cardId,
  } = req.body;

  const retroRelationFromColumnStart = res.locals.get('retroRelationFromColumnStart') as
    TRetroRelationsDocument;
  const retroRelationFromColumnFinish = res.locals.get('retroRelationFromColumnFinish') as
    TRetroRelationsDocument;

  if (isEqualsId(columnStartId, columnFinishId)) {
    await updateRetroRelation(retroRelationFromColumnStart, (_, service) => {
      if (!service.moveCardInColumn(cardId, cardFinishIdx)) {
        throw cardNotInColumnError();
      }
    });

    res.locals.result = SUCCESS_VOID_RESULT;
    return;
  }

  // no transactions (standalone mongo): remove first, so the same card moved concurrently
  // to different columns ends up in one column only (the second move fails with not found)
  await updateRetroRelation(retroRelationFromColumnStart, (_, service) => {
    if (!service.removeCard(cardId)) {
      throw cardNotInColumnError();
    }
  });

  try {
    await updateRetroRelation(retroRelationFromColumnFinish, (_, service) => {
      service.insertCard(cardId, cardFinishIdx);
    });
  } catch (err) {
    // return card back, otherwise it disappears from the board
    await updateRetroRelation(retroRelationFromColumnStart, (_, service) => {
      service.insertCard(cardId, cardStartIdx);
    }).catch((rollbackErr) => {
      log.error({
        err: rollbackErr,
        methodName: 'retroRelationsControllers.moveCardBetweenColumns',
        cardId,
        columnStartId,
      }, 'failed to return card to start column');
    });

    throw err;
  }

  res.locals.result = SUCCESS_VOID_RESULT;
});

const removeCard = createHandler(async (
  req: TAppRequest<{ retroCardId: string }>,
  res: TAppResponse<TSuccessVoidResult>
) => {
  const { retroCardId } = req.params;

  const retroRelation = res.locals.get('retroRelation') as TRetroRelationsDocument;
  const retroCard = res.locals.get('retroCard') as TRetroCardDocument;

  await updateRetroRelation(retroRelation, (_, service) => {
    if (!service.removeCard(retroCardId)) {
      throw cardNotInColumnError();
    }
  });

  await updateRetroCard(retroCard, (doc) => {
    markSoftDeleted(doc);
  });

  res.locals.result = {};
});

const moveCardInActionColumn = createHandler(async (
  req: TAppRequest<{}>,
  res: TAppResponse<TSuccessVoidResult>
) => {
  const retroCard = res.locals.get('retroCard') as TRetroCardDocument;
  const retroTemplate = res.locals.get('retroTemplate') as TRetroTemplateDocument;

  const retroTemplateService = new RetroTemplatesService(retroTemplate);
  const columnAction = retroTemplateService.getActionColumn();

  if (!columnAction) {
    throw new NotFoundError(ERROR_CODES.NOT_FOUND, [
      {
        path: ['params', 'columnId'],
        message: transServer.t('errors.retroSessionTemplate.column.notFoundAction'),
      },
    ]);
  }

  const retroRelationsFromActionColumn = await RetroRelationsModel.findOne({
    templateId: retroTemplate._id,
    columnId: columnAction._id,
  });

  if (!retroRelationsFromActionColumn) {
    throw new NotFoundError(ERROR_CODES.NOT_FOUND, [
      {
        path: ['params'],
        message: transServer.t('errors.retroRelations.notFound'),
      },
    ]);
  }

  const card = RetroCardModel.createNew({
    title: retroCard.title,
    userId: retroCard.userId,
    spaceId: retroCard.spaceId,
    combinedCards: retroCard.combinedCards,
  });

  await saveCardToColumn(card, retroRelationsFromActionColumn);

  res.locals.result = {};
});

export const retroRelationsControllers = {
  createCard,
  moveCardInColumn,
  moveCardBetweenColumns,
  removeCard,
  moveCardInActionColumn,
  getListByTemplateId,
  getListByTemplatesIds,
};
