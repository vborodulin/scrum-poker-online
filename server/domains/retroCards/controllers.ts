import { SUCCESS_VOID_RESULT } from '@chpokify/api-schemas';
import { retroCardsSchemas } from '@chpokify/api-schemas/retroCardsSchemas';
import { isEqualsId, spaceHelpers } from '@chpokify/helpers';
import { transServer } from '@chpokify/i18n';
import { TEntityID } from '@chpokify/models-types';
import { updateRetroCard } from '@domains/retroCards/service';
import { updateRetroRelation } from '@domains/retroRelations/services';
import { ObjectID } from 'bson';

import {
  BadRequestError, ERROR_CODES, ForbiddenError, NotFoundError,
} from '@core/lib/errors';
import { log } from '@core/lib/logger';
import { createHandler } from '@core/middleware/createHandler';
import { TAppRequest, TAppResponse } from '@core/types';

import { RetroCardModel, TRetroCardDocument } from '@models/retroCard';
import { RetroRelationsModel } from '@models/retroRelations';
import { TRetroSessionDocument } from '@models/retroSession';
import { SPACE_PARTICIPANT_ROLE, TSpaceDocument } from '@models/space';

// participant can vote / remove vote only for themselves: voteId is the user id
const validateOwnVote = (voteId: TEntityID, userId: TEntityID, path: string[]) => {
  if (!isEqualsId(voteId, userId)) {
    throw new ForbiddenError(ERROR_CODES.INVALID_PERMISSIONS, [
      {
        message: transServer.t('errors.forbidden'),
        path,
      },
    ]);
  }
};

const getList = createHandler(async (
  req: TAppRequest<{}, retroCardsSchemas.TGetListBodyReq>,
  res: TAppResponse<retroCardsSchemas.TGetListResResp>
) => {
  const { ids } = req.body;
  const space = res.locals.get('space') as TSpaceDocument;

  const objectIdIds = ids.map((id) => new ObjectID(id));

  const retroCards = await RetroCardModel.find({
    _id: {
      $in: objectIdIds,
    },
    spaceId: space._id,
  });

  res.locals.result = {
    retroCards,
  };
});

const update = createHandler(async (
  req: TAppRequest<{}, retroCardsSchemas.TUpdateBodyReq>,
  res: TAppResponse<retroCardsSchemas.TUpdateResResp>
) => {
  const {
    user,
    body,
  } = req;

  const { combinedCardsTitles, combinedCardsDescriptions, ...other } = body;

  const retroCard = res.locals.get('retroCard') as TRetroCardDocument;
  const space = res.locals.get('space') as TSpaceDocument;

  const roleInSpace = spaceHelpers.getParticipantRole(space, user._id);

  if (!isEqualsId(user._id, retroCard.userId)
    && SPACE_PARTICIPANT_ROLE.ADMIN > roleInSpace
  ) {
    throw new ForbiddenError(ERROR_CODES.INVALID_PERMISSIONS, [
      {
        message: transServer.t('errors.forbidden'),
        path: ['params', 'retroCardId'],
      },
    ]);
  }

  const updatedRetroCard = await updateRetroCard(retroCard, (doc, cardService) => {
    if (combinedCardsDescriptions) {
      cardService.updateDescriptionsCombinedCards(combinedCardsDescriptions);
    }

    if (combinedCardsTitles) {
      cardService.updateTitlesCombinedCards(combinedCardsTitles);
      cardService.removeCardsCombined(combinedCardsTitles.length);
    }

    doc.set(other);
  });

  res.locals.result = {
    retroCard: updatedRetroCard,
  };
});

