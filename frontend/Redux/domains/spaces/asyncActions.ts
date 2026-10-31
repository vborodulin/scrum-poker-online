import { participantsApi, spacesApi, teamsApi } from '@api';

import { spacesActionsTypes } from '@Redux/domains/spaces/actionsTypes';
import { createAsyncActionCreator } from '@Redux/lib/createAsyncAction';

const spaceGet = createAsyncActionCreator(
  spacesActionsTypes.GET_PENDING,
  spacesActionsTypes.GET_FULFILLED,
  spacesActionsTypes.GET_REJECTED,
  spacesApi.get
);

const spaceCreate = createAsyncActionCreator(
  spacesActionsTypes.CREATE_PENDING,
  spacesActionsTypes.CREATE_FULFILLED,
  spacesActionsTypes.CREATE_REJECTED,
  spacesApi.create
);

const spaceUpdate = createAsyncActionCreator(
  spacesActionsTypes.UPDATE_PENDING,
  spacesActionsTypes.UPDATE_FULFILLED,
  spacesActionsTypes.UPDATE_REJECTED,
  spacesApi.update
);

const spaceLeave = createAsyncActionCreator(
  spacesActionsTypes.LEAVE_PENDING,
  spacesActionsTypes.LEAVE_FULFILLED,
  spacesActionsTypes.LEAVE_REJECTED,
  participantsApi.leave
);

const teamsCreate = createAsyncActionCreator(
  spacesActionsTypes.TEAMS_CREATE_PENDING,
  spacesActionsTypes.TEAMS_CREATE_FULFILLED,
  spacesActionsTypes.TEAMS_CREATE_REJECTED,
  teamsApi.create
);

const teamsRemove = createAsyncActionCreator(
  spacesActionsTypes.TEAMS_REMOVE_PENDING,
  spacesActionsTypes.TEAMS_REMOVE_FULFILLED,
  spacesActionsTypes.TEAMS_REMOVE_REJECTED,
  teamsApi.remove
);

const teamsUpdate = createAsyncActionCreator(
  spacesActionsTypes.TEAMS_UPDATE_PENDING,
  spacesActionsTypes.TEAMS_UPDATE_FULFILLED,
  spacesActionsTypes.TEAMS_UPDATE_REJECTED,
  teamsApi.update
);

const participantsRemove = createAsyncActionCreator(
  spacesActionsTypes.PARTICIPANTS_REMOVE_PENDING,
  spacesActionsTypes.PARTICIPANTS_REMOVE_FULFILLED,
  spacesActionsTypes.PARTICIPANTS_REMOVE_REJECTED,
  participantsApi.remove
);

const participantTeamsUpdate = createAsyncActionCreator(
  spacesActionsTypes.PARTICIPANT_UPDATE_TEAMS_PENDING,
  spacesActionsTypes.PARTICIPANT_UPDATE_TEAMS_FULFILLED,
  spacesActionsTypes.PARTICIPANT_UPDATE_TEAMS_REJECTED,
  participantsApi.updateTeams
);

const participantSetAdminRole = createAsyncActionCreator(
  spacesActionsTypes.PARTICIPANTS_ROLE_ADMIN_SET_PENDING,
  spacesActionsTypes.PARTICIPANTS_ROLE_ADMIN_SET_FULFILLED,
  spacesActionsTypes.PARTICIPANTS_ROLE_ADMIN_SET_REJECTED,
  participantsApi.setAdminRole
);

const mySpacesGet = createAsyncActionCreator(
  spacesActionsTypes.LIST_GET_PENDING,
  spacesActionsTypes.LIST_GET_FULFILLED,
  spacesActionsTypes.LIST_GET_REJECTED,
  spacesApi.getMyList
);

const inviteValidate = createAsyncActionCreator(
  spacesActionsTypes.INVITE_TOKEN_VALIDATE_PENDING,
  spacesActionsTypes.INVITE_TOKEN_VALIDATE_FULFILLED,
  spacesActionsTypes.INVITE_TOKEN_VALIDATE_REJECTED,
  spacesApi.inviteValidate
);

const inviteGen = createAsyncActionCreator(
  spacesActionsTypes.INVITE_GENERATE_PENDING,
  spacesActionsTypes.INVITE_GENERATE_FULFILLED,
  spacesActionsTypes.INVITE_GENERATE_REJECTED,
  spacesApi.inviteGen
);

const inviteAccept = createAsyncActionCreator(
  spacesActionsTypes.INVITE_ACCEPT_PENDING,
  spacesActionsTypes.INVITE_ACCEPT_FULFILLED,
  spacesActionsTypes.INVITE_ACCEPT_REJECTED,
  spacesApi.inviteAccept
);

const getStat = createAsyncActionCreator(
  spacesActionsTypes.STAT_GET_PENDING,
  spacesActionsTypes.STAT_GET_FULFILLED,
  spacesActionsTypes.STAT_GET_REJECTED,
  spacesApi.getStat
);

export const spacesAsyncActions = {
  spaceGet,
  spaceCreate,
  spaceUpdate,
  spaceLeave,
  teamsCreate,
  teamsRemove,
  teamsUpdate,
  inviteGen,
  inviteAccept,
  participantsRemove,
  participantSetAdminRole,
  participantTeamsUpdate,
  inviteValidate,
  mySpacesGet,
  getStat,
};
