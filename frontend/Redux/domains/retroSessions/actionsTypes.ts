export const retroSessionsActionsTypes = {

  CREATE_PENDING: 'retroSessions/create/pending',
  CREATE_FULFILLED: 'retroSessions/create/fulfilled',
  CREATE_REJECTED: 'retroSessions/create/rejected',

  GET_LIST_PENDING: 'retroSessions/getList/pending',
  GET_LIST_FULFILLED: 'retroSessions/getList/fulfilled',
  GET_LIST_REJECTED: 'retroSessions/getList/rejected',

  GET_PENDING: 'retroSessions/get/pending',
  GET_FULFILLED: 'retroSessions/get/fulfilled',
  GET_REJECTED: 'retroSessions/get/rejected',

  UPDATE_PENDING: 'retroSessions/update/pending',
  UPDATE_FULFILLED: 'retroSessions/update/fulfilled',
  UPDATE_REJECTED: 'retroSessions/update/rejected',

  CURRENT_ID_SET: 'retroSessions/setCurrentId',
  REMOVE_CURRENT_ID: 'retroSessions/removeCurrentId',

  COLUMN_ACTIONS_SIDE_BAR_TOGGLE: 'retroSessions/columnActionsSidebar/toggle',
  COLUMN_ACTIONS_SIDE_BAR_CLOSE: 'retroSessions/columnActionsSidebar/close',

  REMOVE_PENDING: 'retroSessions/remove/pending',
  REMOVE_FULFILLED: 'retroSessions/remove/fulfilled',
  REMOVE_REJECTED: 'retroSessions/remove/rejected',

  UPSERT: 'retroSessions/upsert',

  REMOVE: 'retroSessions/remove',

  INVITE_GENERATE_PENDING: 'retroSessions/invite/generate/pending',
  INVITE_GENERATE_FULFILLED: 'retroSessions/invite/generate/fulfilled',
  INVITE_GENERATE_REJECTED: 'retroSessions/invite/generate/rejected',

  INVITE_TOKEN_VALIDATE_PENDING: 'retroSessions/inviteToken/validate/pending',
  INVITE_TOKEN_VALIDATE_FULFILLED: 'retroSessions/inviteToken/validate/fulfilled',
  INVITE_TOKEN_VALIDATE_REJECTED: 'retroSessions/inviteToken/validate/rejected',

  INVITE_TOKEN_CLEAR: 'retroSessions/inviteToken/clear',

  RESET_VOTES_CARDS_PENDING: 'retroSessions/resetVotesCards/pending',
  RESET_VOTES_CARDS_FULFILLED: 'retroSessions/resetVotesCards/fulfilled',
  RESET_VOTES_CARDS_REJECTED: 'retroSessions/resetVotesCards/rejected',

  EXPORT_CARDS_ACTIONS_CSV_PENDING: 'retroSessions/export/csv/cardsActions/pending',
  EXPORT_CARDS_ACTIONS_CSV_FULFILLED: 'retroSessions/export/csv/cardsActions/fulfilled',
  EXPORT_CARDS_ACTIONS_CSV_REJECTED: 'retroSessions/export/csv/cardsActions/rejected',

  GET_COUNT_ALL_PENDING: 'retroSessions/countAll/pending',
  GET_COUNT_ALL_FULFILLED: 'retroSessions/countAll/fulfilled',
  GET_COUNT_ALL_REJECTED: 'retroSessions/countAll/rejected',

} as const;
