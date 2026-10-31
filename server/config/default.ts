import {
  RETRO_TEMPLATE_TYPE,
} from '@chpokify/models-types';

const config = {
  app: {
    shutdownTime: 10000,
    inviteToSpaceExpiration: '5 days',
  },
  google: {
    webClientId: '238943843598-9iefbdc3npjlpsndj2aooch979djru26.apps.googleusercontent.com',
    iOSClientId: '238943843598-lk5mgc601mkfu2uhim3ev2erftmb2227.apps.googleusercontent.com',
  },
  apple: {
    clientId: 'com.chpokify.web',
    redirectURI: 'https://chpokify.xyz',
  },
  poker: {
    // no heartbeat (locked phone during discussion, lost network): user is still in the meeting,
    // keep the user in session so auto reveal waits for the vote and moderator's story is not stopped
    userRemoveOnlineInterval: 2 * 60 * 60 * 1000,
    userSetOnlineInterval: 5 * 1000,
    // user closed the page: removed from session after this delay, unless heartbeat comes (page reload)
    userLeaveInterval: 15 * 1000,
  },
  intercom: {
    appId: 'zmsti56u',
    identitySecret: 'rJyXkNiMS7t_i7wAx0GxcWQo3pSya4J-UD8qMbHY',
  },
  tagManager: {
    trackingId: '',
  },
  retro: {
    templates: {
      [RETRO_TEMPLATE_TYPE.WENT_WELL_GO_WELL]: {
        type: RETRO_TEMPLATE_TYPE.WENT_WELL_GO_WELL,
      },
      [RETRO_TEMPLATE_TYPE.START_STOP_CONTINUE]: {
        type: RETRO_TEMPLATE_TYPE.START_STOP_CONTINUE,
      },
      [RETRO_TEMPLATE_TYPE.MAD_SAD_GLAD]: {
        type: RETRO_TEMPLATE_TYPE.MAD_SAD_GLAD,
      },
      [RETRO_TEMPLATE_TYPE.CUSTOM]: {
        type: RETRO_TEMPLATE_TYPE.CUSTOM,
      },
    },
  },
};

export default config;
