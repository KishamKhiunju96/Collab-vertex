import React, { createContext, useContext, useEffect, useState } from "react";
import WSManager from "./WebSocketManager";
import { WebSocketEvent } from "./types";
import { flushQueue } from "./messageQueue";

interface WebSocketContextType {
  sendMessage: (event: WebSocketEvent) => void;
  messages: WebSocketEvent[];
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined,
);

export const WebSocketProvider: React.FC<{
  url: string;
  children: React.ReactNode;
}> = ({ url, children }) => {
  const [messages, setMessages] = useState<WebSocketEvent[]>([]);

  useEffect(() => {
    WSManager.connect(url);

    const listener = (event: WebSocketEvent) => {
      setMessages((prev) => [...prev, event]);
    };

    WSManager.addListener(listener);

    flushQueue(WSManager.send.bind(WSManager));

    return () => {
      WSManager.removeListener(listener);
    };
  }, [url]);

  const sendMessage = (event: WebSocketEvent) => {
    WSManager.send(event);
  };

  return (
    <WebSocketContext.Provider value={{ sendMessage, messages }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context)
    throw new Error(
      "useWebSocketContext must be used within a WebSocketProvider",
    );
  return context;
};
