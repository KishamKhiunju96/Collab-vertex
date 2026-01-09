import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    const token = request.cookies.get("collab_vertex_token")?.value;

    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Remove this auto-redirect so users can logout and access login/register
  // if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
  //   const token = request.cookies.get('collab_vertex_token')?.value;
  //
  //   if (token) {
  //     return NextResponse.redirect(new URL('/dashboard', request.url));
  //   }
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register"],
};
