import { pokerSessionsSchemas } from '@chpokify/api-schemas';
import { Router } from 'express';

import { validateMiddleware } from '@core/middleware/validate';

import { pokersSessionsMiddlewares } from '../middlewares';

import { moderateControllers } from './controllers';

const moderateRouter = Router();

moderateRouter.patch(
  '/',
  validateMiddleware(pokerSessionsSchemas.updateSchema),
  moderateControllers.update
);

moderateRouter.delete(
  '/',
  moderateControllers.remove
);

moderateRouter.post(
  '/stories/many',
  validateMiddleware(pokerSessionsSchemas.storiesAddManySchema),
  moderateControllers.storyAddMany
);

moderateRouter.post(
  '/stories/many/set',
  validateMiddleware(pokerSessionsSchemas.storiesSetManySchema),
  moderateControllers.storySetMany
);

moderateRouter.post(
  '/stories/sort',
  validateMiddleware(pokerSessionsSchemas.storiesSetSortSchema),
  moderateControllers.storiesSetSort
);

moderateRouter.use(
  '/stories/:storyId',
  pokersSessionsMiddlewares.withStory
);

moderateRouter.post(
  '/stories/:storyId',
  moderateControllers.storyAdd
);

moderateRouter.delete(
  '/stories/:storyId',
  moderateControllers.storyRemove
);

moderateRouter.post(
  '/stories/:storyId/start',
  moderateControllers.storyStart
);

moderateRouter.post(
  '/stories/:storyId/stop',
  moderateControllers.storyActiveStop
);

// @Deprecated
moderateRouter.post(
  '/stories/:storyId/vote-all',
  moderateControllers.voteAll
);

// @Deprecated
moderateRouter.post(
  '/stories/:storyId/vote-all/cancel',
  moderateControllers.voteAllCancel
);

moderateRouter.post(
  '/stories/:storyId/vote',
  validateMiddleware(pokerSessionsSchemas.storyVoteSchema),
  pokersSessionsMiddlewares.withTeam('body'),
  moderateControllers.vote
);

moderateRouter.post(
  '/stories/:storyId/vote/cancel',
  validateMiddleware(pokerSessionsSchemas.storyVoteCancelSchema),
  pokersSessionsMiddlewares.withTeam('body'),
  moderateControllers.voteCancel
);

moderateRouter.post(
  '/stories/:storyId/reveal',
  moderateControllers.revealAll
);

moderateRouter.post(
  '/stories/:storyId/teams/:teamId/reveal',
  pokersSessionsMiddlewares.withTeam('params'),
  moderateControllers.reveal
);

moderateRouter.post(
  '/stories/:storyId/teams/:teamId/scores',
  validateMiddleware(pokerSessionsSchemas.TeamScoresSetSchema),
  pokersSessionsMiddlewares.withTeam('params'),
  moderateControllers.setTeamScore
);

export {
  moderateRouter,
};
