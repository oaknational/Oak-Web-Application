import { clerkMiddleware } from "@clerk/nextjs/server";
import { MiddlewareConfig } from "next/server";

export default clerkMiddleware();
/**
 * Clerk middleware causes page latency, we're only enabling it for API routes or pages where
 * we need to access the user session in the backend
 */
export const config: MiddlewareConfig = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    // "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // API routes except /api/classroom/* which is used for Google Classroom Add-on
    "/(api|trpc)((?!/classroom))(.*)",
  ],
};
