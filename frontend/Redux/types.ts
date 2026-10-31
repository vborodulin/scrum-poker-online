import { NextComponentType, NextPageContext } from 'next';
import { HYDRATE } from 'next-redux-wrapper';
import { AppContext } from 'next/app';
import { Action, MiddlewareAPI, Store } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import { authTypes } from '@Redux/domains/auth/types';
import { TConfigActionsUnion } from '@Redux/domains/config/types';
import { kanbanBoardRelationsTypes } from '@Redux/domains/kanbanBoardRelations/types';
import { kanbanBoardTypes } from '@Redux/domains/kanbanBoards/types';
import { TPersistActionsUnion } from '@Redux/domains/persist/type';
import { pokerCardDecksTypes } from '@Redux/domains/pokerCardDecks/types';
import { pokerSessionsTypes } from '@Redux/domains/pokerSessions/types';
import { retroSessionsTypes } from '@Redux/domains/retroSessions/types';
import { retroSessionsCardsTypes } from '@Redux/domains/retroSessionsCards/types';
import { retroSessionsRelationsTypes } from '@Redux/domains/retroSessionsRelations/types';
import { retroTemplatesTypes } from '@Redux/domains/retroTemplates/types';
import { spacesTypes } from '@Redux/domains/spaces/types';
import { storiesTypes } from '@Redux/domains/stories/types';
import { systemTypes } from '@Redux/domains/system/types';
import { uiTypes } from '@Redux/domains/ui/types';
import { usersTypes } from '@Redux/domains/users/types';
import { rootReducer } from '@Redux/rootReducer';

import { TAppError } from '@lib/errors';

/**
 * redux core type
 */

export type TAppActionHydrate = Action<typeof HYDRATE> & {
  payload: TAppState
};

export type TAppState = ReturnType<typeof rootReducer>;

export type TAppGetState = () => TAppState;

export type TAppActionMeta = {
  requestId: string,
  args: any[],
  timeMS?: number;
};

export type TAppAction =
  | uiTypes.TActionsUnion
  | authTypes.TActionsUnion
  | spacesTypes.TActionsUnion
  | kanbanBoardTypes.TActionsUnion
  | kanbanBoardRelationsTypes.TActionsUnion
  | usersTypes.TActionsUnion
  | systemTypes.TActionUnion
  | pokerSessionsTypes.TActionsUnion
  | storiesTypes.TActionsUnion
  | pokerCardDecksTypes.TActionsUnion
  | retroSessionsTypes.TActionsUnion
  | retroSessionsRelationsTypes.TActionsUnion
  | retroSessionsCardsTypes.TActionsUnion
  | retroTemplatesTypes.TActionsUnion
  | TConfigActionsUnion
  | TPersistActionsUnion
  | TAppActionHydrate;

type TAppThunkExtraArg = Record<string, any>;

export type TAppDispatch = ThunkDispatch<TAppState, TAppThunkExtraArg, TAppAction>;

export type TAppStore = Omit<Store<TAppState, TAppAction>, 'dispatch'> & {
  dispatch: TAppDispatch;
};

export type TAppMiddleware = (
  store: MiddlewareAPI<TAppDispatch, TAppState>
) => (next: TAppDispatch) => (action: TAppAction) => Promise<TAppAction>;

/**
 * next types
 */

export type TPageContext = NextPageContext & { store: TAppStore };

export type TAppContext = AppContext & { ctx: TPageContext };

export type TAppPage<TInitialProps, TProps> = NextComponentType<TPageContext, TInitialProps, TInitialProps & TProps>;

/**
 * redux actions types
 */

export type TAppOperationReturnTypeFulfilled<T = any> = void | {
  result: T;
};

export type TAppOperationReturnTypeRejected = {
  err: TAppError;
};

export type TAppOperationReturnType =
  | TAppOperationReturnTypeFulfilled
  | TAppOperationReturnTypeRejected;

export type TAppOperation = (
  dispatch: TAppDispatch,
  getState: TAppGetState,
  extra: TAppThunkExtraArg,
) => Promise<TAppOperationReturnType>;
