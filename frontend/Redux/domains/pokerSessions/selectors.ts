import { arrayHelpers, isEqualsId } from '@chpokify/helpers';
import { pokerSessionHelpers } from '@chpokify/helpers/pokerSession';
import { TEntityID } from '@chpokify/models-types';
import { TPokerSession, TPokerSessionTeamResult, TPokerSessionTeamVoting } from '@chpokify/models-types/pokerSession';
import { createSelector } from '@reduxjs/toolkit';
import { compact, get } from 'lodash';

import { TAppState } from '@Redux/types';

/**
 * root
 */
const getPokerSessions = ({ pokerSessions }: TAppState) => pokerSessions;

/**
 * direct
 */

const getEntities = createSelector(
  getPokerSessions,
  (pokerSessions) => pokerSessions.entities
);

const getEntitiesSettings = createSelector(
  getPokerSessions,
  (pokerSessions) => pokerSessions.entitiesSettings
);

const getInvite = createSelector(
  getPokerSessions,
  (pokerSessions) => pokerSessions.invite
);

const getCurrId = createSelector(
  getPokerSessions,
  (pokerSessions) => pokerSessions.pokerSessionId
);

const getSelectedStoryId = createSelector(
  getPokerSessions,
  (pokerSessions) => pokerSessions.selectedStoryId
);

/**
 * complex
 */

const getList = createSelector(
  getEntities,
  (entities) => compact(Object.values(entities)) as TPokerSession[]
);

const getCount = createSelector(
  getList,
  (list) => list.length
);

const getListSortDeskCreatedAt = createSelector(
  getList,
  (list) =>
    list.sort((a, b) =>
      // @ts-ignore
      (a?.createdAt > b?.createdAt ? -1 : 1))
);

const getLastEntity = createSelector(
  getListSortDeskCreatedAt,
  (list) => {
    if (!list.length) {
      return undefined;
    }

    return list[0] as TPokerSession;
  }
);

const getSettingsById = createSelector(
  getEntitiesSettings,
  (entitiesSettings) => (pokerSessionId: TEntityID | null | undefined) => {
    if (!pokerSessionId) {
      return undefined;
    }

    return entitiesSettings[pokerSessionId.toString()];
  }
);

const getById = createSelector(
  getEntities,
  (entities) => (pokerSessionId: TEntityID | null | undefined) => {
    if (!pokerSessionId) {
      return undefined;
    }

    return entities[pokerSessionId.toString()];
  }
);

const getStoriesIds = createSelector(
  getById,
  (getEnityByIdSelector) => (pokerSessionId: TEntityID | undefined) => {
    const pokerSession = getEnityByIdSelector(pokerSessionId);

    if (!pokerSession) {
      return [];
    }

    return pokerSession.storiesIds;
  }
);

const getTeamsIds = createSelector(
  getById,
  (getPokerSessionById) => (pokerSessionId: TEntityID | undefined) =>
    getPokerSessionById(pokerSessionId)?.teamsIds || []
);

const getCurr = createSelector(
  getEntities,
  getCurrId,
  (entities, pokerSessionId) => {
    if (!pokerSessionId) {
      return undefined;
    }

    return entities[pokerSessionId.toString()];
  }
);

const getSpaceId = createSelector(
  getById,
  (getByIdSelector) => (pokerSessionId: TEntityID | null | undefined) => {
    const pokerSession = getByIdSelector(pokerSessionId);
    return pokerSession?.spaceId;
  }
);

const getIsVoting = createSelector(
  getById,
  (getPokerSessionSelector) => (pokerSessionId: TEntityID | undefined) => {
    const pokerSession = getPokerSessionSelector(pokerSessionId);

    if (!pokerSession) {
      return false;
    }

    return !!pokerSession?.active?.voting;
  }
);

const getDurationInSec = createSelector(
  getById,
  (getPokerSessionSelector) => (pokerSessionId: TEntityID | undefined) => {
    const pokerSession = getPokerSessionSelector(pokerSessionId);

    if (!pokerSession) {
      return 0;
    }

    return pokerSessionHelpers.getDuration(pokerSession);
  }
);

const getByStoryId = createSelector(
  getList,
  (list) => (storyId: TEntityID | undefined) => {
    if (arrayHelpers.isEmptyArr(list) || !storyId) {
      return undefined;
    }

    return list.find((el) => el.storiesIds.includes(storyId));
  }
);

const getHasTeams = createSelector(
  getById,
  (getPokerSessionSelector) => (pokerSessionId: TEntityID | undefined) => {
    const pokerSession = getPokerSessionSelector(pokerSessionId);

    if (!pokerSession) {
      return false;
    }

    return !!pokerSession.teamsIds.length;
  }
);

const getIsUserInSession = createSelector(
  getById,
  (getEntityByIdSelector) => (
    pokerSessionId: TEntityID | null | undefined,
    userId: TEntityID | null | undefined
  ) => {
    if (!pokerSessionId || !userId) {
      return false;
    }

    const pokerSession = getEntityByIdSelector(pokerSessionId);

    if (!pokerSession) {
      return false;
    }

    return pokerSession.usersIds.some((id) => isEqualsId(id, userId));
  }
);

