# Quick Reference: WebSocket Connection Flow

## The Simple Flow

```
Brand clicks Influencer
        ↓
POST /chat/conversations/direct { other_profile_id: "influencer-profile-uuid" }
        ↓
Response: { id: "conversation-123", ... }
        ↓
WebSocket connects to: wss://api.dixam.me/chat/ws/conversation/conversation-123
        ↓
✅ CONNECTED! Brand and Influencer can now chat in real-time
```

## Code Example

```typescript
// Step 1: User clicks contact
handleContactClick(contactUserId)
  ↓
// Step 2: Create conversation
const conversation = await createDirectConversation({ 
  other_profile_id: contactProfileId  // Profile UUID from chatable endpoints
})
  ↓
// Step 3: Get conversation_id
const conversationId = conversation.id  // ← This is the magic key!
  ↓
// Step 4: Connect WebSocket with conversation_id
useConversationWebSocket({ 
  conversationId: conversationId,  // ← Use the conversation_id here!
  autoConnect: true 
})
  ↓
// Step 5: WebSocket URL is automatically constructed:
wss://api.dixam.me/chat/ws/conversation/{conversationId}
  ↓
// Step 6: Both users connect to SAME conversation_id
✅ Real-time chat enabled!
```

## Key Files

1. **API Paths**: `src/api/apiPaths.ts`
   - Defines WebSocket endpoint format

2. **Create Conversation**: `src/api/services/chatService.ts`
   - `createDirectConversation()` - Returns conversation with ID

3. **WebSocket Hook**: `src/chat/hooks/useConversationWebSocket.ts`
   - Takes `conversationId` parameter
   - Connects to WebSocket with that ID

4. **UI Container**: `src/chat/components/ConversationChatContainer.tsx`
   - Handles contact click
   - Creates conversation
   - Opens chat room

5. **Chat Room**: `src/chat/components/ConversationChatRoom.tsx`
   - Uses WebSocket hook
   - Displays messages
   - Sends messages

## Important: Use Profile IDs (UUIDs)

The **profile_id** is what connects users:

```typescript
// ✅ CORRECT - Use profile ID from chatable endpoints
const contacts = await chatService.getChatableInfluencers();
const profileId = contacts[0].id; // This is profile UUID

await createDirectConversation({
  other_profile_id: profileId
});

// ❌ WRONG - Don't invent or use user table IDs
await createDirectConversation({
  other_user_id: "made-up-id"
});
```

The **conversation_id** is the bridge that connects both users:

```
Brand WebSocket: wss://api.dixam.me/chat/ws/conversation/conv-123
                                                          ↑
                                              Same conversation_id!
                                                          ↓
Influencer WebSocket: wss://api.dixam.me/chat/ws/conversation/conv-123
```

## Authentication

- **REST API**: HttpOnly cookies via axios
- **WebSocket**: HttpOnly cookies via browser (automatic)
- **No tokens needed**: Cookies are sent automatically

## Testing Checklist

✅ User is logged in (check cookies in DevTools)
✅ Contact user_id is UUID (not profile ID number)
✅ Create conversation API returns conversation object with ID
✅ WebSocket connects with conversation_id
✅ Console shows: "✅ WebSocket connected to conversation: {id}"
✅ Send message: appears in both users' chat windows
✅ Receive message: appears in real-time

## Common Issues

❌ **"Cannot create conversation"**
→ Using profile.id instead of user.id (must be UUID)

❌ **"WebSocket connection failed"**
→ User not logged in, or backend URL incorrect

❌ **"Messages not appearing"**
→ Users connected to different conversation_ids

❌ **"Conversation already exists" (409)**
→ Normal! System finds existing conversation instead

## Success Indicators

✅ Console: "Created direct conversation: {conversation_id}"
✅ Console: "✅ WebSocket connected to conversation: {conversation_id}"
✅ Network tab: WS connection status 101
✅ Messages appear instantly in both windows

---

For full documentation, see: [WEBSOCKET_CONNECTION_FLOW.md](WEBSOCKET_CONNECTION_FLOW.md)
