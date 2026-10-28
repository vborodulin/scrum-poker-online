import { transServer } from '@chpokify/i18n';
import {
  TEntityID, TPokerCardDeck, TPokerCardDeckScores,
} from '@chpokify/models-types';
import {
  TPokerSession,
  TPokerSessionActive,
  TPokerSessionsTeamsResult,
  TPokerSessionTeamResult,
  TPokerSessionTeamVoting,
  TPokerSessionVoting,
} from '@chpokify/models-types/pokerSession';
import { TSpace } from '@chpokify/models-types/space';
import { paramCase } from 'change-case';
import { differenceInSeconds } from 'date-fns';
import { get, set } from 'lodash';

import { isEqualsId } from './common';
import { dateHelpers } from './date';
import { spaceHelpers } from './space';

const getTitle = (pokerSession: TPokerSession) => {
  if (pokerSession.title) {
    return pokerSession.title;
  }

  return `Estimation ${dateHelpers.formatAppointmentDateTime(new Date(pokerSession?.createdAt || ''))}`;
};

const getDuration = (pokerSession: TPokerSession) => {
  const notActiveStoriesDuration = Object.values(
    pokerSession.results
  )
    .reduce((acc, storyResult) => acc + storyResult.duration,
      0);

  const activeStoryStartedAt = pokerSession.active?.startedAt;

  const activeStoryDuration = activeStoryStartedAt
    ? differenceInSeconds(
      dateHelpers.getCurrentDateUTC(),
      new Date(activeStoryStartedAt)
    )
    : 0;

  return notActiveStoriesDuration + activeStoryDuration;
};

const calcStoryScores = (cardSet: TPokerCardDeck, userCardIds: TEntityID[]): TPokerCardDeckScores => {
  const countableScores: number[] = [];

  userCardIds.forEach((cardId) => {
    const card = cardSet.cards.find((c) => isEqualsId(c._id, cardId));

    if (!card) {
      return;
    }

    const scoreNumVal = Number(card.value);

    if (Number.isNaN(scoreNumVal)) {
      return;
    }

    countableScores.push(scoreNumVal);
  });

  if (!countableScores.length) {
    return null;
  }

  const sum = countableScores.reduce((acc, val) => acc + val, 0);
  const avg = sum / countableScores.length;

  // nearest card not less than average; deck cards may be in any order, 0 is a valid score
  const card = cardSet.cards
    .filter((c) => typeof c.value === 'number')
    .sort((a, b) => Number(a.value) - Number(b.value))
    .find((c) => Number(c.value) >= avg);

  return card ? card.value : null;
};

const getActiveStoryId = (pokerSession: TPokerSession): TEntityID | undefined =>
    pokerSession.active?.storyId;

const getIsStoryActive = (
  pokerSession: TPokerSession,
  storyId: TEntityID
) => isEqualsId(pokerSession?.active?.storyId, storyId);

const getIsStoryVoting = (
  pokerSession: TPokerSession,
  storyId: TEntityID
) => {
  const isStoryActive = getIsStoryActive(pokerSession, storyId);
  return isStoryActive
        && !!Object.keys(pokerSession.active?.voting || {}).length;
};

const getIsStoryTeamVoting = (
  pokerSession: TPokerSession,
  storyId: TEntityID,
  teamId: TEntityID
) => {
  const isStoryVoting = getIsStoryVoting(pokerSession, storyId);

  if (isStoryVoting) {
    return !!(pokerSession as TPokerSessionVoting).active.voting[teamId.toString()];
  }

  return false;
};

const incStoryResultActiveDuration = (
  pokerSession: TPokerSessionActive,
  storyId: TEntityID
) => {
  let resultDuration = differenceInSeconds(
    new Date(),
    new Date(pokerSession.active.startedAt)
  );

  const prevStoryResult = pokerSession.results
    ? pokerSession.results[storyId.toString()]
    : null;

  if (prevStoryResult) {
    resultDuration += prevStoryResult.duration;
  }

  set(
    pokerSession,
    `results.${storyId.toString()}.duration`,
    resultDuration
  );
};

const incStoryResultTeamVotingScores = (
  pokerSession: TPokerSessionVoting,
  storyId: TEntityID,
  teamId: TEntityID,
  cardSet: TPokerCardDeck
) => {
  const storyResult = pokerSession.results[storyId.toString()];
  const votingTeamScores = pokerSession.active.voting[teamId.toString()];
  const teamUserCards = votingTeamScores?.userCards || {};

  storyResult.teamsResult[teamId.toString()] = {
    ...votingTeamScores,
    scores: calcStoryScores(
      cardSet,
      Object.values(teamUserCards)
    ),
  } as TPokerSessionTeamResult;
};

