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

export const authApi = {
  get,
  logIn,
  logInGuest,
  googleOAuth,
  appleOAuth,
  signUp,
  signOut,
};
