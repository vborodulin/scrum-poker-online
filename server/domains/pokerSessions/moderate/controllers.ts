import { pokerSessionsSchemas, SUCCESS_VOID_RESULT } from '@chpokify/api-schemas';
import { isEqualsId } from '@chpokify/helpers';
import { updatePokerSession } from '@pokerSessions/services/updatePokerSession';
import { jiraQueue } from '@queue';

import { createHandler } from '@core/middleware/createHandler';
import { QUEUE_JOB_NAME, TAppRequest, TAppResponse } from '@core/types';

import { TPokerSessionDocument } from '@models/pokerSession';
import { TStoryDocument } from '@models/story';

const update = createHandler(async (
  req: TAppRequest<{}, pokerSessionsSchemas.TUpdateBodyReq>,
  res: TAppResponse<pokerSessionsSchemas.TUpdateResResp>
) => {
  const {
    body,
  } = req;
  const {
    jira,
    ...otherParams
  } = body;

  const pokerSession = await updatePokerSession(
    res.locals.get('pokerSession') as TPokerSessionDocument,
    (currPokerSession, pokerSessionService) => {
      const prevTeamIds = [...currPokerSession.teamsIds];
      const prevCardDeckId = currPokerSession.cardSetId;

      currPokerSession.set(otherParams);

      if (body.jira) {
        currPokerSession.set('jira', jira);
      }

      if (body.cardSetId && !isEqualsId(body.cardSetId, prevCardDeckId)) {
        pokerSessionService.clearUsersCards();
        pokerSessionService.clearVoting();
      }

      const { teamsIds } = body;

      if (teamsIds) {
        prevTeamIds.forEach((pokerTeamId) => {
          const needRemove = !teamsIds.some((teamId) => isEqualsId(pokerTeamId, teamId));

          if (needRemove) {
            pokerSessionService.removeTeam(pokerTeamId);
          }
        });
      }
    }
  );

  res.locals.result = {
    pokerSession,
  };
});

const remove = createHandler(async (
  req: TAppRequest,
  res: TAppResponse<pokerSessionsSchemas.TRemoveResResp>
) => {
  const pokerSession = res.locals.get('pokerSession') as TPokerSessionDocument;
  await pokerSession.remove();

  res.locals.result = SUCCESS_VOID_RESULT;
});

const storyAdd = createHandler(async (
  req: TAppRequest,
  res: TAppResponse<pokerSessionsSchemas.TStoryAddResResp>
) => {
  const story = res.locals.get('story') as TStoryDocument;

  const pokerSession = await updatePokerSession(
    res.locals.get('pokerSession') as TPokerSessionDocument,
    (_, pokerSessionService) => pokerSessionService.addStory(story._id)
  );

  res.locals.result = {
    pokerSession,
  };
});

const storyAddMany = createHandler(async (
  req: TAppRequest<{}, pokerSessionsSchemas.TStoryAddManyReq>,
  res: TAppResponse<pokerSessionsSchemas.TStoryAddManyResResp>
) => {
  const { storiesIds } = req.body;

  const pokerSession = await updatePokerSession(
    res.locals.get('pokerSession') as TPokerSessionDocument,
    (_, pokerSessionService) => pokerSessionService.addManyStories(storiesIds)
  );

  res.locals.result = {
    pokerSession,
  };
});

const storySetMany = createHandler(async (
  req: TAppRequest<{}, pokerSessionsSchemas.TStorySetManyReq>,
  res: TAppResponse<pokerSessionsSchemas.TStorySetManyResResp>
) => {
  const { storiesIds } = req.body;

  const pokerSession = await updatePokerSession(
    res.locals.get('pokerSession') as TPokerSessionDocument,
    (_, pokerSessionService) => pokerSessionService.setManyStories(storiesIds)
  );

  res.locals.result = {
    pokerSession,
  };
});

const storiesSetSort = createHandler(async (
  req: TAppRequest<{}, pokerSessionsSchemas.TStoriesSetSortReq>,
  res: TAppResponse<pokerSessionsSchemas.TStoriesSetSortResResp>
) => {
  const { sort } = req.body;

  const pokerSession = await updatePokerSession(
    res.locals.get('pokerSession') as TPokerSessionDocument,
    (_, pokerSessionService) => pokerSessionService.setSortByScores(sort)
  );

  res.locals.result = {
    pokerSession,
  };
});

const storyRemove = createHandler(async (
  req: TAppRequest,
  res: TAppResponse<pokerSessionsSchemas.TStoryRemoveResResp>
) => {
  const story = res.locals.get('story') as TStoryDocument;

  const pokerSession = await updatePokerSession(
    res.locals.get('pokerSession') as TPokerSessionDocument,
    (_, pokerSessionService) => pokerSessionService.removeStory(story._id)
  );

  res.locals.result = {
    pokerSession,
  };
});

const storyStart = createHandler(async (
  req: TAppRequest,
  res: TAppResponse<pokerSessionsSchemas.TStoryStartResResp>
) => {
  const story = res.locals.get('story') as TStoryDocument;

  const pokerSession = await updatePokerSession(
    res.locals.get('pokerSession') as TPokerSessionDocument,
    (_, pokerSessionService) => pokerSessionService.startStory(story._id)
  );

  res.locals.result = {
    pokerSession,
  };
});

