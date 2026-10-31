import { arrayHelpers } from '@chpokify/helpers';
import { TInviteRetroSessionTokenPayload } from '@chpokify/models-types';
import { TRetroSession } from '@chpokify/models-types/retroSession';
import { combineReducers } from '@reduxjs/toolkit';
import update from 'immutability-helper';
import { isEqual } from 'lodash';
import { HYDRATE } from 'next-redux-wrapper';

import { retroSessionsActionsTypes } from '@Redux/domains/retroSessions/actionsTypes';
import { TAppAction } from '@Redux/types';

type TEntitiesState = Record<string, TRetroSession | undefined>;

const entitiesInitialState: TEntitiesState = {};

const entitiesReducer = (
  state = entitiesInitialState,
  action: TAppAction
): TEntitiesState => {
  switch (action.type) {
    case HYDRATE: {
      if (isEqual(action.payload.retroSessions.entities, state)) {
        return state;
      }

      return update(state, {
        $set: action.payload.retroSessions.entities,
      });
    }

    case retroSessionsActionsTypes.UPSERT:
    case retroSessionsActionsTypes.GET_FULFILLED:
    case retroSessionsActionsTypes.UPDATE_FULFILLED:
    case retroSessionsActionsTypes.CREATE_FULFILLED:
      return update(state, {
        [action.payload.retroSession._id.toString()]: { $set: action.payload.retroSession },
      });

    case retroSessionsActionsTypes.GET_LIST_FULFILLED: {
      const { retroSessions } = action.payload;
      return update(state, { $set: arrayHelpers.normalizeArr(retroSessions, '_id') });
    }

    case retroSessionsActionsTypes.REMOVE_FULFILLED:
    case retroSessionsActionsTypes.REMOVE:
      return update(state, { $unset: [action.payload.retroSessionId.toString()] });

    default:
      return state;
  }
};

type TRetroSessionIdState = string;

const retroSessionIdInitialState: TRetroSessionIdState = '';

const retroSessionIdReducer = (
  state: TRetroSessionIdState = retroSessionIdInitialState,
  action: TAppAction
): TRetroSessionIdState => {
  switch (action.type) {
    case HYDRATE: {
      if (isEqual(action.payload.retroSessions.retroSessionId, state)) {
        return state;
      }

      return update(state, {
        $set: action.payload.retroSessions.retroSessionId,
      });
    }

    case retroSessionsActionsTypes.CURRENT_ID_SET:
      return action.payload.retroSessionId;
    case retroSessionsActionsTypes.REMOVE_CURRENT_ID:
      return retroSessionIdInitialState;
    default:
      return state;
  }
};

const isColumnActionsSidebarOpenReducer = (state: boolean = false, action: TAppAction): boolean => {
  switch (action.type) {
    case retroSessionsActionsTypes.COLUMN_ACTIONS_SIDE_BAR_TOGGLE:
      return !state;
    case retroSessionsActionsTypes.COLUMN_ACTIONS_SIDE_BAR_CLOSE:
      return false;
    default:
      return state;
  }
};

type TInviteState = {
  token: string;
  payload: TInviteRetroSessionTokenPayload;
} | null;

const inviteInitialState: TInviteState = null;

const inviteReducer = (
  state: TInviteState = inviteInitialState,
  action: TAppAction
): TInviteState => {
  switch (action.type) {
    case HYDRATE: {
      const { invite } = action.payload.retroSessions;

      if (isEqual(invite, state) || !invite) {
        return state;
      }

      return update(state, {
        $set: {
          token: invite.token,
          payload: invite.payload,
        },
      });
    }

    case retroSessionsActionsTypes.INVITE_TOKEN_VALIDATE_FULFILLED:
      return {
        token: action.meta.args[0].token,
        payload: action.payload.inviteTokenPayload,
      };
    case retroSessionsActionsTypes.INVITE_TOKEN_CLEAR:
      return inviteInitialState;
    default:
      return state;
  }
};

type TCountEntities = number;

const countEntitiesInitialState: TCountEntities = 0;

const countEntitiesReducer = (
  state: TCountEntities = countEntitiesInitialState,
  action: TAppAction
): TCountEntities => {
  switch (action.type) {
    case HYDRATE: {
      const { countEntities } = action.payload.retroSessions;

      if (isEqual(countEntities, state) || !countEntities) {
        return state;
      }

      return countEntities;
    }

    case retroSessionsActionsTypes.GET_COUNT_ALL_FULFILLED:
      return action.payload.count;
    default:
      return state;
  }
};

export const retroSessionsReducer = combineReducers({
  entities: entitiesReducer,
  countEntities: countEntitiesReducer,
  retroSessionId: retroSessionIdReducer,
  isColumnActionsSidebarOpen: isColumnActionsSidebarOpenReducer,
  invite: inviteReducer,
});
