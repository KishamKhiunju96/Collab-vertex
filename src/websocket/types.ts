export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  content: string;
  timestamp: string;
}

// Generic WebSocketEvent type
export interface WebSocketEvent<Payload = unknown> {
  type: string;
  payload: Payload;
}
