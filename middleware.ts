import createMiddleware from 'next-intl/middleware';
import { routing } from './lib/i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match all pathnames except internal paths and static files
  matcher: ['/((?!_next|_vercel|api|.*\\..*).*)'],
};
