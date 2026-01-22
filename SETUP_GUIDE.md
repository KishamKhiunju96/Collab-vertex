# Collab Vertex - Setup & Routing Guide

## 🚀 Quick Start

### Prerequisites
- Node.js v22.x or higher
- npm v10.x or higher

### Installation & Running

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Access the Application**
   - Local: http://localhost:3000
   - Network: http://192.168.1.121:3000

---

## 🔐 Authentication & Role-Based Routing

### Overview
The application implements a complete role-based authentication system with three user roles:
- **Brand** - Companies creating campaigns and events
- **Influencer** - Content creators collaborating with brands
- **Admin** - Platform administrators managing the system

### Authentication Flow

#### 1. Registration Flow
```
User visits → /select-role
  ↓
Selects role (Brand/Influencer)
  ↓
Role saved to localStorage as "pendingUserRole"
  ↓
Redirects to → /register
  ↓
RegisterForm reads role from localStorage
  ↓
User completes registration
  ↓
OTP verification at → /verify_otp
  ↓
Upon verification → Token saved → Redirect to /dashboard
```

#### 2. Login Flow
```
User visits → /login
  ↓
Enters credentials
  ↓
LoginForm calls authService.login()
  ↓
Receives user data with role
  ↓
Token saved to localStorage ("collab_vertex_token")
  ↓
Redirects based on role:
  - Brand → /dashboard/brand
  - Influencer → /dashboard/influencer
  - Admin → /dashboard/admin
  - No role → /select-role
```

#### 3. Dashboard Access Flow
```
User accesses /dashboard
  ↓
DashboardRedirectPage fetches /user/me
  ↓
Extracts user role from response
  ↓
Redirects to /dashboard/{role}
  ↓
Role-specific dashboard validates user role
  ↓
If role doesn't match → Redirect to /401
```

---

## 📁 Project Structure

### Key Directories
```
Collab-vertex/
├── src/
│   ├── api/
│   │   ├── axiosInstance.ts          # Axios config with interceptors
│   │   ├── apiPaths.ts                # API endpoint definitions
│   │   ├── hooks/
│   │   │   ├── useAuth.ts             # Authentication hook
│   │   │   └── useUserData.ts         # User data fetching hook
│   │   ├── services/
│   │   │   ├── authService.ts         # Login, register, logout
│   │   │   ├── brandService.ts        # Brand CRUD operations
│   │   │   └── eventService.ts        # Event management
│   │   └── types/
│   │       ├── event.ts               # Event type definitions
│   │       └── user.ts                # User type definitions
│   │
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/                 # Login page
│   │   │   ├── register/              # Registration page
│   │   │   ├── select-role/           # Role selection page
│   │   │   └── verify_otp/            # OTP verification
│   │   │
│   │   ├── dashboard/
│   │   │   ├── page.tsx               # Dashboard redirect logic
│   │   │   ├── layout.tsx             # Dashboard layout with sidebar
│   │   │   ├── admin/
│   │   │   │   └── page.tsx           # Admin dashboard
│   │   │   ├── brand/
│   │   │   │   ├── page.tsx           # Brand dashboard
│   │   │   │   └── [brandID]/         # Individual brand pages
│   │   │   └── influencer/
│   │   │       └── page.tsx           # Influencer dashboard
│   │   │
│   │   └── layout.tsx                 # Root layout
│   │
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx          # Login form component
│   │   │   └── RegisterForm.tsx       # Registration form
│   │   └── dashboard/
│   │       ├── SideBar.tsx            # Dashboard navigation
│   │       └── CreateBrandForm.tsx    # Brand creation form
│   │
│   ├── types/
│   │   ├── brand.ts                   # Brand interface
│   │   ├── event.ts                   # Event payloads
│   │   └── user.ts                    # User role types
│   │
│   └── utils/
│       └── auth.ts                    # Token management utilities
│
├── public/
│   └── images/                        # Static images
│
└── package.json
```

---

## 🛣️ Route Mapping

### Public Routes
| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `app/page.tsx` | Landing page |
| `/login` | `app/(auth)/login/page.tsx` | Login form |
| `/register` | `app/(auth)/register/page.tsx` | Registration form |
| `/select-role` | `app/(auth)/select-role/page.tsx` | Role selection |
| `/verify_otp` | `app/(auth)/verify_otp/page.tsx` | OTP verification |

### Protected Routes (Requires Authentication)
| Route | Component | Role Required | Description |
|-------|-----------|---------------|-------------|
| `/dashboard` | `app/dashboard/page.tsx` | Any | Redirects to role-specific dashboard |
| `/dashboard/admin` | `app/dashboard/admin/page.tsx` | Admin | Admin control panel |
| `/dashboard/brand` | `app/dashboard/brand/page.tsx` | Brand | Brand management dashboard |
| `/dashboard/brand/[brandID]` | `app/dashboard/brand/[brandID]/page.tsx` | Brand | Individual brand details & events |
| `/dashboard/influencer` | `app/dashboard/influencer/page.tsx` | Influencer | Influencer dashboard |
| `/dashboard/profile` | `app/dashboard/profile/` | Any | User profile settings |
| `/dashboard/settings` | `app/dashboard/settings/` | Any | Account settings |

