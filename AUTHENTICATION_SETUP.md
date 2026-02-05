# Authentication System Setup - Section 3 Frontend

This document describes the frontend authentication implementation for the OVWTN Membership Management Platform.

## Overview

The authentication system uses:
- **NextAuth.js v5** for session management and authentication
- **Zustand** for client-side state management
- **Protected Route Components** for route-level access control
- **Middleware** for automatic route protection

## Files Created/Modified

### Core Authentication Files

1. **`src/lib/auth.js`**
   - NextAuth configuration with credentials provider
   - Connects to FastAPI backend `/api/auth/login` endpoint
   - Handles JWT token storage and session management

2. **`src/app/api/auth/[...nextauth]/route.js`**
   - NextAuth API route handler
   - Handles authentication requests

3. **`src/components/SessionProvider.js`**
   - Custom session provider that syncs NextAuth with Zustand store
   - Wraps the app in `layout.js`

4. **`src/components/ProtectedRoute.js`**
   - Component wrapper for protecting routes
   - Supports role-based access control (admin/member)
   - Shows loading state while checking authentication

5. **`src/components/LogoutButton.js`**
   - Reusable logout button component
   - Handles both NextAuth and Zustand logout

6. **`src/hooks/useAuth.js`**
   - Custom hook combining NextAuth session and Zustand store
   - Provides unified authentication interface

### Pages

7. **`src/app/login/page.js`**
   - Login page with brand colors (#962021, #385664, etc.)
   - Responsive design
   - Form validation and error handling

8. **`src/app/dashboard/page.js`**
   - Example protected member dashboard page

9. **`src/app/admin/page.js`**
   - Example protected admin dashboard page (admin-only)

### Configuration

10. **`src/middleware.js`**
    - Next.js middleware for automatic route protection
    - Redirects unauthenticated users to login

11. **`src/store/useAuthStore.js`** (updated)
    - Updated to work with NextAuth
    - Maintains backward compatibility

12. **`src/lib/api.js`** (updated)
    - Updated to automatically include auth tokens in API requests
    - Helper function to get auth token

13. **`src/app/layout.js`** (updated)
    - Added SessionProvider wrapper

14. **`package.json`** (updated)
    - Added `next-auth@5` dependency

## Environment Variables

Create a `.env.local` file in the project root:

```env
NEXTAUTH_SECRET=your-secret-key-here-change-in-production
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

**Important:** Generate a secure random string for `NEXTAUTH_SECRET`. You can use:
```bash
openssl rand -base64 32
```

## Usage Examples

### Protecting a Page

```javascript
import ProtectedRoute from '@/components/ProtectedRoute';

export default function MyPage() {
  return (
    <ProtectedRoute requireAuth={true}>
      <div>Protected content</div>
    </ProtectedRoute>
  );
}
```

### Admin-Only Page

```javascript
import ProtectedRoute from '@/components/ProtectedRoute';

export default function AdminPage() {
  return (
    <ProtectedRoute requireAuth={true} requireRole="admin">
      <div>Admin only content</div>
    </ProtectedRoute>
  );
}
```

### Using Auth Hook

```javascript
'use client';
import { useAuth } from '@/hooks/useAuth';

export default function MyComponent() {
  const { user, isAuthenticated, isAdmin, isMember } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }
  
  return <div>Welcome, {user?.email}</div>;
}
```

### Logout Button

```javascript
import LogoutButton from '@/components/LogoutButton';

<LogoutButton className="px-4 py-2 bg-red-500 text-white rounded">
  Sign Out
</LogoutButton>
```

### Making Authenticated API Calls

The API utility automatically includes the auth token:

```javascript
import { apiGet, apiPost } from '@/lib/api';

// Token is automatically included
const data = await apiGet('/members');
const result = await apiPost('/listings', { title: 'New Listing' });
```

## Backend Integration

The frontend expects the backend to have:

1. **POST `/api/v1/auth/login`**
   - Request: `{ email: string, password: string }`
   - Response: `{ user: {...}, access_token: string }` or `{ access_token: string, token: string }`

2. **POST `/api/v1/auth/logout`** (optional, handled by NextAuth)

The backend should return user data in this format:
```json
{
  "user": {
    "id": 1,
    "email": "admin@ovwtn.ke",
    "name": "Admin User",
    "role": "admin",
    "organisation_id": null
  },
  "access_token": "jwt-token-here"
}
```

## Testing

1. **Login Flow:**
   - Navigate to `/login`
   - Enter credentials (admin@ovwtn.ke)
   - Should redirect to `/admin` or `/dashboard` based on role

2. **Protected Routes:**
   - Try accessing `/dashboard` or `/admin` without logging in
   - Should redirect to `/login`

3. **Logout:**
   - Click logout button
   - Should clear session and redirect to `/login`

4. **Role-Based Access:**
   - Admin users can access `/admin`
   - Non-admin users redirected from `/admin` to `/dashboard`

## Brand Colors Used

- Primary: `#962021` (red)
- Secondary: `#385664` (blue-green)
- Accent: `#91a27b` (green)
- Orange: `#d96534`
- Text Primary: `#1B1D1B`
- Text Secondary: `#61657e`
- Text Tertiary: `#9fa1af`

## Next Steps

1. Install dependencies: `npm install`
2. Set up environment variables in `.env.local`
3. Ensure backend authentication endpoints are implemented
4. Test the login flow with the admin user created in the backend seed script

## Notes

- The authentication system uses JWT tokens stored in HTTP-only cookies (via NextAuth)
- Zustand store is synced with NextAuth session for client-side access
- All API calls automatically include the auth token in the Authorization header
- Protected routes can be configured at both component and middleware levels
