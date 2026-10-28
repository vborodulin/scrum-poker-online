import React, { useRef } from 'react';
import { useSelector } from 'react-redux';

import { pokerSessionsAsyncActions } from '@Redux/domains/pokerSessions/asyncActions';
import { pokerSessionsSelectors } from '@Redux/domains/pokerSessions/selectors';
import { storiesAsyncActions } from '@Redux/domains/stories/asyncActions';
import { systemSelectors } from '@Redux/domains/system/selectors';
import { uiSelectors } from '@Redux/domains/ui/selectors';
import { getIsRejectedActionPayload } from '@Redux/helpers/common';
import { useAppDispatch } from '@Redux/hooks';

import { useDidmount } from '@components/utils/hooks/useDidmount';
import { usePrevious } from '@components/utils/hooks/usePrevious';
import { SOCKET_STATUS } from '@components/utils/types';

const PokerVisibilitySyncProcessor = (): React.ReactElement | null => {
  const dispatch = useAppDispatch();

  const isPendingRef = useRef<boolean>(false);
  // sync was requested while previous one was in progress (e.g. visibility change + reconnect)
  const isSyncRequestedRef = useRef<boolean>(false);

  const pokerSessionId = useSelector(pokerSessionsSelectors.getCurrId);
  const spaceId = useSelector(pokerSessionsSelectors.getSpaceId)(
    pokerSessionId
  );

  const isDocumentHidden = useSelector(uiSelectors.getIsDocumentHidden);

  const socketStatus = useSelector(systemSelectors.getSocketStatus);
  const prevSocketStatus = usePrevious(socketStatus);

  const syncData = async (): Promise<void> => {
    if (!pokerSessionId || !spaceId) {
      return;
    }

    if (isPendingRef.current) {
      isSyncRequestedRef.current = true;
      return;
    }

    isPendingRef.current = true;
    isSyncRequestedRef.current = false;

    try {
      const { payload } = await dispatch(pokerSessionsAsyncActions.get(pokerSessionId));

      if (!getIsRejectedActionPayload(payload)) {
        await dispatch(
          storiesAsyncActions.getMany(
            spaceId,
            {
              ids: payload.pokerSession.storiesIds,
            }
          )
        );
      }
    } finally {
      isPendingRef.current = false;
    }

    if (isSyncRequestedRef.current) {
      await syncData();
    }
  };

  useDidmount(() => {
    if (!isDocumentHidden) {
      syncData();
    }
  }, [isDocumentHidden]);

  useDidmount(() => {
    if (socketStatus === SOCKET_STATUS.CONNECTED && prevSocketStatus !== SOCKET_STATUS.NONE) {
      syncData();
    }
  }, [socketStatus]);

  return null;
};

export {
  PokerVisibilitySyncProcessor,
};
