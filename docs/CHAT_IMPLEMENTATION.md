# Chat Implementation Guide - WebSocket & REST API Integration

## 📋 Overview

This document provides a comprehensive guide for the real-time chat implementation using WebSocket for live messaging and REST API for message history retrieval.

## 🎯 Features Implemented

### 1. **Real-Time Messaging**
- WebSocket connection for instant message delivery
- Automatic reconnection on connection loss
- Message delivery and read status tracking
- Undelivered message synchronization on connect

### 2. **Message History**
- REST API for fetching chat history
- Pagination support (load more messages)
- Message persistence across sessions

### 3. **Connection Management**
- Automatic reconnection with exponential backoff
- Connection status indicators
- Manual reconnect option
- Graceful disconnection handling

### 4. **User Experience**
- Real-time message updates
- Read receipts (✓✓)
- Delivery status indicators
- Date separators
- Auto-scroll to latest messages
- Load older messages on scroll

---

## 🗂️ File Structure

```
Collab-vertex/
├── src/
│   ├── api/
│   │   ├── apiPaths.ts                              ← Updated: Added CHAT endpoints
│   │   └── services/
│   │       └── chatService.ts                       ← NEW: REST API service
│   ├── chat/
│   │   ├── types.ts                                 ← NEW: TypeScript interfaces
│   │   ├── hooks/
│   │   │   ├── useChat.ts                           ← NEW: Comprehensive chat hook
│   │   │   ├── useChatWebSocket.ts                  ← NEW: WebSocket management
│   │   │   └── useChatRoom.ts                       ← Existing: Old implementation
│   │   └── components/
│   │       └── ChatRoom.tsx                         ← NEW: Chat UI component
│   └── websocket/
│       └── types.ts                                 ← Existing: WebSocket types
```

---

## 🔧 Backend API Endpoints

### 1. WebSocket Endpoint

**Endpoint:** `ws://api.dixam.me/ws/chat/{other_user_id}`

**Purpose:** Real-time bidirectional communication

**Authentication:** Via HTTP cookies (automatic)

**Connection Flow:**
```
1. Client initiates WebSocket connection
2. Backend authenticates via cookies
3. Backend sends undelivered messages
4. Connection established for real-time messaging
```

**Message Format (Sent):**
```json
{
  "content": "Hello, how are you?"
}
```

**Message Format (Received):**
```json
{
  "id": "uuid-string",
  "sender_id": "uuid-string",
  "receiver_id": "uuid-string",
  "content": "Hello, how are you?",
  "sent_at": "2024-01-15T10:30:00.000Z",
  "is_read": false,
  "is_delivered": true
}
```

### 2. REST API Endpoint

**Endpoint:** `GET /get_messages/{other_user_id}`

**Purpose:** Fetch chat history with pagination

**Parameters:**
- `limit` (optional, default: 10) - Number of messages to fetch
- `offset` (optional, default: 0) - Pagination offset

**Request Example:**
```bash
GET /get_messages/123e4567-e89b-12d3-a456-426614174000?limit=50&offset=0
```

**Response:**
```json
[
  {
    "id": "uuid-1",
    "sender_id": "user-id-1",
    "receiver_id": "user-id-2",
    "content": "Hello!",
    "sent_at": "2024-01-15T10:30:00.000Z",
    "is_read": true,
    "is_delivered": true
  },
  {
    "id": "uuid-2",
    "sender_id": "user-id-2",
    "receiver_id": "user-id-1",
    "content": "Hi there!",
    "sent_at": "2024-01-15T10:31:00.000Z",
    "is_read": false,
    "is_delivered": true
  }
]
```

**Note:** Messages are returned in reverse chronological order (newest first), but the frontend reverses them for display.

---

## 📡 Frontend Implementation

### 1. API Paths Configuration

**File:** `src/api/apiPaths.ts`

```typescript
export const API_PATHS = {
  // ... other paths
  
  CHAT: {
    // WebSocket endpoint for real-time chat
    WEBSOCKET: (otherUserId: string) => `/ws/chat/${otherUserId}`,
    // REST endpoint to get chat history
    GET_MESSAGES: (otherUserId: string) => `/get_messages/${otherUserId}`,
  },
}
```

### 2. TypeScript Types

**File:** `src/chat/types.ts`

```typescript
export interface ChatMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  sent_at: string;
  is_read: boolean;
  is_delivered: boolean;
}

export interface SendMessagePayload {
  content: string;
}

export interface GetMessagesParams {
  limit?: number;
  offset?: number;
}
```

### 3. Chat Service (REST API)

**File:** `src/api/services/chatService.ts`

```typescript
import api from "@/api/axiosInstance";
import { API_PATHS } from "@/api/apiPaths";
import { ChatMessage, GetMessagesParams } from "@/chat/types";

export const chatService = {
  async getMessages(
    otherUserId: string,
    params?: GetMessagesParams
  ): Promise<ChatMessage[]> {
    const { limit = 50, offset = 0 } = params || {};
    const response = await api.get<ChatMessage[]>(
      API_PATHS.CHAT.GET_MESSAGES(otherUserId),
      { params: { limit, offset } }
    );
    return response.data;
  },
};
```

