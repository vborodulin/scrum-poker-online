import { isServer } from '@chpokify/helpers';
import { routing } from '@chpokify/routing';
import nextCookies from 'next-cookies';
import Router, { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { authActions } from '@Redux/domains/auth/actions';
import { authSelectors } from '@Redux/domains/auth/selectors';
import { useAppDispatch } from '@Redux/hooks';
import { TAppPage, TPageContext } from '@Redux/types';

import { LOCAL_STORAGE_KEYS } from '@components/domains/core/types';

import { CircularProgress } from '@components/uiKit/CircularProgress';
import { ContentCenter } from '@components/uiKit/ContentCenter';

import { useEventListener } from '@components/utils/hooks/useEventListener';

import { reactHelpers } from '@helpers/React';

const SID = process.env.APP_COOKIE_SESSION_NAME as string;

export const UN_AUTH_REDIRECT_URL = routing.getLogInUrl();

const getSessionId = (ctx: TPageContext): string | undefined => nextCookies(ctx)[SID];

export const SyncLogoutProcessor = (): React.ReactElement | null => {
  const dispatch = useAppDispatch();

  const syncLogout = async (event: StorageEvent) => {
    if (event.key === LOCAL_STORAGE_KEYS.LOGOUT) {
      await Router.push(UN_AUTH_REDIRECT_URL);
      dispatch(authActions.signOutFromOtherTab());
    }
  };

  useEventListener(
    isServer() ? null : window,
    'storage',
    syncLogout
  );

  return null;
};

const withAuthSync = (
  WrappedComponent: TAppPage<any, any>
) => {
  const Component: TAppPage<any, any> = (props) => {
    const router = useRouter();

    const currUserId = useSelector(authSelectors.getCurrUserId);

    useEffect(() => {
      if (!currUserId) {
        router.push(UN_AUTH_REDIRECT_URL);
      }
    }, [currUserId]);

    if (!currUserId) {
      return (
        <ContentCenter>
          <CircularProgress />
        </ContentCenter>
      );
    }

    return (
      <WrappedComponent
        {...props}
      />
    );
  };

  Component.displayName = `withAuthSync(${reactHelpers.getComponentDisplayName(WrappedComponent)})`;

  return Component;
};

const auth = {
  getSessionId,
  withAuthSync,
};

export { auth };
