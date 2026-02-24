# Accept/Reject Application Flow Documentation

## Overview
This document explains how the accept/reject functionality works for influencer applications in the Collab-vertex platform.

## Flow Diagram

```
User clicks "Accept" or "Reject" 
    ↓
ApplicationCard.handleStatusUpdate()
    ↓
ApplicationsList.handleUpdateStatus()
    ↓
applicationService.updateApplicationStatus()
    ↓
PATCH /event/update_application_status/{application_id}
    ↓
Backend processes request
    ↓
Success notification shown
    ↓
Applications list refreshed
```

## Components Involved

### 1. ApplicationCard Component
**Location:** `src/components/applications/ApplicationCard.tsx`

**Responsibilities:**
- Displays individual application with influencer details
- Shows Accept/Reject buttons for pending applications
- Handles loading states during update

**Key Function:**
```typescript
const handleStatusUpdate = async (status: "accepted" | "rejected") => {
  if (!application.id) {
    console.error("Application ID is missing");
    return;
  }
  setIsProcessing(true);
  try {
    await onUpdateStatus(application.id, status);
  } finally {
    setIsProcessing(false);
  }
};
```

### 2. ApplicationsList Component
**Location:** `src/components/applications/ApplicationsList.tsx`

**Responsibilities:**
- Fetches and displays all applications for an event
- Passes update handler to ApplicationCard
- Refetches data after successful update

**Key Function:**
```typescript
const handleUpdateStatus = async (
  applicationId: string,
  status: "accepted" | "rejected",
) => {
  if (!applicationId) {
    console.error("Application ID is required");
    return;
  }

  console.log("Updating application:", applicationId, "to status:", status);
  setUpdatingId(applicationId);

  try {
    const result = await applicationService.updateApplicationStatus(
      applicationId,
      { status }
    );
    console.log("Update result:", result);

    // Refetch applications after status update
    if (refetch) {
      console.log("Refetching applications...");
      await refetch();
    }
  } catch (err) {
    console.error("Failed to update status:", err);
  } finally {
    setUpdatingId(null);
  }
};
```

### 3. Application Service
**Location:** `src/features/applications/services/application.service.ts`

**Responsibilities:**
- Makes PATCH request to backend API
- Handles errors and shows notifications
- Returns updated application data

**Implementation:**
```typescript
export const applicationService = {
  async updateApplicationStatus(
    applicationId: string,
    payload: UpdateApplicationStatusPayload,
  ) {
    try {
      console.log(
        `Updating application ${applicationId} with payload:`,
        payload,
      );

      const { data } = await apiClient.patch(
        API_PATHS.EVENT.UPDATE_APPLICATION_STATUS(applicationId),
        payload,
      );

      console.log(`Application ${applicationId} updated successfully:`, data);

      // Show success notification
      const statusText =
        payload.status === "accepted" ? "accepted" : "rejected";
      notify.success(`Application ${statusText} successfully!`);

      return data;
    } catch (error: unknown) {
      const err = error as {
        response?: { status?: number; data?: { message?: string } };
      };
      console.error("Failed to update application status:", error);

      if (err?.response?.status === 404) {
        notify.error("Application not found.");
        throw new Error("Application not found");
      } else if (err?.response?.status === 422) {
        notify.error("Invalid status value.");
        throw new Error("Invalid status");
      } else if (err?.response?.status === 401) {
        notify.error("Unauthorized. Please log in again.");
        throw new Error("Unauthorized");
      } else {
        notify.error("Failed to update application status.");
        throw error;
      }
    }
  },
};
```

## API Endpoint

### PATCH `/event/update_application_status/{application_id}`

**Base URL:** `https://api.dixam.me`

**Path Parameter:**
- `application_id` (string, required): The UUID of the application to update

**Request Headers:**
- `Content-Type: application/json`
- `Cookies`: Session cookie for authentication (handled automatically)

**Request Body:**
```json
{
  "status": "accepted"
}
```
OR
```json
{
  "status": "rejected"
}
```

