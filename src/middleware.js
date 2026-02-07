import { auth } from "@/lib/auth";

/**
 * Next.js Middleware for route protection
 * Protects routes that require authentication
 */
export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.auth;

  // Public routes that don't require authentication
  const publicRoutes = [
    '/',
    '/login',
    '/apply',
    '/directory',
    '/api/auth',
  ];

  // Check if route is public
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith(route)
  );

  // Allow public routes and API auth routes
  if (isPublicRoute) {
    return;
  }

  // Redirect to login if accessing protected route without auth
  if (!isAuthenticated) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return Response.redirect(loginUrl);
  }

  // Role-based access control for admin routes
  if (pathname.startsWith('/admin') && req.auth?.user?.role !== 'admin') {
    // Redirect non-admin users to member portal
    return Response.redirect(new URL('/member', req.url));
  }

  // Role-based access control for member routes
  if (pathname.startsWith('/member') && req.auth?.user?.role !== 'member') {
    // Redirect non-member users to admin or dashboard
    if (req.auth?.user?.role === 'admin') {
      return Response.redirect(new URL('/admin', req.url));
    }
    return Response.redirect(new URL('/dashboard', req.url));
  }
});

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
