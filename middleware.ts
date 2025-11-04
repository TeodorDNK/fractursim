import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { defaultLocale, isLocale } from './src/i18n/routing';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname === '/favicon.ico' || pathname.startsWith('/assets')) {
    return NextResponse.next();
  }

  const seg0 = pathname.split('/')[1];
  if (isLocale(seg0)) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = `/${defaultLocale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next|favicon.ico|api|assets).*)']
};
