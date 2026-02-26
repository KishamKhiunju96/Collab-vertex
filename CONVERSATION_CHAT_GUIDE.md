# Conversation-Based Chat System - Implementation Guide

## Overview

This project now includes a complete conversation-based chat system with:
- **Direct Conversations (1-on-1)**: Between brand and influencer
- **Group Conversations**: Multiple participants
- **WebSocket Real-time Messaging**: Auto-connect when opening conversations
- **Participant Management**: Add/remove participants in groups
- **Read Receipts**: Mark conversations as read
- **Unread Counts**: Track unread messages per conversation

## API Structure

All chat APIs are defined in `/src/api/apiPaths.ts`:

```typescript
// WebSocket
WEBSOCKET: (conversationId: string) => `wss://api.dixam.me/ws/chat/${conversationId}/`

// Conversation Management
CREATE_DIRECT_CONVERSATION: "/api/chat/conversations/direct/"
CREATE_GROUP_CONVERSATION: "/api/chat/conversations/group/"
GET_CONVERSATIONS_LIST: "/api/chat/conversations/"
GET_CONVERSATION_MESSAGES: (conversationId: string) => `/api/chat/conversations/${conversationId}/messages/`
SEND_MESSAGE: (conversationId: string) => `/api/chat/conversations/${conversationId}/messages/`
MARK_CONVERSATION_READ: (conversationId: string) => `/api/chat/conversations/${conversationId}/mark-read/`
ADD_PARTICIPANTS: (conversationId: string) => `/api/chat/conversations/${conversationId}/add-participants/`
REMOVE_PARTICIPANT: (conversationId: string, userId: string) => `/api/chat/conversations/${conversationId}/remove-participant/${userId}/`
```

## Architecture

### 1. Type Definitions (`/src/chat/types.ts`)

```typescript
// Message in a conversation
interface ConversationMessage {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_name: string;
  content: string;
  message_type: "TEXT" | "IMAGE" | "FILE";
  timestamp: string;
}

// Conversation (DIRECT or GROUP)
interface Conversation {
  id: string;
  type: "DIRECT" | "GROUP";
  name?: string; // For groups
  participants: ConversationParticipant[];
  last_message?: ConversationMessage;
  unread_count: number;
  created_at: string;
  avatar_url?: string;
}
```

### 2. Chat Service (`/src/api/services/chatService.ts`)

All API methods are available:

```typescript
import { chatService } from "@/api/services/chatService";

// Create direct conversation
const conversation = await chatService.createDirectConversation({
  other_profile_id: "profile-uuid" // Profile UUID from chatable endpoints
});

// Create group conversation
const group = await chatService.createGroupConversation({
  name: "Marketing Team",
  participant_profile_ids: ["profile1-uuid", "profile2-uuid", "profile3-uuid"],
  description: "Team collaboration",
  avatar_url: "https://..."
});

// Get all conversations
const conversations = await chatService.getConversationsList();

// Get messages for a conversation
const messages = await chatService.getConversationMessages(conversationId);

// Send message (REST API - use WebSocket for real-time)
await chatService.sendConversationMessage(conversationId, {
  content: "Hello!",
  message_type: "TEXT"
});

// Mark as read
await chatService.markConversationAsRead(conversationId);

// Add participants to group
await chatService.addParticipants(conversationId, {
  user_ids: ["user4", "user5"]
});

// Remove participant from group
await chatService.removeParticipant(conversationId, userId);
```

### 3. WebSocket Hook (`/src/chat/hooks/useConversationWebSocket.ts`)

Real-time messaging via WebSocket:

```typescript
import { useConversationWebSocket } from "@/chat/hooks/useConversationWebSocket";

const {
  messages,           // Real-time messages
  sendMessage,        // Send message function
  isConnected,        // Connection status
  error,              // Error message
  connect,            // Manual connect
  disconnect,         // Manual disconnect
  reconnect           // Manual reconnect
} = useConversationWebSocket(conversationId);

// Send a message
await sendMessage("Hello!", "TEXT");

// Send an image
await sendMessage("https://image-url.jpg", "IMAGE");
```

**Features:**
- Auto-connect on mount (or manual control)
- Auto-reconnect with exponential backoff (max 5 attempts)
- Message queue management
- Connection status tracking
- Error handling

### 4. Conversations List Hook (`/src/chat/hooks/useConversationsList.ts`)

Manage all conversations:

```typescript
import { useConversationsList } from "@/chat/hooks/useConversationsList";

