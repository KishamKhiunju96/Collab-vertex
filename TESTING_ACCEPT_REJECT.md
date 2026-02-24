# Testing Guide: Accept/Reject Application Functionality

## Quick Testing Steps

### 1. Prerequisites
- Logged in as a **Brand** user
- Have at least one event created
- Have at least one influencer application for that event

### 2. Navigate to Event Applications
```
URL: /brand/events/{eventId}
Example: /brand/events/123e4567-e89b-12d3-a456-426614174000
```

### 3. Verify Application Display
Check that you can see:
- ✅ Influencer name (not "Unknown Applicant (Missing ID)")
- ✅ Event title the influencer applied for
- ✅ Status badge showing "Pending" (yellow)
- ✅ Accept button (green)
- ✅ Reject button (red)
- ✅ View Profile button (blue)

### 4. Test Accept Flow

1. **Click the "Accept" button** on a pending application
2. **Expected behavior:**
   - Button shows "Processing..." with spinner
   - Both Accept and Reject buttons become disabled
   - After 1-2 seconds, success notification appears
   - Application status changes to "Accepted" (green)
   - Accept/Reject buttons disappear (only View Profile remains)
   - Status badge shows "Accepted" with checkmark icon

3. **Check console logs:**
   ```
   Updating application: <app-id> to status: accepted
   Updating application <app-id> with payload: { status: "accepted" }
   Application <app-id> updated successfully: {...}
   Refetching applications...
   ```

### 5. Test Reject Flow

1. **Click the "Reject" button** on a different pending application
2. **Expected behavior:**
   - Button shows "Processing..." with spinner
   - Both Accept and Reject buttons become disabled
   - After 1-2 seconds, success notification appears
   - Application status changes to "Rejected" (red)
   - Accept/Reject buttons disappear (only View Profile remains)
   - Status badge shows "Rejected" with X icon

3. **Check console logs:**
   ```
   Updating application: <app-id> to status: rejected
   Updating application <app-id> with payload: { status: "rejected" }
   Application <app-id> updated successfully: {...}
   Refetching applications...
   ```

## Network Tab Verification

### Open Browser DevTools (F12) → Network Tab

1. **Filter by:** XHR/Fetch
2. **Click Accept or Reject**
3. **Find the request:** `update_application_status`

### Request Details to Verify:

#### Request URL:
```
https://api.dixam.me/event/update_application_status/{application_id}
```

#### Request Method:
```
PATCH
```

#### Request Headers:
```
Content-Type: application/json
Accept: application/json
Cookie: <your-session-cookie>
```

#### Request Payload (for Accept):
```json
{
  "status": "accepted"
}
```

#### Request Payload (for Reject):
```json
{
  "status": "rejected"
}
```

#### Response Status:
```
200 OK
```

#### Response Body (example):
```json
{
  "id": "app-uuid",
  "event_id": "event-uuid",
  "influencer_id": "influencer-uuid",
  "status": "accepted",
  "applied_at": "2024-02-24T10:11:00Z",
  "updated_at": "2024-02-24T15:30:00Z"
}
```

## Error Scenarios to Test

### 1. Test Unauthorized Access
- **Action:** Logout and try to access the page directly
- **Expected:** Redirect to login page

### 2. Test Invalid Application ID
- **Action:** Manually modify application ID in the request (using DevTools)
- **Expected:** 404 error notification "Application not found"

### 3. Test Network Failure
- **Action:** Disable internet connection and click Accept
- **Expected:** Error notification "Failed to update application status"

### 4. Test Already Processed Application
- **Action:** Accept an application, then try to accept it again
- **Expected:** No Accept/Reject buttons shown (application already processed)

## Console Debugging

### Enable Detailed Logging

All relevant logs are already implemented. Open Console and look for:

1. **Application Loading:**
   ```
   Fetching applications for event: <event-id>
   Raw applications response: [...]
   Number of applications: X
   ```

2. **Individual Application Details:**
   ```
   Application 1 - Full object: {...}
   Application 1 - Checking for embedded influencer data: {...}
   ```

3. **Status Update:**
   ```
   Updating application: <app-id> to status: accepted
   Updating application <app-id> with payload: { status: "accepted" }
   Application <app-id> updated successfully: {...}
   ```

4. **Refetch:**
   ```
   Refetching applications...
   Successfully enriched X applications
   ```

## Visual Indicators

