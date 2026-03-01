# Group Chat Implementation Guide

## Overview

Group chat functionality has been successfully implemented in your Collab Vertex application! This guide explains how it works and how to use it.

## 🎉 What's New

### 1. **GroupChatCreator Component**
Location: `/src/chat/components/GroupChatCreator.tsx`

A beautiful, two-step UI for creating group chats:
- **Step 1: Select Members** - Pick 2 or more contacts from your list
- **Step 2: Group Details** - Set group name and optional description

### 2. **Updated ConversationChatContainer**
Location: `/src/chat/components/ConversationChatContainer.tsx`

Added group creation view and integrated the new component.

## 🚀 How to Use Group Chat

### For End Users

1. **Open the chat interface** (click the floating chat button)
2. **Click the group icon** (Users icon) in the top-right of the sidebar header
3. **Select participants**:
   - Search for contacts using the search bar
   - Click on contacts to select them (minimum 2 required)
   - Selected count shows at the top
   - Click "Next" when ready
4. **Enter group details**:
   - Group name (required, max 50 chars)
   - Description (optional, max 200 chars)
   - Review selected members
   - Click "Create Group"
5. **Start chatting!** - The group chat opens immediately after creation

### Features

✅ **Search contacts** - Find contacts quickly  
✅ **Visual feedback** - Selected members highlighted in purple  
✅ **Member preview** - See who's in the group before creating  
✅ **Real-time validation** - Can't proceed without minimum members  
✅ **Loading states** - Visual feedback during creation  
✅ **Automatic navigation** - Opens the new group chat immediately

## 📋 How It Works Technically

### 1. API Flow

```typescript
// User creates group via UI
handleCreateGroup(name, participantIds, description)
  ↓
// Hook calls chat service
createGroupConversation(name, participantIds, description)
  ↓
// Service makes API call
POST /chat/conversations/group
{
  name: "Team Chat",
  participant_ids: ["user-uuid-1", "user-uuid-2", "user-uuid-3"],
  description: "Project collaboration",
  avatar_url: undefined
}
  ↓
// Backend returns conversation object
{
  id: "conversation-uuid",
  type: "GROUP",
  name: "Team Chat",
  participants: [...],
  created_at: "2026-03-01T..."
}
  ↓
// UI opens the new group chat
// WebSocket connects automatically
wss://api.dixam.me/chat/ws/conversation/{conversation-uuid}
```

### 2. Key Differences: Direct vs Group Chat

| Feature | Direct Chat | Group Chat |
|---------|-------------|------------|
| **API Endpoint** | `POST /chat/conversations/direct` | `POST /chat/conversations/group` |
| **Payload** | `{ other_user_id: "uuid" }` | `{ name: "...", participant_ids: ["uuid1", "uuid2"], description?: "..." }` |
| **Minimum Participants** | 2 (you + 1 other) | 3+ (you + 2 others) |
| **WebSocket** | Same: `/chat/ws/conversation/{id}` | Same: `/chat/ws/conversation/{id}` |
| **Message Display** | Shows other person's name | Shows sender name for each message |
| **Conversation Type** | `type: "DIRECT"` | `type: "GROUP"` |

### 3. WebSocket Connection

**The WebSocket works identically for both direct and group chats!**

```typescript
// After creating group chat
const conversation = await createGroupConversation(name, participantIds);

// WebSocket auto-connects in ConversationChatRoom component
useConversationWebSocket({
  conversationId: conversation.id,  // ← Same for direct & group!
  autoConnect: true
});

// Send messages the same way
sendMessage("Hello team!", "TEXT");
```

### 4. Backend Automatically Handles

✅ Broadcasting messages to all participants  
✅ Managing participant list  
✅ Tracking unread counts per user  
✅ Message history for all members  
✅ Online/offline status

## 🔧 Architecture

### Components Hierarchy

```
ConversationChatContainer
├── Conversations List View
│   └── Shows both direct + group conversations
├── New Chat View (Direct Messages)
│   └── ChatContactsList → Select 1 contact
└── Group Creator View (NEW!)
    └── GroupChatCreator → Select 2+ contacts
```

### State Management

```typescript
// In ConversationChatContainer
const [view, setView] = useState<"conversations" | "contacts" | "group-creator">();

// Switching views
setView("conversations")   // Show existing chats
setView("contacts")        // Start new direct chat
setView("group-creator")   // Create new group chat
```

### Hooks Used

```typescript
const {
  conversations,                    // All conversations (direct + groups)
  createDirectConversation,         // Create 1-on-1 chat
  createGroupConversation,          // Create group chat ← NEW!
  getOrCreateDirectConversation,    // Smart direct chat creation
} = useConversations();
```

## 📝 API Reference

### Create Group Conversation

**Endpoint**: `POST /chat/conversations/group`

**Request Body**:
```json
{
  "name": "Marketing Team",
  "participant_ids": [
    "a1b2c3d4-user-uuid-1",
    "e5f6g7h8-user-uuid-2",
    "i9j0k1l2-user-uuid-3"
  ],
  "description": "Campaign planning and execution",
  "avatar_url": "https://example.com/avatar.jpg"
}
```

**Response**:
```json
{
  "id": "conversation-uuid",
  "type": "GROUP",
  "name": "Marketing Team",
  "description": "Campaign planning and execution",
  "avatar_url": null,
  "participants": [
    {
      "id": "user-uuid-1",
      "username": "John Doe",
      "email": "john@example.com",
      "role": "brand"
    },
    {
      "id": "user-uuid-2",
      "username": "Jane Smith",
      "email": "jane@example.com",
      "role": "influencer"
    }
  ],
  "created_at": "2026-03-01T10:30:00Z",
  "updated_at": "2026-03-01T10:30:00Z",
  "unread_count": 0
}
```

