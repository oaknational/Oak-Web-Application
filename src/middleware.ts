import { clerkMiddleware } from "@clerk/nextjs/server";
import { MiddlewareConfig, NextFetchEvent, NextRequest } from "next/server";

export default async function middleware(
  req: NextRequest,
  event: NextFetchEvent,
) {
  return clerkMiddleware()(req, event);
}

/**
 * Clerk middleware causes page latency, we're only enabling it for API routes
 * and pages carrying a Clerk handshake token.
 */

export const config: MiddlewareConfig = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    //"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // API routes except /api/classroom/* which is used for Google Classroom Add-on
    "/(api|trpc)((?!/classroom))(.*)",
    // Enable middleware when we need to process a clerk handshake token
    {
      source: "/((?!_next).*)",
      has: [{ type: "query", key: "__clerk_handshake" }],
    },
    {
      source: "/((?!_next).*)",
      has: [{ type: "query", key: "__clerk_handshake_nonce" }],
    },
  ],
};
