import React from "react";
import { useChatStore } from "../store/chatStore";
import { ChatMessage } from "@/websocket/types"; // Make sure types.ts exports ChatMessage

const MessageList: React.FC = () => {
  // Typing the messages from Zustand store
  const messages: ChatMessage[] = useChatStore((state) => state.messages);

  return (
    <div className="flex flex-col space-y-2 overflow-y-auto h-full p-2">
      {messages.map((msg) => (
        <div key={msg.id} className="p-2 rounded bg-gray-200">
          <strong>{msg.senderId}:</strong> {msg.content}
          <div className="text-xs text-gray-500">
            {new Date(msg.timestamp).toLocaleTimeString()}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
