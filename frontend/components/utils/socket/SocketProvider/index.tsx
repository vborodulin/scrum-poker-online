import { isServer } from '@chpokify/helpers';
import { TEntityID } from '@chpokify/models-types';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { systemActions } from '@Redux/domains/system/actions';
import { uiSelectors } from '@Redux/domains/ui/selectors';
import { useAppDispatch } from '@Redux/hooks';

import { SOCKET_STATUS } from '@components/utils/types';

import { ClientError } from '@lib/errors';
import { log } from '@lib/logger';
import { WebWorkerIO, WebWorkerSocket } from '@lib/webWorkerSocket';

const SocketContext = React.createContext<WebWorkerSocket | null>(null);

export type TThemeContextProviderProps = {
  currUserId?: TEntityID;
  children: React.ReactNode;
}

const SocketProvider = (props: TThemeContextProviderProps): React.ReactElement | null => {
  const {
    currUserId,
    children,
  } = props;

  const dispatch = useAppDispatch();
  const [socket, setSocket] = useState<WebWorkerSocket | null>(null);
  const isDocumentHidden = useSelector(uiSelectors.getIsDocumentHidden);

  useEffect(() => {
    if (isServer() || !currUserId) {
      return;
    }

    const webWorkerIO = new WebWorkerIO();
    const webWorkerSocket = webWorkerIO.connect();
    setSocket(webWorkerSocket);

    dispatch(systemActions.socketStatusSet(SOCKET_STATUS.CONNECTING));

    webWorkerSocket.on('connect', () => {
      log.info('[socket] connect');
      dispatch(systemActions.socketStatusSet(SOCKET_STATUS.CONNECTED));
    });

    webWorkerSocket.on('reconnect_attempt', () => {
      log.info('[socket] reconnect_attempt');
      dispatch(systemActions.socketStatusSet(SOCKET_STATUS.RECONNECTING));
    });

    webWorkerSocket.on('connect_error', (err: Error) => {
      log.debug(new ClientError('[socket]: connect_error', [], err.message));
      dispatch(systemActions.socketStatusSet(SOCKET_STATUS.ERROR));
    });

    webWorkerSocket.on('disconnect', (reason: string) => {
      log.debug(new ClientError('[socket]: disconnect', [], reason));
      dispatch(systemActions.socketStatusSet(SOCKET_STATUS.DISCONNECTED));
    });

    return () => {
      webWorkerSocket.disconnect();
      setSocket(null);
    };
  }, [currUserId]);

  useEffect(() => {
    if (socket && !isDocumentHidden) {
      socket.wake();
    }
  }, [socket, isDocumentHidden]);

  return (
    <SocketContext.Provider
      value={socket}
    >
      {children}
    </SocketContext.Provider>
  );
};

export {
  SocketProvider,
  SocketContext,
};
