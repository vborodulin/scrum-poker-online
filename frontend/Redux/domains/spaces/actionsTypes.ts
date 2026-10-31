export const spacesActionsTypes = {
  // cet curr space id
  CURRENT_ID_SET: 'space/setCurrId',

  UPGRADE_PRICING_PLAN_OPEN_SET: 'space/upgradePricingPlan/open/set',

  // get space
  GET_PENDING: 'space/get/pending',
  GET_FULFILLED: 'space/get/fulfilled',
  GET_REJECTED: 'space/get/rejected',

  // create space
  CREATE_PENDING: 'space/create/pending',
  CREATE_FULFILLED: 'space/create/fulfilled',
  CREATE_REJECTED: 'space/create/rejected',

  // update space
  UPSERT: 'space/upsert',

  UPDATE_PENDING: 'space/update/pending',
  UPDATE_FULFILLED: 'space/update/fulfilled',
  UPDATE_REJECTED: 'space/update/rejected',

  // create team
  TEAMS_CREATE_PENDING: 'space/teams/create/pending',
  TEAMS_CREATE_FULFILLED: 'space/teams/create/fulfilled',
  TEAMS_CREATE_REJECTED: 'space/teams/create/rejected',

  // remove team
  TEAMS_REMOVE_PENDING: 'space/teams/remove/pending',
  TEAMS_REMOVE_FULFILLED: 'space/teams/remove/fulfilled',
  TEAMS_REMOVE_REJECTED: 'space/teams/remove/rejected',

  // update team
  TEAMS_UPDATE_PENDING: 'space/teams/update/pending',
  TEAMS_UPDATE_FULFILLED: 'space/teams/update/fulfilled',
  TEAMS_UPDATE_REJECTED: 'space/teams/update/rejected',

  // participants remove from space
  PARTICIPANTS_REMOVE_PENDING: 'space/participants/remove/pending',
  PARTICIPANTS_REMOVE_FULFILLED: 'space/participants/remove/fulfilled',
  PARTICIPANTS_REMOVE_REJECTED: 'space/participants/remove/rejected',

  // participant update teams from space
  PARTICIPANT_UPDATE_TEAMS_PENDING: 'space/participant/updateTeams/pending',
  PARTICIPANT_UPDATE_TEAMS_FULFILLED: 'space/participant/updateTeams/fulfilled',
  PARTICIPANT_UPDATE_TEAMS_REJECTED: 'space/participant/updateTeams/rejected',

  // toggle participant admin role
  PARTICIPANTS_ROLE_ADMIN_SET_PENDING: 'space/participants/role/admin/set/pending',
  PARTICIPANTS_ROLE_ADMIN_SET_FULFILLED: 'space/participants/role/admin/set/fulfilled',
  PARTICIPANTS_ROLE_ADMIN_SET_REJECTED: 'space/participants/role/admin/set/rejected',

  // me leave from space
  LEAVE_PENDING: 'space/leave/pending',
  LEAVE_FULFILLED: 'space/leave/fulfilled',
  LEAVE_REJECTED: 'space/leave/rejected',

  // invite token payload
  INVITE_TOKEN_VALIDATE_PENDING: 'space/inviteToken/validate/pending',
  INVITE_TOKEN_VALIDATE_FULFILLED: 'space/inviteToken/validate/fulfilled',
  INVITE_TOKEN_VALIDATE_REJECTED: 'space/inviteToken/validate/rejected',

  // participants invite generate
  INVITE_GENERATE_PENDING: 'space/invite/generate/pending',
  INVITE_GENERATE_FULFILLED: 'space/invite/generate/fulfilled',
  INVITE_GENERATE_REJECTED: 'space/invite/generate/rejected',

  // participants invite accept
  INVITE_ACCEPT_PENDING: 'space/invite/accept/pending',
  INVITE_ACCEPT_FULFILLED: 'space/invite/accept/fulfilled',
  INVITE_ACCEPT_REJECTED: 'space/invite/accept/rejected',

  INVITE_TOKEN_CLEAR: 'space/inviteToken/clear',

  // get spaces when me participant
  LIST_GET_PENDING: 'space/list/get/pending',
  LIST_GET_FULFILLED: 'space/list/get/fulfilled',
  LIST_GET_REJECTED: 'space/list/get/rejected',

  // get stat
  STAT_GET_PENDING: 'space/stat/get/pending',
  STAT_GET_FULFILLED: 'space/stat/get/fulfilled',
  STAT_GET_REJECTED: 'space/stat/get/rejected',

  // remove space
  REMOVE: 'space/remove',
} as const;
