# Quick Start - Authentication

## Setup (One-time)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env.local` file:**
   ```bash
   cp .env.example .env.local
   ```

3. **Generate NextAuth secret:**
   ```bash
   openssl rand -base64 32
   ```
   Copy the output and paste it as `NEXTAUTH_SECRET` in `.env.local`

4. **Start development server:**
   ```bash
   npm run dev
   ```

## Testing Authentication

1. **Access login page:**
   - Navigate to `http://localhost:3000/login`

2. **Login with admin credentials:**
   - Email: `admin@ovwtn.ke`
   - Password: (from backend seed script)

3. **Verify redirects:**
   - Admin users → `/admin`
   - Member users → `/dashboard`
   - Unauthenticated → `/login`

## Common Usage Patterns

### Protect a Page Component

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
      <div>Admin content</div>
    </ProtectedRoute>
  );
}
```

### Use Auth in Component

```javascript
'use client';
import { useAuth } from '@/hooks/useAuth';

export default function MyComponent() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  
  if (!isAuthenticated) return <div>Please login</div>;
  
  return <div>Hello {user?.email}</div>;
}
```

### Add Logout Button

```javascript
import LogoutButton from '@/components/LogoutButton';

<LogoutButton className="px-4 py-2 rounded bg-red-500 text-white">
  Sign Out
</LogoutButton>
```

## Troubleshooting

**Issue: "Invalid credentials" error**
- Check backend is running on `http://localhost:8000`
- Verify backend `/api/v1/auth/login` endpoint exists
- Check `.env.local` has correct `NEXT_PUBLIC_API_URL`

**Issue: Session not persisting**
- Check `NEXTAUTH_SECRET` is set in `.env.local`
- Clear browser cookies and try again
- Check browser console for errors

**Issue: Redirect loop**
- Verify middleware matcher excludes public routes
- Check `callbackUrl` parameter handling

## File Structure

```
src/
├── app/
│   ├── login/page.js          # Login page
│   ├── dashboard/page.js       # Member dashboard (example)
│   ├── admin/page.js           # Admin dashboard (example)
│   └── api/auth/[...nextauth]/route.js  # NextAuth API route
├── components/
│   ├── ProtectedRoute.js      # Route protection wrapper
│   ├── LogoutButton.js         # Logout component
│   └── SessionProvider.js     # Session sync component
├── hooks/
│   └── useAuth.js             # Auth hook
├── lib/
│   ├── auth.js                # NextAuth configuration
│   └── api.js                 # API utilities (with auth)
├── store/
│   └── useAuthStore.js        # Zustand auth store
└── middleware.js              # Route protection middleware
```
