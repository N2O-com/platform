import { getSessionCookie } from "better-auth/cookies";
import type { NextFetchEvent, NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function authMiddleware(
  middlewareFn?: (
    _auth: { req: NextRequest; authorized: boolean },
    request: NextRequest,
    event: NextFetchEvent
  ) => Promise<Response> | Response
) {
  return async function middleware(
    request: NextRequest,
    event: NextFetchEvent
  ) {
    const { pathname } = request.nextUrl;

    // Unauthenticated-only routes — signed-in users get bounced to /
    const publicRoutes = [
      "/sign-in",
      "/sign-up",
      "/forgot-password",
      "/reset-password",
      "/verify-email",
    ];

    // Routes that allow both signed-in and signed-out access
    const neutralRoutes = ["/accept-invitation"];

    const isPublicRoute = publicRoutes.some((route) =>
      pathname.startsWith(route)
    );
    const isNeutralRoute = neutralRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (pathname.startsWith("/api/auth")) {
      return NextResponse.next();
    }

    const sessionCookie = getSessionCookie(request);
    const authorized = Boolean(sessionCookie);

    if (middlewareFn) {
      const response = await middlewareFn(
        { req: request, authorized },
        request,
        event
      );
      if (response && response.headers.get("Location")) {
        return response;
      }
    }

    if (isNeutralRoute) {
      return NextResponse.next();
    }

    if (authorized && isPublicRoute) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (!(authorized || isPublicRoute)) {
      const signInUrl = new URL("/sign-in", request.url);
      signInUrl.searchParams.set("returnTo", pathname);
      return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
  };
}
