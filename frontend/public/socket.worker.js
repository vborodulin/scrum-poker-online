const SOCKET_IO_CDN_URL = 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.0.0/socket.io.min.js';

self.importScripts(SOCKET_IO_CDN_URL);

let socket = null;
const SUBSCRIBE_CB_MAP = {};

// rooms are lost on server after any disconnect (locked phone, network change, server restart):
// keep them here and join again on every connect
const ROOMS = new Set();
const JOIN_ROOM_EVENT = 'joinRoom';
const LEAVE_ROOM_EVENT = 'leaveRoom';

// in socket.io v4 reconnect events are emitted by manager (socket.io), not by socket
const MANAGER_EVENTS = ['reconnect_attempt', 'reconnect', 'reconnect_error', 'reconnect_failed'];

// server middleware rejected connection (session expired), retrying makes no sense
const UNAUTHORIZED_ERROR = 'unauthorized';

const CONNECT_EVENT = 'connect';
const CONNECT_ERROR_EVENT = 'connect_error';
const DISCONNECT_EVENT = 'disconnect';
const RECONNECT_ATTEMPT = 'reconnect_attempt';

const DISCONNECT_REASON = {
  serverDisconnect: 'io server disconnect',
  clientDisconnect: 'io client disconnect',
  pingTimeout: 'ping timeout',
  transportClose: 'transport close',
  transportError: 'transport error',
};

const CONNECT_ERROR_TIMEOUT = 1000;
const CONNECT_ERROR_TIMEOUT_MAX = 10000;

let connectErrorTimeout = CONNECT_ERROR_TIMEOUT;

let hasLog = true;

const log = (method, ...arg) => {
  if (!hasLog) return;
  console.log(method, ...arg);
};

const handleConnect = (data) => {
  socket = io(data.url, {
    transports: ['websocket'],
    reconnectionDelay: 500,
  });
  hasLog = data.hasLog;

  log('[sww]: handleConnect', data);

  socket.io.on(RECONNECT_ATTEMPT, () => {
    socket.io.opts.transports = ['polling', 'websocket'];
    log('[sww]: event: reconnect_attempt');
  });

  socket.on(CONNECT_EVENT, () => {
    log('[sww]: event: connect', [...ROOMS]);
    connectErrorTimeout = CONNECT_ERROR_TIMEOUT;

    ROOMS.forEach((roomId) => {
      socket.emit(JOIN_ROOM_EVENT, { roomId });
    });
  });

  socket.on(CONNECT_ERROR_EVENT, (err) => {
    log('[sww]: event: connect_error', err.message);

    if (err.message === UNAUTHORIZED_ERROR) {
      return;
    }

    // transport errors are handled by manager reconnection,
    // manual connect is needed when namespace connection was refused
    setTimeout(() => {
      if (!socket.connected) {
        socket.connect();
      }
    }, connectErrorTimeout);

    connectErrorTimeout = Math.min(connectErrorTimeout * 2, CONNECT_ERROR_TIMEOUT_MAX);
  });

  socket.on(DISCONNECT_EVENT, (reason) => {
    log('[sww]: event: disconnect', reason);

    if (reason === DISCONNECT_REASON.serverDisconnect) {
      socket.connect();
    }
  });
};

const handleDisconnect = () => {
  if (socket) {
    socket.disconnect();
  }

  log('[sww]: handleDisconnect');
};

const handleEmit = (data) => {
  if (!socket) {
    return;
  }

  log('[sww]: handleEmit', data);
  const {
    eventName,
    args,
  } = data;

  const isRoomEvent = eventName === JOIN_ROOM_EVENT || eventName === LEAVE_ROOM_EVENT;

  if (isRoomEvent && args && args.roomId) {
    if (eventName === JOIN_ROOM_EVENT) {
      ROOMS.add(args.roomId);
    } else {
      ROOMS.delete(args.roomId);
    }

    // while disconnected socket.io buffers emits; rooms will be joined on connect
    if (!socket.connected) {
      return;
    }
  }

  socket.emit(eventName, args);
};

const getEmitter = (eventName) => (MANAGER_EVENTS.includes(eventName) ? socket.io : socket);

const handleSubscribe = (data) => {
  if (!socket) {
    return;
  }

  log('[sww]: handleSubscribe', data);
  const { eventName } = data;

  const cb = (args) => {
    log('[sww]: handleSubscribe callback call', data, args);

    try {
      postMessage({
        eventName,
        args,
      });
    } catch (err) {
      // do nothing
    }
  };

  // drop previous listener of the same event, otherwise it leaks and duplicates messages
  if (SUBSCRIBE_CB_MAP[eventName]) {
    getEmitter(eventName).off(eventName, SUBSCRIBE_CB_MAP[eventName]);
  }

  SUBSCRIBE_CB_MAP[eventName] = cb;
  getEmitter(eventName).on(eventName, cb);
};

const handleUnsubscribe = (data) => {
  if (!socket) {
    return;
  }

  log('[sww]: handleUnsubscribe', data);
  const { eventName } = data;
  const cb = SUBSCRIBE_CB_MAP[eventName];
  getEmitter(eventName).off(eventName, cb);
  delete SUBSCRIBE_CB_MAP[eventName];
};

// page became visible again (e.g. unlocked phone): do not wait for reconnection backoff
const handleWake = () => {
  if (!socket || socket.connected) {
    return;
  }

  log('[sww]: handleWake');
  socket.connect();
};

onmessage = (msg) => {
  const { data } = msg;

  switch (data.type) {
    case 'connect':
      handleConnect(data);
      break;
    case 'disconnect':
      handleDisconnect(data);
      break;
    case 'emit':
      handleEmit(data);
      break;
    case 'subscribe':
      handleSubscribe(data);
      break;
    case 'unsubscribe':
      handleUnsubscribe(data);
      break;
    case 'wake':
      handleWake();
      break;
    default:
      break;
  }
};