const getActiveStoryId = createSelector(
  getById,
  (getByIdBindStory) => (pokerSessionId: TEntityID | null | undefined) => {
    if (!pokerSessionId) {
      return undefined;
    }

    const pokerSession = getByIdBindStory(pokerSessionId);

    return pokerSession?.active?.storyId;
  }
);

const getIsStoryActive = createSelector(
  getActiveStoryId,
  (getActiveStoryIdBindStore) => (
    pokerSessionId: TEntityID | null | undefined,
    storyId: TEntityID
  ) => {
    const activeStoryId = getActiveStoryIdBindStore(pokerSessionId);
    return isEqualsId(activeStoryId, storyId);
  }
);

const getIsStoryVoting = createSelector(
  getById,
  (getByIdBindStory) => (
    pokerSessionId: TEntityID | null | undefined,
    storyId: TEntityID | null | undefined
  ) => {
    if (!pokerSessionId || !storyId) {
      return false;
    }

    const pokerSession = getByIdBindStory(pokerSessionId);

    if (!pokerSession) {
      return false;
    }

    const isStoryActive = isEqualsId(pokerSession.active?.storyId, storyId);
    const isStoryVoting = !!Object.keys(pokerSession.active?.voting || {}).length;

    return isStoryActive && isStoryVoting;
  }
);

const getIsTeamVoting = createSelector(
  getById,
  (getByIdBindStory) => (
    pokerSessionId: TEntityID | null | undefined,
    teamId: TEntityID | null | undefined
  ) => {
    if (!pokerSessionId) {
      return false;
    }

    const pokerSession = getByIdBindStory(pokerSessionId);
    return !!get(pokerSession, `active.voting.${teamId}`);
  }
);

const getIsTeamVotingStory = createSelector(
  getIsTeamVoting,
  getIsStoryVoting,
  (
    getIsTeamVotingSelector,
    getIsStoryVotingSelector
  ) => (
    pokerSessionId: TEntityID | null | undefined,
    teamId: TEntityID | null | undefined,
    storyId: TEntityID | null | undefined
  ) => {
    const isStoryVoting = getIsStoryVotingSelector(pokerSessionId, storyId);
    const isTeamVoting = getIsTeamVotingSelector(pokerSessionId, teamId);

    return isStoryVoting && isTeamVoting;
  }
);

const getStoryDurationInSec = createSelector(
  getById,
  (getByIdBindStory) => (
    pokerSessionId: TEntityID | null | undefined,
    storyId: TEntityID
  ) => {
    if (!pokerSessionId) {
      return 0;
    }

    const pokerSession = getByIdBindStory(pokerSessionId);

    if (!pokerSession) {
      return 0;
    }

    return pokerSessionHelpers.getStoryDuration(
      pokerSession,
      storyId
    );
  }
);

const getRatingTime = createSelector(
  getSettingsById,
  (getSettingsByIdSelector) => (pokerSessionId: TEntityID) => {
    const pokerSessionSettings = getSettingsByIdSelector(pokerSessionId);

    if (!pokerSessionSettings) {
      return;
    }

    return pokerSessionSettings.ratingTime;
  }
);

const getRating = createSelector(
  getById,
  (getByIdSelector) => (pokerSessionId: TEntityID) => {
    const pokerSession = getByIdSelector(pokerSessionId);

    if (!pokerSession) {
      return;
    }

    return pokerSession.rating;
  }
);

const getRatingWithoutSkip = createSelector(
  getById,
  (getByIdSelector) => (pokerSessionId: TEntityID) => {
    const pokerSession = getByIdSelector(pokerSessionId);

    if (!pokerSession || !pokerSession.rating) {
      return;
    }

    const { rating } = pokerSession;
    return rating?.filter((el) => !el.skip);
  }
);

const hasRatingWithoutSkip = createSelector(
  getById,
  (getByIdSelector) => (pokerSessionId: TEntityID) => {
    const pokerSession = getByIdSelector(pokerSessionId);

    if (!pokerSession || !pokerSession.rating) {
      return;
    }

    const { rating } = pokerSession;
    const ratingWithoutSkip = rating?.filter((el) => !el.skip);
    return !arrayHelpers.isEmptyArr(ratingWithoutSkip as []);
  }
);

const hasRating = createSelector(
  getById,
  (getByIdSelector) => (pokerSessionId: TEntityID) => {
    const pokerSession = getByIdSelector(pokerSessionId);

    if (!pokerSession || !pokerSession?.rating) {
      return;
    }

    return !arrayHelpers.isEmptyArr(pokerSession?.rating as []);
  }
);

const getUserStoryResultCardId = createSelector(
  getCurr,
  (pokerSession) => (storyId: TEntityID, teamId: TEntityID, userId: TEntityID) => get(
    pokerSession,
    `results.${storyId}.teamsResult.${teamId}.userCards.${userId}`,
    null
  )
);