const {
  conversations,                    // All conversations (direct + groups)
  loading,                          // Loading state
  error,                            // Error message
  refresh,                          // Refresh conversations
  createDirectConversation,         // Create direct chat
  createGroupConversation,          // Create group
  markAsRead,                       // Mark as read
  addParticipants,                  // Add to group
  removeParticipant,                // Remove from group
  getOrCreateDirectConversation     // Get existing or create new
} = useConversationsList();

// When user clicks on a contact
const conversation = await getOrCreateDirectConversation(userId);
```

## UI Components

### 1. ConversationsList Component

Displays all conversations with:
- Unread badges
- Last message preview
- Timestamp formatting
- Group member counts
- Online status indicators

```tsx
import { ConversationsList } from "@/chat/components/ConversationsList";

<ConversationsList
  conversations={conversations}
  selectedConversationId={selectedId}
  onConversationSelect={(conv) => setSelected(conv)}
  loading={loading}
/>
```

### 2. ConversationChatRoom Component

Individual chat room with:
- Message list with date separators
- Real-time WebSocket connection
- Send message input
- Connection status indicators
- Auto-scroll to bottom
- Mark as read on open

```tsx
import ConversationChatRoom from "@/chat/components/ConversationChatRoom";

<ConversationChatRoom
  conversation={selectedConversation}
  onMarkAsRead={() => markAsRead(conversationId)}
/>
```

### 3. ConversationChatContainer Component

Complete chat UI with:
- Conversations list sidebar
- Contacts list for new chats (with tab switching)
- Chat room view
- Create direct conversation on contact click
- Responsive layout

```tsx
import ConversationChatContainer from "@/chat/components/ConversationChatContainer";

<ConversationChatContainer
  contacts={availableUsers}
  onClose={() => closeChat()}
  isLoadingContacts={loading}
/>
```

### 4. FloatingConversationChatButton Component

Floating chat button like Facebook Messenger:
- Fixed position floating button
- Unread badge
- Minimize/maximize functionality
- Full chat container

```tsx
import FloatingConversationChatButton from "@/chat/components/FloatingConversationChatButton";

<FloatingConversationChatButton
  contacts={chatContacts}
  isLoading={isLoadingContacts}
  unreadTotal={totalUnreadCount}
/>
```

## Integration Example

### Dashboard Integration (Brand or Influencer)

```tsx
// 1. Import the component
import FloatingConversationChatButton from "@/chat/components/FloatingConversationChatButton";
import { useState, useEffect } from "react";

export default function DashboardPage() {
  const [chatContacts, setChatContacts] = useState([]);
  const [isLoadingContacts, setIsLoadingContacts] = useState(true);

  // 2. Fetch available users for chat
  useEffect(() => {
    async function fetchChatContacts() {
      try {
        // Replace with your API call
        // For brands: fetch influencers
        // For influencers: fetch brands or other influencers
        const response = await fetch("/api/users/available-for-chat");
        const data = await response.json();
        
        const contacts = data.map((user: any) => ({
          id: user.id,           // User UUID (NOT profile id)
          username: user.username,
          email: user.email,
          role: user.role,       // "brand" | "influencer"
          isOnline: user.is_online || false
        }));
        
        setChatContacts(contacts);
      } catch (error) {
        console.error("Failed to fetch contacts:", error);
      } finally {
        setIsLoadingContacts(false);
      }
    }

    fetchChatContacts();
  }, []);

  // 3. Calculate total unread count (optional)
  // You can get this from the conversations list or notifications API
  const totalUnreadCount = 5; // Replace with actual count

  return (
    <div>
      {/* Your dashboard content */}
      
      {/* 4. Add floating chat button */}
      <FloatingConversationChatButton
        contacts={chatContacts}
        isLoading={isLoadingContacts}
        unreadTotal={totalUnreadCount}
      />
    </div>
  );
}
```

## User Flow

### Starting a Direct Conversation

1. User clicks floating chat button
2. User switches to "New Chat" tab
3. User clicks on a contact
4. System calls `getOrCreateDirectConversation(userId)`
5. If conversation exists → Opens it
6. If not → Creates new conversation via API → Opens it
7. WebSocket auto-connects to conversation
8. User can send/receive messages in real-time

### Receiving Messages

1. WebSocket connection is active for current conversation
2. New message arrives via WebSocket
3. Message is automatically added to message list
4. UI auto-scrolls to bottom
5. If user is viewing the conversation → Mark as read

### Creating Group Chat

1. User clicks "Create Group" button (you can add this)
2. User selects participants
3. User enters group name and description
4. System calls `createGroupConversation()`
5. Group appears in conversations list
6. User can start messaging

## Important Notes

### User IDs vs Profile IDs

- **CRITICAL**: Use User UUID (from `user.id`), NOT profile IDs
- User UUID: `"a1b2c3d4-e5f6-7890-abcd-ef1234567890"`
- Profile ID: `1`, `2`, `3` (numbers)

```typescript
// ✅ CORRECT
const contacts = await chatService.getChatableInfluencers();
const profileId = contacts[0].id; // Profile UUID from chatable endpoint

