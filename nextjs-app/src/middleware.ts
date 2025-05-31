import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { apiSecurity } from './middleware/api-security';

export async function middleware(request: NextRequest) {
  // Apply API security measures for all API routes
  if (request.nextUrl.pathname.startsWith('/api')) {
    const securityResponse = await apiSecurity(request);
    if (securityResponse) return securityResponse;
  }

  // Existing authentication middleware
  const token = await getToken({ req: request });
  const isAuthenticated = !!token;
  const path = request.nextUrl.pathname;

  // If user is authenticated and trying to access auth pages
  if (isAuthenticated && (path === '/signin' || path === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If user is authenticated and trying to access the home page
  if (isAuthenticated && path === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    '/api/:path*',
    '/',
    '/signin',
    '/signup',
    '/dashboard/:path*',
    '/user/:path*',
    '/resume/:path*'
  ]
}; 