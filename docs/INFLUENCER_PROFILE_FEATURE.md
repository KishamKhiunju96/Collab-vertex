# Influencer Profile Feature - Implementation Guide

## 📋 Overview

This document outlines the implementation of the enhanced influencer profile feature with proper navigation, routing, and event display functionality.

## 🎯 Features Implemented

### 1. **Enhanced Profile Management**
- Create and edit influencer profiles
- Display profile statistics (audience size, engagement rate, etc.)
- Manage social media links
- View profile overview and stats

### 2. **Public Profile Viewing**
- View any influencer's public profile via `/influencer/[id]`
- Display influencer's events on their profile
- Show social media presence and statistics
- Proper navigation between edit and view modes

### 3. **Event Integration**
- Display events specific to each influencer using `/event/all_events/{influencer_id}`
- Filter and search events on the All Events page
- Proper integration with influencer profile ID

### 4. **Navigation & Routing**
- Dynamic routing for viewing influencer profiles
- Navigation between edit profile and public view
- Back button support for better UX

---

## 🗂️ File Structure

```
Collab-vertex/
├── src/
│   ├── api/
│   │   ├── apiPaths.ts                              ← Updated: Added GET_BY_ID, GET_SOCIAL_LINKS_BY_ID
│   │   ├── services/
│   │   │   └── influencerService.ts                 ← Updated: Added getProfileById, getSocialLinksById
│   │   │   └── eventService.ts                      ← Used: getAllEvents(influencerId)
│   ├── app/
│   │   └── influencer/
│   │       ├── [id]/
│   │       │   └── page.tsx                         ← NEW: Dynamic route for public profiles
│   │       └── profile/
│   │           └── page.tsx                         ← Existing: Edit profile page
│   ├── components/
│   │   ├── influencer/
│   │   │   └── profile/
│   │   │       ├── EnhancedProfilePage.tsx          ← Updated: Added navigation & view profile button
│   │   │       └── InfluencerProfileView.tsx        ← NEW: Reusable profile viewer component
│   │   └── events/
│   │       └── EventListPage.tsx                    ← Updated: Uses correct API with influencer_id
│   └── components/
│       └── dashboard/
│           └── sidebar/
│               └── navConfig.ts                     ← Sidebar configuration (All Events)
```

---

## 🔧 Implementation Details

### 1. API Endpoints Added

#### **Get Influencer by ID**
```typescript
// apiPaths.ts
GET_BY_ID: (influencerId: string) => `/influencer/get_influencer_by_id/${influencerId}`

// influencerService.ts
getProfileById: async (influencerId: string): Promise<InfluencerProfile>
```

#### **Get Social Links by Influencer ID**
```typescript
// apiPaths.ts
GET_SOCIAL_LINKS_BY_ID: (influencerId: string) => `/influencer/get_sociallinks/${influencerId}`

// influencerService.ts
getSocialLinksById: async (influencerId: string): Promise<SocialLink[]>
```

### 2. Updated Event Fetching

#### **EventListPage.tsx**
- **Before:** Used hardcoded URL `https://api.dixam.me/event/all_events` without influencer ID
- **After:** Uses `eventService.getAllEvents(profile.id)` with proper influencer ID

```typescript
const fetchEvents = useCallback(async () => {
  if (profileLoading || !profile?.id) {
    return;
  }

  setLoading(true);
  try {
    // Fetch events using the influencer's profile ID
    const data = await eventService.getAllEvents(profile.id);
    setEvents(data);
    setFilteredEvents(data);
  } catch (err) {
    notify.error("Failed to load events.");
  } finally {
    setLoading(false);
  }
}, [profile?.id, profileLoading]);
```

**Key Changes:**
- Waits for influencer profile to load
- Uses profile ID to fetch events
- Shows message if no profile exists
- Properly handles loading states

### 3. Dynamic Routing Implementation

#### **Route Structure**

| Route                          | Purpose                     | Component                |
|--------------------------------|-----------------------------|--------------------------|
| `/influencer/profile`          | Edit own profile            | EnhancedProfilePage      |
| `/influencer/[id]`             | View public profile         | InfluencerProfileView    |
| `/dashboard/events`            | All events (with filters)   | EventListPage            |

#### **Public Profile Page** (`/influencer/[id]/page.tsx`)

```typescript
"use client";

import { useParams } from "next/navigation";
import InfluencerProfileView from "@/components/influencer/profile/InfluencerProfileView";

export default function PublicInfluencerProfilePage() {
  const params = useParams();
  const influencerId = params.id as string;

  return <InfluencerProfileView influencerId={influencerId} />;
}
```

### 4. InfluencerProfileView Component

**Props:**
```typescript
interface InfluencerProfileViewProps {
  influencerId: string;
  isOwnProfile?: boolean;
}
```

**Features:**
- ✅ Fetches profile by ID (public) or current user (own profile)
- ✅ Displays social media links
- ✅ Shows events specific to the influencer
- ✅ Tabs for Overview and Events
- ✅ Back button navigation
- ✅ Responsive design

**Usage:**
```typescript
// View public profile
<InfluencerProfileView influencerId="123" />

// View own profile
<InfluencerProfileView influencerId="123" isOwnProfile={true} />
```

### 5. Enhanced Profile Page Updates

**New Features:**
- **View Public Profile Button:** Navigate to `/influencer/{profile.id}`
- **Edit Profile Button:** Edit mode (existing functionality)
- **Proper Router Integration:** Uses Next.js `useRouter()` for navigation

```typescript
<button
  onClick={() => router.push(`/influencer/${profile.id}`)}
  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl"
>
  <Eye size={16} />
  View Public Profile
</button>
```

---

## 🎨 UI/UX Improvements

### Profile View Features

