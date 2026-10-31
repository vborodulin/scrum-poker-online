import { pokerSessionsSchemas } from '@chpokify/api-schemas';
import { arrayHelpers, isEqualsId, objectHelpers } from '@chpokify/helpers';
import { TEntityID } from '@chpokify/models-types';
import { TInvitePokerSessionTokenPayload, TPokerSession } from '@chpokify/models-types/pokerSession';
import { combineReducers } from '@reduxjs/toolkit';
import update from 'immutability-helper';
import { isEqual } from 'lodash';
import { HYDRATE } from 'next-redux-wrapper';

import { pokerSessionsActionsTypes } from '@Redux/domains/pokerSessions/actionTypes';
import { TAppAction } from '@Redux/types';

type TEntitiesSettingsState = Record<string, { ratingTime: number } | undefined>;

const entitiesSettingsInitialState: TEntitiesSettingsState = {};

const entitiesSettingsReducer = (state = entitiesSettingsInitialState, action: TAppAction): TEntitiesSettingsState => {
  switch (action.type) {
    case pokerSessionsActionsTypes.RATING_TIMER_SET: {
      const { pokerSessionId } = action.payload;
      return update(state, { [pokerSessionId.toString()]: { $set: { ratingTime: Math.floor(Date.now() / 1000) } } });
    }

    default:
      return state;
  }
};

type TEntitiesState = Record<string, TPokerSession | undefined>;

const entitiesInitialState: TEntitiesState = {};

const entitiesReducer = (state = entitiesInitialState,
  action: TAppAction): TEntitiesState => {
  switch (action.type) {
    case HYDRATE: {
      const { pokerSessions } = action.payload;

      if (isEqual(pokerSessions.entities, state)
        || objectHelpers.isEmptyObject(pokerSessions.entities)) {
        return state;
      }

      return update(state, {
        $set: pokerSessions.entities,
      });
    }

    case pokerSessionsActionsTypes.UPSERT: {
      const { pokerSession } = action.payload;
      return update(state, { [pokerSession._id.toString()]: { $set: pokerSession } });
    }

    case pokerSessionsActionsTypes.REMOVE: {
      const { pokerSessionId } = action.payload;
      return update(state, { $unset: [pokerSessionId.toString()] });
    }

    case pokerSessionsActionsTypes.GET_FULFILLED: {
      const { pokerSession } = action.payload;
      return update(state, { [pokerSession._id.toString()]: { $set: pokerSession } });
    }

    case pokerSessionsActionsTypes.LIST_GET_FULFILLED: {
      const { pokerSessions } = action.payload;
      return update(state, { $set: arrayHelpers.normalizeArr(pokerSessions, '_id') });
    }

    case pokerSessionsActionsTypes.CREATE_FULFILLED: {
      const { pokerSession } = action.payload;
      return update(state, { [pokerSession._id.toString()]: { $set: pokerSession } });
    }

    case pokerSessionsActionsTypes.UPDATE_FULFILLED: {
      const { pokerSession } = action.payload;
      return update(state, { [pokerSession._id.toString()]: { $set: pokerSession } });
    }

    case pokerSessionsActionsTypes.REMOVE_FULFILLED: {
      const [pokerSessionId] = action.meta.args;
      return update(state, { $unset: [pokerSessionId.toString()] });
    }

    case pokerSessionsActionsTypes.STORY_ADD_FULFILLED: {
      const { pokerSession } = action.payload;
      return update(state, { [pokerSession._id.toString()]: { $set: pokerSession } });
    }

    case pokerSessionsActionsTypes.STORY_ADD_MANY_FULFILLED: {
      const { pokerSession } = action.payload;
      return update(state, { [pokerSession._id.toString()]: { $set: pokerSession } });
    }

    case pokerSessionsActionsTypes.STORIES_ORDER_SET_PENDING: {
      const [
        pokerSessionId,
        { storiesIds },
      ] = action.payload.args as [TEntityID, pokerSessionsSchemas.TStorySetManyReq];
      const pokerSession = state[pokerSessionId.toString()];

      if (!pokerSession) {
        return state;
      }

      return update(state, {
        [pokerSessionId.toString()]: {
          storiesIds: { $set: storiesIds },
        },
      });
    }

    case pokerSessionsActionsTypes.STORY_REMOVE_FULFILLED: {
      const { pokerSession } = action.payload;
      return update(state, { [pokerSession._id.toString()]: { $set: pokerSession } });
    }

    case pokerSessionsActionsTypes.STORY_START_FULFILLED: {
      const { pokerSession } = action.payload;
      return update(state, { [pokerSession._id.toString()]: { $set: pokerSession } });
    }

    case pokerSessionsActionsTypes.STORY_STOP_FULFILLED: {
      const { pokerSession } = action.payload;
      return update(state, { [pokerSession._id.toString()]: { $set: pokerSession } });
    }

    case pokerSessionsActionsTypes.STORY_VOTE_TEAM_FULFILLED: {
      const { pokerSession } = action.payload;
      return update(state, { [pokerSession._id.toString()]: { $set: pokerSession } });
    }

    case pokerSessionsActionsTypes.STORY_VOTE_CANCEL_TEAM_FULFILLED: {
      const { pokerSession } = action.payload;
      return update(state, { [pokerSession._id.toString()]: { $set: pokerSession } });
    }

    case pokerSessionsActionsTypes.STORY_TEAM_REVEAL_CARDS_FULFILLED: {
      const { pokerSession } = action.payload;
      return update(state, { [pokerSession._id.toString()]: { $set: pokerSession } });
    }

    case pokerSessionsActionsTypes.STORY_CHOOSE_CARD_FULFILLED: {
      const { pokerSession } = action.payload;
      return update(state, { [pokerSession._id.toString()]: { $set: pokerSession } });
    }

    case pokerSessionsActionsTypes.STORY_TEAM_SCORES_SET_FULFILLED: {
      const { pokerSession } = action.payload;
      return update(state, { [pokerSession._id.toString()]: { $set: pokerSession } });
    }

    default:
      return state;
  }
};

