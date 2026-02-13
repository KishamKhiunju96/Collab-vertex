import { WebSocketEvent } from "./types";

// Message queue for offline or retry messages
const queue: WebSocketEvent[] = [];

// Add a message to the queue
export const addMessageToQueue = (event: WebSocketEvent) => {
  queue.push(event);
};

// Flush the queued messages using the provided send function

export const flushQueue = (sendFn: (event: WebSocketEvent) => void) => {
  while (queue.length > 0) {
    const event = queue.shift();
    if (event) {
      sendFn(event);
    }
  }
};
