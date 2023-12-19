import { NextRequest, NextResponse } from "next/server";

export const defaultLocale = "en";
export const locales = ["en", "vi"];

export function middleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const pathname = request.nextUrl.pathname;

  console.log("====================================");
  console.log("pathname", pathname);
  console.log("====================================");
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  console.log("pathnameIsMissingLocale", pathnameIsMissingLocale);

  if (pathnameIsMissingLocale) {
    return NextResponse.redirect(
      new URL(
        `/${defaultLocale}${request.nextUrl.pathname}${request.nextUrl.search}`,
        request.url
      )
    );
  }
  return NextResponse.next();
}

export const config = {
  // Do not run the middleware on the following paths
  matcher:
    "/((?!api|_next/static|_next/image|manifest.json|assets|favicon.ico).*)",
};
