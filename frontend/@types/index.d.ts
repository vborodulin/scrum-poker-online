import { TAppState, TAppStore } from '@Redux/types';

declare global {
  interface Window {
    __NEXT_REDUX_STORE__: TAppStore;
    getState: () => TAppState;
    dataLayer: any[];
    ga?: any;
    Paddle?: any;
    AppleID: any;
  }
}
