import { coreSchemas } from '@chpokify/api-schemas';
import { isEqualsId, spaceHelpers } from '@chpokify/helpers';
import { transServer } from '@chpokify/i18n';

import {
  BadRequestError, ERROR_CODES, ForbiddenError, NotFoundError,
} from '@core/lib/errors';
import { createHandler } from '@core/middleware/createHandler';
import { TAppRequest } from '@core/types';

import { PokerSessionModel, TPokerSessionDocument } from '@models/pokerSession';
import { SpaceModel, TSpaceDocument } from '@models/space';
import { StoryModel } from '@models/story';

const withSession = createHandler(async (
  req: TAppRequest<{pokerSessionId: string}>,
  res
) => {
  const { params: { pokerSessionId } } = req;

  const { error } = coreSchemas.ObjectIdSchema.validate(pokerSessionId);

  if (error) {
    throw new BadRequestError(ERROR_CODES.INVALID_PARAM, [
      {
        path: ['params', 'pokerSession'],
        message: transServer.t('errors.pokerSession.invalidId'),
      },
    ]);
  }

  const pokerSession = await PokerSessionModel.findById(pokerSessionId);

  if (!pokerSession) {
    throw new NotFoundError(ERROR_CODES.NOT_FOUND, [
      {
        message: transServer.t('errors.pokerSession.notFound'),
        path: ['params', 'pokerSessionId'],
      },
    ]);
  }

  const { spaceId } = pokerSession;
  const space = await SpaceModel.findById(spaceId);

  if (!space) {
    throw new NotFoundError(ERROR_CODES.NOT_FOUND, [
      {
        message: transServer.t('errors.space.notFound'),
        path: ['params', 'pokerSession', 'spaceId'],
      },
    ]);
  }

  res.locals.set('space', space);
  res.locals.set('pokerSession', pokerSession);
});

const withStory = createHandler(async (
  req: TAppRequest<{ storyId: string }>,
  res
) => {
  const pokerSession = res.locals.get('pokerSession') as TPokerSessionDocument;
  const { storyId } = req.params;

  const notFoundError = new NotFoundError(ERROR_CODES.NOT_FOUND, [
    {
      message: transServer.t('errors.storyNotFound'),
      path: ['params', 'storyId'],
    },
  ]);

  const story = await StoryModel.findById(storyId);

  if (!story || !isEqualsId(story.spaceId, pokerSession.spaceId)) {
    throw notFoundError;
  }

  const isStoryInSession = pokerSession.storiesIds.some(
    (id) => isEqualsId(story._id, id)
  );

  if (!isStoryInSession) {
    throw notFoundError;
  }

  res.locals.set('story', story);
});

const withTeam = (from: 'params' | 'body', checkInTeam: boolean = false) => createHandler(async (
  req: TAppRequest<{ teamId: string }>,
  res
) => {
  const { user } = req;
  const { teamId } = req[from];
  const pokerSession = res.locals.get('pokerSession') as TPokerSessionDocument;
  const space = res.locals.get('space') as TSpaceDocument;

  if (!pokerSession.teamsIds.some((id) => isEqualsId(id, teamId))) {
    throw new NotFoundError(ERROR_CODES.NOT_FOUND, [
      {
        message: transServer.t('errors.pokerSession.teamNotInPokerSession'),
        path: ['params', 'teamId'],
      },
    ]);
  }

  if (!checkInTeam) {
    return;
  }

  const isInTeam = spaceHelpers.getTeamUsersIds(space, teamId)
    .some((teamUserId) => isEqualsId(teamUserId, user._id));

  if (!isInTeam) {
    throw new ForbiddenError(ERROR_CODES.INVALID_PERMISSIONS, [
      {
        message: transServer.t('errors.forbidden'),
        path: [from, 'teamId'],
      },
    ]);
  }
});

const pokersSessionsMiddlewares = {
  withSession,
  withStory,
  withTeam,
};

export {
  pokersSessionsMiddlewares,
};
