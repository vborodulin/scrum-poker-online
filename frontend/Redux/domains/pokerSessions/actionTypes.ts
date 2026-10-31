export const pokerSessionsActionsTypes = {
  // get
  GET_PENDING: 'pokerSessions/get/pending',
  GET_FULFILLED: 'pokerSessions/get/fulfilled',
  GET_REJECTED: 'pokerSessions/get/rejected',

  // open rating modal
  OPEN_RATING_MODAL_PENDING: 'pokerSessions/rating/modal/pending',
  OPEN_RATING_MODAL_FULFILLED: 'pokerSessions/rating/modal/fulfilled',
  OPEN_RATING_MODAL_REJECTED: 'pokerSessions/rating/modal/rejected',

  // set rating
  SET_RATING_PENDING: 'pokerSessions/setRating/pending',
  SET_RATING_FULFILLED: 'pokerSessions/setRating/fulfilled',
  SET_RATING_REJECTED: 'pokerSessions/setRating/rejected',

  // get list
  LIST_GET_PENDING: 'pokersSessions/getList/pending',
  LIST_GET_FULFILLED: 'pokersSessions/getList/fulfilled',
  LIST_GET_REJECTED: 'pokersSessions/getList/rejected',

  // session invite generate
  INVITE_GENERATE_PENDING: 'pokerSessions/invite/generate/pending',
  INVITE_GENERATE_FULFILLED: 'pokerSessions/invite/generate/fulfilled',
  INVITE_GENERATE_REJECTED: 'pokerSessions/invite/generate/rejected',

  // invite token payload
  INVITE_TOKEN_VALIDATE_PENDING: 'pokerSessions/inviteToken/validate/pending',
  INVITE_TOKEN_VALIDATE_FULFILLED: 'pokerSessions/inviteToken/validate/fulfilled',
  INVITE_TOKEN_VALIDATE_REJECTED: 'pokerSessions/inviteToken/validate/rejected',

  // create
  CREATE_PENDING: 'pokerSessions/create/pending',
  CREATE_FULFILLED: 'pokerSessions/create/fulfilled',
  CREATE_REJECTED: 'pokerSessions/create/rejected',

  // clear invite token
  INVITE_TOKEN_CLEAR: 'pokerSessions/inviteToken/clear',

  // upsert
  UPSERT: 'pokerSessions/upsert',

  // remove
  REMOVE: 'pokerSessions/remove',

  // update
  UPDATE_PENDING: 'pokerSessions/update/pending',
  UPDATE_FULFILLED: 'pokerSessions/update/fulfilled',
  UPDATE_REJECTED: 'pokerSessions/update/rejected',

  // remove
  REMOVE_PENDING: 'pokerSessions/remove/pending',
  REMOVE_FULFILLED: 'pokerSessions/remove/fulfilled',
  REMOVE_REJECTED: 'pokerSessions/remove/rejected',

  // export csv
  EXPORT_CSV_PENDING: 'pokerSessions/export/csv/pending',
  EXPORT_CSV_FULFILLED: 'pokerSessions/export/csv/fulfilled',
  EXPORT_CSV_REJECTED: 'pokerSessions/export/csv/rejected',

  // set poker session rating timer
  RATING_TIMER_SET: 'pokerSessions/pokerSessionRatingTimer/set',
  RATING_TIMER_SET_RESET: 'pokerSession/pokerSessionRatingTimer/reset',

  // set poker session id
  SESSION_ID_SET: 'pokerSessions/pokerSessionId/set',
  SESSION_ID_RESET: 'pokerSession/pokerSessionId/reset',

  // set in session
  SET_IN_SESSION_PENDING: 'pokerSessions/pokerSession/setInSession/pending',
  SET_IN_SESSION_FULFILLED: 'pokerSessions/pokerSession/setInSession/fulfilled',
  SET_IN_SESSION_REJECTED: 'pokerSessions/pokerSession/setInSession/rejected',

  // story select
  STORY_SELECT: 'pokerSessions/story/select',

  // story add
  STORY_ADD_PENDING: 'pokerSessions/story/add/pending',
  STORY_ADD_FULFILLED: 'pokerSessions/story/add/fulfilled',
  STORY_ADD_REJECTED: 'pokerSessions/story/add/rejected',

  // story add many
  STORY_ADD_MANY_PENDING: 'pokerSessions/story/many/add/pending',
  STORY_ADD_MANY_FULFILLED: 'pokerSessions/story/many/add/fulfilled',
  STORY_ADD_MANY_REJECTED: 'pokerSessions/story/many/add/rejected',

  // story set many
  STORIES_ORDER_SET_PENDING: 'pokerSessions/storier/order/set/pending',
  STORIES_ORDER_SET_FULFILLED: 'pokerSessions/storier/order/set/fulfilled',
  STORIES_ORDER_SET_MANY_REJECTED: 'pokerSessions/storier/order/set/rejected',

  // story remove
  STORY_REMOVE_PENDING: 'pokerSessions/story/remive/pending',
  STORY_REMOVE_FULFILLED: 'pokerSessions/story/remive/fulfilled',
  STORY_REMOVE_REJECTED: 'pokerSessions/story/remive/rejected',

  // story start
  STORY_START_PENDING: 'pokerSessions/story/start/pending',
  STORY_START_FULFILLED: 'pokerSessions/story/start/fulfilled',
  STORY_START_REJECTED: 'pokerSessions/story/start/rejected',

  // story stop
  STORY_STOP_PENDING: 'pokerSessions/story/stop/pending',
  STORY_STOP_FULFILLED: 'pokerSessions/story/stop/fulfilled',
  STORY_STOP_REJECTED: 'pokerSessions/story/stop/rejected',

  // story voteTeam all teams
  STORY_VOTE_ALL_TEAMS_PENDING: 'pokerSessions/story/vote/all-teams/pending',
  STORY_VOTE_ALL_TEAMS_FULFILLED: 'pokerSessions/story/vote/all-teams/fulfilled',
  STORY_VOTE_ALL_TEAMS_REJECTED: 'pokerSessions/story/vote/all-teams/rejected',

  // story voteTeam all teams cancel
  STORY_VOTE_ALL_TEAMS_CANCEL_PENDING: 'pokerSessions/story/vote/all-teams/cancel/pending',
  STORY_VOTE_ALL_TEAMS_CANCEL_FULFILLED: 'pokerSessions/story/vote/all-teams/cancel/fulfilled',
  STORY_VOTE_ALL_TEAMS_CANCEL_REJECTED: 'pokerSessions/story/vote/all-teams/cancel/rejected',

  // story vote team
  STORY_VOTE_TEAM_PENDING: 'pokerSessions/story/vote/team/pending',
  STORY_VOTE_TEAM_FULFILLED: 'pokerSessions/story/vote/team/fulfilled',
  STORY_VOTE_TEAM_REJECTED: 'pokerSessions/story/vote/team/rejected',

  // story voteTeam cancel team
  STORY_VOTE_CANCEL_TEAM_PENDING: 'pokerSessions/story/vote/cancel/team/pending',
  STORY_VOTE_CANCEL_TEAM_FULFILLED: 'pokerSessions/story/vote/cancel/team/fulfilled',
  STORY_VOTE_CANCEL_TEAM_REJECTED: 'pokerSessions/story/vote/cancel/team/rejected',

  // story reveal cards
  STORY_REVEAL_CARDS_PENDING: 'pokerSessions/story/revealCards/pending',
  STORY_REVEAL_CARDS_FULFILLED: 'pokerSessions/story/revealCards/fulfilled',
  STORY_REVEAL_CARDS_REJECTED: 'pokerSessions/story/revealCards/rejected',

  // story reveal cards
  STORY_TEAM_REVEAL_CARDS_PENDING: 'pokerSessions/story/team/revealCards/pending',
  STORY_TEAM_REVEAL_CARDS_FULFILLED: 'pokerSessions/story/team/revealCards/fulfilled',
  STORY_TEAM_REVEAL_CARDS_REJECTED: 'pokerSessions/story/team/revealCards/rejected',

  // story voting choose card
  STORY_CHOOSE_CARD_PENDING: 'pokerSessions/story/chooseCard/pending',
  STORY_CHOOSE_CARD_FULFILLED: 'pokerSessions/story/chooseCard/fulfilled',
  STORY_CHOOSE_CARD_REJECTED: 'pokerSessions/story/chooseCard/rejected',

  // story team scores set
  STORY_TEAM_SCORES_SET_PENDING: 'pokerSessions/story/team/scores/set/pending',
  STORY_TEAM_SCORES_SET_FULFILLED: 'pokerSessions/story/team/scores/set/fulfilled',
  STORY_TEAM_SCORES_SET_REJECTED: 'pokerSessions/story/team/scores/set/rejected',

  // destroy
  DESTROY: 'pokerSessions/destroy',

  // set sort
  STORIES_SORT_SET_SORT_PENDING: 'pokerSessions/stories/sort/set/pending',
  STORIES_SORT_SET_SORT_FULFILLED: 'pokerSessions/stories/sort/set/fulfilled',
  STORIES_SORT_SET_SORT_REJECTED: 'pokerSessions/stories/sort/set/rejected',
} as const;
