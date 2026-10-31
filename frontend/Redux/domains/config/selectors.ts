import { createSelector } from '@reduxjs/toolkit';

import { TAppState } from '@Redux/types';

import { urlJoin } from '@lib/urlJoin';

/**
 * root
 */
const getConfig = ({ config }: TAppState) => config;

/**
 * direct
 */
const getData = createSelector(
  getConfig,
  (config) => config.data
);

const getUserData = createSelector(
  getConfig,
  (config) => config.userData
);

/**
 * complex
 */
const getPoker = createSelector(
  getData,
  (config) => config.poker
);

const getBaseUrl = createSelector(
  getData,
  (config) => config.baseUrl
);

const getRetro = createSelector(
  getData,
  (config) => config.retro
);

const getRetroTemplates = createSelector(
  getRetro,
  (retro) => retro.templates
);

/**
 * complex
 */

// url
const getAbsoluteUrl = createSelector(
  getBaseUrl,
  (baseUrl) => (path: string) => urlJoin(baseUrl, path)
);

// poker
const getPokerUserSetOnlineInterval = createSelector(
  getPoker,
  (poker) => poker.userSetOnlineInterval
);

// apple
const getApple = createSelector(
  getData,
  (config) => config.apple
);

const getAppleClientId = createSelector(
  getApple,
  (apple) => apple.clientId
);

const getAppleRedirectURI = createSelector(
  getApple,
  (apple) => apple.redirectURI
);

// tag manager
const getTagManagerTrackingId = createSelector(
  getData,
  (config) => config.tagManager.trackingId
);

const configSelectors = {
  // direct
  getData,
  getUserData,
  // config
  getPoker,
  getBaseUrl,
  // url
  getAbsoluteUrl,
  // poker
  getPokerUserSetOnlineInterval,
  // apple
  getApple,
  getAppleClientId,
  getAppleRedirectURI,
  // tag manager
  getTagManagerTrackingId,
  // retro
  getRetro,
  getRetroTemplates,
};

export {
  configSelectors,
};