**Success Response (200 OK):**
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "event_id": "event-uuid",
  "influencer_id": "influencer-uuid",
  "status": "accepted",
  "applied_at": "2024-02-24T10:11:00Z",
  "updated_at": "2024-02-24T15:30:00Z"
}
```

**Error Responses:**

- **401 Unauthorized:** User not authenticated
```json
{
  "error": "Unauthorized",
  "message": "Please log in to continue"
}
```

- **404 Not Found:** Application doesn't exist
```json
{
  "error": "Not Found",
  "message": "Application not found"
}
```

- **422 Unprocessable Entity:** Invalid status value
```json
{
  "error": "Validation Error",
  "message": "Status must be 'accepted' or 'rejected'"
}
```

## API Path Configuration

**Location:** `src/api/apiPaths.ts`

```typescript
export const API_PATHS = {
  EVENT: {
    // ... other paths
    UPDATE_APPLICATION_STATUS: (applicationId: string) =>
      `/event/update_application_status/${applicationId}`,
  },
};
```

## Type Definitions

**Location:** `src/features/applications/types/application.types.ts`

```typescript
export type ApplicationStatus = "pending" | "accepted" | "rejected";

export interface UpdateApplicationStatusPayload {
  status: ApplicationStatus;
}
```

## cURL Example

```bash
# Accept an application
curl https://api.dixam.me/event/update_application_status/123e4567-e89b-12d3-a456-426614174000 \
  --request PATCH \
  --header 'Content-Type: application/json' \
  --header 'Cookie: your-session-cookie' \
  --data '{
    "status": "accepted"
  }'

# Reject an application
curl https://api.dixam.me/event/update_application_status/123e4567-e89b-12d3-a456-426614174000 \
  --request PATCH \
  --header 'Content-Type: application/json' \
  --header 'Cookie: your-session-cookie' \
  --data '{
    "status": "rejected"
  }'
```

## Error Handling

The application handles errors at multiple levels:

1. **Component Level:** 
   - Shows loading states
   - Disables buttons during processing
   - Displays error messages via notifications

2. **Service Level:**
   - Catches HTTP errors
   - Maps error codes to user-friendly messages
   - Logs detailed error information for debugging

3. **API Level:**
   - Axios interceptors handle 401 errors globally
   - Automatic redirect to login on authentication failure

## Testing

To test the accept/reject functionality:

1. **Login as a brand user**
2. **Navigate to an event with applications:**
   `/brand/events/{eventId}`
3. **Click "Accept" or "Reject" on a pending application**
4. **Verify:**
   - Loading spinner appears
   - Success notification shows
   - Application status updates in the UI
   - Button changes to reflect new status

## Debugging

If the accept/reject is not working, check:

1. **Console Logs:**
   - Application ID is valid
   - Request payload is correct
   - API endpoint URL is correct
   - Response status and data

2. **Network Tab:**
   - Request method is PATCH
   - Content-Type header is set
   - Request body contains `{"status": "accepted"}` or `{"status": "rejected"}`
   - Session cookie is present

3. **Backend Logs:**
   - Application exists in database
   - User has permission to update the application
   - Status value is valid

## Recent Changes

### Enhanced Influencer Data Fetching
**Date:** Current session
**Changes:**
- Added support for embedded influencer data in application responses
- Improved error handling with detailed logging
- Added fallback mechanisms when influencer profile fetch fails
- Better type definitions for raw application responses

### API Path Integration
**Date:** Current session
**Changes:**
- Updated application service to use `API_PATHS` constant
- Ensured consistent API endpoint usage across codebase
- Added detailed console logging for debugging

## Security Considerations

1. **Authentication:** All requests require valid session cookie
2. **Authorization:** Backend should verify user owns the event before allowing status updates
3. **Validation:** Status values are validated on both frontend and backend
4. **Rate Limiting:** Backend should implement rate limiting to prevent abuse

## Future Improvements

1. **Optimistic Updates:** Update UI immediately, rollback on error
2. **Batch Operations:** Accept/reject multiple applications at once
3. **Undo Functionality:** Allow brands to undo recent status changes
4. **Email Notifications:** Notify influencers when their application is accepted/rejected
5. **Audit Trail:** Log all status changes for compliance