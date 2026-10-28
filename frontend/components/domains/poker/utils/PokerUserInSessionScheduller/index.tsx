import { isServer } from '@chpokify/helpers';
import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';

import { pokerSessionsApi } from '@api/pokerSessions';

import { configSelectors } from '@Redux/domains/config/selectors';
import { pokerSessionsAsyncActions } from '@Redux/domains/pokerSessions/asyncActions';
import { pokerSessionsSelectors } from '@Redux/domains/pokerSessions/selectors';
import { uiSelectors } from '@Redux/domains/ui/selectors';
import { useAppDispatch } from '@Redux/hooks';

import { useDidmount } from '@components/utils/hooks/useDidmount';
import { useEventListener } from '@components/utils/hooks/useEventListener';
import { useInterval } from '@components/utils/hooks/useInterval';

const PokerUserInSessionProcessor = (): React.ReactElement | null => {
  const dispatch = useAppDispatch();

  const isPendingRef = useRef<boolean>(false);

  const pokerSessionId = useSelector(pokerSessionsSelectors.getCurrId);

  const userSetOnlineInterval = useSelector(configSelectors.getPokerUserSetOnlineInterval);

  const isDocumentHidden = useSelector(uiSelectors.getIsDocumentHidden);

  const setUserInSession = async () => {
    if (!pokerSessionId || isPendingRef.current) {
      return;
    }

    isPendingRef.current = true;

    try {
      await dispatch(pokerSessionsAsyncActions.setInSession(pokerSessionId));
    } finally {
      isPendingRef.current = false;
    }
  };

  useDidmount(() => {
    if (!isDocumentHidden) {
      setUserInSession();
    }
  }, [isDocumentHidden]);

  useInterval(
    'interval',
    setUserInSession,
    userSetOnlineInterval,
    true
  );

  // tell server the user left (closed tab, navigated away), so voting does not wait for this user.
  // phone lock is not a leave: page stays alive and user is removed only by heartbeat timeout
  useEventListener(
    isServer() ? null : window,
    'pagehide',
    () => {
      if (pokerSessionId) {
        pokerSessionsApi.leaveSession(pokerSessionId);
      }
    }
  );

  useEffect(() => () => {
    if (pokerSessionId) {
      pokerSessionsApi.leaveSession(pokerSessionId);
    }
  }, [pokerSessionId]);

  return null;
};

export {
  PokerUserInSessionProcessor,
};
