# Quick Reference: Accept/Reject Application

## 🚀 Quick Start

### Test the Feature
1. Login as **Brand** user
2. Go to `/brand/events/{eventId}`
3. Click **Accept** or **Reject** on any pending application
4. ✅ Done!

---

## 📡 API Details

### Endpoint
```
PATCH /event/update_application_status/{application_id}
```

### Request
```json
{
  "status": "accepted"
}
```
or
```json
{
  "status": "rejected"
}
```

### Response (200 OK)
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

---

## 📂 Key Files

### Service
```
src/features/applications/services/application.service.ts
```

### Components
```
src/components/applications/ApplicationCard.tsx
src/components/applications/ApplicationsList.tsx
```

### Types
```
src/features/applications/types/application.types.ts
```

### API Paths
```
src/api/apiPaths.ts
```

---

## 🧪 Quick Test

```bash
# Test with cURL
curl https://api.dixam.me/event/update_application_status/YOUR_APP_ID \
  --request PATCH \
  --header 'Content-Type: application/json' \
  --cookie 'YOUR_SESSION_COOKIE' \
  --data '{"status": "accepted"}'
```

---

## 🔍 Debugging

### Check Console Logs
```
Updating application: <id> to status: accepted
Application <id> updated successfully
```

### Check Network Tab
- Method: **PATCH**
- URL: `/event/update_application_status/{id}`
- Body: `{"status": "accepted"}`
- Status: **200 OK**

---

## ✅ Expected Behavior

### Before Click
- 🟡 Yellow "Pending" badge
- ✅ Green "Accept" button visible
- ❌ Red "Reject" button visible

### During Processing
- 🔄 "Processing..." text
- 🔒 Buttons disabled
- ⏳ Spinner animation

### After Success
- 🟢 Green "Accepted" badge (or 🔴 Red "Rejected")
- ✓ Success notification
- 🔘 Accept/Reject buttons hidden
- 🔄 List auto-refreshed

---

## 🐛 Common Issues

### "Unknown Applicant (Missing ID)"
✅ **FIXED** - Enhanced influencer data fetching

### Accept/Reject not working
- Check console for errors
- Verify Network tab shows PATCH request
- Ensure user is authenticated
- Check application ID is valid

### UI not updating
- Check if refetch is being called
- Hard refresh (Ctrl+F5)
- Check console for errors

---

## 📚 Full Documentation

- **Technical Flow:** `ACCEPT_REJECT_FLOW.md`
- **Testing Guide:** `TESTING_ACCEPT_REJECT.md`
- **Implementation Summary:** `IMPLEMENTATION_SUMMARY.md`

---

## 🎯 Status: ✅ COMPLETE

All functionality implemented and ready for testing!