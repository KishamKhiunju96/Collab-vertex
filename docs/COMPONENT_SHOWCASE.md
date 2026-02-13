# Component Showcase - Production-Grade Styling

## 🎨 Visual Style Guide

This document showcases all the styled components with visual descriptions and usage patterns.

---

## 1. Dashboard Header

### Visual Description
```
┌─────────────────────────────────────────────────────────────────┐
│  Hi Username, Welcome to Collab Vertex              🔔 (3)      │
│  Manage your brands, collaborate with influencers...             │
└─────────────────────────────────────────────────────────────────┘
```

**Features:**
- White card with rounded corners (1.25rem)
- Gradient title text (purple to pink)
- Shadow on hover with lift effect
- Notification bell with badge in top-right

**Colors:**
- Background: White
- Title: Gradient (#6C5CE7 → #FF7675)
- Subtitle: Gray (#6B7280)
- Shadow: Soft elevation

**States:**
- Default: Subtle shadow
- Hover: Elevated shadow, translates up 2px
- Active: Pressed feel

---

## 2. Notification System

### Notification Bell
```
   ╭─────╮
   │ 🔔  │ ← Circular button
   ╰─────╯
      (3) ← Pulsing red badge
```

**Animation:** Badge pulses continuously to draw attention

### Notification Dropdown
```
╔═══════════════════════════════════════╗
║ Notifications         Mark all as read║
╠═══════════════════════════════════════╣
║ ┃ ● New Brand Created                 ║ ← Blue accent (unread)
║ ┃   Your brand "Nike" was created     ║
║ ┃   2 hours ago                    [×]║
╟───────────────────────────────────────╢
║   Event Published                     ║ ← No accent (read)
║   Summer Sale event is now live       ║
║   1 day ago                        [×]║
╚═══════════════════════════════════════╝
```

**Features:**
- Slide-down animation on open
- Scrollable (max 400px)
- Unread items have blue left border
- Animated dot indicator for unread
- Delete button on each item
- Empty state with friendly message

---

## 3. Brand Table

### Visual Layout
```
┌─────────────────────────────────────────────────────────────┐
│ BRAND NAME    │ LOCATION      │ WEBSITE        │ ACTIONS    │ ← Gradient header
├─────────────────────────────────────────────────────────────┤
│ Nike          │ Portland      │ nike.com       │ 👁 ✏️ 🗑   │
├─────────────────────────────────────────────────────────────┤
│ Adidas        │ Germany       │ adidas.com     │ 👁 ✏️ 🗑   │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- White card container
- Gradient purple header background
- Brand names are links with animated underline
- Row hover: Subtle purple tint, slight scale
- Action icons: View (eye), Edit (pencil), Delete (trash)
- Delete button turns red on hover

**Hover Effects:**
- Row: Background changes to light purple gradient
- Link: Underline animates from left to right
- Icons: Scale up, background circle appears

---

## 4. Analytics Chart Card

### Visual Layout
```
╔═════════════════════════════════════════════════════════════╗
║ Event Performance                  📊 Total Reach: 45.2k    ║
║ Reach and engagement over 7 months    Total Eng: 18.9k     ║
╠═════════════════════════════════════════════════════════════╣
║                                                              ║
║      ┌─────────────────────────────────────────┐           ║
║  25k │    ╱╲                        ╱╲          │           ║
║      │   ╱  ╲      ╱╲              ╱  ╲         │ Purple   ║
║  20k │  ╱    ╲    ╱  ╲    ╱╲      ╱    ╲        │ (Reach)  ║
║      │ ╱      ╲  ╱    ╲  ╱  ╲    ╱      ╲       │          ║
║  15k │╱        ╲╱      ╲╱    ╲  ╱        ╲      │          ║
║      │          ╲              ╲╱          ╲     │ Teal     ║
║  10k │           ╲                          ╲    │ (Engage) ║
║      └─────────────────────────────────────────┘           ║
║        Jan  Feb  Mar  Apr  May  Jun  Jul                    ║
╠═════════════════════════════════════════════════════════════╣
║ ━ Reach        ━ Engagement                                 ║
╠═════════════════════════════════════════════════════════════╣
║ 📈 Performance Trend              Avg. Engagement Rate      ║
║    +12.5% increase this month              24.3%            ║
╚═════════════════════════════════════════════════════════════╝
```

**Features:**
- Clean white card with shadow
- Summary stats in header
- Gradient-filled area chart
- Interactive tooltip on hover
- Legend with colored dots
- Performance insights footer
- Hover: Card lifts with increased shadow

**Colors:**
- Reach: Purple gradient (#6C5CE7)
- Engagement: Teal gradient (#2ED8B6)
- Grid lines: Light gray
- Background fills: Semi-transparent gradients

---

## 5. Activity Feed Card

### Visual Layout
```
╔═══════════════════════════════════════╗
║ Brand Activity                        ║
║ Track everything happening with...    ║
╠═══════════════════════════════════════╣
║  ╭───╮                                ║
║  │ 📝 │ New Brand Created             ║
║  ╰───╯ Nike brand added to portfolio  ║
║        2 hours ago                    ║
╟───────────────────────────────────────╢
║  ╭───╮                                ║
║  │ 🚀 │ Event Published               ║
║  ╰───╯ Summer Sale event went live    ║
║        5 hours ago                    ║
╟───────────────────────────────────────╢
║  ╭───╮                                ║
║  │ 👥 │ New Collaboration             ║
║  ╰───╯ Partnership with @influencer   ║
║        1 day ago                      ║
╠═══════════════════════════════════════╣
║ ● 8 activities tracked    View All → ║
╚═══════════════════════════════════════╝
```

**Features:**
- Scrollable list (max-height: 600px)
- Circular colored icons
- Hover: Item slides right, background changes
- Icon rotates 10° and scales on hover
- Empty state with SVG illustration
- Footer summary with live indicator

**Icon Colors:**
- Event: Purple background
- User: Pink background
- Notification: Teal background
- Success: Green background

---

## 6. Sidebar Navigation

### Visual Layout
```
╔══════════════════════════╗
║                          ║
║  ╭────╮                  ║
║  │ C  │  Collab Vertex   ║ ← Logo (gradient purple)
║  ╰────╯                  ║
╠══════════════════════════╣
║                          ║
║  MAIN                    ║
║  ┃ 📊 Overview          ║ ← Active (gradient bg + border)
║    📅 All Events         ║
║                          ║
║  MANAGEMENT              ║
║    📋 Manage Events      ║
║    👥 Find Influencers   ║
║    🤝 Collaborations     ║
║                          ║
║  INSIGHTS                ║
║    📈 Analytics          ║
║                          ║
║  ACCOUNT                 ║
║    ⚙️ Settings           ║
╠══════════════════════════╣
║  ╭──╮                    ║
║  │JD│ John Doe           ║ ← User profile (expandable)
║  ╰──╯ Brand account   ▼  ║
║                          ║
║  Active: 12   Total: 48  ║ ← Quick stats
╚══════════════════════════╝
```

**Features:**
- Dark gradient background (#1F2937 → #111827)
- Fixed left side (280px width)
- Gradient logo icon
- Grouped navigation by category
- Active state: Gradient background + left accent bar
- Hover: Slide right, left accent bar grows
- User profile with dropdown menu
- Quick stats cards

**States:**
- Default: Gray text
- Hover: White text, purple tint, slide right
- Active: White text, gradient background, full left border

---

## 7. Floating Action Button (FAB)

### Visual Position
```
┌─────────────────────────────────────────┐
│                                         │
│                                         │
│          Dashboard Content              │
│                                         │
│                                         │
│                                ╭──────╮ │
│                                │ + Create Brand │
│                                ╰──────╯ │ ← Fixed bottom-right
└─────────────────────────────────────────┘
```

**Features:**
- Fixed positioning (2rem from bottom-right)
- Gradient teal background (#2ED8B6)
- Rounded pill shape (3rem radius)
- Large shadow with teal tint
- Plus icon + text
- Hover: Lifts up 4px, scales 1.05x
- Active: Scales down slightly

**Animation:**
- Default: Floats with shadow
- Hover: Lifts and enlarges
- Click: Quick press effect

---

## 8. Empty State

### Visual Layout
```
        ╭───────────────────╮
        │                   │
        │      ┌─────┐      │
        │      │ ⊙-⊙ │      │ ← Illustration
        │      │  ▯  │      │
        │      └─────┘      │
        │                   │
        │ No Brand Profile  │
        │      Found        │
        │                   │
        │ Click the Create  │
        │ Brand button to   │
        │ get started...    │
        │                   │
        ╰───────────────────╯
```

**Features:**
- Centered layout with padding
- SVG icon illustration (semi-transparent)
- Bold title
- Descriptive message
- Call-to-action hint
- Professional, friendly tone

---

## 9. Loading States

### Spinner
```
      ╭─────╮
      │  ⟲  │  ← Rotating circle
      ╰─────╯
   Loading dashboard...
```

**Animation:** Smooth 360° rotation (0.8s)

### Skeleton Loader
```
┌────────────────────────────┐
│ ▓▓▓▓▓▓░░░░░░░░░░          │ ← Shimmer effect
│ ▓▓▓▓░░░░░░░░░░░           │    moves left to right
│ ▓▓▓▓▓▓▓▓░░░░░░░░░         │
└────────────────────────────┘
```

**Animation:** Gradient sweeps across (1.5s loop)

---

## 10. User Profile Dropdown

### Visual Layout
```
╔═══════════════════════════╗
║  ╭──╮                     ║
║  │JD│ John Doe        ▲   ║ ← Clickable card
║  ╰──╯ Brand account       ║
╠═══════════════════════════╣ ← Opens on click
║  👤 Profile               ║
╟───────────────────────────╢
║  ⚙️ Settings              ║
╟───────────────────────────╢
║  🚪 Log out               ║ ← Red on hover
╚═══════════════════════════╝
```

**Features:**
- Avatar with initials (gradient background)
- User name and role
- Expandable menu with chevron indicator
- Three menu items: Profile, Settings, Logout
- Logout item has red color on hover
- Slide-in animation

---

## 🎭 Animation Showcase

### 1. Fade In Up (Cards)
```
Frame 1:  ▓ ↓ (below, transparent)
Frame 2:  ▓ ↓ (moving up, fading in)
Frame 3:  ▓   (in position, opaque)
```
**Duration:** 0.5s
**Used on:** Cards, sections

### 2. Slide Down (Dropdowns)
```
Frame 1:  ▼ (above, transparent)
Frame 2:  ▼ (sliding down, fading in)
Frame 3:  ▼ (in position, opaque)
```
**Duration:** 0.3s
**Used on:** Notification dropdown, menus

### 3. Pulse (Badges)
```
Frame 1:  ● (normal size)
Frame 2:  ◉ (scaled 1.1x)
Frame 3:  ● (back to normal)
```
**Duration:** 2s (infinite)
**Used on:** Notification badge, status indicators

### 4. Hover Lift (Cards)
```
Default:  ┌────┐
          │    │ ← Shadow
          └────┘

Hover:    ┌────┐ ← Moves up
          │    │
          └────┘
             ▓▓▓ ← Larger shadow
```
**Used on:** Cards, buttons

### 5. Icon Rotation (Activity)
```
Default:  📝 (0°)
Hover:    📝 (rotates 10° + scales 1.1x)
```
**Used on:** Activity feed icons

---

## 📏 Spacing Scale

Visual representation of spacing:

```
0.25rem (4px):   ▪
0.5rem (8px):    ▪▪
0.75rem (12px):  ▪▪▪
1rem (16px):     ▪▪▪▪
1.5rem (24px):   ▪▪▪▪▪▪
2rem (32px):     ▪▪▪▪▪▪▪▪
2.5rem (40px):   ▪▪▪▪▪▪▪▪▪▪
3rem (48px):     ▪▪▪▪▪▪▪▪▪▪▪▪
```

**Common uses:**
- `p-2` (0.5rem): Tight padding
- `p-4` (1rem): Standard padding
- `p-6` (1.5rem): Card padding
- `gap-4` (1rem): Element spacing
- `space-y-8` (2rem): Section spacing

---

## 🎨 Color System Visual

### Brand Colors
```
Primary (Purple):    ██████  #6C5CE7
Accent (Pink):       ██████  #FF7675
Secondary (Teal):    ██████  #2ED8B6
Highlight (Gold):    ██████  #FDCB6E
```

### Gradient Examples
```
Primary Gradient:    ████████████  (Purple → Dark Purple)
Accent Gradient:     ████████████  (Pink → Red)
Success Gradient:    ████████████  (Teal → Dark Teal)
```

### Text Colors
```
Primary Text:        ████  #1F2937  (Dark Gray)
Secondary Text:      ████  #4B5563  (Medium Gray)
Muted Text:          ████  #9CA3AF  (Light Gray)
Disabled Text:       ████  #CBD5E1  (Very Light)
```

### Status Colors
```
Success:  ████  #22C55E  (Green)
Warning:  ████  #D97706  (Orange)
Error:    ████  #DC2626  (Red)
Info:     ████  #3B82F6  (Blue)
```

---

## 📱 Responsive Behavior

### Desktop (1024px+)
```
┌─────────────────────────────────────────────────┐
│ Sidebar │ Main Content (Dashboard)              │
│ 280px   │                                        │
│         │  ┌─────────────┬──────────┐          │
│ Fixed   │  │ Analytics   │ Activity │          │
│         │  │ (2 cols)    │ (1 col)  │          │
│         │  └─────────────┴──────────┘          │
└─────────────────────────────────────────────────┘
```

### Tablet (640px - 1024px)
```
┌─────────────────────────────────────┐
│ ☰                                   │ ← Hamburger menu
│                                     │
│  ┌───────────────────────────────┐ │
│  │ Main Content (Full Width)     │ │
│  │                               │ │
│  │ ┌─────────────────────────┐  │ │
│  │ │ Analytics (Full Width)   │  │ │ ← Stacked
│  │ └─────────────────────────┘  │ │
│  │ ┌─────────────────────────┐  │ │
│  │ │ Activity (Full Width)    │  │ │
│  │ └─────────────────────────┘  │ │
│  └───────────────────────────────┘ │
└─────────────────────────────────────┘

Sidebar (Hidden by default):
┌──────────────┐
│ Sidebar      │ ← Slides in from left
│              │
│ [Close ✕]   │
└──────────────┘
```

### Mobile (< 640px)
```
┌─────────────────────┐
│ ☰                   │ ← Hamburger
│                     │
│  ┌──────────────┐  │
│  │ Main Content │  │
│  │              │  │
│  │ ┌──────────┐ │  │
│  │ │Analytics │ │  │ ← Full width
│  │ └──────────┘ │  │
│  │ ┌──────────┐ │  │
│  │ │Activity  │ │  │ ← Full width
│  │ └──────────┘ │  │
│  │ ┌──────────┐ │  │
│  │ │Table     │ │  │ ← Scrollable
│  │ │→→→→→→→→→│ │  │    horizontally
│  │ └──────────┘ │  │
│  └──────────────┘  │
└─────────────────────┘

FAB (Smaller):
       ╭────╮
       │ + │ ← Compact version
       ╰────╯
```

---

## 🎯 Interaction States

### Buttons
```
Default:   ┌─────────┐
           │ Button  │
           └─────────┘

Hover:     ┌─────────┐ ← Shadow grows
           │ Button  │    Slight scale
           └─────────┘
              ▓▓▓

Active:    ┌─────────┐ ← Pressed down
           │ Button  │
           └─────────┘

Disabled:  ┌─────────┐ ← Grayed out
           │ Button  │    No interaction
           └─────────┘
```

### Links
```
Default:   Link Text

Hover:     Link Text
           ─────────  ← Underline animates in

Active:    Link Text
           ═════════  ← Full underline
```

### Input Fields
```
Default:   ┌──────────────────┐
           │                  │
           └──────────────────┘

Focus:     ┌──────────────────┐ ← Purple border
           │ |                │    Shadow appears
           └──────────────────┘
                ▓▓▓

Error:     ┌──────────────────┐ ← Red border
           │ Invalid input    │
           └──────────────────┘
           ✗ Error message
```

---

## 🔔 Notification Badge States

```
No unread:     🔔  (Gray bell, no badge)

1-9 unread:    🔔  (Badge with number)
               (3)

10+ unread:    🔔  (Badge with 9+)
               (9+)

Hover:         🔔  (Scales up, shadow grows)
               (3)
               ▓▓

Click:         🔔  (Dropdown opens below)
               (3)
               ▼
           ╔═══════════╗
           ║ Notifs... ║
           ╚═══════════╝
```

---

## 🎨 Card Hierarchy

Visual depth through shadows:

```
Level 1 (Flat):        ┌────┐
                       │    │  (No shadow)
                       └────┘

Level 2 (Elevated):    ┌────┐
                       │    │
                       └────┘
                         ▓

Level 3 (Floating):    ┌────┐
                       │    │
                       └────┘
                        ▓▓▓

Level 4 (Modal):       ┌────┐
                       │    │
                       └────┘
                       ▓▓▓▓▓
```

**Usage:**
- Level 1: Background elements
- Level 2: Standard cards
- Level 3: Hovered cards, dropdowns
- Level 4: Modals, overlays

---

## ✨ Special Effects

### Gradient Text
```
Standard Text:  Welcome to Dashboard

Gradient Text:  Welcome to Dashboard
                ╰─────────────────────╯
                (Purple → Pink gradient)
```

### Glassmorphism (Future)
```
┌────────────────────┐
│ ░░░░░░░░░░░░░░░░░░│ ← Frosted glass effect
│ ░░ Content ░░░░░░░│
│ ░░░░░░░░░░░░░░░░░░│
└────────────────────┘
```

### Animated Background
```
┌─────────────────────────────┐
│ ▓▓▓░░░                      │ ← Subtle gradient animation
│    ▓▓▓░░░                   │    (moves diagonally)
│       ▓▓▓░░░                │
└─────────────────────────────┘
```

---

## 📊 Component Combinations

### Dashboard Overview Layout
```
┌─────────────────────────────────────────────────────┐
│ Sidebar │ ┌─────────────────────────────────────┐ │
│         │ │ Dashboard Header                    │ │
│         │ │ Welcome + Notification Bell         │ │
│         │ └─────────────────────────────────────┘ │
│         │                                         │
│         │ ┌─────────────────────┬──────────────┐│
│         │ │ Analytics Chart     │ Activity Feed││
│         │ │ (2/3 width)         │ (1/3 width)  ││
│         │ └─────────────────────┴──────────────┘│
│         │                                         │
│         │ ┌─────────────────────────────────────┐│
│         │ │ Brand Table (Full Width)            ││
│         │ └─────────────────────────────────────┘│
│         │                                         │
│         │                           ╭──────────╮ │
│         │                           │ FAB      │ │
│         │                           ╰──────────╯ │
└─────────────────────────────────────────────────────┘
```

---

## 🎯 Best Practices Summary

### ✅ DO
- Use CSS classes consistently
- Follow naming conventions
- Add hover states to interactive elements
- Include focus indicators for accessibility
- Use CSS variables for colors
- Test on mobile devices
- Maintain visual hierarchy with shadows

### ❌ DON'T
- Mix inline styles with CSS classes
- Override transition timings arbitrarily
- Add colors without using CSS variables
- Forget responsive behavior
- Skip accessibility features
- Use hard-coded pixel values
- Ignore loading/empty states

---

## 📱 Touch Target Sizes

Minimum recommended sizes for mobile:

```
Small:   ┌──────┐  32px × 32px
         │      │  (Icons, compact buttons)
         └──────┘

Medium:  ┌──────────┐  40px × 40px
         │          │  (Standard buttons)
         └──────────┘

Large:   ┌────────────┐  48px × 48px
         │            │  (Primary actions, FAB)
         └────────────┘
```

**All interactive elements meet minimum 44px touch target on mobile.**

---

## 🎨 Typography Scale

```
Hero (3rem/48px):       Main Dashboard Title

Heading 1 (2rem/32px):  Section Headers

Heading 2 (1.5rem/24px): Card Titles

Heading 3 (1.25rem/20px): Subsection Headers

Body (1rem/16px):       Standard text

Small (0.875rem/14px):  Captions, labels

Tiny (0.75rem/12px):    Timestamps, metadata
```

**Line heights:**
- Headings: 1.2
- Body text: 1.5
- Small text: 1.4

---

**This showcase demonstrates the complete visual design system implemented for Collab Vertex.**