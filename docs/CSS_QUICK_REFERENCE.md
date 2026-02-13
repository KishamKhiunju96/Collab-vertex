# Dashboard CSS - Quick Reference Cheat Sheet

## 🎯 Core Container Classes

| Class | Purpose | Example |
|-------|---------|---------|
| `.dashboard-container` | Main dashboard wrapper | `<div className="dashboard-container">` |
| `.dashboard-header` | Header section with title | `<div className="dashboard-header">` |
| `.dashboard-title` | Gradient title text | `<h1 className="dashboard-title">` |
| `.dashboard-subtitle` | Secondary description | `<p className="dashboard-subtitle">` |

---

## 🔔 Notification System

| Class | Purpose |
|-------|---------|
| `.notification-bell` | Bell icon button with hover effect |
| `.notification-badge` | Red badge with count (includes pulse animation) |
| `.notification-dropdown` | Dropdown container with shadow |
| `.notification-header` | Dropdown header section |
| `.notification-title` | "Notifications" title text |
| `.notification-mark-all` | "Mark all as read" button |
| `.notification-list` | Scrollable notifications container |
| `.notification-item` | Individual notification row |
| `.notification-item.unread` | Unread notification (blue accent) |
| `.notification-item-title` | Notification title text |
| `.notification-item-message` | Notification message text |
| `.notification-item-time` | Timestamp text |
| `.notification-unread-indicator` | Unread dot + "New" text wrapper |
| `.notification-unread-dot` | Animated blue dot |
| `.notification-unread-text` | "New" label text |
| `.notification-delete-btn` | Delete button (red on hover) |
| `.notification-empty` | Empty state message |

---

## 📊 Brand Table

| Class | Purpose |
|-------|---------|
| `.brand-table-container` | Table wrapper with shadow |
| `.brand-table` | Table element |
| `.brand-table-link` | Brand name link (animated underline) |
| `.brand-table-actions` | Action buttons container |
| `.brand-table-action-btn` | Action button (view/edit/delete) |
| `.brand-table-action-btn.delete` | Delete button (red on hover) |

**Note**: Table has gradient header and hover row effects built-in.

---

## 📈 Analytics Chart

| Class | Purpose |
|-------|---------|
| `.analytics-card` | Chart card container |
| `.analytics-header` | Chart header section |
| `.analytics-title` | Chart title |
| `.analytics-subtitle` | Chart description |
| `.analytics-legend` | Legend container (flex row) |
| `.analytics-legend-item` | Individual legend item |
| `.analytics-legend-dot` | Colored indicator dot |
| `.analytics-legend-label` | Legend label text |

---

## 📝 Activity Feed

| Class | Purpose |
|-------|---------|
| `.activity-card` | Activity feed card container |
| `.activity-header` | Feed header section |
| `.activity-title` | Feed title |
| `.activity-subtitle` | Feed description |
| `.activity-list` | Scrollable activity list |
| `.activity-item` | Individual activity row (has hover effect) |
| `.activity-icon` | Circular icon container |
| `.activity-content` | Activity text wrapper |
| `.activity-item-title` | Activity title (bold) |
| `.activity-item-description` | Activity description |
| `.activity-item-time` | Timestamp |

---

## 🧭 Sidebar Navigation

| Class | Purpose |
|-------|---------|
| `.sidebar` | Main sidebar container (dark theme) |
| `.sidebar-header` | Logo section |
| `.sidebar-logo` | Logo link wrapper |
| `.sidebar-logo-icon` | Brand icon with gradient background |
| `.sidebar-logo-text` | "Collab Vertex" text |
| `.sidebar-nav` | Navigation container |
| `.sidebar-nav-group` | Navigation category group |
| `.sidebar-nav-group-title` | Category title (uppercase, gray) |
| `.sidebar-nav-item` | Navigation link |
| `.sidebar-nav-item.active` | Active page link (gradient bg) |
| `.sidebar-nav-icon` | Navigation icon |
| `.sidebar-footer` | Footer section |
| `.sidebar-user` | User profile card (clickable) |
| `.sidebar-user-avatar` | User avatar with initials |
| `.sidebar-user-info` | User info text wrapper |
| `.sidebar-user-name` | User display name |
| `.sidebar-user-role` | User role badge |

---

## 🚀 Action Buttons

| Class | Purpose |
|-------|---------|
| `.fab-button` | Floating action button (bottom-right) |

**Features**: Gradient background, shadow, hover lift effect

---

## 🎭 State Classes

| Class | Purpose |
|-------|---------|
| `.loading-spinner` | Animated loading spinner |
| `.skeleton` | Shimmer loading placeholder |
| `.empty-state` | Empty state container |
| `.empty-state-icon` | Empty state icon |
| `.empty-state-title` | Empty state title |
| `.empty-state-description` | Empty state description |

---

## 📱 Mobile-Specific

| Class | Purpose |
|-------|---------|
| `.mobile-menu-toggle` | Mobile menu hamburger button |
| `.sidebar-overlay` | Dark overlay behind sidebar |
| `.sidebar-overlay.active` | Active overlay (visible) |

**Mobile Behavior**:
- Sidebar hidden by default on `< 1024px`
- Add `.open` to sidebar to show it
- Use overlay for click-outside dismiss

---

