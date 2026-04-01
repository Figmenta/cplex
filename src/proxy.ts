import { NextRequest, NextResponse } from 'next/server';
import { LOCALES, DEFAULT_LOCALE, isValidLocale } from '@/lib/i18n/constants';

/**
 * Determines the best locale based on user preferences
 */
function getLocale(request: NextRequest) {
  // Check if there is a preferred locale in cookies
  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value;
  if (cookieLocale && isValidLocale(cookieLocale)) {
    return cookieLocale;
  }

  // Check for Accept-Language header
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const preferredLocale = acceptLanguage
      .split(',')
      .map(lang => lang.split(';')[0].trim())
      .find(lang => LOCALES.some(locale => lang.startsWith(locale)));
    
    if (preferredLocale) {
      const foundLocale = LOCALES.find(locale => preferredLocale.startsWith(locale));
      if (foundLocale) {
        return foundLocale;
      }
    }
  }

  return DEFAULT_LOCALE;
}

/**
 * Next.js 16 proxy (replaces middleware): redirect rules.
 * Handles i18n redirects and digital-solution/solution redirects.
 */
export function proxy(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;

  // Helper: returns locale if path starts with /[locale]/, else null
  function extractLocale(path: string): string | null {
    for (const locale of LOCALES) {
      if (path === `/${locale}` || path.startsWith(`/${locale}/`)) {
        return locale;
      }
    }
    return null;
  }

  // Try to match any pattern, first with locale, then without
  let locale = extractLocale(pathname);
  let pathToCheck = pathname;
  if (locale) {
    pathToCheck = pathname.replace(`/${locale}`, '') || '/';
  }

  // ====== DIGITAL SOLUTIONS / SOLUTION LEGACY REDIRECTS =======

  // Redirect /digital-solutions or /[locale]/digital-solutions => /[locale]/digital-products
  if (/^\/digital-solutions(\/|$)/.test(pathToCheck)) {
    if (!locale) {
      locale = getLocale(request);
    }
    const redirectUrl = new URL(`/${locale}/digital-products`, origin);
    request.nextUrl.searchParams.forEach((value, key) => {
      redirectUrl.searchParams.set(key, value);
    });
    return NextResponse.redirect(redirectUrl, { status: 308 });
  }

  // Redirect /digital-solutions/showcase-website or /solution/showcase-website (any locale)
  // => /[locale]/branding
  if (
    /^\/digital-solutions\/showcase-website(\/|$)/.test(pathToCheck) ||
    /^\/solution\/showcase-website(\/|$)/.test(pathToCheck)
  ) {
    if (!locale) {
      locale = getLocale(request);
    }
    const redirectUrl = new URL(`/${locale}/branding`, origin);
    request.nextUrl.searchParams.forEach((value, key) => {
      redirectUrl.searchParams.set(key, value);
    });
    return NextResponse.redirect(redirectUrl, { status: 308 });
  }

  // ...the rest of your normal i18n proxy logic below.

  // Check if the pathname already has a locale
  const pathnameHasLocale = LOCALES.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  if (pathnameHasLocale) return;
  
  // Redirect if no locale is specified
  locale = getLocale(request);
  // Remove any trailing slashes and ensure clean path
  const cleanPathname = pathname === '/' ? '' : pathname.replace(/\/$/, '');
  const newUrl = new URL(`/${locale}${cleanPathname}`, request.url);
  
  // Copy all search params
  request.nextUrl.searchParams.forEach((value, key) => {
    newUrl.searchParams.set(key, value);
  });
  
  return NextResponse.redirect(newUrl, { status: 301 });
}

export const config = {
  matcher: [
    // Match all paths that do not start with these exclusions
    // Skip _next/static files and api routes
    '/((?!api|_next/static|_next/image|favicon.ico|images|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.jpeg|.*\\.webp|.*\\.ico|.*\\.txt|.*\\.xml|.*\\.json|.*\\.mp4|.*\\.gif).*)',
    // Also handle the root path
    '/',
  ],
};
