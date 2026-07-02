import { clerkMiddleware } from "@clerk/nextjs/server";
import {
  MiddlewareConfig,
  NextFetchEvent,
  NextRequest,
  NextResponse,
} from "next/server";

import getServerConfig from "./node-lib/getServerConfig";

export const EXPERIMENT_COOKIE = "__experiments:test-flag";
const posthogApiKey = getServerConfig("posthogApiKey");

export default async function middleware(
  req: NextRequest,
  event: NextFetchEvent,
) {
  if (
    req.nextUrl.pathname.match(/\/teachers\/programmes\/.*\/units\/.*\/lessons/)
  ) {
    const existing = req.cookies.get(EXPERIMENT_COOKIE)?.value;
    const rewriteUrl = new URL(req.nextUrl.pathname + "/variant", req.url);
    if (existing === "test") {
      return NextResponse.rewrite(rewriteUrl);
    }

    if (existing === "control") {
      return NextResponse.next();
    }

    // No cookie yet — evaluate the flag
    const posthogCookie = req.cookies.get(`ph_${posthogApiKey}_posthog`);
    const cookieValue = posthogCookie ? JSON.parse(posthogCookie.value) : {};
    const distinctId = cookieValue["distinct_id"];

    if (distinctId) {
      const phRes = await fetch(
        `${getServerConfig("posthogApiHost")}/decide?v=3`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            api_key: posthogApiKey,
            distinct_id: distinctId,
          }),
        },
      );

      if (!phRes.ok) return null;

      const data = await phRes.json();
      const variant = data?.featureFlags?.["test-flag"] ?? null;

      const isTest = variant === "test";
      const res = isTest
        ? NextResponse.rewrite(rewriteUrl)
        : NextResponse.next();

      res.cookies.set(EXPERIMENT_COOKIE, isTest ? "test" : "control", {
        maxAge: 60 * 60 * 24 * 30,
        sameSite: "lax",
        path: "/",
      });
      return res;
    }

    return NextResponse.next();
  } else {
    // Fall through to default clerk middleware on all other routes (/api)
    return clerkMiddleware()(req, event);
  }
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
    // Experiment route
    "/teachers/programmes/:programmeSlug/units/:unitSlug/lessons",
  ],
};
