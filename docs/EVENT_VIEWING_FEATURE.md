# Event Viewing Feature Documentation

## Overview

This document describes the newly implemented Event Viewing feature, which allows users to browse and view all created events in a manner similar to the existing Brand viewing functionality.

## Features Implemented

### 1. Responsive Navigation with Hamburger Menu

**Location:** `src/components/shared/Navbar.tsx`

The landing page navigation now includes a fully responsive hamburger menu with the following features:

- **Desktop View:** Traditional horizontal navigation with links
- **Mobile View:** Hamburger icon that opens a slide-in menu
- **Smooth Animations:** CSS transitions for opening/closing
- **Accessibility:**
  - Keyboard support (ESC key to close)
  - ARIA labels for screen readers
  - Focus management
- **Auto-close:** Menu closes automatically on route changes
- **Body Scroll Lock:** Prevents background scrolling when menu is open

**Navigation Links:**
- Home (/)
- About (/about)
- Services (/services)
- Contact (/contacts)
- Login (/login)

### 2. Event List Page

**Route:** `/dashboard/events`  
**Component:** `src/components/events/EventListPage.tsx`

A comprehensive event listing page with the following features:

#### Search & Filtering
- **Text Search:** Search by title, description, location, or category
- **Status Filter:** Filter by Active/Inactive status
- **Category Filter:** Dynamic filter based on available event categories
- **Active Filter Display:** Visual chips showing currently active filters
- **Clear All:** One-click removal of all filters

#### UI Features
- **Responsive Grid:** 1 column (mobile), 2 columns (tablet), 3 columns (desktop)
- **Loading States:** Skeleton loaders during data fetch
- **Empty States:**
  - No events available
  - No results matching filters
- **Error Handling:** User-friendly error messages with retry option
- **Results Count:** Shows filtered/total event count
- **Create Event Button:** Quick access to event creation

#### Event Information Displayed
Each event card shows:
- Title (clickable link to detail page)
- Status badge (Active/Inactive with color coding)
- Description (truncated to 2 lines)
- Category
- Location
- Start date
- Budget
- Date range (start to end)

### 3. Event Detail Page

**Route:** `/dashboard/events/[id]`  
**Component:** `src/components/events/EventDetailPage.tsx`

A comprehensive event detail view with the following sections:

#### Header Section
- Event title (large, prominent)
- Status badge with color coding
- Creation date
- Action buttons:
  - Edit (links to edit page)
  - Delete (with confirmation dialog)
- Back button to return to event list

#### Main Content Area (2/3 width on desktop)
- **Description Section:** Full event description with proper formatting
- **Objectives Section:** Event objectives and goals
- **Deliverables Section:** Expected deliverables from collaborators

#### Sidebar (1/3 width on desktop)
- **Event Details Card:**
  - Category with icon
  - Location with map pin icon
  - Budget (formatted with $ and commas)
  - Target audience
  
- **Timeline Card:**
  - Start date and time
  - End date and time
  - Duration in days (calculated)
  
- **Metadata Card:**
  - Event ID (for reference)
  - Created timestamp
  - Last updated timestamp

#### Responsive Design
- **Desktop:** Two-column layout (main content + sidebar)
- **Mobile:** Single column, stacked layout
- **Icons:** Lucide icons for visual clarity
- **Color Coding:** Consistent status colors throughout

### 4. Reusable Components

#### EventCard Component
**Location:** `src/components/events/EventCard.tsx`

- Displays event summary in card format
- Hover effects for better UX
- Click-through to detail page
- Responsive layout
- Status badge with dynamic colors
- Icon indicators for key information

#### EventSkeleton Component
**Location:** `src/components/events/EventSkeleton.tsx`

- Loading placeholder for event cards
- Pulse animation
- Matches EventCard layout
- Improves perceived performance

#### EmptyState Component
**Location:** `src/components/events/EmptyState.tsx`

- Reusable empty state display
- Customizable title and description
- Optional action button
- Icon display for visual feedback

#### Badge Component
**Location:** `src/components/ui/Badge.tsx`

- Production-ready badge component
- Multiple variants: default, success, warning, error, info, secondary
- Consistent styling across the app
- TypeScript typed for safety

### 5. Routing Structure

```
/dashboard/events              → Event list page
/dashboard/events/[id]         → Event detail page
/dashboard/events/[id]/edit    → Event edit page (route created, implementation pending)
```

### 6. Navigation Integration

**Updated:** `src/components/dashboard/SideBar.tsx`

Added "All Events" navigation link to both Brand and Influencer dashboards:

**Brand Dashboard Navigation:**
- Overview
- **All Events** ← NEW
- Manage Events
- Find Influencers
- Collaborations
- Analytics
- Settings

**Influencer Dashboard Navigation:**
- Overview
- **All Events** ← NEW
- My Events
- Collaborations
- Social Links
- Analytics
- Settings

## API Integration

### Endpoints Used

1. **Get All Events**
   - URL: `https://api.dixam.me/event/allevents`
   - Method: GET
   - Used in: EventListPage

2. **Get Event by ID**
   - URL: `https://api.dixam.me/event/eventbyid/{eventId}`
   - Method: GET
   - Used in: EventDetailPage

3. **Delete Event**
   - URL: `https://api.dixam.me/event/delete_event/{eventId}`
   - Method: DELETE
   - Used in: EventDetailPage

### Event Data Structure

```typescript
interface Event {
  id: string;
  brand_id: string;
  title: string;
  description: string;
  objectives: string;
  budget: number;
  start_date: string;
  end_date: string;
  deliverables: string;
  target_audience: string;
  category: string;
  location: string;
  status: EventStatus; // "active" | "inactive"
  created_at: string;
  updated_at: string;
}
```

