import { TEntityID, TRetroSession } from '@chpokify/models-types';

import { retroSessionsActionsTypes } from '@Redux/domains/retroSessions/actionsTypes';

import { TAppError } from '@lib/errors';

const setCurrId = (retroSessionId: string) => ({
  type: retroSessionsActionsTypes.CURRENT_ID_SET,
  payload: {
    retroSessionId,
  },
}) as const;

const removeCurrId = () => ({
  type: retroSessionsActionsTypes.REMOVE_CURRENT_ID,
  payload: {},
}) as const;

const columnActionsSidebarToggle = () => ({
  type: retroSessionsActionsTypes.COLUMN_ACTIONS_SIDE_BAR_TOGGLE,
  payload: {
  },
}) as const;

const columnActionsSidebarClose = () => ({
  type: retroSessionsActionsTypes.COLUMN_ACTIONS_SIDE_BAR_CLOSE,
  payload: {
  },
}) as const;

const upsert = (retroSession: TRetroSession) => ({
  type: retroSessionsActionsTypes.UPSERT,
  payload: {
    retroSession,
  },
}) as const;

const remove = (retroSessionId: TEntityID) => ({
  type: retroSessionsActionsTypes.REMOVE,
  payload: {
    retroSessionId,
  },
}) as const;

const inviteTokenClear = () => ({
  type: retroSessionsActionsTypes.INVITE_TOKEN_CLEAR,
  payload: {},
}) as const;

const exportCSVCardsActionPending = () => ({
  type: retroSessionsActionsTypes.EXPORT_CARDS_ACTIONS_CSV_PENDING,
  payload: {},
}) as const;

const exportCSVCardsActionFulfilled = (file: Blob) => ({
  type: retroSessionsActionsTypes.EXPORT_CARDS_ACTIONS_CSV_FULFILLED,
  payload: {
    file,
  },
}) as const;

const exportCSVCardsActionRejected = (error: TAppError) => ({
  type: retroSessionsActionsTypes.EXPORT_CARDS_ACTIONS_CSV_REJECTED,
  payload: {
    error,
  },
}) as const;

const retroSessionsActions = {
  setCurrId,
  removeCurrId,
  columnActionsSidebarToggle,
  columnActionsSidebarClose,
  upsert,
  remove,
  inviteTokenClear,
  exportCSVCardsActionPending,
  exportCSVCardsActionFulfilled,
  exportCSVCardsActionRejected,
};

export {
  retroSessionsActions,
};
