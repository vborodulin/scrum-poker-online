import { TEntityID, TUser, USER_ROLES } from '@chpokify/models-types';
import http from 'http';
import { Server } from 'socket.io';

import { log } from '@core/lib/logger';
import { passport } from '@core/lib/passport';
import { sessionMiddleware } from '@core/middleware/sessionMiddleware';

import { canJoinRoom, getSpaceRoomsIds, parseRoomId } from './helpers/canJoinRoom';
import { wrap } from './helpers/wrap';

let io: Server;

// all sockets of the user (tabs, devices); not a valid room id, so clients can't join it
const getUserSocketsRoom = (userId: TEntityID) => `sockets:user:${userId.toString()}`;

// e.g. participant was removed from space: stop sending space events to the removed user
const leaveSpaceRooms = (userId: TEntityID, spaceId: TEntityID) => {
  if (!io) {
    return;
  }

  io.in(getUserSocketsRoom(userId)).socketsLeave(getSpaceRoomsIds(spaceId));
};

const getRoomId = (data: unknown): string | null => {
  const roomId = (data as { roomId?: unknown } | null)?.roomId;
  return typeof roomId === 'string' ? roomId : null;
};

const socketConnect = (httpServer: http.Server) => {
  io = new Server(httpServer, {
    // mobile networks and locked phones: too short values cause constant reconnects,
    // client detects dead connection after resume by its own ping timeout timer
    pingInterval: 10000,
    pingTimeout: 10000,
    cors: {
      methods: ['OPTIONS', 'POST'],
      origin: true,
      credentials: true,
    },
    cookie: true,
  });

  // middlewares
  io.use(wrap(sessionMiddleware));
  io.use(wrap(passport.initialize()));
  io.use(wrap(passport.session()));
  io.use((socket, next) => {
    // @ts-ignore
    const user = socket.request.user as TUser | undefined;

    if (user && user.role >= USER_ROLES.USER) {
      next();
      return;
    }

    next(new Error('unauthorized'));
  });

  io.on('connection', (socket) => {
    // @ts-ignore
    const user = socket.request.user as TUser;
    log.info({
      methodName: 'socketConnect',
      userId: user._id,
    }, 'connected');

    socket.join(getUserSocketsRoom(user._id));

    socket.on('disconnect', (reason: string) => {
      log.info({
        methodName: 'socketConnect',
        userId: user._id,
        reason,
      }, 'disconnected');
    });

    socket.on('joinRoom', async (data: unknown) => {
      const roomId = getRoomId(data);

      if (!roomId) {
        return;
      }

      try {
        const isAllowed = await canJoinRoom(user, roomId);

        if (!isAllowed) {
          // not well-formed rooms are not real rooms (e.g. global events), skip silently
          if (parseRoomId(roomId)) {
            log.warn({
              methodName: 'socketConnect',
              userId: user._id,
              roomId,
            }, 'join room forbidden');
          }

          return;
        }

        log.info({
          methodName: 'socketConnect',
          userId: user._id,
          roomId,
        }, 'join room');
        socket.join(roomId);
      } catch (err) {
        log.error({
          err,
          methodName: 'socketConnect',
          userId: user._id,
          roomId,
        }, 'join room failed');
      }
    });

    socket.on('leaveRoom', (data: unknown) => {
      const roomId = getRoomId(data);

      if (!roomId) {
        return;
      }

      log.info({
        methodName: 'socketConnect',
        userId: user._id,
        roomId,
      }, 'leave room');
      socket.leave(roomId);
    });
  });
};

export {
  io,
  leaveSpaceRooms,
  socketConnect,
};
