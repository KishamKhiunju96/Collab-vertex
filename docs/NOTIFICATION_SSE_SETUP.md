# SSE Notification System Setup & Troubleshooting

## Overview

This application uses **Server-Sent Events (SSE)** for real-time notifications. This document explains how the system works and how to troubleshoot connection issues.

## Architecture

```
┌─────────────────┐         SSE Stream          ┌─────────────────┐
│                 │ ◄─────────────────────────── │                 │
│  React Client   │                              │  Backend API    │
│  (Next.js)      │                              │                 │
│                 │ ────────────────────────────►│                 │
└─────────────────┘    HTTP Requests with        └─────────────────┘
                       Cookies (Auth)
```

## Configuration

### API Endpoints

Configured in `src/api/apiPaths.ts`:

```typescript
BASE_URL: "https://api.dixam.me"

NOTIFICATION: {
  STREAM: "/notification/notifications/stream",      // SSE endpoint
  GET_ALL: "/notification/notifications",            // Get all notifications
  MARK_AS_READ: "/notification/notifications/{id}/read",
  MARK_ALL_AS_READ: "/notification/notifications/mark-all-read"
}
```

### Full SSE URL
```
https://api.dixam.me/notification/notifications/stream
```

## How It Works

1. **Client Connection**: The `useNotifications()` hook establishes an SSE connection on app load
2. **Authentication**: Cookies are automatically sent with `withCredentials: true`
3. **Real-time Updates**: Server pushes notifications through the SSE stream
4. **Global State**: Notifications are managed via `NotificationContext` (React Context)
5. **UI Updates**: Components subscribe to the context to display notifications

## File Structure

```
src/
├── api/
│   ├── hooks/
│   │   └── useNotifications.ts          # SSE connection logic ★
│   ├── services/
│   │   └── notificationService.ts       # API calls for notifications
│   └── apiPaths.ts                      # API endpoint configuration
├── context/
│   └── NotificationContext.tsx          # Global notification state
└── components/
    ├── InnerApp.tsx                     # Initializes SSE on app load
    ├── brand/overview/
    │   └── BrandDashboardPage.tsx       # Uses notifications
    └── influencer/dashboard/
        └── DashboardHeader.tsx          # Uses notifications
```

## Common Errors & Solutions

### ❌ Error: "SSE connection failed"

**Console Output:**
```
⚠️ SSE Notification Connection Failed
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Endpoint: https://api.dixam.me/notification/notifications/stream
• Status: Connection Closed
```

**Possible Causes:**

1. **Backend server is not running**
   - Solution: Start your backend server
   - Verify: `curl https://api.dixam.me/health` (or equivalent health check)

2. **SSE endpoint not implemented**
   - Solution: Ensure backend has SSE endpoint at `/notification/notifications/stream`
   - Check backend logs for 404 errors

3. **CORS issues**
   - Solution: Backend must allow:
     ```javascript
     Access-Control-Allow-Origin: http://localhost:3000
     Access-Control-Allow-Credentials: true
     ```

4. **Authentication/Session expired**
   - Solution: Login again to refresh your session
   - Check if cookies are being sent in browser DevTools → Network tab

5. **Backend error (5xx)**
   - Solution: Check backend logs for errors in the SSE endpoint
   - Verify database connectivity and authentication middleware

### 🔧 Temporary Solution: Disable SSE During Development

If backend is not ready, you can temporarily disable SSE:

**File:** `src/api/hooks/useNotifications.ts`

```typescript
// Set to true to disable SSE notifications
const DISABLE_SSE_NOTIFICATIONS = true;  // ← Change this to true
```

This will stop connection attempts and clear console errors.

## Debugging Checklist

### 1. Check Backend Status
```bash
curl -i https://api.dixam.me/notification/notifications/stream \
  -H "Cookie: your_session_cookie"
```

Expected response headers:
```
HTTP/1.1 200 OK
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
```