1. **Hero Header**
   - Gradient background
   - Avatar with first letter of name
   - Profile statistics cards

2. **Statistics Display**
   - Audience Size
   - Engagement Rate
   - Social Links Count
   - Total Followers

3. **Tabbed Interface**
   - **Overview Tab:** Social links, about section
   - **Events Tab:** Available events for collaboration

4. **Social Media Cards**
   - Platform icons (Instagram, Twitter, Facebook, YouTube, TikTok, LinkedIn)
   - Follower counts
   - External links to social profiles

5. **Event Cards**
   - Grid layout with event details
   - Loading states
   - Empty state when no events

---

## 🔄 Data Flow

### Viewing Public Profile

```
User clicks "View Public Profile"
    ↓
Navigate to /influencer/{id}
    ↓
InfluencerProfileView component loads
    ↓
Fetch profile by ID → influencerService.getProfileById(id)
    ↓
Fetch social links by ID → getSocialLinksById(id)
    ↓
Fetch events by ID → eventService.getAllEvents(id)
    ↓
Display profile with tabs (Overview, Events)
```

### Viewing All Events

```
User navigates to /dashboard/events
    ↓
EventListPage component loads
    ↓
Fetch influencer profile → useInfluencerProfile()
    ↓
Wait for profile.id
    ↓
Fetch events → eventService.getAllEvents(profile.id)
    ↓
Display events with search/filter
```

---

## 🧪 Testing Checklist

### Profile Creation & Viewing
- [ ] Create influencer profile successfully
- [ ] View profile statistics correctly
- [ ] Add/edit/delete social media links
- [ ] Navigate to public profile view
- [ ] Back button works on public profile

### Events Integration
- [ ] Events load on All Events page with influencer ID
- [ ] Events display on profile's Events tab
- [ ] Search and filter events work properly
- [ ] Empty state shows when no events
- [ ] Loading states display correctly

### Navigation
- [ ] Navigate from edit to public view
- [ ] Navigate back from public view
- [ ] Sidebar "All Events" link works
- [ ] Profile link in dashboard works

### Error Handling
- [ ] Shows message when profile doesn't exist
- [ ] Shows message when no events available
- [ ] API errors display user-friendly messages
- [ ] Loading states prevent premature API calls

---

## 📡 API Endpoints Used

### Influencer Profile

| Endpoint                                    | Method | Purpose                          |
|---------------------------------------------|--------|----------------------------------|
| `/influencer/create_influencerprofile`      | POST   | Create new profile               |
| `/influencer/get_influencer_by_user`        | GET    | Get current user's profile       |
| `/influencer/get_influencer_by_id/{id}`     | GET    | Get profile by ID (public)       |
| `/influencer/get_sociallinks`               | GET    | Get current user's social links  |
| `/influencer/get_sociallinks/{id}`          | GET    | Get social links by influencer ID|
| `/influencer/create_sociallink`             | POST   | Add social media link            |
| `/influencer/update_sociallink/{id}`        | PUT    | Update social media link         |
| `/influencer/delete_sociallink/{id}`        | DELETE | Delete social media link         |

### Events

| Endpoint                           | Method | Purpose                          |
|------------------------------------|--------|----------------------------------|
| `/event/all_events/{influencer_id}`| GET    | Get all events for influencer    |

---

## 🚀 Usage Examples

### 1. Viewing Own Profile
```typescript
// Navigate to edit profile
router.push('/influencer/profile');

// Click "View Public Profile" button
router.push(`/influencer/${profile.id}`);
```

### 2. Viewing Another Influencer's Profile
```typescript
// From brand dashboard or search results
router.push(`/influencer/${influencerId}`);
```

### 3. Viewing All Events
```typescript
// From sidebar navigation
<Link href="/dashboard/events">All Events</Link>
```

---

## 🎯 Key Benefits

1. **Proper API Integration:** Uses correct endpoints with influencer ID
2. **Dynamic Routing:** Support for viewing any influencer's profile
3. **Better UX:** Clear navigation between edit and view modes
4. **Event Display:** Shows events specific to each influencer
5. **Reusable Components:** InfluencerProfileView can be used anywhere
6. **Type Safety:** Full TypeScript support with proper interfaces
7. **Error Handling:** Graceful fallbacks and loading states

---

## 🔮 Future Enhancements

- [ ] Add profile search functionality
- [ ] Implement profile sharing (copy link, social share)
- [ ] Add profile analytics dashboard
- [ ] Enable profile customization (themes, layouts)
- [ ] Add verification badges for influencers
- [ ] Implement follow/unfollow functionality
- [ ] Add profile completion percentage
- [ ] Enable profile recommendations

---

## 📚 Related Documentation

- [Event Architecture](./EVENT_ARCHITECTURE.md)
- [Setup Guide](../SETUP_GUIDE.md)
- [Event Application Feature](./EVENT_APPLICATION_FEATURE.md)

---

## 🐛 Troubleshooting

### Events Not Loading
**Problem:** Events page shows loading indefinitely  
**Solution:** Ensure influencer profile exists and has valid ID

### Profile Not Found
**Problem:** "Profile Not Found" error when viewing public profile  
**Solution:** Verify influencer ID is correct and profile exists in database

### Social Links Not Displaying
**Problem:** Social links don't show on public profile  
**Solution:** Check API endpoint `/influencer/get_sociallinks/{id}` is working

---

## ✅ Summary

This implementation provides a complete influencer profile system with:
- ✅ Profile creation and management
- ✅ Public profile viewing
- ✅ Event integration with proper API endpoints
- ✅ Dynamic routing with Next.js
- ✅ Proper navigation and UX
- ✅ Type-safe API services
- ✅ Comprehensive error handling

The system is now ready for influencers to showcase their profiles and for brands to discover and collaborate with them.