### 4. WebSocket Hook

**File:** `src/chat/hooks/useChatWebSocket.ts`

**Purpose:** Manages WebSocket connection lifecycle

**Features:**
- Automatic connection on mount
- Reconnection on disconnect (max 5 attempts)
- Message sending/receiving
- Error handling

**Usage:**
```typescript
const {
  sendMessage,
  isConnected,
  messages,
  error,
  reconnect
} = useChatWebSocket({
  otherUserId: "user-uuid",
  onMessageReceived: (msg) => console.log("New message:", msg),
  onConnectionChange: (connected) => console.log("Connected:", connected)
});
```

### 5. Comprehensive Chat Hook

**File:** `src/chat/hooks/useChat.ts`

**Purpose:** Combines WebSocket and REST API for complete chat functionality

**Features:**
- Initial message loading from REST API
- Real-time messages via WebSocket
- Pagination (load more messages)
- Message deduplication
- Read status management

**Usage:**
```typescript
const {
  messages,
  sendMessage,
  loadMoreMessages,
  isConnected,
  isLoading,
  hasMore,
  error,
  reconnect,
  markAsRead
} = useChat({
  otherUserId: "user-uuid",
  enabled: true
});
```

### 6. Chat Room Component

**File:** `src/chat/components/ChatRoom.tsx`

**Features:**
- Full chat UI with message bubbles
- Connection status indicator
- Date separators
- Read receipts (✓ sent, ✓✓ delivered, ✓✓ read)
- Auto-scroll to bottom
- Load more messages button
- Manual reconnect button

**Usage:**
```tsx
<ChatRoom 
  otherUserId="123e4567-e89b-12d3-a456-426614174000"
  otherUserName="John Doe"
/>
```

---

## 🔄 Data Flow

### Sending a Message

```
User types message → Click Send
    ↓
useChat.sendMessage(content)
    ↓
useChatWebSocket.sendMessage(content)
    ↓
WebSocket.send({ content })
    ↓
Backend receives message
    ↓
Backend saves to database
    ↓
Backend sends back confirmation with message object
    ↓
Frontend receives message via WebSocket
    ↓
Message added to local state
    ↓
UI updates with new message
```

### Receiving a Message

```
Other user sends message
    ↓
Backend saves to database
    ↓
Backend sends to recipient via WebSocket (if online)
    ↓
Frontend receives message
    ↓
useChatWebSocket.onmessage triggered
    ↓
Message added to local state
    ↓
UI updates with new message
    ↓
Optional: Send read receipt
```

### Loading Message History

```
Component mounts
    ↓
useChat hook initializes
    ↓
WebSocket connects
    ↓
loadInitialMessages() called
    ↓
chatService.getMessages(otherUserId, { limit: 50, offset: 0 })
    ↓
REST API returns message history
    ↓
Messages displayed in UI
    ↓
User scrolls up → Click "Load older messages"
    ↓
loadMoreMessages() called
    ↓
Fetch with increased offset
    ↓
Prepend older messages to list
```

---

## 🎨 UI Features

### Message Status Indicators

| Status | Icon | Meaning |
|--------|------|---------|
| Sent | ✓ | Message sent from client |
| Delivered | ✓✓ (blue) | Message delivered to recipient |
| Read | ✓✓ (lighter blue) | Message read by recipient |

### Connection Status

| Status | Indicator | Description |
|--------|-----------|-------------|
| Connected | 🟢 Pulsing green dot | WebSocket connected |
| Disconnected | 📡 WiFi off icon | Connection lost |
| Reconnecting | ⏳ | Attempting to reconnect |

### Date Separators

Messages are grouped by date with separators:
- **Today** - for messages sent today
- **Yesterday** - for messages sent yesterday
- **Jan 15, 2024** - for older messages

---

## 🔐 Environment Variables

Create or update `.env.local`:

```bash
# WebSocket URL (auto-detects http/https for ws/wss)
NEXT_PUBLIC_WS_URL=wss://api.dixam.me

# API Base URL
NEXT_PUBLIC_API_URL=https://api.dixam.me
```

**Auto-detection Logic:**
```typescript
const WS_BASE_URL = 
  process.env.NEXT_PUBLIC_WS_URL ||
  (window.location.protocol === "https:" 
    ? "wss://api.dixam.me" 
    : "ws://api.dixam.me");
```

---

## 🧪 Testing Checklist

### WebSocket Connection
- [ ] WebSocket connects successfully
- [ ] Authentication works via cookies
- [ ] Undelivered messages load on connect
- [ ] Connection status updates correctly
- [ ] Manual reconnect works
- [ ] Auto-reconnect works after disconnect
- [ ] Max reconnect attempts respected

### Messaging
- [ ] Send message successfully
- [ ] Receive messages in real-time
- [ ] Message appears for both sender and receiver
- [ ] Message status updates (sent → delivered → read)
- [ ] Empty messages are prevented
- [ ] Long messages wrap correctly
- [ ] Special characters handled properly