### 2. Verify Browser Console

**Successful Connection:**
```
🔔 Attempting to connect to notifications SSE: https://api.dixam.me/notification/notifications/stream
✅ SSE connection established successfully
```

**Failed Connection:**
```
⚠️ SSE Notification Connection Failed
...
```

### 3. Check Network Tab

1. Open Browser DevTools → Network tab
2. Filter by "stream" or "notification"
3. Look for the SSE request
4. Check:
   - Status Code (should be 200)
   - Request Headers (cookies present?)
   - Response Headers (Content-Type: text/event-stream?)
   - EventStream tab (see incoming events)

### 4. Verify Authentication

SSE requires authentication. Ensure:
- User is logged in
- Session cookie is valid
- Cookie is being sent with request (`withCredentials: true`)

## Backend Requirements

Your backend SSE endpoint must:

1. **Return proper headers:**
   ```http
   Content-Type: text/event-stream
   Cache-Control: no-cache
   Connection: keep-alive
   Access-Control-Allow-Origin: http://localhost:3000
   Access-Control-Allow-Credentials: true
   ```

2. **Send data in SSE format:**
   ```
   data: {"id":"123","message":"New event!","is_read":false,"created_at":"2024-01-01T12:00:00Z"}
   
   ```

3. **Keep connection alive:**
   - Send periodic heartbeat comments (`: heartbeat\n\n`)
   - Or send events when they occur

4. **Handle authentication:**
   - Verify session/JWT from cookies
   - Close connection if unauthorized

## Example Backend Implementation (Node.js)

```javascript
app.get('/notification/notifications/stream', authenticateUser, (req, res) => {
  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  // Send a comment as heartbeat every 30 seconds
  const heartbeat = setInterval(() => {
    res.write(': heartbeat\n\n');
  }, 30000);

  // Send notification when event occurs
  const sendNotification = (notification) => {
    res.write(`data: ${JSON.stringify(notification)}\n\n`);
  };

  // Example: Listen to database changes or event emitter
  notificationEmitter.on('new-notification', sendNotification);

  // Cleanup on disconnect
  req.on('close', () => {
    clearInterval(heartbeat);
    notificationEmitter.off('new-notification', sendNotification);
  });
});
```

## Testing SSE Connection

### Using curl:
```bash
curl -N -H "Cookie: sessionid=your_session" \
  https://api.dixam.me/notification/notifications/stream
```

### Using Browser:
```javascript
// Open browser console and run:
const es = new EventSource('https://api.dixam.me/notification/notifications/stream', {
  withCredentials: true
});

es.onopen = () => console.log('✅ Connected');
es.onmessage = (e) => console.log('📬 Message:', e.data);
es.onerror = (e) => console.error('❌ Error:', e);
```

## Performance Considerations

- **One Connection Per User**: SSE maintains a persistent connection
- **Connection Limit**: Browsers typically limit 6 concurrent connections per domain
- **Reconnection**: Current implementation does NOT auto-reconnect (by design)
- **Mobile**: SSE connections may drop on mobile when app goes to background

## Future Improvements

- [ ] Implement automatic reconnection with exponential backoff
- [ ] Add connection status indicator in UI
- [ ] Implement WebSocket fallback for older browsers
- [ ] Add offline notification queue
- [ ] Implement notification preferences (mute, filter)
- [ ] Add push notification support for mobile

## Support

If you continue to experience issues:

1. Check backend logs for errors
2. Verify CORS configuration
3. Test SSE endpoint with curl
4. Enable verbose logging in `useNotifications.ts`
5. Check if firewall/proxy is blocking SSE connections

## Related Files

- `src/api/hooks/useNotifications.ts` - SSE connection management
- `src/context/NotificationContext.tsx` - Global state
- `src/api/apiPaths.ts` - API configuration
- `src/components/InnerApp.tsx` - SSE initialization

---

**Last Updated:** 2024
**Version:** 1.0