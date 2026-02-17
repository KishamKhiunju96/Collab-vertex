# Tailwind Utilities & Reusable CSS Guide

This guide documents all the custom Tailwind utilities, animations, and CSS classes available in the Collab-Vertex project for creating consistent, beautiful interfaces across all pages.

## Table of Contents
- [Custom Animations](#custom-animations)
- [Brand Colors](#brand-colors)
- [Background Utilities](#background-utilities)
- [Custom Utilities](#custom-utilities)
- [Component Patterns](#component-patterns)
- [Usage Examples](#usage-examples)

---

## Custom Animations

### Available Animations

#### 1. **Gradient Shift**
Smooth infinite gradient animation for backgrounds.

```jsx
<div className="bg-gradient-hero bg-200% animate-gradient-shift">
  Beautiful gradient background
</div>
```

**Use cases:** Hero sections, feature cards, attention-grabbing elements

---

#### 2. **Float**
Gentle floating effect for elements.

```jsx
<div className="animate-float">
  Floating element
</div>
```

**Use cases:** Icons, illustrations, decorative elements

---

#### 3. **Pulse Glow**
Pulsing shadow/glow effect.

```jsx
<button className="animate-pulse-glow">
  Glowing Button
</button>
```

**Use cases:** Call-to-action buttons, notifications, highlights

---

#### 4. **Fade In Up**
Element fades in while sliding up.

```jsx
<div className="animate-fade-in-up">
  Content appears smoothly
</div>
```

**Use cases:** Page content, cards, sections on scroll

---

#### 5. **Slide Animations**
Slide in/out from different directions.

```jsx
// Slide from right
<div className="animate-slide-in-right">Mobile Menu</div>

// Slide from left
<div className="animate-slide-in-left">Sidebar</div>
```

**Use cases:** Modals, drawers, side menus, notifications

---

#### 6. **Scale In**
Zoom in with fade effect.

```jsx
<div className="animate-scale-in">
  Popup content
</div>
```

**Use cases:** Modals, tooltips, dropdown menus

---

## Brand Colors

### Primary Brand Colors

```jsx
// Electric Violet (Primary)
<div className="bg-brand-primary text-white">Primary</div>
<div className="text-brand-primary">Primary Text</div>
<div className="border-brand-primary">Primary Border</div>

// Coral Pink (Accent)
<div className="bg-brand-accent text-white">Accent</div>
<div className="hover:text-brand-accent">Hover Accent</div>

// Mint Teal (Secondary)
<div className="bg-brand-secondary text-white">Secondary</div>

// Soft Gold (Highlight)
<div className="bg-brand-highlight text-gray-800">Highlight</div>
```

### Background Colors

```jsx
// Light & Joyful backgrounds
<section className="bg-background-hero">Hero Section</section>
<section className="bg-background-alternate">Alternate Section</section>
<div className="bg-background-card">Card Background</div>
<div className="bg-background-surface">Surface</div>

// Hover/Interactive states
<div className="hover:bg-background-hoverFade">Hover Effect</div>
<div className="bg-background-selected">Selected State</div>
```

### Text Colors

```jsx
// Text hierarchy
<h1 className="text-text-primary">Primary Heading</h1>
<p className="text-text-secondary">Secondary Text</p>
<span className="text-text-muted">Muted Text</span>
<span className="text-text-disabled">Disabled Text</span>

// Semantic colors
<span className="text-text-success">Success Message</span>
<span className="text-text-warning">Warning Message</span>
<span className="text-text-error">Error Message</span>
```

### Button System

```jsx
// Primary Button
<button className="bg-button-primary hover:bg-button-primary-hover 
                   active:bg-button-primary-active text-button-primary-text
                   px-6 py-2.5 rounded-lg font-medium transition-smooth
                   shadow-md hover:shadow-lg transform hover:-translate-y-0.5">
  Primary Action
</button>

// Secondary Button
<button className="bg-button-secondary hover:bg-button-secondary-hover
                   text-button-secondary-text px-6 py-2.5 rounded-lg
                   font-medium transition-smooth">
  Secondary Action
</button>

// Tertiary Button (Outlined)
<button className="border-2 border-button-tertiary-border 
                   text-button-tertiary-text hover:bg-button-tertiary-hover
                   active:bg-button-tertiary-active px-6 py-2.5 rounded-lg
                   font-medium transition-smooth">
  Tertiary Action
</button>
```

---

## Background Utilities

### Gradient Backgrounds

```jsx
// Pre-defined gradients
<div className="bg-gradient-primary">Primary Gradient</div>
<div className="bg-gradient-accent">Accent Gradient</div>
<div className="bg-gradient-hero">Hero Gradient</div>
<div className="bg-gradient-footer">Footer Gradient</div>

// With animation
<div className="bg-gradient-hero bg-200% animate-gradient-shift">
  Animated Gradient
</div>
```

### Grid Patterns

```jsx
// White grid pattern (for dark backgrounds)
<div className="bg-brand-primary bg-grid-pattern bg-grid-md">
  Content with grid pattern
</div>

// Sizes available: bg-grid-sm, bg-grid-md, bg-grid-lg
```

### Glass Morphism

```jsx
// Light glass effect
<div className="bg-glass border border-border-subtle rounded-xl p-6">
  Glass morphism card
</div>

// Dark glass effect
<div className="bg-glass-dark text-white border border-white/20 rounded-xl p-6">
  Dark glass card
</div>
```

---

## Custom Utilities

### Text Gradient

Apply gradient to text (requires gradient background).

```jsx
<h1 className="text-gradient bg-gradient-hero text-5xl font-bold">
  Gradient Text
</h1>
```

### Smooth Transitions

Consistent smooth transitions across all properties.

```jsx
<button className="transition-smooth hover:scale-105">
  Smooth Hover
</button>
```

### Hide Scrollbar

Hide scrollbar while maintaining scroll functionality.

```jsx
<div className="overflow-auto scrollbar-hide">
  Scrollable content without visible scrollbar
</div>
```

### Backdrop Blur

```jsx
// Available sizes: xs, sm, md, lg, xl
<div className="backdrop-blur-md bg-white/80">
  Blurred background
</div>
```

---

## Component Patterns

### Navbar Pattern

```jsx
<nav className="sticky top-0 z-sticky bg-glass border-b border-border-subtle shadow-sm">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex h-16 items-center justify-between">
      {/* Logo */}
      <a href="/" className="text-2xl font-bold text-brand-primary 
                             hover:text-brand-accent transition-smooth">
        Brand
      </a>
      
      {/* Links */}
      <div className="hidden md:flex items-center gap-8">
        <a className="text-text-secondary font-medium hover:text-brand-primary 
                      transition-smooth relative group">
          Link
          <span className="absolute -bottom-1 left-0 w-0 h-0.5 
                          bg-brand-primary transition-all duration-300 
                          group-hover:w-full"></span>
        </a>
      </div>
    </div>
  </div>
</nav>
```

### Card Pattern

```jsx
<div className="bg-background-card rounded-xl p-6 shadow-card 
                hover:shadow-lg transition-smooth 
                border border-border-subtle animate-fade-in-up">
  <h3 className="text-text-primary font-semibold text-xl mb-3">
    Card Title
  </h3>
  <p className="text-text-secondary">
    Card content goes here
  </p>
</div>
```

### Status Badge Pattern

```jsx
// Success Badge
<span className="bg-status-successBg text-status-successText 
                 px-3 py-1 rounded-full text-sm font-medium">
  Active
</span>

// Warning Badge
<span className="bg-status-warningBg text-status-warningText 
                 px-3 py-1 rounded-full text-sm font-medium">
  Pending
</span>

// Error Badge
<span className="bg-status-errorBg text-status-errorText 
                 px-3 py-1 rounded-full text-sm font-medium">
  Failed
</span>

// Info Badge
<span className="bg-status-infoBg text-status-infoText 
                 px-3 py-1 rounded-full text-sm font-medium">
  Info
</span