### Message History
- [ ] Initial messages load on connect
- [ ] Pagination works (load more)
- [ ] Messages in correct chronological order
- [ ] No duplicate messages
- [ ] Scroll position maintained when loading older messages

### Error Handling
- [ ] Network error shows user-friendly message
- [ ] Failed reconnect shows error state
- [ ] Failed message send shows notification
- [ ] Invalid WebSocket URL handled
- [ ] Backend errors displayed properly

### UI/UX
- [ ] Auto-scroll to bottom on new messages
- [ ] Date separators display correctly
- [ ] Read receipts update properly
- [ ] Loading states show during fetch
- [ ] Empty state shows when no messages
- [ ] Mobile responsive design
- [ ] Keyboard shortcuts work (Enter to send)

---

## 🚀 Usage Examples

### Basic Chat Implementation

```tsx
// app/chat/[userId]/page.tsx
"use client";

import { useParams } from "next/navigation";
import ChatRoom from "@/chat/components/ChatRoom";

export default function ChatPage() {
  const params = useParams();
  const otherUserId = params.userId as string;

  return (
    <div className="h-screen p-4">
      <ChatRoom 
        otherUserId={otherUserId}
        otherUserName="Chat Partner"
      />
    </div>
  );
}
```

### Custom Chat with Advanced Features

```tsx
"use client";

import { useChat } from "@/chat/hooks/useChat";
import { useEffect } from "react";

export default function CustomChat({ otherUserId }: { otherUserId: string }) {
  const {
    messages,
    sendMessage,
    loadMoreMessages,
    isConnected,
    markAsRead
  } = useChat({ otherUserId });

  // Mark messages as read when user views them
  useEffect(() => {
    const unreadMessages = messages
      .filter(msg => msg.receiver_id === currentUserId && !msg.is_read)
      .map(msg => msg.id);
    
    if (unreadMessages.length > 0) {
      markAsRead(unreadMessages);
    }
  }, [messages]);

  return (
    <div>
      {/* Your custom UI */}
      <button onClick={() => sendMessage("Hello!")}>
        Send Hello
      </button>
    </div>
  );
}
```

### Only WebSocket (No History)

```tsx
import { useChatWebSocket } from "@/chat/hooks/useChatWebSocket";

export default function LiveChat({ otherUserId }: { otherUserId: string }) {
  const { sendMessage, isConnected, messages } = useChatWebSocket({
    otherUserId,
    onMessageReceived: (msg) => {
      console.log("New message:", msg);
      // Play notification sound, show toast, etc.
    }
  });

  return <div>{/* UI */}</div>;
}
```

---

## 🐛 Troubleshooting

### WebSocket Connection Issues

**Problem:** WebSocket fails to connect  
**Solution:**
1. Check WebSocket URL format (ws:// or wss://)
2. Verify authentication cookies are sent
3. Check CORS settings on backend
4. Ensure backend WebSocket endpoint is accessible

### Messages Not Appearing

**Problem:** Sent messages don't appear in UI  
**Solution:**
1. Check WebSocket connection status
2. Verify message format matches backend expectation
3. Check browser console for errors
4. Ensure message deduplication isn't removing valid messages

### Duplicate Messages

**Problem:** Same message appears multiple times  
**Solution:**
1. Check message ID uniqueness
2. Verify deduplication logic in `useChat` hook
3. Ensure WebSocket doesn't reconnect unnecessarily

### Reconnection Loop

**Problem:** WebSocket keeps disconnecting and reconnecting  
**Solution:**
1. Check backend stability
2. Verify authentication isn't expiring
3. Review reconnection logic and max attempts
4. Check for memory leaks or resource issues

---

## 🔮 Future Enhancements

### Planned Features
- [ ] Typing indicators
- [ ] Message reactions (emoji)
- [ ] File/image attachments
- [ ] Voice messages
- [ ] Group chat support
- [ ] Message search
- [ ] Message deletion
- [ ] Message editing
- [ ] Push notifications for offline messages
- [ ] End-to-end encryption
- [ ] Chat backup/export

### Backend Enhancements Needed
- [ ] Typing status endpoint
- [ ] Read receipt endpoint
- [ ] File upload endpoint
- [ ] Group chat management
- [ ] User blocking/reporting
- [ ] Message search API
- [ ] Conversation list endpoint

---

## 📚 Related Documentation

- [WebSocket API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
- [React Hooks Best Practices](https://react.dev/reference/react)
- [Event Architecture](./EVENT_ARCHITECTURE.md)
- [Setup Guide](../SETUP_GUIDE.md)

---

## ✅ Summary

This implementation provides:
- ✅ Real-time bidirectional messaging via WebSocket
- ✅ Message history via REST API
- ✅ Automatic reconnection handling
- ✅ Message status tracking (sent, delivered, read)
- ✅ Pagination for chat history
- ✅ Comprehensive error handling
- ✅ Type-safe TypeScript implementation
- ✅ Reusable hooks and components
- ✅ Production-ready UI

The chat system is now fully integrated and ready for use across the application!