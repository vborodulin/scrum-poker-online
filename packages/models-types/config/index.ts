import { TRetroTemplateData } from '../retroSession';

export type TPokerConfig = {
  userRemoveOnlineInterval: number
  userSetOnlineInterval: number
  userLeaveInterval: number
};

export type TStripeConfig = {
  publishableKey: string;
};

export type TAppleConfig = {
  clientId: string;
  redirectURI: string;
}

export type TTagManagerConfig = {
  trackingId: string;
}

export type TRetroConfig = {
  templates:TRetroTemplateData | null
};

export type TClientConfig = {
  baseUrl: string;
  poker: TPokerConfig;
  apple: TAppleConfig;
  tagManager: TTagManagerConfig;
  retro: TRetroConfig;
}
