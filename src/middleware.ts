import { clerkMiddleware } from "@clerk/nextjs/server";
import { MiddlewareConfig, NextFetchEvent, NextRequest } from "next/server";

import experimentMiddleware from "@/utils/posthogExperiments/experimentMiddleware";

const DOWNLOAD_SUCCESS_HEADER_COMPACT_PATH =
  /^\/teachers\/programmes\/[^/]+\/units\/[^/]+\/lessons\/[^/]+\/downloads\/success$/;

export default async function middleware(
  req: NextRequest,
  event: NextFetchEvent,
) {
  if (DOWNLOAD_SUCCESS_HEADER_COMPACT_PATH.test(req.nextUrl.pathname)) {
    return experimentMiddleware({
      request: req,
      featureFlag: "download-success-header-compact",
    });
  }

  return clerkMiddleware()(req, event);
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
    // Download success page - runs the download-success-header-compact A/B experiment
    "/teachers/programmes/:slug/units/:unitSlug/lessons/:lessonSlug/downloads/success",
  ],
};
