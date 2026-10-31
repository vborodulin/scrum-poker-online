import { arrayHelpers } from '@chpokify/helpers';
import { TUserProtected } from '@chpokify/models-types';
import { combineReducers } from '@reduxjs/toolkit';
import update from 'immutability-helper';
import { isEqual } from 'lodash';
import { HYDRATE } from 'next-redux-wrapper';

import { authActionsTypes } from '@Redux/domains/auth/actionsTypes';
import { usersActionsTypes } from '@Redux/domains/users/actionsTypes';
import { TAppAction } from '@Redux/types';

/**
 * list reducer
 *
 */

type TEntitiesState = Record<string, TUserProtected>;

const entitiesInitialState: TEntitiesState = {};

const entitiesReducer = (state = entitiesInitialState, action: TAppAction): TEntitiesState => {
  switch (action.type) {
    case HYDRATE: {
      if (isEqual(action.payload.users.entities, state)) {
        return state;
      }

      return update(state, {
        $set: action.payload.users.entities,
      });
    }

    case authActionsTypes.LOG_IN_FULFILLED: {
      const { user } = action.payload;
      return update(state, { [user._id.toString()]: { $set: user } });
    }

    case authActionsTypes.SIGN_UP_FULFILLED: {
      const { user } = action.payload;
      return update(state, { [user._id.toString()]: { $set: user } });
    }

    case authActionsTypes.GOOGLE_OAUTH_FULFILLED: {
      const { user } = action.payload;
      return update(state, { [user._id.toString()]: { $set: user } });
    }

    case authActionsTypes.GET_FULFILLED: {
      const { user } = action.payload;

      if (!user) {
        return state;
      }

      return update(state, {
        [user._id.toString()]: { $set: user },
      });
    }

    case usersActionsTypes.LIST_GET_FULFILLED:
      return arrayHelpers.normalizeArr(action.payload.users, '_id');

    case usersActionsTypes.UPSERT: {
      const { user } = action.payload;
      return update(state, { [user._id.toString()]: { $set: user } });
    }

    case usersActionsTypes.UPDATE_FULFILLED: {
      const { user } = action.payload;
      return update(state, { [user._id.toString()]: { $set: user } });
    }

    case usersActionsTypes.UPDATE_PASSWORD_FULFILLED: {
      const { user } = action.payload;
      return {
        ...state,
        [user._id.toString()]: user,
      };
    }

    case usersActionsTypes.UPDATE_SETTINGS_FULFILLED: {
      const { user } = action.payload;
      return {
        ...state,
        [user._id.toString()]: user,
      };
    }

    case usersActionsTypes.UPDATE_EMAIL_FULFILLED: {
      const { user } = action.payload;
      return {
        ...state,
        [user._id.toString()]: user,
      };
    }

    default:
      return state;
  }
};

/**
 * root reducer
 *
 */

export const usersReducer = combineReducers({
  entities: entitiesReducer,
});
