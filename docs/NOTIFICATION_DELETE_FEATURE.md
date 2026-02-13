# Notification Delete Feature Documentation

## 📋 Overview

This document describes the implementation of the delete notification feature, allowing users to remove individual notifications from their notification list.

---

## 🎯 Feature Goal

Enable users to delete individual notifications by clicking a delete button (trash icon) on each notification item.

---

## 🔧 Implementation Details

### **1. API Endpoint**

**Endpoint:** `DELETE /notification/{notification_id}`

**Example:**
```bash
curl https://api.dixam.me/notification/123e4567-e89b-12d3-a456-426614174000 \
  --request DELETE \
  --header "Cookie: session_cookie" \
  --header "Content-Type: application/json"
```

**Response:**
- Success: `200 OK` with deleted notification data
- Error: `404 Not Found` if notification doesn't exist
- Error: `403 Forbidden` if user doesn't own the notification

---

### **2. API Path Configuration**

**File:** `src/api/apiPaths.ts`

Added DELETE endpoint to NOTIFICATION paths:

```typescript
NOTIFICATION: {
  STREAM: "/notification/stream",
  GET_ALL: "/notification",
  GET_UNREAD_COUNT: "/notification/unread-count",
  MARK_AS_READ: (notificationId: string) =>
    `/notification/${notificationId}/read`,
  MARK_ALL_AS_READ: "/notification/mark-all-read",
  DELETE: (notificationId: string) => `/notification/${notificationId}`, // ✅ NEW
}
```

---

### **3. Notification Service**

**File:** `src/api/services/notificationService.ts`

Added `deleteNotification` function:

```typescript
export const deleteNotification = async (notificationId: string) => {
  const { data } = await api.delete(
    API_PATHS.NOTIFICATION.DELETE(notificationId),
  );
  return data;
};
```

---

### **4. NotificationContext**

**File:** `src/context/NotificationContext.tsx`

#### **Interface Update:**

```typescript
interface NotificationContextProps {
  notifications: NotificationRead[];
  unreadCount: number;
  addNotification: (notification: NotificationRead) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>; // ✅ NEW
  refetchNotifications: () => Promise<void>;
  reconnectStream: () => void;
  loading: boolean;
}
```

#### **Implementation:**

```typescript
const deleteNotificationHandler = useCallback(
  async (id: string) => {
    try {
      // Find the notification to check if it was unread
      const notificationToDelete = notifications.find((n) => n.id === id);
      const wasUnread = notificationToDelete && !notificationToDelete.is_read;

      // Optimistically remove from UI
      setNotifications((prev) => prev.filter((n) => n.id !== id));

      // Decrement unread count if it was unread
      if (wasUnread) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }

      // Call API to delete
      await deleteNotification(id);
    } catch (error) {
      console.error("Failed to delete notification:", error);

      // Reload notifications to restore correct state
      await loadNotifications();
    }
  },
  [notifications, loadNotifications],
);
```

**Key Features:**
- ✅ **Optimistic Update:** Removes notification from UI immediately
- ✅ **Unread Count Adjustment:** Decrements if deleted notification was unread
- ✅ **Error Handling:** Refetches all notifications if delete fails
- ✅ **State Restoration:** Ensures UI shows correct state on error

---

### **5. NotificationItem Component**

**File:** `src/components/notifications/NotificationItem.tsx`

#### **Changes:**

1. **Added `onDelete` prop:**
```typescript
interface Props {
  notification: NotificationRead;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void; // ✅ NEW
}
```

2. **Added delete button with Trash2 icon:**
```tsx
<button
  onClick={() => onDelete(notification.id)}
  className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition"
  title="Delete notification"
>
  <Trash2 size={16} />
</button>
```

3. **Improved layout:**
   - Flexbox layout with notification content on left
   - Delete button on right (always visible)
   - Hover effects for better UX

---

### **6. NotificationList Component**

**File:** `src/components/notifications/NotificationList.tsx`

**Changes:**

```typescript
const { notifications, markAsRead, deleteNotification } =
  useNotificationContext();

// Pass deleteNotification to each item
<NotificationItem
  key={n.id}
  notification={n}
  onMarkAsRead={markAsRead}
  onDelete={deleteNotification} // ✅ NEW
/>
```

---

### **7. DashboardHeader Component**

**File:** `src/components/influencer/dashboard/DashboardHeader.tsx`

#### **Changes:**

1. **Added deleteNotification from context:**
```typescript
const {
  notifications,
  unreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification, // ✅ NEW
  loading,
} = useNotificationContext();
```

2. **Added delete handler:**
```typescript
const handleDeleteNotification = async (notifId: string) => {
  await deleteNotification(notifId);
};
```

3. **Updated notification item layout:**
   - Wrapped content in clickable div for "mark as read"
   - Added delete button on the right side
   - Used `e.stopPropagation()` to prevent marking as read when deleting

```tsx
<div className="flex items-start justify-between gap-2">
  <div
    className="flex-1 cursor-pointer"
    onClick={() => handleMarkNotification(notif.id)}
    title="Click to mark as read"
  >
    {/* Notification content */}
  </div>
  
  <button
    onClick={(e) => {
      e.stopPropagation();
      handleDeleteNotification(notif.id);
    }}
    className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition flex-shrink-0"
    title="Delete notification"
  >
    <Trash2 size={16} />
  </button>
</div>
```

---

### **8. BrandDashboardPage Component**

**File:** `src/components/brand/overview/BrandDashboardPage.tsx`

**Changes:** Same as DashboardHeader - added delete functionality to brand dashboard notifications dropdown.