### Add Participants (Future Enhancement)

**Endpoint**: `POST /chat/conversations/{conversation_id}/participants`

Already available in backend! Can be added to UI later:

```typescript
await chatService.addParticipants(conversationId, {
  user_ids: ["new-user-uuid-1", "new-user-uuid-2"]
});
```

### Remove Participant (Future Enhancement)

**Endpoint**: `DELETE /chat/conversations/{conversation_id}/participants/{user_id}`

```typescript
await chatService.removeParticipant(conversationId, userIdToRemove);
```

## 🎨 UI Customization

### Colors

The component uses your existing purple/pink gradient theme:
- Primary buttons: `from-purple-600 to-pink-600`
- Selected items: `bg-purple-50` with `text-purple-700`
- Hover states: `hover:bg-purple-100`

### Modify the UI

**Change minimum participants**:
```tsx
// In GroupChatCreator.tsx, line ~66
if (selectedContacts.size >= 2) {  // Change 2 to your preferred minimum
```

**Change maximum group name length**:
```tsx
// In GroupChatCreator.tsx
maxLength={50}  // Change to your preferred length
```

**Add avatar upload**:
```tsx
// Add file input in "Group Details" step
<input type="file" accept="image/*" onChange={handleAvatarUpload} />
```

## 🧪 Testing

### Test Group Creation

```typescript
// 1. Select multiple contacts in UI
// 2. Click "Create Group"
// 3. Check browser console:
console.log("Creating group:", {
  name: "Test Group",
  participantIds: ["uuid1", "uuid2"],
  description: "Test description"
});

// 4. Verify WebSocket connection:
// Open DevTools → Network → WS
// Should see: wss://api.dixam.me/chat/ws/conversation/{conversation-id}

// 5. Send a test message
// 6. Verify all participants receive it
```

### Debug Mode

Add logging to see what's happening:

```typescript
// In ConversationChatContainer.tsx
const handleCreateGroup = async (name, participantIds, description) => {
  console.log("🚀 Creating group:", { name, participantIds, description });
  
  const conversation = await createGroupConversation(name, participantIds, description);
  
  console.log("✅ Group created:", conversation);
  console.log("📊 Participants:", conversation.participants);
  console.log("🆔 Conversation ID:", conversation.id);
};
```

## 🐛 Troubleshooting

### Issue: "Failed to create group"

**Check**:
1. Are you selecting at least 2 participants?
2. Are the user IDs correct (from `contact.id`)?
3. Check browser console for API errors
4. Verify backend endpoint is accessible: `POST /chat/conversations/group`

### Issue: Group created but can't send messages

**Check**:
1. WebSocket connection status (DevTools → Network → WS)
2. Verify `conversationId` in WebSocket URL matches the created group
3. Check cookies are being sent with WebSocket connection
4. Backend logs for WebSocket authentication errors

### Issue: Participants can't see messages

**Check**:
1. Ensure all participants have correct user UUIDs in backend
2. Verify backend is broadcasting to all participants
3. Check each participant's WebSocket connection status
4. Verify backend conversation_id matches for all users

## 🎯 Future Enhancements

### Planned Features (APIs already exist!):

1. **Add Members to Existing Group**
   ```typescript
   // UI: "+ Add Members" button in group chat header
   await addParticipants(conversationId, [newUserId]);
   ```

2. **Remove Members**
   ```typescript
   // UI: "Remove" option in member list
   await removeParticipant(conversationId, userId);
   ```

3. **Group Settings**
   - Edit group name
   - Edit description
   - Upload group avatar
   - Leave group

4. **Member Management**
   - View all members
   - See who's online
   - Admin/member roles
   - Member permissions

### Easy to Add:

```tsx
// Add to ConversationChatRoom header when conversation.type === "GROUP"
{selectedConversation.type === "GROUP" && (
  <button onClick={() => setShowGroupSettings(true)}>
    <Settings size={20} />
  </button>
)}
```

## 📚 Related Files

- **API Paths**: `/src/api/apiPaths.ts` - All endpoint definitions
- **Types**: `/src/chat/types.ts` - TypeScript interfaces
- **Service**: `/src/api/services/chatService.ts` - API calls
- **Hook**: `/src/chat/hooks/useConversationsList.ts` - Conversation management
- **WebSocket**: `/src/chat/hooks/useConversationWebSocket.ts` - Real-time messaging
- **Components**:
  - `/src/chat/components/GroupChatCreator.tsx` - Group creation UI
  - `/src/chat/components/ConversationChatContainer.tsx` - Main container
  - `/src/chat/components/ConversationChatRoom.tsx` - Chat room (works for both!)
  - `/src/chat/components/ConversationsList.tsx` - List of chats

## 🎓 Key Takeaways

1. **Group chat uses the SAME WebSocket** as direct chat
2. **Only difference is the API call** to create the conversation
3. **Backend handles all the complexity** of multi-user messaging
4. **UI is ready to use** - just click the Users icon!
5. **Easily extensible** for future features (add/remove members, etc.)

## ✅ Summary

You now have a fully functional group chat system that:
- ✅ Creates group conversations with 2+ members
- ✅ Uses the same real-time WebSocket as direct chats
- ✅ Has a beautiful, intuitive UI
- ✅ Validates input and provides feedback
- ✅ Automatically opens the new group after creation
- ✅ Supports all messaging features (text, images, files)
- ✅ Works seamlessly alongside direct chats

**Ready to test!** Just open your chat UI and click the Users icon to create your first group chat! 🎉
