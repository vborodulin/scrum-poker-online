import { authActionsTypes } from '@Redux/domains/auth/actionsTypes';
import { authRepoOperations } from '@Redux/domains/authRepo/operations';
import { spacesActions } from '@Redux/domains/spaces/actions';
import { TAppMiddleware } from '@Redux/types';

import { authHelpers } from '@components/domains/auth/helpers';

const postAuth: TAppMiddleware = (reduxStore) => (next) =>
  async (action) => {
    const { dispatch, getState } = reduxStore;

    const res = next(action);

    switch (action.type) {
      case authActionsTypes.SIGN_UP_FULFILLED:
        dispatch(spacesActions.inviteTokenClear());
        await dispatch(authRepoOperations.loadCurrUserMeta());
        await dispatch(authRepoOperations.redirectAfterLogin());
        break;

      case authActionsTypes.LOG_IN_GUEST_FULFILLED: {
        await dispatch(authRepoOperations.loadCurrUserMeta());
        const defineRedirect = authHelpers.defineRedirectAfterLoginGuest(getState());
        await dispatch(authRepoOperations.redirectAfterLoginGuest(defineRedirect));
        await dispatch(authRepoOperations.inviteTokenGuestClear(defineRedirect));
        break;
      }

      case authActionsTypes.LOG_IN_FULFILLED:
        dispatch(spacesActions.inviteTokenClear());
        await dispatch(authRepoOperations.loadCurrUserMeta());
        await dispatch(authRepoOperations.redirectAfterLogin());
        break;
      case authActionsTypes.GOOGLE_OAUTH_FULFILLED:
        dispatch(spacesActions.inviteTokenClear());
        await dispatch(authRepoOperations.loadCurrUserMeta());
        await dispatch(authRepoOperations.redirectAfterLogin());
        break;
      case authActionsTypes.APPLE_OAUTH_FULFILLED:
        dispatch(spacesActions.inviteTokenClear());
        await dispatch(authRepoOperations.loadCurrUserMeta());
        await dispatch(authRepoOperations.redirectAfterLogin());
        break;
      default:
        break;
    }

    return res;
  };

export const authRepoMiddlewares = [postAuth];
