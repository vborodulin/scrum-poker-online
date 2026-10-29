import { authApi } from '@api';

import { authActionsTypes } from '@Redux/domains/auth/actionsTypes';
import { createAsyncActionCreator } from '@Redux/lib/createAsyncAction';

export const get = createAsyncActionCreator(
  authActionsTypes.GET_PENDING,
  authActionsTypes.GET_FULFILLED,
  authActionsTypes.GET_REJECTED,
  authApi.get
);

export const logIn = createAsyncActionCreator(
  authActionsTypes.LOG_IN_PENDING,
  authActionsTypes.LOG_IN_FULFILLED,
  authActionsTypes.LOG_IN_REJECTED,
  authApi.logIn
);

export const logInGuest = createAsyncActionCreator(
  authActionsTypes.LOG_IN_GUEST_PENDING,
  authActionsTypes.LOG_IN_GUEST_FULFILLED,
  authActionsTypes.LOG_IN_GUEST_REJECTED,
  authApi.logInGuest
);

const googleOAuth = createAsyncActionCreator(
  authActionsTypes.GOOGLE_OAUTH_PENDING,
  authActionsTypes.GOOGLE_OAUTH_FULFILLED,
  authActionsTypes.GOOGLE_OAUTH_REJECTED,
  authApi.googleOAuth
);

const appleOAuth = createAsyncActionCreator(
  authActionsTypes.APPLE_OAUTH_PENDING,
  authActionsTypes.APPLE_OAUTH_FULFILLED,
  authActionsTypes.APPLE_OAUTH_REJECTED,
  authApi.appleOAuth
);

const signUp = createAsyncActionCreator(
  authActionsTypes.SIGN_UP_PENDING,
  authActionsTypes.SIGN_UP_FULFILLED,
  authActionsTypes.SIGN_UP_REJECTED,
  authApi.signUp
);

const signOut = createAsyncActionCreator(
  authActionsTypes.SIGN_OUT_PENDING,
  authActionsTypes.SIGN_OUT_FULFILLED,
  authActionsTypes.SIGN_OUT_REJECTED,
  authApi.signOut
);

const restorePassword = createAsyncActionCreator(
  authActionsTypes.RESTORE_PASSWORD_PENDING,
  authActionsTypes.RESTORE_PASSWORD_FULFILLED,
  authActionsTypes.RESTORE_PASSWORD_REJECTED,
  authApi.restorePassword
);

const resetPassword = createAsyncActionCreator(
  authActionsTypes.RESET_PASSWORD_PENDING,
  authActionsTypes.RESET_PASSWORD_FULFILLED,
  authActionsTypes.RESET_PASSWORD_REJECTED,
  authApi.resetPassword
);

const resetPasswordValidate = createAsyncActionCreator(
  authActionsTypes.RESET_PASSWORD_VALIDATE_PENDING,
  authActionsTypes.RESET_PASSWORD_VALIDATE_FULFILLED,
  authActionsTypes.RESET_PASSWORD_VALIDATE_REJECTED,
  authApi.resetPasswordValidate
);

export const authAsyncActions = {
  get,
  logIn,
  logInGuest,
  googleOAuth,
  appleOAuth,
  signUp,
  signOut,
  restorePassword,
  resetPassword,
  resetPasswordValidate,
};
