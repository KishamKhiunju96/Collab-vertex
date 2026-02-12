import React from "react";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useChatRoom } from "../hooks/useChatRoom";

interface ChatWindowProps {
  roomId: string;
  currentUserId: string;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ roomId, currentUserId }) => {
  const { messages, sendMessage } = useChatRoom(roomId);

  return (
    <div className="flex flex-col border rounded h-full">
      <div className="flex-1 overflow-y-auto">
        <MessageList />
      </div>
      <MessageInput onSend={(msg) => sendMessage(msg, currentUserId)} />
    </div>
  );
};

export default ChatWindow;
