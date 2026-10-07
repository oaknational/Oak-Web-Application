import { clerkMiddleware } from "@clerk/nextjs/server";
import { MiddlewareConfig, NextFetchEvent, NextRequest } from "next/server";

export default async function middleware(
  req: NextRequest,
  event: NextFetchEvent,
) {
  // Keep server-side redirects pointed at our own sign-in page rather than Clerk's account portal
  return clerkMiddleware({ signInUrl: "/sign-in", signUpUrl: "/sign-in" })(
    req,
    event,
  );
}

/**
 * Clerk middleware causes page latency, we're only enabling it for API routes or pages where
 * we need to access the user session in the backend
 */

export const config: MiddlewareConfig = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    //"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // API routes except /api/classroom/* which is used for Google Classroom Add-on
    "/(api|trpc)((?!/classroom))(.*)",
    // Pages which resolve the signed-in user on the server
    "/teachers/my-library",
  ],
};
