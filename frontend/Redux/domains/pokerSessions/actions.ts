import { TEntityID } from '@chpokify/models-types';
import { TPokerSession } from '@chpokify/models-types/pokerSession';

import { pokerSessionsActionsTypes } from '@Redux/domains/pokerSessions/actionTypes';

import { TAppError } from '@lib/errors';

const upsert = (pokerSession: TPokerSession) => ({
  type: pokerSessionsActionsTypes.UPSERT,
  payload: {
    pokerSession,
  },
}) as const;

const remove = (pokerSessionId: TEntityID) => ({
  type: pokerSessionsActionsTypes.REMOVE,
  payload: {
    pokerSessionId,
  },
}) as const;

const exportCSVPending = () => ({
  type: pokerSessionsActionsTypes.EXPORT_CSV_PENDING,
  payload: {},
}) as const;

const exportCSVFulfilled = (file: Blob) => ({
  type: pokerSessionsActionsTypes.EXPORT_CSV_FULFILLED,
  payload: {
    file,
  },
}) as const;

const exportCSVRejected = (error: TAppError) => ({
  type: pokerSessionsActionsTypes.EXPORT_CSV_REJECTED,
  payload: {
    error,
  },
}) as const;

const pokerSessionRatingTimerSet = (pokerSessionId: TEntityID) => ({
  type: pokerSessionsActionsTypes.RATING_TIMER_SET,
  payload: {
    pokerSessionId,
  },
}) as const;

const pokerSessionRatingTimerReset = (pokerSessionId: TEntityID) => ({
  type: pokerSessionsActionsTypes.RATING_TIMER_SET_RESET,
  payload: {
    pokerSessionId,
  },
}) as const;

const pokerSessionIdSet = (pokerSessionId: TEntityID) => ({
  type: pokerSessionsActionsTypes.SESSION_ID_SET,
  payload: {
    pokerSessionId,
  },
}) as const;

const pokerSessionIdReset = () => ({
  type: pokerSessionsActionsTypes.SESSION_ID_RESET,
  payload: {},
}) as const;

const storySelect = (storyId: TEntityID) => ({
  type: pokerSessionsActionsTypes.STORY_SELECT,
  payload: {
    storyId,
  },
}) as const;

const destroy = () => ({
  type: pokerSessionsActionsTypes.DESTROY,
  payload: {},
}) as const;

const inviteTokenClear = () => ({
  type: pokerSessionsActionsTypes.INVITE_TOKEN_CLEAR,
  payload: {},
}) as const;

const pokerSessionsActions = {
  upsert,
  remove,
  pokerSessionRatingTimerSet,
  pokerSessionRatingTimerReset,
  exportCSVPending,
  exportCSVFulfilled,
  exportCSVRejected,
  pokerSessionIdSet,
  pokerSessionIdReset,
  storySelect,
  destroy,
  inviteTokenClear,
};

export {
  pokerSessionsActions,
};
