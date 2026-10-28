import { TClientConfig, TUserConfig } from '@chpokify/models-types';
import update from 'immutability-helper';
import { HYDRATE } from 'next-redux-wrapper';

import { configActionTypes } from '@Redux/domains/config/actionTypes';
import { TAppAction } from '@Redux/types';

type TState = {
  data: TClientConfig;
  userData: TUserConfig
};

const initialState: TState = {
  data: {
    baseUrl: '',
    poker: {
      userSetOnlineInterval: 10000,
      userRemoveOnlineInterval: 50000,
      userLeaveInterval: 15000,
    },
    jitsi: {
      host: '',
    },
    apple: {
      clientId: '',
      redirectURI: '',
    },
    tagManager: {
      trackingId: '',
    },
    retro: {
      templates: null,
    },
  },
  userData: {},
};

const configReducer = (state: TState = initialState, action: TAppAction): TState => {
  switch (action.type) {
    case HYDRATE: {
      return update(state, {
        data: {
          $set: action.payload.config.data,
        },
      });
    }

    case configActionTypes.GET_FULFILLED: {
      return update(state, {
        data: {
          $set: action.payload.config,
        },
      });
    }

    case configActionTypes.CONFIG_USER_GET_FULFILLED:
      return update(state, {
        userData: {
          $set: action.payload.userConfig,
        },
      });
    default:
      return state;
  }
};

export {
  configReducer,
};