---

## 🔧 Configuration

### API Configuration
The backend API is configured in `src/api/apiPaths.ts`:

```typescript
BASE_URL = "https://api.dixam.me"
```

### Available API Endpoints

#### User Endpoints
- `POST /user/login` - User authentication
- `POST /user/register` - New user registration
- `GET /user/me` - Get current user data
- `POST /user/logout` - User logout

#### OTP Endpoints
- `POST /otp/verify_otp` - Verify OTP code
- `POST /otp/resend_otp` - Resend OTP

#### Brand Endpoints
- `POST /brand/create_brandprofile` - Create brand
- `GET /brand/get_brandprofile` - Get brand profile
- `PUT /brand/update_brandprofile` - Update brand
- `DELETE /brand/delete_brandprofile` - Delete brand
- `GET /brand/brandsbyuser` - Get all brands by user

#### Event Endpoints
- `POST /event/create_event/{brandId}` - Create event
- `GET /event/eventsbybrand/{brandId}` - Get events by brand
- `PUT /event/update_event/{eventId}` - Update event
- `DELETE /event/delete_event/{eventId}` - Delete event

---

## 🔑 Key Features Implemented

### 1. Token-Based Authentication
- JWT tokens stored in `localStorage` as `collab_vertex_token`
- Automatic token injection via Axios interceptors
- Token validation on protected routes

### 2. Role-Based Access Control (RBAC)
- Three distinct user roles: Admin, Brand, Influencer
- Role verification at dashboard level
- Unauthorized access redirects to `/401`

### 3. Protected Route System
- Dashboard layout wrapper checks authentication
- Individual pages verify role permissions
- Automatic redirect to login if unauthenticated

### 4. Axios Request/Response Interceptors
- Automatic Authorization header injection
- 401 error handling (clears token, redirects to login)
- Centralized error management

### 5. Custom Hooks
- `useAuth()` - Authentication state management
- `useAuthProtection()` - Protected route wrapper
- `useUserData()` - User profile data fetching

---

## 🎨 Dashboard Features by Role

### Admin Dashboard (`/dashboard/admin`)
- User statistics overview
- Platform monitoring
- System configuration access
- Activity logs

### Brand Dashboard (`/dashboard/brand`)
- Brand profile management
- Create and manage brands
- Event creation and tracking
- Collaboration management
- Brand-specific analytics

### Influencer Dashboard (`/dashboard/influencer`)
- Active events overview
- Collaboration tracking
- Earnings summary
- Brand discovery
- Profile management

---

## 🐛 Troubleshooting

### Common Issues

1. **Server won't start**
   - Ensure Node.js v22+ is installed
   - Clear `.next` cache: `rm -rf .next`
   - Reinstall dependencies: `rm -rf node_modules && npm install`

2. **Authentication not working**
   - Check browser console for errors
   - Verify token in localStorage: `collab_vertex_token`
   - Ensure API base URL is correct in `src/api/apiPaths.ts`

3. **401 Unauthorized errors**
   - Token may be expired or invalid
   - Clear localStorage and login again
   - Check network tab for API response details

4. **Role redirect not working**
   - Check user role in API response (`/user/me`)
   - Verify role matches one of: "admin", "brand", "influencer"
   - Check browser console for redirect logs

---

## 📝 Development Notes

### Recent Fixes Applied
1. ✅ Created admin dashboard page
2. ✅ Fixed LoginForm to handle all three roles
3. ✅ Improved dashboard redirect with better loading UI
4. ✅ Fixed TypeScript errors in brand pages
5. ✅ Removed deprecated middleware (Next.js 16 compatibility)
6. ✅ Unified Brand and Event type definitions

### Type Definitions
- Use `Brand` from `@/api/services/brandService`
- Use `Event` from `@/api/types/event`
- Use `UserRole` from `@/types/user` or `@/api/hooks/useAuth`

### Best Practices
- Always use TypeScript interfaces for API responses
- Leverage custom hooks for data fetching
- Use `router.replace()` for redirects to prevent back navigation
- Handle loading and error states in components
- Validate user roles at both frontend and backend

---

## 🚀 Next Steps

### Recommended Enhancements
1. Implement forgot password functionality
2. Add email verification flow
3. Create admin user management interface
4. Add real-time notifications
5. Implement search and filter for brands/events
6. Add analytics dashboards
7. Create brand update modal
8. Implement event management features

---

## 📞 Support

For issues or questions:
- Check the browser console for errors
- Review API responses in Network tab
- Verify token and user role in localStorage
- Check that backend API is running at `https://api.dixam.me`

---

**Last Updated:** 2025
**Next.js Version:** 16.1.1
**React Version:** 19.2.3