---

## 📊 Data Flow

### **Delete Notification Flow:**

```
User clicks delete button (trash icon)
         ↓
deleteNotification(id) called in Context
         ↓
1. Find notification to check if unread
         ↓
2. Optimistic Update:
   - Remove from notifications array
   - Decrement unreadCount if was unread
         ↓
3. API Call: DELETE /notification/{id}
         ↓
4a. Success:
    ✅ Notification removed
    ✅ UI already updated (optimistic)
    ✅ Unread count adjusted
         ↓
4b. Failure:
    ❌ API call failed
    ❌ Refetch all notifications
    ❌ Restore correct state
    ❌ Show error in console
         ↓
5. UI reflects final state
```

---

## 🎨 UI/UX Design

### **Delete Button:**

- **Icon:** Trash2 from lucide-react
- **Size:** 16px
- **Color:** Red (`text-red-500`)
- **Hover:** Darker red (`hover:text-red-700`)
- **Background:** Red tint on hover (`hover:bg-red-50`)
- **Position:** Top-right corner of each notification
- **Accessibility:** 
  - `title` attribute for tooltip
  - `e.stopPropagation()` prevents accidental mark as read

### **Layout:**

```
┌─────────────────────────────────────────────┐
│ ┌─────────────────────────────────┐  [🗑️]  │
│ │ Notification Title               │        │
│ │ Notification message text here   │        │
│ │ 2024-01-15 10:30 AM             │        │
│ │ ● New                            │        │
│ └─────────────────────────────────┘        │
└─────────────────────────────────────────────┘
```

---

## ✅ Benefits

### **1. User Control**
- Users can remove irrelevant or old notifications
- Keeps notification list clean and manageable

### **2. Optimistic Updates**
- Instant feedback - no waiting for API response
- Better perceived performance

### **3. Smart Unread Count**
- Automatically decrements if deleted notification was unread
- Always shows accurate unread count

### **4. Error Recovery**
- Gracefully handles API failures
- Restores correct state by refetching

### **5. Consistent UX**
- Delete button available in all notification views:
  - Influencer Dashboard
  - Brand Dashboard
  - Notification List component

---

## 🧪 Testing

### **Test Cases:**

1. ✅ **Delete unread notification:**
   - Notification removed from list
   - Unread count decrements by 1
   - Badge updates correctly

2. ✅ **Delete read notification:**
   - Notification removed from list
   - Unread count stays the same

3. ✅ **Delete with API failure:**
   - Shows error in console
   - Refetches notifications
   - UI shows correct state

4. ✅ **Delete last notification:**
   - Shows "No notifications" message
   - Unread count becomes 0

5. ✅ **Delete doesn't trigger mark as read:**
   - Clicking delete icon only deletes
   - Doesn't mark as read

6. ✅ **Multiple rapid deletes:**
   - Optimistic updates work correctly
   - No race conditions

---

## 🎯 Usage Examples

### **Component Usage:**

```typescript
import { useNotificationContext } from "@/context/NotificationContext";

function MyComponent() {
  const { notifications, deleteNotification } = useNotificationContext();

  const handleDelete = async (id: string) => {
    await deleteNotification(id);
    // Optimistic update already done
    // Show success toast if needed
  };

  return (
    <div>
      {notifications.map((notif) => (
        <div key={notif.id}>
          <p>{notif.message}</p>
          <button onClick={() => handleDelete(notif.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
```

### **With Confirmation Dialog:**

```typescript
const handleDelete = async (id: string) => {
  const confirmed = window.confirm(
    "Are you sure you want to delete this notification?"
  );
  
  if (confirmed) {
    await deleteNotification(id);
  }
};
```

---

## 🚀 Future Enhancements

Potential improvements:

### **1. Bulk Delete:**
```typescript
const deleteBulkNotifications = async (ids: string[]) => {
  // Delete multiple notifications at once
};
```

### **2. Undo Delete:**
```typescript
const undoDelete = (notification: NotificationRead) => {
  // Restore recently deleted notification
};
```

### **3. Confirmation Dialog:**
- Optional confirmation before delete
- Prevent accidental deletions

### **4. Delete All Read:**
```typescript
const deleteAllRead = async () => {
  // Delete all read notifications
};
```

### **5. Archive Instead of Delete:**
- Soft delete (archive) notifications
- Keep in database but hide from UI
- Allow viewing archived notifications

### **6. Swipe to Delete (Mobile):**
- Gesture support for mobile devices
- Swipe left to reveal delete button

---

## 📚 Related Files

- `src/api/apiPaths.ts` - API endpoint configuration
- `src/api/services/notificationService.ts` - API calls
- `src/context/NotificationContext.tsx` - State management + delete logic
- `src/components/notifications/NotificationItem.tsx` - Individual notification UI
- `src/components/notifications/NotificationList.tsx` - Notification list
- `src/components/influencer/dashboard/DashboardHeader.tsx` - Influencer notifications
- `src/components/brand/overview/BrandDashboardPage.tsx` - Brand notifications

---

## 🎯 Summary

The delete notification feature provides:

✅ **User Control** - Remove unwanted notifications  
✅ **Optimistic Updates** - Instant UI feedback  
✅ **Smart Unread Count** - Auto-adjusts on delete  
✅ **Error Recovery** - Graceful handling of failures  
✅ **Consistent UX** - Available in all notification views  
✅ **Clean API** - Simple one-line usage  

The implementation follows React best practices with optimistic updates, proper error handling, and clean separation of concerns between API, state management, and UI components.