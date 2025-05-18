import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const isAuthenticated = !!token;

  // Get the pathname of the request
  const path = request.nextUrl.pathname;

  // If user is authenticated and trying to access the home page
  if (isAuthenticated && path === '/') {
    // Redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: ['/'], // Only run middleware on the home page
}; 