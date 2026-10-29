import { TSuccessResponse, AuthSchemas } from '@chpokify/api-schemas';

import { api } from '@lib/api';

const get = async () => api.get<TSuccessResponse<AuthSchemas.TGetResResp>>('/auth');

const logIn = async (data: AuthSchemas.TLogInBodyReq) => (
  api.post<TSuccessResponse<AuthSchemas.TLogInResResp>>('/auth/log-in', data)
);

const logInGuest = async (data: AuthSchemas.TLogInGuestBodyReq) => (
  api.post<TSuccessResponse<AuthSchemas.TLogInGuestResResp>>('/auth/log-in-guest', data)
);

const googleOAuth = async (data: AuthSchemas.TGoogleOauthBodyReq) => (
  api.post<TSuccessResponse<AuthSchemas.TGoogleOAuthResp>>('/auth/google', data)
);

const appleOAuth = async (data: AuthSchemas.TAppleOauthBodyReq) => (
  api.post<TSuccessResponse<AuthSchemas.TAppleOauthResp>>('/auth/apple', data)
);

const signUp = async (data: AuthSchemas.TSignUpBodyReq) =>
  api.post<TSuccessResponse<AuthSchemas.TSignUpResResp>>('/auth/sign-up', data);

const signOut = async () =>
  api.post<TSuccessResponse<AuthSchemas.TSignOutResResp>>('/auth/sign-out');

const restorePassword = async (data: AuthSchemas.TRestorePasswordBodyReq) =>
  api.post<TSuccessResponse<AuthSchemas.TRestorePasswordResResp>>('/auth/password/restore', data);

const resetPassword = async (data: AuthSchemas.TResetPasswordBodyReq) =>
  api.post<TSuccessResponse<AuthSchemas.TResetPasswordResResp>>('/auth/password/reset', data);

const resetPasswordValidate = (data: AuthSchemas.TValidateResetPasswordTokenBodyReq) =>
  api.post<TSuccessResponse<AuthSchemas.TValidateResetPasswordTokenResResp>>(
    '/auth/password/reset/validate', data
  );

const getNonce = () => api.get<TSuccessResponse<{ nonce: string }>>('/auth/nonce');

const logInCrypto = (data: AuthSchemas.TSignInCryptoBodyReq) =>
  api.post<TSuccessResponse<AuthSchemas.TSignInCryptoResp>>('/auth/crypto/login', data);

const singUpCrypto = (data: AuthSchemas.TSignUpCryptoBodyReq) =>
  api.post<TSuccessResponse<AuthSchemas.TSignUpCryptoResp>>('/auth/crypto/signup', data);

export const authApi = {
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
  getNonce,
  logInCrypto,
  singUpCrypto,
};
