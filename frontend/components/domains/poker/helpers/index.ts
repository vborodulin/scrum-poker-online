import { TPokerCardDeckScores } from '@chpokify/models-types';
import { TRatingPokerSession } from '@chpokify/models-types/pokerSession';
import { routing } from '@chpokify/routing';
import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next';

import { authSelectors } from '@Redux/domains/auth/selectors';
import { pokerSessionsSelectors } from '@Redux/domains/pokerSessions/selectors';
import { TAppStore } from '@Redux/types';

const averageRating = (rating: TRatingPokerSession[]) => {
  const total = rating.reduce((a, b) => a + Number(b.result), 0);
  return total / rating.length;
};

const ratingStat = (rating: TRatingPokerSession[] | undefined) => {
  if (!rating) return 0;
  return Number(averageRating(rating)
    .toFixed(1));
};

const getScoresView = (scores?: TPokerCardDeckScores) => {
  if (!scores) {
    return 0;
  }

  return Number(scores.toFixed(1));
};

const getHasScores = (scores?: TPokerCardDeckScores) => typeof scores === 'number';

const redirectPokerSessionPageByToken = (
  ctx: GetServerSidePropsContext,
  reduxStore: TAppStore
):GetServerSidePropsResult<{}> | undefined => {
  const { getState } = reduxStore;
  const isLoggedIn = authSelectors.getIsLoggedIn(getState());
  const inviteTokenPayload = pokerSessionsSelectors.getInviteTokenPayload(getState());

  if (isLoggedIn && inviteTokenPayload) {
    const redirectUrl = routing.getPokerUrl(inviteTokenPayload.spaceId, inviteTokenPayload.pokerSessionId);
    return {
      redirect: {
        permanent: false,
        destination: redirectUrl,
      },
    };
  }
};

const pokerHelpers = {
  averageRating,
  ratingStat,
  redirectPokerSessionPageByToken,
  getScoresView,
  getHasScores,
};

export {
  pokerHelpers,
};
