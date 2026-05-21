import { clerkMiddleware } from "@clerk/nextjs/server";
import { MiddlewareConfig, NextResponse } from "next/server";

import { tryLegacyProgrammeUnitsRedirect } from "@/utils/integratedJourney/legacyProgrammeUnitsRedirect";

export default clerkMiddleware(async (_auth, request) => {
  const destination = tryLegacyProgrammeUnitsRedirect(request);
  if (destination) {
    return NextResponse.redirect(new URL(destination, request.url), 308);
  }
});
/**
 * Clerk middleware causes page latency, we're only enabling it for API routes or pages where
 * we need to access the user session in the backend
 */

export const config: MiddlewareConfig = {
  matcher: [
    "/teachers/programmes/:programmeSlug/units",
    // API routes except /api/classroom/* which is used for Google Classroom Add-on
    "/(api|trpc)((?!/classroom))(.*)",
  ],
};
