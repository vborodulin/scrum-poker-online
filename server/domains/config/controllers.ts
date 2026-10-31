import { configSchemas } from '@chpokify/api-schemas/configSchemas';
import {
  TAppleConfig, TPokerConfig, TRetroConfig, TTagManagerConfig,
} from '@chpokify/models-types';
import config from 'config';

import { createHandler } from '@core/middleware/createHandler';
import { TAppRequest, TAppResponse } from '@core/types';

const getConfig = createHandler(async (
  _,
  res: TAppResponse<configSchemas.TConfigResResp>
) => {
  const poker = config.get('poker') as TPokerConfig;
  const apple = config.get('apple') as TAppleConfig;
  const tagManager = config.get('tagManager') as TTagManagerConfig;
  const retro = config.get('retro') as TRetroConfig;

  res.locals.result = {
    config: {
      baseUrl: process.env.CLIENT_DOMAIN as string,
      poker,
      apple,
      tagManager,
      retro,
    },
  };
});

const getUserConfig = createHandler(async (
  req: TAppRequest,
  res: TAppResponse<configSchemas.TUserConfigResResp>
) => {
  res.locals.result = {
    userConfig: {},
  };
});

const configControllers = {
  getConfig,
  getUserConfig,
};

export {
  configControllers,
};
