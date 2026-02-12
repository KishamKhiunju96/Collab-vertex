# Event Application Feature - Implementation Guide

## Overview
This document describes the implementation of the event application feature in the Influencer Dashboard, allowing influencers to apply to events using the `/event/apply_event` API endpoint.

## Changes Made

### 1. Updated Event Service (`src/api/services/eventService.ts`)

#### Added Types:
```typescript
export interface ApplyEventPayload {
  event_id: string;
  influencer_id: string;
}

export interface ApplyEventResponse {
  message: string;
  application_id?: string;
}
```

#### Added API Endpoint:
```typescript
APPLY_EVENT: "/event/apply_event"
```

#### Added Service Method:
```typescript
async applyEvent(payload: ApplyEventPayload): Promise<ApplyEventResponse>
```

This method:
- Makes a POST request to `https://api.dixam.me/event/apply_event`
- Sends `event_id` and `influencer_id` in the request body
- Returns the API response with a success message

---

### 2. Updated Event Cards Component (`src/components/influencer/dashboard/EventCards.tsx`)

#### New Imports:
```typescript
import { useUserData } from "@/api/hooks/useUserData";
import { useInfluencerProfile } from "@/api/hooks/useInfluencerProfile";
import { notify } from "@/utils/notify";
```

#### New State:
```typescript
const [applyingEventId, setApplyingEventId] = useState<string | null>(null);
```
- Tracks which event is currently being applied to
- Prevents duplicate submissions
- Provides loading state for UI feedback

#### New Handler Function:
```typescript
const handleApplyToEvent = async (eventId: string)
```

**Features:**
- ✅ Validates that the influencer has a complete profile
- ✅ Validates that the user is logged in
- ✅ Shows loading state on the button while applying
- ✅ Calls the `eventService.applyEvent()` API
- ✅ Shows success toast notification
- ✅ Shows error toast notification with API error details
- ✅ Handles errors gracefully

#### Updated Button:
```typescript
<button
  className="w-full rounded-lg bg-black text-white py-2 text-sm hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
  onClick={() => handleApplyToEvent(event.id)}
  disabled={applyingEventId === event.id}
>
  {applyingEventId === event.id ? "Applying..." : "Apply to Event"}
</button>
```

**Features:**
- Dynamic button text (shows "Applying..." during submission)
- Disabled state while applying
- Visual feedback with disabled styles
- Smooth transitions

---

## User Flow

### When Influencer Clicks "Apply to Event":

1. **Validation Checks:**
   - ✅ Check if influencer profile exists
   - ✅ Check if user is authenticated
   - Show error notification if validation fails

2. **API Call:**
   - Set loading state (button shows "Applying...")
   - Send POST request to `/event/apply_event`
   - Payload: `{ event_id, influencer_id }`

3. **Success Response:**
   - Show success toast: "Successfully applied to event!"
   - Clear loading state

4. **Error Response:**
   - Show error toast with API error message
   - Log error to console for debugging
   - Clear loading state

---

## API Integration

### Endpoint Details:
- **URL:** `https://api.dixam.me/event/apply_event`
- **Method:** POST
- **Headers:** `Content-Type: application/json`
- **Authentication:** Uses HttpOnly cookies (handled by axios interceptor)

### Request Payload:
```json
{
  "event_id": "string",
  "influencer_id": "string"
}
```

### Response:
```json
{
  "message": "string",
  "application_id": "string" // optional
}
```

---

## Error Handling

### Validation Errors:
- **No Profile:** "Please complete your influencer profile first"
- **Not Logged In:** "Please log in to apply to events"

### API Errors:
- Displays the error message from `err?.response?.data?.detail`
- Fallback: "Failed to apply to event"
- All errors are logged to console for debugging

---

## User Experience Features

1. **Loading States:**
   - Button shows "Applying..." during submission
   - Button is disabled to prevent duplicate clicks
   - Visual feedback with opacity change

2. **Toast Notifications:**
   - Success notifications for successful applications
   - Error notifications with clear error messages
   - Uses `react-hot-toast` library

3. **Validation:**
   - Prevents application without profile
   - Prevents application without authentication
   - Shows helpful error messages

4. **Accessibility:**
   - Disabled button has `disabled:cursor-not-allowed`
   - Clear visual states (normal, hover, disabled)
   - Descriptive button text

---

## File Structure

```
Collab-vertex/
├── src/
│   ├── api/
│   │   ├── services/
│   │   │   └── eventService.ts        ← Updated: Added applyEvent()
│   │   └── hooks/
│   │       ├── useUserData.ts         ← Used for user authentication
│   │       └── useInfluencerProfile.ts ← Used for profile validation
│   ├── components/
│   │   └── influencer/
│   │       └── dashboard/
│   │           └── EventCards.tsx     ← Updated: Added apply functionality
│   └── utils/
│       └── notify.ts                  ← Used for toast notifications
```

---

## Testing Checklist

- [ ] Influencer can click "Apply to Event" button
- [ ] Button shows "Applying..." during submission
- [ ] Button is disabled during submission
- [ ] Success toast appears on successful application
- [ ] Error toast appears on failed application
- [ ] Validation prevents application without profile
- [ ] Validation prevents application without login
- [ ] Multiple rapid clicks don't cause duplicate applications
- [ ] Error messages are clear and helpful

---

## Future Enhancements

1. **Application Status Tracking:**
   - Show "Applied" badge on events already applied to
   - Disable apply button for already applied events
   - Track application status (pending, accepted, rejected)

2. **Application History:**
   - Create a page to view all applications
   - Show application timeline
   - Allow withdrawal of applications

3. **Notifications:**
   - Email notification on successful application
   - Push notifications for application status changes

4. **Analytics:**
   - Track application success rates
   - Show event popularity metrics
   - Recommend similar events

---

## Related Files

- **API Service:** `src/api/services/eventService.ts`
- **Component:** `src/components/influencer/dashboard/EventCards.tsx`
- **Page:** `src/app/dashboard/influencer/page.tsx`
- **Hooks:** `src/api/hooks/useUserData.ts`, `src/api/hooks/useInfluencerProfile.ts`
- **Utilities:** `src/utils/notify.ts`

---

## Support

For issues or questions:
1. Check console logs for detailed error messages
2. Verify influencer profile is complete
3. Verify user authentication status
4. Check network tab for API response details