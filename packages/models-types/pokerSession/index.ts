import { typesHelpers } from '@chpokify/helpers/types';

import { TEntityID } from '../core';
import { TPokerCardDeckScores } from '../pokerCardDeck';
import { TSpace } from '../space';

export type TPokerUserScores = string | null;

export type TPokerSessionTeamVoting = {
  teamId: TEntityID;
  userCards: Record<string, TEntityID>
};

export type TPokerSessionTeamResult = {
  teamId: TEntityID;
  userCards: Record<string, TEntityID>;
  scores: TPokerCardDeckScores;
  isEdited: boolean;
}

export type TPokerSessionTeamsVoting = Record<string, TPokerSessionTeamVoting | undefined>;

export type TPokerSessionsTeamsResult = Record<string, TPokerSessionTeamResult>;

export type TPokerSessionActiveInfo = {
  storyId: TEntityID;
  startedAt: string;
  voting: TPokerSessionTeamsVoting | null;
};

export type TPokerSessionActiveVotingInfo = typesHelpers.Override<TPokerSessionActiveInfo, {
  voting: TPokerSessionTeamsVoting;
}>;

export type TPokerSessionStoryResult = {
  teamsResult: TPokerSessionsTeamsResult;
  duration: number;
};

export type TRatingPokerSession = {
  result?: number;
  isAnonym?: boolean
  skip?: boolean
  comment?: string;
  userId: TEntityID;
  createdAt?: string;
  updatedAt?: string;
}

export type TInvitePokerSessionTokenPayload = {
  spaceId: TEntityID;
  teams: TSpace['teams'];
  pokerSessionId: TEntityID;
};

export type TPokerSession = {
  _id: TEntityID;
  spaceId: TEntityID;
  teamsIds: TEntityID[];
  storiesIds: TEntityID[];
  usersIds: TEntityID[];
  results: Record<string, TPokerSessionStoryResult>;
  active: TPokerSessionActiveInfo | null;
  isAutoReveal: boolean;
  cardSetId: TEntityID;
  title?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: string;
  deletedAt?: string;
  rating?: TRatingPokerSession[]
}

export type TPokerSessionActive = typesHelpers.Override<TPokerSession, {
  active: TPokerSessionActiveInfo
}>

export type TPokerSessionVoting = typesHelpers.Override<TPokerSession, {
  active: TPokerSessionActiveVotingInfo
}>;

export type TPokerSessionInit = typesHelpers.Override<Partial<TPokerSession>, {
  spaceId: TEntityID;
}>;

// constants

export const POKER_SESSION_TITLE_MIN_LENGTH = 3;

export const POKER_SESSION_TITLE_MAX_LENGTH = 150;
