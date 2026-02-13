# Notification Stream Refetch Implementation

## 📋 Overview

This document describes the implementation of the notification stream refetch functionality, specifically triggered when a user marks all notifications as read.

## 🎯 Goal

Enable the notification system to reconnect the SSE (Server-Sent Events) stream after the user executes "Mark All as Read", ensuring fresh data synchronization between client and server.

---

## 🏗️ Architecture Changes

### **Before: Loose Coupling**

```
InnerApp.tsx
  └─> useNotifications() ──> SSE Connection (no return value)
  
NotificationContext.tsx
  └─> State Management (no SSE control)
```

**Problem:** NotificationContext had no way to control the SSE connection.

---

### **After: Integrated Control**

```
NotificationContext.tsx
  ├─> useNotifications() ──> Returns SSE Controls
  │     └─> reconnect()
  │     └─> disconnect()
  │     └─> isConnected
  │
  └─> State Management + SSE Control
        └─> Can trigger reconnect when needed
```

**Solution:** SSE hook now returns control methods that Context can use imperatively.

---

## 🔧 Implementation Details

### **1. Modified `useNotifications.ts` Hook**

**Key Changes:**

- **Returns SSE Controls** instead of void:
  ```typescript
  export interface SSEControls {
    reconnect: () => void;
    disconnect: () => void;
    isConnected: boolean;
  }
  
  export const useNotifications = (): SSEControls
  ```

- **Exposed `reconnect()` method:**
  - Closes existing EventSource connection
  - Clears pending reconnection timeouts
  - Resets reconnection attempt counter
  - Triggers fresh connection

- **Exposed `disconnect()` method:**
  - Manually closes SSE connection
  - Useful for cleanup or manual control

- **Added `isConnected` state:**
  - Tracks connection status using React state
  - Updates when connection opens/closes
  - Safe to use in render (not a ref)

---

### **2. Enhanced `NotificationContext.tsx`**

**Key Changes:**

- **Initializes SSE internally:**
  ```typescript
  const sseControls = useNotifications();
  ```
  - SSE now managed by Context (not InnerApp)
  - Direct access to SSE control methods

- **Added `reconnectStream()` to context API:**
  ```typescript
  interface NotificationContextProps {
    // ... existing properties
    reconnectStream: () => void;
  }
  ```
  - Exposes SSE reconnect to consumers
  - Can be called from any component

- **Modified `markAllAsRead()` flow:**
  ```typescript
  const markAllAsRead = async () => {
    try {
      // 1. Optimistic UI update
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);

      // 2. Call backend API
      await markAllNotificationsAsRead();

      // 3. Fetch latest state via REST
      await loadNotifications();

      // 4. Reconnect SSE stream for fresh connection
      console.log("🔄 Reconnecting notification stream after mark all as read");
      sseControls.reconnect();
    } catch (error) {
      // Error handling...
      await loadNotifications();
    }
  };
  ```

---

### **3. Cleaned Up Duplicate Calls**

**Removed from:**
- ✅ `InnerApp.tsx` - No longer calls `useNotifications()`
- ✅ `BrandDashboardPage.tsx` - Removed duplicate initialization

**Why?** SSE is now initialized once in `NotificationContext` and available globally.

---

## 📊 Data Flow

### **Mark All as Read Flow:**

```
User clicks "Mark All as Read"
         ↓
markAllAsRead() in Context
         ↓
1. Optimistic Update (all notifications → is_read: true)
         ↓
2. API Call: POST /notification/mark-all-read
         ↓
3. Fetch Fresh Data: GET /notification (REST API)
         ↓
4. Reconnect SSE Stream (sseControls.reconnect())
         ↓
   a. Close existing EventSource
   b. Clear reconnection attempts
   c. Open fresh SSE connection
         ↓
5. SSE resumes listening for new notifications
         ↓
UI reflects updated state + fresh stream ready
```

---

## 🔍 Why Both REST Fetch + SSE Reconnect?

### **REST API Fetch (`loadNotifications()`):**
- ✅ Gets current state immediately
- ✅ Ensures UI has latest data from server
- ✅ Handles any missed updates
- ✅ Synchronous pull of data

### **SSE Reconnect (`sseControls.reconnect()`):**
- ✅ Establishes fresh push connection
- ✅ Ensures no stale connection issues
- ✅ Resets any internal SSE state
- ✅ Ready for future real-time updates

