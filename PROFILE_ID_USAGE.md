# ✅ Updated: Using Profile IDs for Chat System

## What Changed

The chat system now correctly uses **profile IDs** (UUIDs) instead of user IDs, matching your backend implementation.

## Critical Information

### Backend Expects Profile IDs

```typescript
// ✅ CORRECT - Use profile ID from chatable endpoints
POST /chat/conversations/direct
{
  "other_profile_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890"  // Profile UUID
}

// ❌ OLD (WRONG) - Don't use user_id
{
  "other_user_id": "user-uuid"
}
```

## Where to Get Profile IDs

### For Brands (chatting with influencers):
```typescript
const response = await fetch("/api/brand/chatable_influencers");
const influencers = await response.json();

// Each influencer has:
{
  id: "profile-uuid",  // ← Use this for creating conversations!
  name: "Influencer Name",
  email: "email@example.com",
  // ... other fields
}
```

### For Influencers (chatting with brands):
```typescript
const response = await fetch("/api/influencer/chatable_brands");
const brands = await response.json();

// Each brand has:
{
  id: "profile-uuid",  // ← Use this for creating conversations!
  name: "Brand Name",
  email: "email@example.com",
  // ... other fields
}
```

## Usage Example

### Step 1: Fetch Chatable Contacts
```typescript
// In your dashboard component
const [chatContacts, setChatContacts] = useState([]);

useEffect(() => {
  async function fetchContacts() {
    if (user.role === "brand") {
      const response = await fetch("/api/brand/chatable_influencers");
      const data = await response.json();
      
      const contacts = data.map(profile => ({
        id: profile.id,        // ✅ This is profile UUID - what we need!
        username: profile.name,
        email: profile.email,
        role: "influencer"
      }));
      
      setChatContacts(contacts);
    }
  }
  
  fetchContacts();
}, [user]);
```

### Step 2: Click Contact to Start Chat
```typescript
const handleContactClick = async (contact) => {
  // contact.id is the profile UUID
  const conversation = await chatService.createDirectConversation({
    other_profile_id: contact.id  // ✅ Profile UUID from chatable endpoint
  });
  
  // conversation.id is the conversation UUID
  // Use this to connect WebSocket
};
```

### Step 3: WebSocket Connects Automatically
```typescript
// In ConversationChatRoom component
const { sendMessage, isConnected } = useConversationWebSocket({
  conversationId: conversation.id,  // Conversation UUID from step 2
  autoConnect: true
});

// WebSocket URL: wss://api.dixam.me/chat/ws/conversation/{conversation.id}
```

## Updated API Types

### Create Direct Conversation
```typescript
interface CreateDirectConversationPayload {
  other_profile_id: string;  // ✅ Profile UUID (not user_id)
}

// Usage:
await chatService.createDirectConversation({
  other_profile_id: "profile-uuid-here"
});
```

### Create Group Conversation
```typescript
interface CreateGroupConversationPayload {
  name: string;
  participant_profile_ids: string[];  // ✅ Array of profile UUIDs (not user_ids)
  description?: string;
  avatar_url?: string;
}

// Usage:
await chatService.createGroupConversation({
  name: "Team Chat",
  participant_profile_ids: [
    "profile-uuid-1",
    "profile-uuid-2",
    "profile-uuid-3"
  ],
  description: "Marketing team collaboration"
});
```

## Key Points

✅ **Profile IDs are UUIDs** - They look like: `"a1b2c3d4-e5f6-7890-abcd-ef1234567890"`

✅ **Get profile IDs from chatable endpoints**:
- Brands: `/api/brand/chatable_influencers`
- Influencers: `/api/influencer/chatable_brands`

✅ **Use `contact.id`** when creating conversations - it's the profile UUID

✅ **Backend expects `other_profile_id`** in the request body

✅ **conversation_id** (different from profile_id) is used for WebSocket connection

## Complete Flow

```
1. Fetch chatable contacts
   ↓
   GET /brand/chatable_influencers
   Response: [{ id: "profile-uuid-1", ... }, { id: "profile-uuid-2", ... }]
   
2. User clicks contact
   ↓
   contact.id = "profile-uuid-1"
   
3. Create conversation
   ↓
   POST /chat/conversations/direct
   Body: { other_profile_id: "profile-uuid-1" }
   Response: { id: "conversation-uuid-123", ... }
   
4. Connect WebSocket
   ↓
   wss://api.dixam.me/chat/ws/conversation/conversation-uuid-123
   
5. ✅ Chat enabled!
```

## Updated Files

### Type Definitions
- ✅ `src/chat/types.ts` - Updated payload interfaces to use `other_profile_id`

### API Service
- ✅ `src/api/services/chatService.ts` - Updated JSDoc comments with correct usage

### Hooks
- ✅ `src/chat/hooks/useConversationsList.ts` - Updated parameter names and comments

### API Paths
- ✅ `src/api/apiPaths.ts` - Updated documentation comments

### Documentation
- ✅ `CONVERSATION_CHAT_GUIDE.md` - Updated examples
- ✅ `WEBSOCKET_CONNECTION_FLOW.md` - Updated flow diagrams
- ✅ `WEBSOCKET_QUICK_REFERENCE.md` - Updated quick reference
- ✅ `src/examples/DashboardWithChatExample.tsx` - Updated example code

## Testing Checklist

Before testing, verify:

1. ✅ Chatable endpoints return profile UUIDs in `id` field
2. ✅ Contact list uses `profile.id` (not making up IDs)
3. ✅ Create conversation payload has `other_profile_id`
4. ✅ Backend accepts `other_profile_id` field
5. ✅ WebSocket connects with `conversation_id` (from API response)

## Common Mistakes to Avoid

❌ **Using user table IDs**
```typescript
// WRONG - Don't use user.id from authentication
createDirectConversation({ other_profile_id: user.id })
```

✅ **Using profile IDs from chatable endpoints**
```typescript
// CORRECT - Use contact.id from chatable_influencers/brands
createDirectConversation({ other_profile_id: contact.id })
```

❌ **Using conversation_id to create conversation**
```typescript
// WRONG - conversation_id is the result, not input
createDirectConversation({ other_profile_id: conversationId })
```

✅ **Using profile_id to create, conversation_id for WebSocket**
```typescript
// CORRECT
const conv = await createDirectConversation({ 
  other_profile_id: profileId  // Input: profile UUID
});
useConversationWebSocket({ 
  conversationId: conv.id  // Output: conversation UUID
});
```

## Summary

**Before**: System incorrectly referenced "user IDs"
**Now**: System correctly uses "profile IDs" (UUIDs) from chatable endpoints
**Backend**: Expects `other_profile_id` in request body
**Result**: Chat system now matches your backend API expectations! 🎉

---

For full implementation details, see:
- [CONVERSATION_CHAT_GUIDE.md](CONVERSATION_CHAT_GUIDE.md)
- [WEBSOCKET_CONNECTION_FLOW.md](WEBSOCKET_CONNECTION_FLOW.md)
- [WEBSOCKET_QUICK_REFERENCE.md](WEBSOCKET_QUICK_REFERENCE.md)
