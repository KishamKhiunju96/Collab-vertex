# Quick Start Guide: Event Viewing Features

## 🚀 Getting Started

This guide will help you quickly understand and use the new Event Viewing features in Collab-Vertex.

## 📍 Accessing Events

### For All Users (Landing Page)
1. Visit the homepage
2. On mobile devices, tap the **hamburger menu (☰)** in the top-right corner
3. Navigate to any section: Home, About, Services, or Contact

### For Authenticated Users (Dashboard)
1. Log in to your account
2. Look for **"All Events"** in the left sidebar
3. Click to view all available events

## 🎯 Using the Event List Page

### Location
```
/dashboard/events
```

### Features

#### 1. Search Events
- Use the search bar at the top
- Search by: title, description, location, or category
- Results update in real-time as you type

#### 2. Filter Events
- **Status Filter:** Show only Active or Inactive events
- **Category Filter:** Filter by event categories
- **Clear All:** Remove all filters with one click

#### 3. Browse Events
- Events display in a responsive grid
- 3 columns on desktop
- 2 columns on tablet
- 1 column on mobile

#### 4. View Event Details
- Click any event card
- See complete event information
- Edit or delete if you have permissions

## 📄 Event Detail Page

### Location
```
/dashboard/events/[event-id]
```

### What You'll See

#### Main Information
- **Title & Status:** Event name with active/inactive badge
- **Description:** Full event description
- **Objectives:** Event goals and objectives
- **Deliverables:** Expected outcomes and deliverables

#### Sidebar Details
- **Category:** Event type/category
- **Location:** Where the event takes place
- **Budget:** Event budget amount
- **Target Audience:** Intended audience
- **Timeline:** Start date, end date, duration
- **Metadata:** Creation date, last update

#### Actions Available
- **Edit:** Modify event details (coming soon)
- **Delete:** Remove event (requires confirmation)
- **Back:** Return to event list

## 📱 Mobile Experience

### Responsive Navigation
1. **Hamburger Menu:**
   - Tap the ☰ icon in the top-right
   - Menu slides in from the right
   - Tap outside or press ESC to close

2. **Event Cards:**
   - Stack vertically on mobile
   - Full-width for easy tapping
   - All information remains visible

3. **Detail Pages:**
   - Single-column layout
   - Sidebar moves below main content
   - Optimized for scrolling

## 💡 Pro Tips

### Search Tips
```
✓ Search "marketing" → finds events with "marketing" in any field
✓ Search "New York" → finds events in New York
✓ Combine filters → Status: Active + Category: Social Media
```

### Keyboard Shortcuts
- **ESC** - Close mobile menu
- **Tab** - Navigate between elements
- **Enter** - Activate links/buttons

### Visual Indicators
- 🟢 **Green Badge** = Active event
- ⚫ **Gray Badge** = Inactive event
- **Hover Effect** = Clickable card

## 🎨 UI Elements Explained

### Event Card Components
```
┌─────────────────────────────┐
│ Title              [Status] │
│ Description preview...      │
│                             │
│ 🏷️ Category  📍 Location    │
│ 📅 Start Date  💵 Budget    │
│ ⏰ Date Range               │
└─────────────────────────────┘
```

### Status Badges
- **Active** → Green background, dark green text
- **Inactive** → Gray background, dark gray text

### Empty States
If no events are found:
- Clear message explaining why
- Suggestion to adjust filters or create events
- Quick action button when applicable

## 🔧 Common Tasks

### Task 1: Find All Active Marketing Events
1. Go to `/dashboard/events`
2. Select **Status: Active**
3. Select **Category: Marketing**
4. Browse filtered results

### Task 2: View Event Details
1. Click any event card
2. Scroll to see all information
3. Use back button to return to list

### Task 3: Delete an Event
1. Open event detail page
2. Click **Delete** button (red)
3. Confirm deletion in popup
4. Redirected to event list

### Task 4: Search for Specific Event
1. Type event name in search bar
2. Results filter automatically
3. Click event to view details

## 📊 Data Displayed

### Event List View
- Title
- Status badge
- Short description (2 lines)
- Category
- Location
- Start date
- Budget
- Full date range

### Event Detail View
- Everything from list view, plus:
- Full description
- Objectives
- Deliverables
- Target audience
- End date
- Duration (calculated)
- Event ID
- Created timestamp
- Last updated timestamp

## ⚡ Performance Notes

### Loading States
- **Skeleton loaders** appear while fetching data
- **Smooth transitions** when data loads
- **No layout shift** during loading

### Error Handling
- **Clear error messages** if something goes wrong
- **Retry button** to attempt loading again
- **Fallback states** for missing data

## 🎯 User Roles

### Brand Users
- View all events
- Create events (via brand dashboard)
- Edit/delete own events
- Access "Manage Events" for brand-specific events

### Influencer Users
- View all events
- Browse and filter events
- Apply to events
- Access "My Events" for applied events

## 🔍 Troubleshooting

### Problem: No events showing
**Solution:** 
- Check if filters are applied (clear them)
- Verify you're logged in
- Check internet connection
- Refresh the page

### Problem: Search not working
**Solution:**
- Clear search field and try again
- Disable browser extensions
- Try different search terms

### Problem: Mobile menu won't close
**Solution:**
- Press ESC key
- Tap outside the menu
- Refresh the page if stuck

### Problem: Event won't delete
**Solution:**
- Ensure you have permissions
- Check if event has dependencies
- Contact support if issue persists

## 🌐 Browser Support

### Recommended Browsers
- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS/Android)

### Minimum Requirements
- JavaScript enabled
- Cookies enabled
- Modern browser (last 2 versions)

## 📱 Mobile Devices

### Tested On
- iOS Safari
- Android Chrome
- Various screen sizes (320px - 4K)

### Touch Gestures
- **Tap** - Select/activate
- **Scroll** - Browse events
- **Swipe** - Close menu (in some contexts)

## 🎓 Best Practices

### For Better Performance
1. Use specific search terms
2. Apply filters before searching
3. Bookmark frequently visited events
4. Clear filters when done

### For Better Organization
1. Use consistent naming for events
2. Keep categories accurate
3. Update status regularly
4. Add detailed descriptions

## 📞 Need Help?

### Documentation
- Full docs: `docs/EVENT_VIEWING_FEATURE.md`
- Feature summary: `FEATURE_SUMMARY.md`
- Setup guide: `SETUP_GUIDE.md`

### Support
- Check console for error messages
- Review this quick start guide
- Contact development team
- Submit bug reports

## 🎉 What's Next?

### Coming Soon
- Event edit functionality
- Advanced filtering options
- Sorting capabilities
- Calendar view
- Export features
- Bulk actions

### Stay Updated
- Check release notes
- Watch for UI updates
- Provide feedback
- Request features

---

**Version:** 1.0.0  
**Last Updated:** 2024  
**Status:** Production Ready ✅

Happy event browsing! 🚀