**Together:** Provides both immediate sync (REST) and future updates (SSE).

---

## 🎛️ Available Control Methods

Components can now use:

```typescript
const {
  notifications,
  unreadCount,
  markAsRead,
  markAllAsRead,        // ← Automatically refetches stream
  refetchNotifications, // ← REST API only
  reconnectStream,      // ← Manual SSE reconnect
  loading
} = useNotificationContext();
```

### **Usage Examples:**

**1. Manual Refresh Button:**
```typescript
const handleManualRefresh = async () => {
  await refetchNotifications(); // Fetch latest via REST
  reconnectStream();            // Reconnect SSE
};
```

**2. After Error Recovery:**
```typescript
try {
  await someOperation();
} catch (error) {
  // Sync data after error
  reconnectStream();
}
```

**3. Mark All as Read (automatic):**
```typescript
await markAllAsRead();
// Automatically does REST fetch + SSE reconnect
```

---

## ✅ Benefits

### **1. Imperative Control**
- Can manually trigger SSE reconnection when needed
- Not limited to automatic reconnection on errors

### **2. Data Consistency**
- REST API ensures immediate sync
- SSE reconnect ensures fresh stream
- No risk of stale data after mutations

### **3. Clean Architecture**
- SSE management centralized in Context
- No duplicate hook calls across components
- Clear separation of concerns

### **4. Better UX**
- Optimistic updates for instant feedback
- Background sync ensures correctness
- Fresh stream ready for new notifications

---

## 🐛 Debugging

### **Check Connection Status:**
```typescript
const { reconnectStream } = useNotificationContext();

// In console:
// "🔄 Manual stream reconnection triggered"
// "🔔 Connecting to notification stream: ..."
// "✅ Notification stream connected"
```

### **Verify Stream Reconnect:**
Look for these logs after marking all as read:
```
🔄 Reconnecting notification stream after mark all as read
🔄 Manual reconnect requested
🔌 Closing notification stream
🔔 Connecting to notification stream: https://...
✅ Notification stream connected
```

---

## 🔄 Migration Notes

If you're upgrading from the previous implementation:

### **Old Code:**
```typescript
// InnerApp.tsx
useNotifications(); // Multiple calls in different components

// NotificationContext.tsx
await markAllNotificationsAsRead();
// ❌ No way to refetch stream
```

### **New Code:**
```typescript
// NotificationContext.tsx handles everything
const sseControls = useNotifications();

await markAllNotificationsAsRead();
await loadNotifications();
sseControls.reconnect(); // ✅ Can control SSE
```

**Components automatically benefit** - no changes needed in consuming components!

---

## 📝 Testing

### **Test Cases:**

1. ✅ Mark single notification as read → No stream reconnect
2. ✅ Mark all as read → Stream reconnects automatically
3. ✅ Manual reconnect via `reconnectStream()` → Works
4. ✅ Connection lost → Auto-reconnect with backoff
5. ✅ Multiple tabs → Each maintains own SSE connection
6. ✅ Component unmount → Proper cleanup

---

## 🚀 Future Enhancements

Potential improvements:

1. **Connection State in UI:**
   ```typescript
   const { isConnected } = sseControls;
   // Show green/red indicator
   ```

2. **Reconnect with Sync:**
   ```typescript
   const refreshAll = async () => {
     await refetchNotifications();
     reconnectStream();
   };
   ```

3. **Circuit Breaker Pattern:**
   - Stop reconnecting after too many failures
   - Show manual retry button

4. **Cross-Tab Sync:**
   - Use BroadcastChannel API
   - Sync state across browser tabs

---

## 📚 Related Files

- `src/api/hooks/useNotifications.ts` - SSE connection management
- `src/context/NotificationContext.tsx` - State + SSE control
- `src/api/services/notificationService.ts` - REST API calls
- `src/components/InnerApp.tsx` - App initialization

---

## 🎯 Summary

The notification stream refetch feature provides:

✅ **Imperative SSE control** via returned methods  
✅ **Automatic refetch** on mark all as read  
✅ **Data consistency** via REST + SSE combo  
✅ **Clean architecture** with centralized management  
✅ **Better UX** with optimistic updates + background sync  

The system now has full control over both state management (REST) and real-time updates (SSE), enabling robust notification handling throughout the application.