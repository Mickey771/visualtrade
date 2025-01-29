export class WebSocketClient {
  private _ws: WebSocket | null = null;
  private heartbeatCallback: (() => void) | null = null;

  get ws() {
    return this._ws;
  }

  connect(url: string) {
    if (typeof window !== "undefined") {
      this._ws = new WebSocket(url);

      this._ws.addEventListener("open", () => {
        console.log("Connected");
        if (this.heartbeatCallback) {
          this.heartbeatCallback();
        }
      });

      this._ws.addEventListener("message", (event) => {
        console.log("Received:", event.data);
      });

      this._ws.addEventListener("close", () => {
        console.log("Disconnected");
      });

      this._ws.addEventListener("error", (error) => {
        console.error("Error:", error);
      });
    }
  }

  setHeartbeatCallback(callback: () => void) {
    this.heartbeatCallback = callback;
  }

  sendMessage(message: string) {
    this._ws?.send(message);
  }

  disconnect() {
    this._ws?.close();
  }
}

export const wsClient = new WebSocketClient();
