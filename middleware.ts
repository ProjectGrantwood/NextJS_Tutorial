import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';
import { authConfig } from '@/auth.config';
 
const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const isAuthed = !!req.auth;
  const { pathname, search } = req.nextUrl;
  const isPublic = pathname === '/' || pathname.startsWith('/login');
    
  if (!isAuthed && !isPublic) {
    const url = new URL('/login', req.url);
    url.searchParams.set('callbackUrl', pathname + search);
    return NextResponse.redirect(url);
  }
  
  if (isAuthed && isPublic) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  
})
 
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
  // The nextjs dashboard tutorial recommended the 'nodejs' runtime, but this was creating build errors.
  runtime: 'experimental-edge',
};