const addVote = createHandler(async (
  req: TAppRequest<{}, retroCardsSchemas.TAddVoteBodyReq>,
  res: TAppResponse<retroCardsSchemas.TAddVoteResResp>
) => {
  const { voteId } = req.body;
  const { user } = req;

  validateOwnVote(voteId, user._id, ['body', 'voteId']);

  const retroCard = res.locals.get('retroCard') as TRetroCardDocument;
  const retroSession = res.locals.get('retroSession') as TRetroSessionDocument;

  // votes limit is taken from the session: the card must belong to it,
  // otherwise any session with a bigger limit could be passed in body
  const isCardInSession = await RetroRelationsModel.exists({
    templateId: retroSession.templateId,
    cardsIds: retroCard._id,
  });

  if (!isCardInSession) {
    throw new NotFoundError(ERROR_CODES.NOT_FOUND, [
      {
        message: transServer.t('errors.retroCard.notFound'),
        path: ['params', 'retroCardId'],
      },
    ]);
  }

  // limit is checked on every attempt: concurrent clicks must not exceed max votes
  await updateRetroCard(retroCard, (_, retroCardService) => {
    const countVotesByUserId = retroCardService.getCountVotesByUserId(user._id);

    if (countVotesByUserId >= retroSession.maxVotesCard) {
      throw new BadRequestError(ERROR_CODES.BROKEN_DATA, [
        {
          path: ['body', 'voteId'],
          message: transServer.t('errors.retroCard.invalidMaxVotes', {
            maxVotes: retroSession.maxVotesCard,
          }),
        },
      ]);
    }

    retroCardService.addVote(user._id);
  });

  res.locals.result = SUCCESS_VOID_RESULT;
});

const removeVote = createHandler(async (
  req: TAppRequest<{ voteId: string }>,
  res: TAppResponse<retroCardsSchemas.TRemoveVoteResResp>
) => {
  const { voteId } = req.params;
  const { user } = req;

  validateOwnVote(voteId, user._id, ['params', 'voteId']);

  const retroCard = res.locals.get('retroCard') as TRetroCardDocument;

  await updateRetroCard(retroCard, (_, retroCardService) => {
    retroCardService.removeVote(user._id);
  });

  res.locals.result = SUCCESS_VOID_RESULT;
});

const combineCard = createHandler(async (
  req: TAppRequest<{}, retroCardsSchemas.TCombineCardBodyReq>,
  res: TAppResponse<retroCardsSchemas.TCombineCardResResp>
) => {
  const {
    cardId,
    columnId,
  } = req.body;

  const retroCard = res.locals.get('retroCard') as TRetroCardDocument;
  const retroSession = res.locals.get('retroSession') as TRetroSessionDocument;

  const retroRelation = await RetroRelationsModel.findOne({
    templateId: retroSession.templateId,
    columnId,
  });

  if (!retroRelation) {
    throw new NotFoundError(ERROR_CODES.NOT_FOUND, [
      {
        message: transServer.t('errors.retroRelations.notFound'),
        path: ['body', 'columnId'],
      },
    ]);
  }

  if (isEqualsId(cardId, retroCard._id)) {
    throw new BadRequestError(ERROR_CODES.BROKEN_DATA, [
      {
        message: transServer.t('errors.retroCard.combineWithItself'),
        path: ['body', 'cardId'],
      },
    ]);
  }

  const cardNotFoundError = () => new NotFoundError(ERROR_CODES.NOT_FOUND, [
    {
      message: transServer.t('errors.retroCard.notFound'),
      path: ['body', 'cardId'],
    },
  ]);

  let cardIdx = -1;

  // no transactions (standalone mongo): remove moving card from column first, so the same card
  // combined concurrently into two cards is merged only once (the second request fails with not found)
  await updateRetroRelation(retroRelation, (doc, service) => {
    cardIdx = doc.cardsIds.findIndex((id) => isEqualsId(id, cardId));

    if (!service.removeCard(cardId)) {
      throw cardNotFoundError();
    }
  });

  try {
    // read after removing from column: votes for it given before that are not lost
    const retroCardMoving = await RetroCardModel.findOne(
      {
        _id: cardId,
        spaceId: retroCard.spaceId,
      },
      ['isCompleted', 'title', 'description', 'spaceId', 'userId', 'votes', 'combinedCards']
    );

    if (!retroCardMoving) {
      throw cardNotFoundError();
    }

    await updateRetroCard(retroCard, (_, retroCardService) => {
      retroCardService.combineCard(retroCardMoving);
    });
  } catch (err) {
    // return card back, otherwise it disappears from the board
    await updateRetroRelation(retroRelation, (_, service) => {
      service.insertCard(cardId, cardIdx);
    }).catch((rollbackErr) => {
      log.error({
        err: rollbackErr,
        methodName: 'retroCardsControllers.combineCard',
        cardId,
        columnId,
      }, 'failed to return card to column');
    });

    throw err;
  }

  await RetroCardModel.deleteOne({ _id: cardId });

  res.locals.result = SUCCESS_VOID_RESULT;
});

export const retroCardsControllers = {
  getList,
  update,
  addVote,
  removeVote,
  combineCard,
};
