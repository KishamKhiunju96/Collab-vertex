# Event Application Issue - Fix Documentation

## Issue Description

When clicking the "Apply to Event" button, users were seeing the error message:
> "Please log in to apply to events"

Even though they were already logged in and had created an influencer profile.

## Root Cause

The issue was caused by multiple problems:

1. **Wrong validation order**: The code was checking `!user?.id` before checking if the profile existed, but the actual issue was that it should check `!user` first.

2. **Incorrect profile type**: The `useInfluencerProfile` hook was using `CreateInfluencerPayload` type which has `id` as optional (`id?: string`), but we need the `id` to always be present for applying to events.

3. **Using wrong API method**: The hook was calling `getProfileByUser()` which returns `CreateInfluencerPayload | null`, instead of `getProfile()` which returns `InfluencerProfile` with required `id`.

4. **Race condition**: The profile might still be loading when the user clicks the button, but there was no check for the loading state.

## Changes Made

### 1. Updated `useInfluencerProfile` Hook (`src/api/hooks/useInfluencerProfile.ts`)

**Before:**
```typescript
const [profile, setProfile] = useState<CreateInfluencerPayload | null>(null);

const data = await influencerService.getProfileByUser(); // Returns type with optional id
if (data?.id) setProfile(data);
```

**After:**
```typescript
const [profile, setProfile] = useState<InfluencerProfile | null>(null);

const data = await influencerService.getProfile(); // Returns type with required id
setProfile(data);
```

**Key Changes:**
- ✅ Changed profile state type from `CreateInfluencerPayload` to `InfluencerProfile`
- ✅ Using `getProfile()` method which returns `InfluencerProfile` with required `id` field
- ✅ Removed conditional check `if (data?.id)` since `InfluencerProfile.id` is always required
- ✅ Better error handling with console logging

### 2. Updated Event Cards Component (`src/components/influencer/dashboard/EventCards.tsx`)

**Before:**
```typescript
const handleApplyToEvent = async (eventId: string) => {
  if (!profile?.id) {
    notify.error("Please complete your influencer profile first");
    return;
  }

  if (!user?.id) {
    notify.error("Please log in to apply to events");
    return;
  }
  // ... rest of code
}
```

**After:**
```typescript
const handleApplyToEvent = async (eventId: string) => {
  // Wait for profile to finish loading
  if (profileLoading) {
    notify.info("Loading your profile, please wait...");
    return;
  }

  // Check if user is authenticated
  if (!user) {
    notify.error("Please log in to apply to events");
    return;
  }

  // Check if influencer profile exists
  if (!profile || !profile.id) {
    notify.error("Please complete your influencer profile first");
    return;
  }
  // ... rest of code
}
```

**Key Changes:**
- ✅ Added loading state check first to prevent premature validation
- ✅ Reordered validation: check user authentication before profile
- ✅ Changed `!user?.id` to `!user` for simpler, more reliable check
- ✅ Added explicit check for both `!profile` AND `!profile.id`
- ✅ Added debug logging to help troubleshoot issues
- ✅ Updated button disabled state to include `profileLoading`
- ✅ Updated button text to show "Loading..." when profile is loading

### 3. Button State Improvements

**Before:**
```typescript
<button
  disabled={applyingEventId === event.id}
>
  {applyingEventId === event.id ? "Applying..." : "Apply to Event"}
</button>
```

**After:**
```typescript
<button
  disabled={applyingEventId === event.id || profileLoading}
>
  {profileLoading
    ? "Loading..."
    : applyingEventId === event.id
      ? "Applying..."
      : "Apply to Event"}
</button>
```

**Features:**
- Button is disabled while profile is loading
- Shows "Loading..." while profile loads
- Shows "Applying..." during submission
- Shows "Apply to Event" when ready

## Type Definitions

### CreateInfluencerPayload
```typescript
interface CreateInfluencerPayload {
  id?: string; // ❌ OPTIONAL - used for creating profiles
  name: string;
  niche: string;
  audience_size: number;
  engagement_rate: number;
  bio: string;
  location: string;
}
```

### InfluencerProfile
```typescript
interface InfluencerProfile {
  id: string; // ✅ REQUIRED - used for existing profiles
  name: string;
  niche: string;
  audience_size: number;
  engagement_rate: number;
  bio: string;
  location: string;
  created_at: string;
  updated_at: string;
}
```

## Debug Information

When clicking "Apply to Event", the console will now show:

```
=== Apply Event Debug ===
User: { id: "...", username: "...", role: "influencer", ... }
Profile: { id: "...", name: "...", niche: "...", ... }
Profile Loading: false
Event ID: "event-123"
========================
```

If validation fails, you'll see specific error messages:
- `Validation failed: User not found`
- `Validation failed: Profile not found or missing ID`

## Testing Steps

1. **Log in as an influencer**
   - Ensure you have a valid session
   - Check browser console for user object

2. **Verify profile exists**
   - Navigate to influencer dashboard
   - Check browser console for profile object
   - Verify profile has an `id` field

3. **Click "Apply to Event"**
   - Button should not show loading state if profile is already loaded
   - Should see debug logs in console
   - Should see success message if everything is correct

4. **Check for errors**
   - If you see "Loading your profile, please wait..." - profile is still loading
   - If you see "Please log in..." - user session is invalid
   - If you see "Please complete your profile..." - profile doesn't exist or missing ID

## Common Issues & Solutions

### Issue: "Loading your profile, please wait..."
**Cause:** Profile is still being fetched from API
**Solution:** Wait a moment and try again. If it persists, check network tab for API errors.

### Issue: "Please log in to apply to events"
**Cause:** User object is null or undefined
**Solution:** 
- Check if session cookie is valid
- Try logging out and logging back in
- Check browser console for authentication errors

### Issue: "Please complete your influencer profile first"
**Cause:** Profile doesn't exist or is missing the `id` field
**Solution:**
- Create an influencer profile if you haven't already
- Check the API response from `/influencer/get_influencer_by_user`
- Verify the response includes an `id` field

## API Verification

To verify the API is working correctly, check these endpoints:

1. **Get User Info:**
   ```
   GET https://api.dixam.me/user/me
   Response: { id: "...", username: "...", role: "influencer" }
   ```

2. **Get Influencer Profile:**
   ```
   GET https://api.dixam.me/influencer/get_influencer_by_user
   Response: { id: "...", name: "...", niche: "...", ... }
   ```

3. **Apply to Event:**
   ```
   POST https://api.dixam.me/event/apply_event
   Body: { "event_id": "...", "influencer_id": "..." }
   Response: { "message": "...", "application_id": "..." }
   ```

## Files Modified

1. `src/api/hooks/useInfluencerProfile.ts` - Fixed profile type and API method
2. `src/components/influencer/dashboard/EventCards.tsx` - Fixed validation logic and added loading checks

## Next Steps

After deploying these changes:

1. Test with a real influencer account
2. Monitor console logs for any unexpected errors
3. Verify the apply event API is being called with correct data
4. Consider removing debug logs in production build

## Related Documentation

- [Event Application Feature](./EVENT_APPLICATION_FEATURE.md)
- [Influencer Profile Setup](../SETUP_GUIDE.md#influencer-profile)