type TPokerSessionIdState = TEntityID;

const pokerSessionIdInitialState: TPokerSessionIdState = '';

const pokerSessionIdReducer = (
  state: TPokerSessionIdState = pokerSessionIdInitialState,
  action: TAppAction
): TPokerSessionIdState => {
  switch (action.type) {
    case HYDRATE: {
      if (isEqual(action.payload.pokerSessions.pokerSessionId, state)) {
        return state;
      }

      return update(state, {
        $set: action.payload.pokerSessions.pokerSessionId,
      });
    }

    case pokerSessionsActionsTypes.SESSION_ID_SET:
      return action.payload.pokerSessionId;
    case pokerSessionsActionsTypes.SESSION_ID_RESET:
      return pokerSessionIdInitialState;
    case pokerSessionsActionsTypes.DESTROY:
      return '';
    default:
      return state;
  }
};

type StoryIdState = TEntityID;

const storyIdInitialState: StoryIdState = '';

const selectedStoryIdReducer = (state: StoryIdState = storyIdInitialState, action: TAppAction): StoryIdState => {
  switch (action.type) {
    case pokerSessionsActionsTypes.STORY_SELECT:
      return action.payload.storyId;
    case pokerSessionsActionsTypes.STORY_REMOVE_FULFILLED:
      return storyIdInitialState;

    case pokerSessionsActionsTypes.UPSERT: {
      const { pokerSession } = action.payload;
      const hasSelectedStory = pokerSession.storiesIds.some((storyId) => isEqualsId(state, storyId));

      return hasSelectedStory ? state : '';
    }

    case pokerSessionsActionsTypes.DESTROY:
      return '';
    default:
      return state;
  }
};

type TInviteState = {
  token: string;
  payload: TInvitePokerSessionTokenPayload;
} | null;

const inviteInitialState: TInviteState = null;

const inviteReducer = (
  state: TInviteState = inviteInitialState,
  action: TAppAction
): TInviteState => {
  switch (action.type) {
    case HYDRATE: {
      const { invite } = action.payload.pokerSessions;

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

    case pokerSessionsActionsTypes.INVITE_TOKEN_VALIDATE_FULFILLED:
      return {
        token: action.meta.args[0].token,
        payload: action.payload.inviteTokenPayload,
      };
    case pokerSessionsActionsTypes.INVITE_TOKEN_CLEAR:
      return inviteInitialState;
    default:
      return state;
  }
};

export const pokerSessionsReducer = combineReducers({
  entitiesSettings: entitiesSettingsReducer,
  entities: entitiesReducer,
  pokerSessionId: pokerSessionIdReducer,
  selectedStoryId: selectedStoryIdReducer,
  invite: inviteReducer,
});
