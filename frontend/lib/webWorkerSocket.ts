import { ENVIRONMENT } from '@chpokify/models-types';

export class WebWorkerSocket {
  // several subscribers per event: worker is subscribed once, on the first callback
  private eventCbMap: Record<string, Set<Function> | undefined> = {};

  public constructor(private worker: Worker) {
    this.worker.onmessage = (event: MessageEvent) => {
      const { data } = event;
      const cbs = this.eventCbMap[data.eventName];

      if (!cbs) {
        return;
      }

      [...cbs].forEach((cb) => cb(data.args));
    };
  }

  public disconnect() {
    this.worker.postMessage({
      type: 'disconnect',
    });
    this.worker.terminate();
  }

  public wake() {
    this.worker.postMessage({
      type: 'wake',
    });
  }

  public emit(eventName: string, args: any) {
    this.worker.postMessage({
      type: 'emit',
      eventName,
      args,
    });
  }

  public on(eventName: string, cb: Function) {
    const cbs = this.eventCbMap[eventName] || new Set<Function>();

    if (!cbs.size) {
      this.worker.postMessage({
        type: 'subscribe',
        eventName,
      });
    }

    cbs.add(cb);
    this.eventCbMap[eventName] = cbs;
  }

  public off(eventName: string, cb?: Function) {
    const cbs = this.eventCbMap[eventName];

    if (!cbs) {
      return;
    }

    if (cb) {
      cbs.delete(cb);
    } else {
      cbs.clear();
    }

    if (cbs.size) {
      return;
    }

    this.worker.postMessage({
      type: 'unsubscribe',
      eventName,
    });

    delete this.eventCbMap[eventName];
  }
}

class WebWorkerIO {
  private worker: Worker;

  public constructor() {
    this.worker = new Worker('/socket.worker.js');
  }

  public connect() {
    this.worker.postMessage({
      type: 'connect',
      url: process.env.BASE_API_CLIENT_URL,
      hasLog: process.env.NODE_ENV !== ENVIRONMENT.PRODUCTION,
    });

    return new WebWorkerSocket(this.worker);
  }
}

export {
  WebWorkerIO,
};
