import { WebSocketEvent } from "./types";

class WebSocketManager {
  private static instance: WebSocketManager;
  private socket: WebSocket | null = null;
  private url: string = "";
  private listeners: ((event: WebSocketEvent) => void)[] = [];
  private reconnectTimeout = 3000;
  private isConnected = false;

  private constructor() {}

  public static getInstance(): WebSocketManager {
    if (!WebSocketManager.instance) {
      WebSocketManager.instance = new WebSocketManager();
    }
    return WebSocketManager.instance;
  }

  public connect(url: string) {
    if (this.socket) return;
    this.url = url;
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log("WebSocket connected");
      this.isConnected = true;
      // flush offline queue if needed
    };

    this.socket.onmessage = (event) => {
      const data: WebSocketEvent = JSON.parse(event.data);
      this.listeners.forEach((listener) => listener(data));
    };

    this.socket.onclose = () => {
      console.log("WebSocket disconnected. Reconnecting...");
      this.isConnected = false;
      this.socket = null;
      setTimeout(() => this.connect(this.url), this.reconnectTimeout);
    };

    this.socket.onerror = (err) => {
      console.error("WebSocket error", err);
      this.socket?.close();
    };
  }

  public send(event: WebSocketEvent) {
    if (this.isConnected && this.socket?.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(event));
    } else {
      console.warn("WebSocket not connected, message not sent.");
      // Could push to offline queue here
    }
  }

  public addListener(callback: (event: WebSocketEvent) => void) {
    this.listeners.push(callback);
  }

  public removeListener(callback: (event: WebSocketEvent) => void) {
    this.listeners = this.listeners.filter((fn) => fn !== callback);
  }
}

export default WebSocketManager.getInstance();
