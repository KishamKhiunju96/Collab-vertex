# Testing Guide - Event Viewing Features

## 🧪 Overview

This guide provides comprehensive testing procedures for the Event Viewing features in Collab-Vertex.

## 📋 Pre-Testing Checklist

### Environment Setup
- [ ] Node.js and npm installed
- [ ] Project dependencies installed (`npm install`)
- [ ] Development server running (`npm run dev`)
- [ ] Backend API accessible (https://api.dixam.me)
- [ ] Test user accounts available (brand and influencer roles)

### Browser Setup
- [ ] Latest Chrome/Edge
- [ ] Latest Firefox
- [ ] Latest Safari
- [ ] Mobile browser (iOS/Android)
- [ ] Browser DevTools open for debugging

## 🎯 Test Cases

### 1. Responsive Navigation (Navbar)

#### Desktop Navigation (≥768px)
**Test ID:** NAV-001  
**Priority:** High

**Steps:**
1. Open landing page on desktop browser
2. Verify navigation links visible: Home, About, Services, Contact, Login
3. Click each navigation link
4. Verify correct page loads
5. Verify no hamburger menu visible

**Expected Results:**
- ✅ All links visible horizontally
- ✅ Hover effects work
- ✅ Navigation is sticky on scroll
- ✅ Active link highlighted
- ✅ No layout shifts

---

#### Mobile Navigation (<768px)
**Test ID:** NAV-002  
**Priority:** High

**Steps:**
1. Resize browser to mobile width (375px)
2. Verify hamburger icon (☰) visible
3. Click hamburger icon
4. Verify menu slides in from right
5. Click each navigation link
6. Verify menu closes after navigation
7. Click outside menu
8. Verify menu closes
9. Press ESC key
10. Verify menu closes

**Expected Results:**
- ✅ Hamburger icon visible
- ✅ Menu animates smoothly
- ✅ No body scroll when menu open
- ✅ Menu closes on navigation
- ✅ Menu closes on outside click
- ✅ Menu closes on ESC key
- ✅ Focus trapped in menu
- ✅ No horizontal overflow

---

### 2. Event List Page

#### Loading State
**Test ID:** EVT-001  
**Priority:** High

**Steps:**
1. Navigate to `/dashboard/events`
2. Observe loading state before data loads
3. Verify skeleton loaders display

**Expected Results:**
- ✅ 6 skeleton loaders visible
- ✅ Pulse animation active
- ✅ Layout matches actual cards
- ✅ No layout shift when data loads
- ✅ Loading message displayed

---

#### Successful Data Load
**Test ID:** EVT-002  
**Priority:** Critical

**Steps:**
1. Navigate to `/dashboard/events`
2. Wait for events to load
3. Verify event cards display
4. Count number of events

**Expected Results:**
- ✅ Events display in grid
- ✅ All event fields populated
- ✅ Status badges colored correctly
- ✅ Images/icons display properly
- ✅ Grid responsive (1/2/3 columns)
- ✅ Results counter accurate

---

#### Empty State
**Test ID:** EVT-003  
**Priority:** Medium

**Steps:**
1. Use test account with no events
2. Navigate to `/dashboard/events`
3. Verify empty state displays

**Expected Results:**
- ✅ Empty state icon visible
- ✅ Message clear and helpful
- ✅ "Create Event" button present
- ✅ Button functional
- ✅ Centered layout

---

#### Error State
**Test ID:** EVT-004  
**Priority:** High

**Steps:**
1. Disconnect from internet
2. Navigate to `/dashboard/events`
3. Verify error state displays
4. Reconnect internet
5. Click "Try Again" button

**Expected Results:**
- ✅ Error message displayed
- ✅ Retry button visible
- ✅ Retry button works
- ✅ Events load after retry
- ✅ No crash or blank screen

---

### 3. Search Functionality

#### Text Search
**Test ID:** SEARCH-001  
**Priority:** High

**Steps:**
1. Navigate to `/dashboard/events`
2. Enter "marketing" in search field
3. Verify filtered results
4. Clear search
5. Verify all events return

**Expected Results:**
- ✅ Results filter in real-time
- ✅ Search is case-insensitive
- ✅ Searches title, description, location, category
- ✅ Results counter updates
- ✅ Clear search works

---

#### No Results
**Test ID:** SEARCH-002  
**Priority:** Medium

**Steps:**
1. Navigate to `/dashboard/events`
2. Enter "zzzzzzzzz" in search field
3. Verify no results state

**Expected Results:**
- ✅ "No events match" message displays
- ✅ Suggestion to adjust filters
- ✅ No error thrown
- ✅ Can recover by clearing search

---

### 4. Filter Functionality

#### Status Filter
**Test ID:** FILTER-001  
**Priority:** High

**Steps:**
1. Navigate to `/dashboard/events`
2. Select "Active" from status filter
3. Verify only active events show
4. Select "Inactive"
5. Verify only inactive events show
6. Select "All Status"
7. Verify all events return

**Expected Results:**
- ✅ Filter applies immediately
- ✅ Only matching events display
- ✅ Results counter updates
- ✅ Active filter chip shows
- ✅ Can clear filter

---

#### Category Filter
**Test ID:** FILTER-002  
**Priority:** High

**Steps:**
1. Navigate to `/dashboard/events`
2. Note available categories
3. Select a category
4. Verify only events in that category show
5. Select "All Categories"
6. Verify all events return

**Expected Results:**
- ✅ Categories dynamically populated
- ✅ Filter works correctly
- ✅ Results counter updates
- ✅ Active filter chip shows
- ✅ Can clear filter

---

#### Combined Filters
**Test ID:** FILTER-003  
**Priority:** Medium

**Steps:**
1. Navigate to `/dashboard/events`
2. Enter search term
3. Select status filter
4. Select category filter
5. Verify all filters apply together
6. Click "Clear all"
7. Verify all filters removed

**Expected Results:**
- ✅ All filters work together (AND logic)
- ✅ Multiple filter chips display
- ✅ "Clear all" button visible
- ✅ "Clear all" removes all filters
- ✅ Results accurate

---

### 5. Event Card

#### Card Display
**Test ID:** CARD-001  
**Priority:** High

**Steps:**
1. Navigate to `/dashboard/events`
2. Inspect an event card
3. Verify all fields present

**Expected Results:**
- ✅ Title displays (truncated if long)
- ✅ Status badge displays with color
- ✅ Description displays (2 lines max)
- ✅ Category with icon
- ✅ Location with icon
- ✅ Start date with icon
- ✅ Budget formatted with $
- ✅ Date range in footer

---

#### Card Interaction
**Test ID:** CARD-002  
**Priority:** High

**Steps:**
1. Navigate to `/dashboard/events`
2. Hover over an event card
3. Verify hover effect
4. Click event card
5. Verify navigation to detail page

**Expected Results:**
- ✅ Hover shows shadow/scale
- ✅ Cursor changes to pointer
- ✅ Click navigates correctly
- ✅ No broken links
- ✅ Smooth transition

---

### 6. Event Detail Page

#### Page Load
**Test ID:** DETAIL-001  
**Priority:** Critical

**Steps:**
1. Navigate to `/dashboard/events`
2. Click an event card
3. Verify detail page loads
4. Verify all sections present

**Expected Results:**
- ✅ Loading state shows first
- ✅ Page loads without errors
- ✅ All data displays
- ✅ Layout is responsive
- ✅ Back button present

---

#### Header Section
**Test ID:** DETAIL-002  
**Priority:** High

**Steps:**
1. Open event detail page
2. Verify header information

**Expected Results:**
- ✅ Title displays prominently
- ✅ Status badge correct color
- ✅ Created date formatted
- ✅ Edit button visible
- ✅ Delete button visible
- ✅ Back button functional

---

#### Main Content
**Test ID:** DETAIL-003  
**Priority:** High

**Steps:**
1. Open event detail page
2. Scroll through main content
3. Verify all sections present

**Expected Results:**
- ✅ Description card displays
- ✅ Objectives card displays
- ✅ Deliverables card displays
- ✅ Text formatted properly
- ✅ Whitespace preserved
- ✅ No truncation

---

#### Sidebar
**Test ID:** DETAIL-004  
**Priority:** High

**Steps:**
1. Open event detail page
2. Check sidebar sections

**Expected Results:**
- ✅ Event Details card present
- ✅ Category displays
- ✅ Location displays
- ✅ Budget formatted ($X,XXX)
- ✅ Target audience displays
- ✅ Timeline card present
- ✅ Start/end dates formatted
- ✅ Duration calculated
- ✅ Metadata card present
- ✅ Event ID displays
- ✅ Timestamps formatted

---

#### Delete Functionality
**Test ID:** DETAIL-005  
**Priority:** Critical

**Steps:**
1. Open event detail page
2. Click Delete button
3. Verify confirmation dialog
4. Click Cancel
5. Verify still on page
6. Click Delete again
7. Click Confirm
8. Verify redirect to event list

**Expected Results:**
- ✅ Confirmation dialog shows
- ✅ Cancel works
- ✅ Confirm deletes event
- ✅ Success notification
- ✅ Redirects to list
- ✅ Event removed from list

---

#### Invalid Event ID
**Test ID:** DETAIL-006  
**Priority:** High

**Steps:**
1. Navigate to `/dashboard/events/invalid-id`
2. Verify error state displays