## 🎨 CSS Variables Reference

```css
/* Brand Colors */
--brand-primary: #6c5ce7
--brand-accent: #ff7675
--brand-secondary: #2ed8b6
--brand-highlight: #fdcb6e

/* Gradients */
--gradient-primary: linear-gradient(135deg, #6c5ce7 0%, #5a4bd8 100%)
--gradient-accent: linear-gradient(135deg, #ff7675 0%, #ff5c5b 100%)
--gradient-success: linear-gradient(135deg, #2ed8b6 0%, #26c9a7 100%)

/* Shadows */
--shadow-sm: 0 2px 6px rgba(0, 0, 0, 0.06)
--shadow-md: 0 4px 16px rgba(108, 92, 231, 0.12)
--shadow-lg: 0 12px 30px rgba(108, 92, 231, 0.18)
--shadow-card: 0 4px 20px rgba(0, 0, 0, 0.08)
--shadow-elevated: 0 10px 40px rgba(0, 0, 0, 0.15)

/* Transitions */
--transition-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-base: 250ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-slow: 350ms cubic-bezier(0.4, 0, 0.2, 1)
```

---

## ⚡ Common Patterns

### Dashboard Page Structure
```tsx
<div className="dashboard-container p-6 space-y-8">
  {/* Header */}
  <div className="dashboard-header">
    <h1 className="dashboard-title">Title</h1>
    <p className="dashboard-subtitle">Subtitle</p>
  </div>
  
  {/* Content */}
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div className="lg:col-span-2">
      <div className="analytics-card">{/* Chart */}</div>
    </div>
    <div className="activity-card">{/* Activity */}</div>
  </div>
  
  {/* FAB */}
  <button className="fab-button">Create</button>
</div>
```

### Notification Bell
```tsx
<button className="notification-bell" onClick={toggleNotifications}>
  <Bell size={24} />
  {unreadCount > 0 && (
    <span className="notification-badge">{unreadCount}</span>
  )}
</button>
```

### Table with Actions
```tsx
<div className="brand-table-container">
  <table className="brand-table">
    <thead><tr><th>Name</th><th>Actions</th></tr></thead>
    <tbody>
      <tr>
        <td><a className="brand-table-link" href="#">Brand</a></td>
        <td>
          <div className="brand-table-actions">
            <button className="brand-table-action-btn"><Eye /></button>
            <button className="brand-table-action-btn delete"><Trash2 /></button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

### Activity Item
```tsx
<div className="activity-item">
  <div className="activity-icon bg-purple-500">
    <Icon className="h-5 w-5 text-white" />
  </div>
  <div className="activity-content">
    <p className="activity-item-title">Title</p>
    <p className="activity-item-description">Description</p>
    <p className="activity-item-time">2 hours ago</p>
  </div>
</div>
```

---

## 🎬 Animation Classes

| Keyframe | Duration | Usage |
|----------|----------|-------|
| `fadeInUp` | 0.5s | Cards entering viewport |
| `slideDown` | 0.3s | Dropdowns opening |
| `pulse-badge` | 2s (infinite) | Notification badge |
| `pulse-dot` | 2s (infinite) | Unread indicators |
| `spin` | 0.8s (infinite) | Loading spinner |
| `shimmer` | 1.5s (infinite) | Skeleton loaders |

**Applied automatically** - no need to add animation classes manually.

---

## 🎨 Color Utility Classes

Use Tailwind for additional colors:
- `bg-purple-500` - Purple background
- `text-purple-600` - Purple text
- `bg-teal-500` - Teal background
- `text-red-500` - Error red
- `text-green-500` - Success green

---

## 📏 Spacing Scale

Use Tailwind spacing:
- `p-4` = 1rem padding
- `p-6` = 1.5rem padding
- `gap-4` = 1rem gap
- `space-y-8` = 2rem vertical spacing

---

## 🔍 Pro Tips

1. **Always use `.dashboard-container`** as the main wrapper
2. **Cards auto-animate** on page load (fadeInUp)
3. **Hover effects** are built into most components
4. **Dark sidebar** contrasts with light content
5. **Responsive** breakpoint is at `1024px`
6. **Gradients** are available via CSS variables
7. **Shadows** create visual hierarchy
8. **Transitions** are smooth and consistent

---

## 🚫 Common Mistakes

❌ **Don't**: Mix custom classes with inline styles
✅ **Do**: Use CSS variables for consistency

❌ **Don't**: Override transition timings
✅ **Do**: Use predefined transition variables

❌ **Don't**: Add custom colors without variables
✅ **Do**: Define new colors in `:root` first

❌ **Don't**: Forget responsive classes
✅ **Do**: Test on mobile, tablet, desktop

---

## 📚 Related Files

- **Full Documentation**: `docs/BRAND_DASHBOARD_STYLING.md`
- **Main CSS File**: `src/app/globals.css`
- **Tailwind Config**: `tailwind.config.mjs`
- **Component Files**:
  - `src/components/brand/overview/BrandDashboardPage.tsx`
  - `src/components/analytics/AnalyticsChart.tsx`
  - `src/components/brand/overview/ActivityFeed.tsx`
  - `src/components/dashboard/sidebar/Sidebar.tsx`

---

**Quick Find**: Press `Ctrl+F` and search for your component or class name!