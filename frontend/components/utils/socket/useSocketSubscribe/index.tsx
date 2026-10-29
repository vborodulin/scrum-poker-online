import { useContext, useEffect } from 'react';

import { SocketContext } from '@components/utils/socket/SocketProvider';

// several components can subscribe to the same room: leave it only after the last one unsubscribed.
// rejoining rooms after reconnect is done by socket worker
const roomSubscribersCount: Record<string, number> = {};

const useSocketSubscribe = (eventName: string, cb: Function) => {
  const socket = useContext(SocketContext);

  useEffect(() => {
    if (!eventName || !socket) {
      return;
    }

    const roomId = eventName;
    const event = eventName;

    roomSubscribersCount[roomId] = (roomSubscribersCount[roomId] || 0) + 1;

    if (roomSubscribersCount[roomId] === 1) {
      socket.emit('joinRoom', {
        roomId,
      });
    }

    socket.on(event, cb);

    return function useSocketCleanup() {
      roomSubscribersCount[roomId] -= 1;

      if (!roomSubscribersCount[roomId]) {
        delete roomSubscribersCount[roomId];
        socket.emit('leaveRoom', {
          roomId,
        });
      }

      socket.off(event, cb);
    };
  }, [eventName, socket]);

  return socket;
};

export {
  useSocketSubscribe,
};
