import { isEqualsId, objectHelpers } from '@chpokify/helpers';
import { TResetPasswordTokenPayload, TUser } from '@chpokify/models-types';
import { combineReducers } from '@reduxjs/toolkit';
import update from 'immutability-helper';
import { isEqual } from 'lodash';
import { HYDRATE } from 'next-redux-wrapper';

import { authActionsTypes } from '@Redux/domains/auth/actionsTypes';
import { usersActionsTypes } from '@Redux/domains/users/actionsTypes';
import { TAppAction } from '@Redux/types';

import { TAfterLoginRedirect } from '@lib/auth/afterLoginRedirect';

type TUserState = TUser | null;

const userInitialState: TUserState = null;

const updateCurrUser = (state: TUserState, updatedUser: TUser) => {
  if (!state) {
    return state;
  }

  if (isEqualsId(state._id, updatedUser._id)) {
    return updatedUser;
  }

  return state;
};

const userReducer = (state: TUserState = userInitialState, action: TAppAction): TUserState => {
  switch (action.type) {
    case HYDRATE: {
      if (isEqual(action.payload.auth.user, state)
        || objectHelpers.isEmptyObject(action.payload.auth?.user || {})
      ) {
        return state;
      }

      return update(state, {
        $set: action.payload.auth.user,
      });
    }

    case authActionsTypes.GET_FULFILLED:
      return action.payload.user || null;
    case authActionsTypes.LOG_IN_FULFILLED:
      return action.payload.user;
    case authActionsTypes.LOG_IN_GUEST_FULFILLED:
      return action.payload.user;
    case authActionsTypes.GOOGLE_OAUTH_FULFILLED:
      return action.payload.user;
    case authActionsTypes.APPLE_OAUTH_FULFILLED:
      return action.payload.user;
    case authActionsTypes.CRYPTO_AUTH_FULFILLED:
      return action.payload.user;
    case authActionsTypes.SIGN_OUT_FULFILLED:
      return userInitialState;
    case authActionsTypes.SIGN_UP_FULFILLED:
      return action.payload.user;
    case authActionsTypes.SIGN_OUT_FORM_OTHER_TAB:
      return userInitialState;
    case usersActionsTypes.UPSERT:
      return updateCurrUser(state, action.payload.user);
    case usersActionsTypes.UPDATE_FULFILLED:
      return updateCurrUser(state, action.payload.user);
    case usersActionsTypes.UPDATE_PASSWORD_FULFILLED:
      return updateCurrUser(state, action.payload.user);
    case usersActionsTypes.UPDATE_EMAIL_FULFILLED:
      return updateCurrUser(state, action.payload.user);
    case usersActionsTypes.UPDATE_SETTINGS_FULFILLED:
      return updateCurrUser(state, action.payload.user);
    default:
      return state;
  }
};

type TResetPasswordTokenPayloadState = TResetPasswordTokenPayload | null;

const resetPasswordTokenPayloadInitialState: TResetPasswordTokenPayloadState = null;

const resetPasswordTokenPayloadReducer = (
  state: TResetPasswordTokenPayloadState = resetPasswordTokenPayloadInitialState, action: TAppAction
): TResetPasswordTokenPayloadState => {
  switch (action.type) {
    case authActionsTypes.RESET_PASSWORD_VALIDATE_FULFILLED:
      return action.payload.resetPasswordTokenPayload;
    default:
      return state;
  }
};

type TAfterLoginRedirectState = TAfterLoginRedirect | null;

const afterLoginRedirectInitialState: TAfterLoginRedirectState = null;

const afterLoginRedirectDataReducer = (
  state: TAfterLoginRedirectState = afterLoginRedirectInitialState,
  action: TAppAction
): TAfterLoginRedirectState => {
  switch (action.type) {
    case authActionsTypes.AFTER_LOGIN_REDIRECT_DATA_SET: {
      return action.payload.afterLoginRedirect;
    }

    default:
      return state;
  }
};

export const authReducer = combineReducers({
  user: userReducer,
  resetPasswordTokenPayload: resetPasswordTokenPayloadReducer,
  afterLoginRedirectData: afterLoginRedirectDataReducer,
});
