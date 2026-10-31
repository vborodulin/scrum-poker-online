import { pokerSessionsSchemas } from '@chpokify/api-schemas';
import { updatePokerSession } from '@pokerSessions/services/updatePokerSession';

import { createHandler } from '@core/middleware/createHandler';
import { TAppRequest, TAppResponse } from '@core/types';

import { TPokerSessionDocument } from '@models/pokerSession';
import { TStoryDocument } from '@models/story';

const chooseCard = createHandler(async (
  req: TAppRequest<{}, pokerSessionsSchemas.TChooseCardsBodyReq>,
  res: TAppResponse<pokerSessionsSchemas.TChooseCardsResResp>
) => {
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

  res.locals.result = {
    pokerSession,
  };
});

const playControllers = {
  chooseCard,
};

export { playControllers };
