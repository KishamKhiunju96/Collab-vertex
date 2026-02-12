import { useWebSocketContext } from "./WebSocketContext";
import { WebSocketEvent } from "./types";

/**
 * useWebSocket hook with generic payload type
 */
export const useWebSocket = <Payload = unknown>() => {
  const { sendMessage, messages } = useWebSocketContext();

  /**
   * Send a WebSocket event with a typed payload
   */
  const send = (type: string, payload: Payload) => {
    const event: WebSocketEvent<Payload> = { type, payload };
    sendMessage(event);
  };

  return { messages: messages as WebSocketEvent<Payload>[], send };
};
