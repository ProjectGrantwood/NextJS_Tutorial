import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
 
const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const isAuthed = !!req.auth;
  const { pathname } = req.nextUrl;
  const isPublic =
    pathname.startsWith('/login') ||
    pathname.startsWith('/');
    
  if (!isAuthed && !isPublic) {
    const url = new URL('/login', req.url);
    return Response.redirect(url);
  }
  
})
 
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
  // The nextjs dashboard tutorial recommended the 'nodejs' runtime, but this was creating build errors.
  runtime: 'experimental-edge',
};