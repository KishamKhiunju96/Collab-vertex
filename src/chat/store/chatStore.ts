import { create } from "zustand";
import { ChatMessage } from "@/websocket/types";

interface ChatState {
  messages: ChatMessage[];
  addMessage: (msg: ChatMessage) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  addMessage: (msg) =>
    set((state: ChatState) => ({ messages: [...state.messages, msg] })),
  clearMessages: () => set({ messages: [] }),
}));