await chatService.createDirectConversation({
  other_profile_id: profileId
});
```

### Authentication

All API calls require authentication token:
```typescript
// axiosInstance automatically includes token
// Make sure user is logged in before making chat API calls
```

### WebSocket Connection Lifecycle

```
1. User opens conversation
   → useConversationWebSocket hook initializes
   → connect() called automatically
   → WebSocket connects to wss://api.dixam.me/ws/chat/{conversationId}/
   
2. User sends message
   → sendMessage() called
   → Message sent via WebSocket
   → Message appears in real-time
   
3. User closes conversation
   → Component unmounts
   → disconnect() called automatically
   → WebSocket closes gracefully
```

### Error Handling

```typescript
// Service calls
try {
  const conversation = await chatService.createDirectConversation({
    other_user_id: userId
  });
} catch (error) {
  if (error.response?.status === 409) {
    // Conversation already exists
    console.log("Conversation already exists");
  } else {
    // Other error
    console.error("Failed to create conversation:", error);
  }
}

// WebSocket errors
const { error } = useConversationWebSocket(conversationId);
if (error) {
  console.error("WebSocket error:", error);
}
```

## Styling

All components use Tailwind CSS with:
- Gradient backgrounds (purple-600 to pink-600)
- Smooth animations
- Responsive design
- Production-grade polish
- Custom scrollbars
- Hover effects
- Shadow effects

Matches your existing design system with Electric Violet and Coral Pink colors.

## Testing the Chat

1. **Create a direct conversation:**
   ```typescript
   await chatService.createDirectConversation({
     other_user_id: "user-uuid-here"
   });
   ```

2. **Send a test message:**
   ```typescript
   const { sendMessage } = useConversationWebSocket(conversationId);
   await sendMessage("Hello!", "TEXT");
   ```

3. **Check conversations list:**
   ```typescript
   const { conversations } = useConversationsList();
   console.log(conversations);
   ```

4. **Test WebSocket connection:**
   - Open Developer Tools → Network → WS
   - Should see connection to `wss://api.dixam.me/ws/chat/{conversationId}/`
   - Send message → Should appear in real-time

## Next Steps

1. **Replace mock contacts** with actual API calls
2. **Add group creation UI** (button + modal)
3. **Implement participant management UI** for groups
4. **Add notifications** for new messages
5. **Integrate with dashboard notifications**
6. **Add message search functionality**
7. **Add file/image upload** for messages
8. **Add typing indicators** (if backend supports)
9. **Add message reactions** (if backend supports)

## File Reference

```
/src/chat/
├── types.ts                          # Type definitions
├── hooks/
│   ├── useConversationWebSocket.ts   # WebSocket hook
│   └── useConversationsList.ts       # Conversations management hook
└── components/
    ├── ConversationsList.tsx         # Conversations list UI
    ├── ConversationChatRoom.tsx      # Chat room UI
    ├── ConversationChatContainer.tsx # Complete chat UI
    └── FloatingConversationChatButton.tsx  # Floating button

/src/api/
├── apiPaths.ts                       # All API endpoints
└── services/
    └── chatService.ts                # Chat API methods
```

## Support

If you encounter issues:
1. Check browser console for errors
2. Check Network tab for API calls
3. Check WebSocket connections in Network/WS tab
4. Verify user IDs are UUIDs, not profile IDs
5. Ensure user is authenticated
6. Check backend API is running and accessible

---

**Status: ✅ Fully Implemented**

All infrastructure is ready. Just integrate `FloatingConversationChatButton` into your dashboards and replace mock contacts with real API data.