const incStoryResultVotingScores = (
  pokerSession: TPokerSessionVoting,
  storyId: TEntityID,
  cardSet: TPokerCardDeck
) => {
  const storyResult = pokerSession.results[storyId.toString()];
  const votingScores = pokerSession.active.voting;

  Object.keys(votingScores)
    .forEach((teamId) => {
      const votingTeam = votingScores[teamId];
      const teamUserCards = votingTeam?.userCards || {};

      storyResult.teamsResult[teamId] = {
        ...votingTeam,
        scores: calcStoryScores(
          cardSet,
          Object.values(teamUserCards)
        ),
      } as TPokerSessionTeamResult;
    });
};

const incStoryResultVotingDuration = (
  pokerSession: TPokerSession,
  storyId: TEntityID,
  startedAt: string
) => {
  let resultDuration = differenceInSeconds(
    new Date(),
    new Date(startedAt)
  );

  const prevStoryResult = pokerSession.results
    ? pokerSession.results[storyId.toString()]
    : null;

  if (prevStoryResult) {
    resultDuration += prevStoryResult.duration;
  }

  set(
    pokerSession,
    `results.${storyId.toString()}.duration`,
    resultDuration
  );
};

const getStoryScores = (
  pokerSession: TPokerSession | undefined,
  storyId: TEntityID
): TPokerCardDeckScores => {
  if (!pokerSession) {
    return null;
  }

  const teamsResult: TPokerSessionsTeamsResult = get(pokerSession, `results.${storyId}.teamsResult`);

  if (!teamsResult) {
    return null;
  }

  return Object.values(teamsResult)
    .reduce((acc: TPokerCardDeckScores, teamResult) => {
      if (teamResult.scores === null) {
        return acc;
      }

      const numTeamScores = Number(teamResult.scores);

      if (Number.isNaN(numTeamScores)) {
        return acc;
      }

      if (acc === null) {
        return numTeamScores;
      }

      return acc + numTeamScores;
    }, null);
};

const getSessionScores = (pokerSession: TPokerSession): TPokerCardDeckScores => Object.keys(
  pokerSession.results
)
  .reduce(
    (acc: TPokerCardDeckScores, storyId) => {
      const storyScores = getStoryScores(pokerSession, storyId);

      if (storyScores === null) {
        return acc;
      }

      if (acc === null) {
        return storyScores;
      }

      return Number(acc) + Number(storyScores);
    },
    null
  );

const getStoryDuration = (
  pokerSession: TPokerSession,
  storyId: TEntityID
) => {
  const {
    active,
    results,
  } = pokerSession;

  let duration = 0;

  const storyResult = results
    ? results[storyId.toString()]
    : null;

  if (storyResult) {
    duration += storyResult.duration;
  }

  const isStoryActive = isEqualsId(active?.storyId, storyId);

  if (!!active && isStoryActive) {
    duration += differenceInSeconds(
      dateHelpers.getCurrentDateUTC(),
      new Date(active.startedAt)
    );
  }

  return duration;
};

const getTeamVoting = (pokerSession: TPokerSession, teamId: TEntityID) =>
  get(pokerSession, `active.voting.${teamId}`);

const getIsAllTeamStoryVoted = (
  pokerSession: TPokerSession,
  space: TSpace,
  teamId: TEntityID,
  storyId: TEntityID
) => {
  if (!getIsStoryActive(pokerSession, storyId)) {
    throw new Error(transServer.t('errors.pokerSession.storyNotActive'));
  }

  const teamVoting = getTeamVoting(pokerSession, teamId) as TPokerSessionTeamVoting | undefined;

  if (!teamVoting) {
    throw new Error(transServer.t('errors.pokerSession.teamNotVotingStory'));
  }

  const { userCards } = teamVoting;
  const teamUserIds = spaceHelpers.getTeamUsersIds(space, teamId);
  const hasVote = (userId: TEntityID) => userId.toString() in userCards;

  // nobody of the current team members voted yet
  if (!teamUserIds.some(hasVote)) {
    return false;
  }

  // wait only for team members who are online in session; vote of a member who left still counts
  return teamUserIds
    .filter((teamUserId) => pokerSession.usersIds.some((userId) => isEqualsId(userId, teamUserId)))
    .every(hasVote);
};

const getExportFilename = (title?: string): string =>
  paramCase(title || dateHelpers.getCurrentDateUTC()
    .toISOString());

const pokerSessionHelpers = {
  getTitle,
  getDuration,
  calcStoryScores,
  getActiveStoryId,
  getIsStoryActive,
  getIsStoryVoting,
  getIsStoryTeamVoting,
  incStoryResultActiveDuration,
  incStoryResultTeamVotingScores,
  incStoryResultVotingScores,
  incStoryResultVotingDuration,
  getStoryScores,
  getSessionScores,
  getStoryDuration,
  getTeamVoting,
  getIsAllTeamStoryVoted,
  getExportFilename,
};

export {
  pokerSessionHelpers,
};
