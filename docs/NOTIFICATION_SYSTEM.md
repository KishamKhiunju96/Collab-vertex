# Notification System - Reference Guide

## 🔔 Overview

The notification system uses **Server-Sent Events (SSE)** for real-time notifications and a REST API for fetching historical notifications. It's designed to notify users (especially influencers) about event applications, status updates, and other important activities.

---

## 🏗️ Architecture

### Components

1. **NotificationContext** - Global state management for notifications
2. **useNotifications** - SSE connection hook for real-time updates
3. **notificationService** - API calls for CRUD operations
4. **DashboardHeader** - UI component displaying notifications

### Data Flow

```
Backend SSE Stream → useNotifications Hook → NotificationContext → UI Components
     ↓
  /notification/stream (SSE)
     ↓
  Real-time notifications pushed to frontend
```

---

## 📡 API Endpoints

### SSE Stream (Real-time)
```
GET /notification/stream
```
- **Type:** Server-Sent Events (SSE)
- **Authentication:** Required (cookies)
- **Purpose:** Real-time notification delivery
- **Response:** Stream of notification events

### Fetch All Notifications
```
GET /notification/notifications
```
- **Returns:** Array of `NotificationRead[]`
- **Purpose:** Get all notifications for current user

### Mark as Read
```
POST /notification/notifications/{notificationId}/read
```
- **Purpose:** Mark single notification as read

### Mark All as Read
```
POST /notification/notifications/mark-all-read
```
- **Purpose:** Mark all notifications as read

---

## 🎯 Notification Structure

```typescript
interface NotificationRead {
  id: string;                    // Unique notification ID
  type: string;                  // e.g., "event_application", "status_update"
  title: string;                 // Notification title
  message: string;               // Notification message/description
  data: NotificationData;        // Additional metadata
  is_read: boolean;              // Read status
  created_at: string;            // ISO timestamp
}

interface NotificationData {
  application_id?: string;       // Related application ID
  event_id?: string;             // Related event ID
  influencer_id?: string;        // Related influencer ID
  brand_id?: string;             // Related brand ID
  [key: string]: any;            // Additional custom data
}
```

---

## 💻 Usage Examples

### 1. Display Notifications in Component

```typescript
import { useNotificationContext } from '@/context/NotificationContext';

function My