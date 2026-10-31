import { THEME_TYPES } from '@chpokify/models-types';
import { createSelector } from '@reduxjs/toolkit';

import { TAppState } from '@Redux/types';

/**
 * root
 */

const getAuth = ({ auth }: TAppState) => auth;

/**
 * simple
 */

const getCurrUser = createSelector(
  getAuth,
  (auth) => auth.user
);

const getAfterLoginRedirectData = createSelector(
  getAuth,
  (auth) => auth.afterLoginRedirectData
);

/**
 * complex
 */

// curr user
const getIsLoggedIn = createSelector(
  getCurrUser,
  (currUser) => !!currUser
);

const getCurrUserId = createSelector(
  getCurrUser,
  (currUser) => currUser?._id
);

const getCurrUserEmail = createSelector(getCurrUser, (currUser) => currUser?.email || '');

const isCurrUserGuest = createSelector(getCurrUser, (currUser) => !!currUser?.isGuest);

const getCurrUsername = createSelector(
  getCurrUser,
  (currUser) => currUser?.username || ''
);

// user settings

const getCurrUserSettings = createSelector(
  getCurrUser,
  (user) => user?.settings
);

const getCurrUserThemeType = createSelector(
  getCurrUserSettings,
  (settings) => settings?.themeType || THEME_TYPES.LIGHT
);

// onboarding
const getShowSpaceOnboarding = createSelector(
  getCurrUser,
  (user) => !!user?.showSpaceOnboarding
);

const getShowPokerOnboarding = createSelector(
  getCurrUser,
  (user) => !!user?.showPokerOnboarding
);

export const authSelectors = {
  getCurrUser,
  getAfterLoginRedirectData,
  getIsLoggedIn,
  getCurrUserId,
  getCurrUserEmail,
  getCurrUsername,
  getCurrUserThemeType,
  getShowSpaceOnboarding,
  getShowPokerOnboarding,
  isCurrUserGuest,
};