const getUserStoryVotingCardId = createSelector(
  getCurr,
  (pokerSession) => (
    storyId: TEntityID, teamId: TEntityID, userId: TEntityID
  ) => {
    if (!pokerSession) {
      return null;
    }

    const activeStoryId = get(pokerSession, 'active.storyId');

    if (!isEqualsId(activeStoryId, storyId)) {
      return null;
    }

    return get(
      pokerSession,
      `active.voting.${teamId}.userCards.${userId}`,
      null
    );
  }
);

const getScores = createSelector(
  getById,
  (getByIdSelector) => (pokerSessionId: TEntityID | null | undefined) => {
    const pokerSession = getByIdSelector(pokerSessionId);

    if (!pokerSession) {
      return 0;
    }

    return pokerSessionHelpers.getSessionScores(pokerSession);
  }
);

const getStoryScores = createSelector(
  getCurr,
  (pokerSession) => (
    storyId: TEntityID | null | undefined
  ) => {
    if (!pokerSession || !storyId) {
      return null;
    }

    return pokerSessionHelpers.getStoryScores(pokerSession, storyId);
  }
);

const getTeamResultByStory = createSelector(
  getById,
  (getEntitySelector) => (
    pokerSessionId: TEntityID | null,
    storyId: TEntityID,
    teamId: TEntityID
  ): TPokerSessionTeamResult | undefined => {
    if (!pokerSessionId) {
      return undefined;
    }

    const pokerSession = getEntitySelector(pokerSessionId);
    return get(pokerSession, `results.${storyId}.teamsResult.${teamId}`);
  }
);

const getTeamScoresByStory = createSelector(
  getTeamResultByStory,
  (getTeamResultByStorySelector) => (
    pokerSessionId: TEntityID | null,
    storyId: TEntityID,
    teamId: TEntityID
  ) => {
    const teamResultByStory = getTeamResultByStorySelector(
      pokerSessionId,
      storyId,
      teamId
    );
    return teamResultByStory?.scores;
  }
);

const getTeamScoreTotal = createSelector(
  [
    getStoriesIds,
    getTeamResultByStory,
  ],
  (
    getStoriesIdsSelector,
    getTeamScoresByStorySelector
  ) => (
    pokerSessionId: TEntityID,
    teamId: TEntityID
  ) =>
    getStoriesIdsSelector(pokerSessionId)
      .reduce((acc: number, storyId: TEntityID) => {
        const result = getTeamScoresByStorySelector(pokerSessionId, storyId, teamId);

        if (result && result.scores !== null) {
          return acc + result.scores;
        }

        return acc;
      }, 0)
);

const getTeamVoting = createSelector(
  getById,
  (getByIdSelector) => (
    pokerSessionId: TEntityID | null,
    teamId: TEntityID
  ) => {
    const pokerSession = getByIdSelector(pokerSessionId);

    if (!pokerSession) {
      return null;
    }

    return get(pokerSession, `active.voting.${teamId}`) as TPokerSessionTeamVoting;
  }
);

const getCardSetId = createSelector(
  getById,
  (getByIdSelector) => (pokerSessionId: TEntityID) => {
    const pokerSession = getByIdSelector(pokerSessionId);

    if (!pokerSession) {
      return undefined;
    }

    return pokerSession.cardSetId;
  }
);

const getTitle = createSelector(
  getById,
  (getByIdSelector) => (pokerSessionId: TEntityID) => {
    const pokerSession = getByIdSelector(pokerSessionId);

    if (!pokerSession) {
      return '';
    }

    return pokerSession.title;
  }
);

const getInviteTokenPayload = createSelector(
  getInvite,
  (invite) => invite?.payload
);

const getInviteToken = createSelector(
  getInvite,
  (invite) => invite?.token
);

const pokerSessionsSelectors = {
  getEntities,
  getByStoryId,
  getSelectedStoryId,
  getCurrId,
  getRating,
  getRatingTime,
  getSettingsById,
  getRatingWithoutSkip,
  hasRatingWithoutSkip,
  hasRating,
  getStoriesIds,
  getList,
  getCount,
  getListSortDeskCreatedAt,
  getById,
  getCurr,
  getSpaceId,
  getIsVoting,
  getDurationInSec,
  getHasTeams,
  getIsUserInSession,
  getActiveStoryId,
  getIsStoryActive,
  getIsStoryVoting,
  getIsTeamVoting,
  getIsTeamVotingStory,
  getStoryDurationInSec,
  getUserStoryResultCardId,
  getUserStoryVotingCardId,
  getScores,
  getStoryScores,
  getTeamsIds,
  getTeamResultByStory,
  getTeamScoresByStory,
  getTeamScoreTotal,
  getTeamVoting,
  getCardSetId,
  getTitle,
  getInvite,
  getInviteTokenPayload,
  getInviteToken,
  getLastEntity,
};

export {
  pokerSessionsSelectors,
};
