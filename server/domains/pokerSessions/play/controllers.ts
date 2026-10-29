import { pokerSessionsSchemas } from '@chpokify/api-schemas';
import { updatePokerSession } from '@pokerSessions/services/updatePokerSession';
import { jiraQueue } from '@queue';

import { createHandler } from '@core/middleware/createHandler';
import { QUEUE_JOB_NAME, TAppRequest, TAppResponse } from '@core/types';

import { TPokerSessionDocument } from '@models/pokerSession';
import { TStoryDocument } from '@models/story';

const chooseCard = createHandler(async (
  req: TAppRequest<{}, pokerSessionsSchemas.TChooseCardsBodyReq>,
  res: TAppResponse<pokerSessionsSchemas.TChooseCardsResResp>
) => {
  const { jiraIntegrations } = req.user;
  const {
    user,
    body: {
      teamId,
      cardId,
    },
  } = req;
  const story = res.locals.get('story') as TStoryDocument;

  const pokerSession = await updatePokerSession(
    res.locals.get('pokerSession') as TPokerSessionDocument,
    (_, pokerSessionService) => pokerSessionService.chooseCard({
      userId: user._id,
      teamId,
      storyId: story._id,
      cardId,
    })
  );

  if (pokerSession.isAutoReveal) {
    jiraQueue.add(QUEUE_JOB_NAME.JIRA_SET_FIELD_ISSUE, {
      pokerSession,
      story,
      jiraIntegrations,
    });
  }

  res.locals.result = {
    pokerSession,
  };
});

const playControllers = {
  chooseCard,
};

export { playControllers };