### Pending Application:
- 🟡 Yellow status bar at top of card
- ⏰ Clock icon with "Pending" badge
- ✅ Green "Accept" button visible
- ❌ Red "Reject" button visible

### Accepted Application:
- 🟢 Green status bar at top of card
- ✓ Checkmark icon with "Accepted" badge
- 🔘 No Accept/Reject buttons (already processed)
- 💎 Sparkles icon in footer

### Rejected Application:
- 🔴 Red status bar at top of card
- ✗ X icon with "Rejected" badge
- 🔘 No Accept/Reject buttons (already processed)
- 💎 Sparkles icon in footer

## Success Criteria

✅ **All checks must pass:**

1. Influencer name displays correctly (not "Unknown Applicant")
2. Accept button works and updates status to "accepted"
3. Reject button works and updates status to "rejected"
4. Success notification appears after status update
5. UI refreshes automatically after update
6. Buttons become disabled during processing
7. Loading spinner appears during API call
8. Status badge updates correctly
9. Accept/Reject buttons disappear after processing
10. Console shows no errors

## Troubleshooting

### Issue: "Unknown Applicant (Missing ID)" shows

**Possible causes:**
- Backend not returning influencer_id in application response
- Influencer profile doesn't exist
- API endpoint `/influencer/get_influencer_by_id/{id}` failing

**Solution:**
1. Check console for error messages
2. Verify influencer_id exists in application data
3. Test influencer API endpoint directly

### Issue: Accept/Reject doesn't work

**Possible causes:**
- Application ID is missing or invalid
- User not authenticated
- CORS issues
- Backend endpoint not working

**Solution:**
1. Check Network tab for failed requests
2. Verify request URL and payload
3. Check for authentication errors (401)
4. Verify session cookie is present

### Issue: Status doesn't update in UI

**Possible causes:**
- API call successful but refetch failing
- Component not re-rendering
- Cache issues

**Solution:**
1. Check if refetch function is being called
2. Hard refresh the page (Ctrl+F5)
3. Clear browser cache

### Issue: Multiple clicks cause errors

**Possible causes:**
- Buttons not properly disabled
- Race conditions

**Solution:**
- Verify `isUpdating` and `isProcessing` states are working
- Check that buttons have `disabled` attribute when processing

## API Testing with cURL

### Test Accept:
```bash
curl https://api.dixam.me/event/update_application_status/YOUR_APP_ID \
  --request PATCH \
  --header 'Content-Type: application/json' \
  --cookie 'YOUR_SESSION_COOKIE' \
  --data '{"status": "accepted"}'
```

### Test Reject:
```bash
curl https://api.dixam.me/event/update_application_status/YOUR_APP_ID \
  --request PATCH \
  --header 'Content-Type: application/json' \
  --cookie 'YOUR_SESSION_COOKIE' \
  --data '{"status": "rejected"}'
```

### Get Session Cookie:
1. Open DevTools → Application tab
2. Go to Cookies → https://api.dixam.me
3. Copy the session cookie value

## Performance Checks

- ⏱️ Status update should complete in < 2 seconds
- 🔄 Application list should refresh in < 1 second
- 📊 No memory leaks (check DevTools Memory tab)
- 🚀 No unnecessary re-renders (check React DevTools)

## Accessibility Testing

1. **Keyboard Navigation:**
   - Tab to Accept button → Press Enter
   - Tab to Reject button → Press Enter

2. **Screen Reader:**
   - Button labels should be announced
   - Status changes should be announced

3. **Color Contrast:**
   - Green Accept button passes WCAG AA
   - Red Reject button passes WCAG AA
   - Status badges are readable

## Final Checklist

Before considering the feature complete:

- [ ] Accept functionality works
- [ ] Reject functionality works
- [ ] Success notifications appear
- [ ] Error handling works
- [ ] UI updates correctly
- [ ] No console errors
- [ ] Loading states work
- [ ] Buttons disable during processing
- [ ] Network requests are correct
- [ ] Authentication is enforced
- [ ] Response data is handled properly
- [ ] Edge cases are handled
- [ ] Performance is acceptable
- [ ] Code is documented
- [ ] Tests pass (if applicable)

---

**Note:** If any test fails, refer to the detailed flow documentation in `ACCEPT_REJECT_FLOW.md` or check the implementation in:
- `src/components/applications/ApplicationCard.tsx`
- `src/components/applications/ApplicationsList.tsx`
- `src/features/applications/services/application.service.ts`