const storyActiveStop = createHandler(async (
  req: TAppRequest,
  res: TAppResponse<pokerSessionsSchemas.TStoryStopResResp>
) => {
  const pokerSession = await updatePokerSession(
    res.locals.get('pokerSession') as TPokerSessionDocument,
    (_, pokerSessionService) => pokerSessionService.storyActiveStop()
  );

  res.locals.result = {
    pokerSession,
  };
});

const voteAll = createHandler(async (
  req: TAppRequest,
  res: TAppResponse<pokerSessionsSchemas.TStoryVoteAllResResp>
) => {
  const story = res.locals.get('story') as TStoryDocument;

  const pokerSession = await updatePokerSession(
    res.locals.get('pokerSession') as TPokerSessionDocument,
    (_, pokerSessionService) => pokerSessionService.voteAll(story._id)
  );

  res.locals.result = {
    pokerSession,
  };
});

const voteAllCancel = createHandler(async (
  req: TAppRequest,
  res: TAppResponse<pokerSessionsSchemas.TStoryVoteAllCancelResResp>
) => {
  const story = res.locals.get('story') as TStoryDocument;

  const pokerSession = await updatePokerSession(
    res.locals.get('pokerSession') as TPokerSessionDocument,
    (_, pokerSessionService) => pokerSessionService.voteAllCancel(story._id)
  );

  res.locals.result = {
    pokerSession,
  };
});

const vote = createHandler(async (
  req: TAppRequest<{}, pokerSessionsSchemas.TStoryVoteBodyReq>,
  res: TAppResponse<pokerSessionsSchemas.TStoryVoteResResp>
) => {
  const story = res.locals.get('story') as TStoryDocument;
  const { teamId } = req.body;

  const pokerSession = await updatePokerSession(
    res.locals.get('pokerSession') as TPokerSessionDocument,
    (_, pokerSessionService) => pokerSessionService.voteTeam(story._id, teamId)
  );

  res.locals.result = {
    pokerSession,
  };
});

const voteCancel = createHandler(async (
  req: TAppRequest<{}, pokerSessionsSchemas.TStoryVoteCancelBodyReq>,
  res: TAppResponse<pokerSessionsSchemas.TStoryVoteCancelResResp>
) => {
  const story = res.locals.get('story') as TStoryDocument;
  const { teamId } = req.body;

  const pokerSession = await updatePokerSession(
    res.locals.get('pokerSession') as TPokerSessionDocument,
    (_, pokerSessionService) => pokerSessionService.voteTeamCancel(story._id, teamId)
  );

  res.locals.result = {
    pokerSession,
  };
});

const revealAll = createHandler(async (
  req: TAppRequest,
  res: TAppResponse<pokerSessionsSchemas.TRevealResResp>
) => {
  const { jiraIntegrations } = req.user;
  const story = res.locals.get('story') as TStoryDocument;

  const pokerSession = await updatePokerSession(
    res.locals.get('pokerSession') as TPokerSessionDocument,
    (_, pokerSessionService) => pokerSessionService.reveal(story._id)
  );

  jiraQueue.add(QUEUE_JOB_NAME.JIRA_SET_FIELD_ISSUE, {
    pokerSession,
    story,
    jiraIntegrations,
  });

  res.locals.result = {
    pokerSession,
  };
});

const reveal = createHandler(async (
  req: TAppRequest,
  res: TAppResponse<pokerSessionsSchemas.TTeamRevealResResp>
) => {
  const { jiraIntegrations } = req.user;
  const story = res.locals.get('story') as TStoryDocument;
  const { teamId } = req.params;

  const pokerSession = await updatePokerSession(
    res.locals.get('pokerSession') as TPokerSessionDocument,
    (_, pokerSessionService) => pokerSessionService.revealTeam(story._id, teamId)
  );

  jiraQueue.add(QUEUE_JOB_NAME.JIRA_SET_FIELD_ISSUE, {
    pokerSession,
    story,
    jiraIntegrations,
  });

  res.locals.result = {
    pokerSession,
  };
});

const setTeamScore = createHandler(async (
  req: TAppRequest<{ teamId: string }, pokerSessionsSchemas.TTeamScoresSetBodyReq>,
  res: TAppResponse<pokerSessionsSchemas.TTeamScoresSetResResp>
) => {
  const { jiraIntegrations } = req.user;
  const story = res.locals.get('story') as TStoryDocument;
  const { scores } = req.body;
  const { teamId } = req.params;

  const pokerSession = await updatePokerSession(
    res.locals.get('pokerSession') as TPokerSessionDocument,
    (_, pokerSessionService) => pokerSessionService.setTeamScore(story._id, teamId, scores)
  );

  jiraQueue.add(QUEUE_JOB_NAME.JIRA_SET_FIELD_ISSUE, {
    pokerSession,
    story,
    jiraIntegrations,
  });

  res.locals.result = {
    pokerSession,
  };
});

const moderateControllers = {
  update,
  remove,
  storyAdd,
  storyAddMany,
  storySetMany,
  storyRemove,
  storyStart,
  storyActiveStop,
  voteAll,
  voteAllCancel,
  vote,
  voteCancel,
  revealAll,
  reveal,
  setTeamScore,
  storiesSetSort,
};

export {
  moderateControllers,
};