## Technical Implementation

### Technology Stack
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (strictly typed, no `any`)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **State Management:** React Hooks (useState, useEffect, useCallback)
- **Routing:** Next.js App Router with dynamic routes

### Code Quality Standards
- ✅ TypeScript strictly typed
- ✅ No `any` types used
- ✅ Proper error handling
- ✅ Loading states for all async operations
- ✅ Responsive design (mobile-first)
- ✅ Accessibility features (ARIA labels, keyboard navigation)
- ✅ Reusable components
- ✅ Clean code with comments where needed
- ✅ Consistent naming conventions
- ✅ Production-ready code

### Performance Optimizations
- Skeleton loaders for perceived performance
- useCallback for memoized functions
- Efficient filtering (client-side for better UX)
- No unnecessary re-renders
- Proper dependency arrays in useEffect

### Accessibility
- ARIA labels on interactive elements
- Keyboard navigation support
- Focus management in modals/menus
- Semantic HTML structure
- Color contrast compliance
- Screen reader friendly

## User Flow

### Viewing Events
1. User navigates to `/dashboard/events` from sidebar
2. System fetches all events from API
3. Events display in responsive grid with loading skeletons
4. User can search and filter events
5. User clicks on event card
6. System navigates to event detail page
7. Full event information is displayed

### Managing Events
1. From event detail page, user can:
   - View all event information
   - Edit event (redirects to edit page)
   - Delete event (with confirmation)
   - Return to event list

## Mobile Responsiveness

### Breakpoints
- **Mobile:** < 768px (1 column)
- **Tablet:** 768px - 1024px (2 columns)
- **Desktop:** > 1024px (3 columns)

### Mobile Optimizations
- Touch-friendly button sizes (min 44x44px)
- Hamburger menu for navigation
- Single-column layout for detail pages
- Horizontal scroll prevention
- Proper text wrapping and truncation
- Adequate spacing for touch targets

## Future Enhancements

### Potential Improvements
1. **Event Edit Page:** Implement full edit functionality
2. **Advanced Filters:**
   - Date range filter
   - Budget range slider
   - Multiple category selection
   - Location-based search
3. **Sorting Options:**
   - Sort by date
   - Sort by budget
   - Sort by status
4. **Pagination:** For large event lists
5. **Event Analytics:** View event performance metrics
6. **Export Functionality:** Export event data
7. **Bulk Actions:** Delete/update multiple events
8. **Event Templates:** Quick event creation from templates
9. **Calendar View:** Visual timeline of events
10. **Notifications:** Alert users about event updates

## Testing Checklist

### Functionality
- [x] Event list loads correctly
- [x] Event detail page displays all information
- [x] Search functionality works
- [x] Status filter works
- [x] Category filter works
- [x] Delete event works with confirmation
- [x] Navigation between pages works
- [x] Back button returns to list
- [x] Error states display correctly
- [x] Empty states display correctly
- [x] Loading states display correctly

### Responsive Design
- [x] Mobile layout (< 768px)
- [x] Tablet layout (768px - 1024px)
- [x] Desktop layout (> 1024px)
- [x] Hamburger menu works on mobile
- [x] No horizontal overflow
- [x] Touch-friendly buttons
- [x] Proper text wrapping

### Accessibility
- [x] Keyboard navigation works
- [x] ESC key closes menu
- [x] ARIA labels present
- [x] Focus indicators visible
- [x] Semantic HTML used
- [x] Color contrast sufficient

### Browser Compatibility
- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers

## Maintenance Notes

### File Structure
```
src/
├── app/
│   └── dashboard/
│       └── events/
│           ├── page.tsx              # Event list route
│           └── [id]/
│               └── page.tsx          # Event detail route
├── components/
│   ├── events/
│   │   ├── EventCard.tsx            # Event card component
│   │   ├── EventSkeleton.tsx        # Loading skeleton
│   │   ├── EmptyState.tsx           # Empty state display
│   │   ├── EventDetailPage.tsx      # Detail page component
│   │   ├── EventListPage.tsx        # List page component
│   │   └── index.ts                 # Barrel exports
│   ├── shared/
│   │   └── Navbar.tsx               # Updated with hamburger menu
│   ├── dashboard/
│   │   └── SideBar.tsx              # Updated with events link
│   └── ui/
│       └── Badge.tsx                # New badge component
└── api/
    └── services/
        └── eventService.ts          # Event API service (existing)
```

### Key Files Modified
1. `src/components/shared/Navbar.tsx` - Added hamburger menu
2. `src/components/dashboard/SideBar.tsx` - Added events navigation link
3. `src/components/ui/Badge.tsx` - Created badge component

### Key Files Created
1. Event list page and route
2. Event detail page and route
3. EventCard, EventSkeleton, EmptyState components
4. EventListPage, EventDetailPage components

## Known Limitations

1. **Edit Functionality:** Edit page route exists but implementation is pending
2. **API Rate Limiting:** No rate limiting implementation on client side
3. **Offline Support:** No offline caching or PWA features
4. **Image Support:** Events don't currently support images
5. **Real-time Updates:** No WebSocket support for live event updates

## Support & Contact

For questions or issues related to this feature, please:
1. Check this documentation first
2. Review the code comments in the components
3. Check the console for error messages
4. Contact the development team

---

**Last Updated:** 2024  
**Version:** 1.0.0  
**Author:** Development Team  
**Status:** Production Ready ✅