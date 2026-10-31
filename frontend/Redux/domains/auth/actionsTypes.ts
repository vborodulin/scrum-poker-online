export const authActionsTypes = {
  // get curr user
  GET_PENDING: 'auth/get/pending',
  GET_FULFILLED: 'auth/get/fulfilled',
  GET_REJECTED: 'auth/get/rejected',

  // sign in
  LOG_IN_PENDING: 'auth/logIn/pending',
  LOG_IN_FULFILLED: 'auth/logIn/fulfilled',
  LOG_IN_REJECTED: 'auth/logIn/rejected',

  // sign in
  LOG_IN_GUEST_PENDING: 'auth/logInGuest/pending',
  LOG_IN_GUEST_FULFILLED: 'auth/logInGuest/fulfilled',
  LOG_IN_GUEST_REJECTED: 'auth/logInGuest/rejected',

  // google oauth
  GOOGLE_OAUTH_PENDING: 'auth/googleOauth/pending',
  GOOGLE_OAUTH_FULFILLED: 'auth/googleOauth/fulfilled',
  GOOGLE_OAUTH_REJECTED: 'auth/googleOauth/rejected',

  // apple oauth
  APPLE_OAUTH_PENDING: 'auth/appleOauth/pending',
  APPLE_OAUTH_FULFILLED: 'auth/appleOauth/fulfilled',
  APPLE_OAUTH_REJECTED: 'auth/appleOauth/rejected',

  // sign up
  SIGN_UP_PENDING: 'auth/signUp/pending',
  SIGN_UP_FULFILLED: 'auth/signUp/fulfilled',
  SIGN_UP_REJECTED: 'auth/signUp/rejected',

  // sing out
  SIGN_OUT_PENDING: 'auth/signOut/pending',
  SIGN_OUT_FULFILLED: 'auth/signOut/fulfilled',
  SIGN_OUT_REJECTED: 'auth/signOut/rejected',

  // sign out from other tab
  SIGN_OUT_FORM_OTHER_TAB: 'auth/signOut/fromOtherTab',

  // after login redirect
  AFTER_LOGIN_REDIRECT_DATA_SET: 'auth/afterLoginRedirect/data/set',
  AFTER_LOGIN_REDIRECT_DATA_REMOVE: 'auth/afterLoginRedirect/data/remove',
} as const;
