import {
  MessageFromServer,
  MessageToServer,
  decodeMessageFromServer,
  encodeMessageToServer,
} from "./TrackerMessages";

type SubscribeFunction = (message: MessageFromServer) => void;
type UnsubscribeFunction = () => void;

export type TrackerState =
  | "connecting"
  | "connected"
  | "disconnected"
  | "error";

export class Tracker {
  url: string;
  socket: WebSocket;
  state: TrackerState = "connecting";

  onMessage: ((message: MessageFromServer) => void)[] = [];
  onStateChange: ((state: TrackerState) => void)[] = [];

  constructor(serverUrl: string) {
    this.socket = new WebSocket(serverUrl);
    this.url = serverUrl;
    this.connect();
  }

  close() {
    this.socket.onopen = null;
    this.socket.onclose = null;
    this.socket.onerror = null;
    this.socket.onmessage = null;
    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.close();
    }
  }

  connect() {
    this.socket = new WebSocket(this.url);
    this._setState("connecting");

    const reconnect = () => {
      this.close();
      this.connect();
    };

    this.socket.onopen = () => {
      this._setState("connected");
    };

    this.socket.onclose = () => {
      this._setState("disconnected");
      setTimeout(reconnect, 5000);
    };

    this.socket.onerror = () => {
      this._setState("error");
      setTimeout(reconnect, 5000);
    };

    this.socket.onmessage = this.messageHandler;
  }

  _setState(state: TrackerState) {
    this.state = state;
    this.onStateChange.forEach((cb) => cb(state));
  }

  send(message: MessageToServer) {
    if (this.state !== "connected") {
      return;
    }
    this.socket.send(encodeMessageToServer(message));
  }

  subscribe(callback: SubscribeFunction): UnsubscribeFunction {
    this.onMessage.push(callback);
    return () => {
      this.onMessage = this.onMessage.filter((cb) => cb !== callback);
    };
  }

  subscribeState(callback: (state: TrackerState) => void): UnsubscribeFunction {
    this.onStateChange.push(callback);
    return () => {
      this.onStateChange = this.onStateChange.filter((cb) => cb !== callback);
    };
  }

  messageHandler = (event: MessageEvent) => {
    const message = decodeMessageFromServer(event.data);
    this.onMessage.forEach((cb) => cb(message));
  };
}
