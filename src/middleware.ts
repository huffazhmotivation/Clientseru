import { NextResponse, type NextRequest } from "next/server";

const PROTECTED = ["/dashboard", "/clients", "/requests", "/history", "/settings", "/portal"];

/** Penjaga ringan: cek keberadaan cookie. Verifikasi tanda tangan tetap di server. */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const needsAuth = PROTECTED.some((route) => pathname === route || pathname.startsWith(`${route}/`));
  if (!needsAuth) return NextResponse.next();

  if (!request.cookies.get("quota_session")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/clients/:path*", "/requests/:path*", "/history/:path*", "/settings/:path*", "/portal/:path*"],
};
