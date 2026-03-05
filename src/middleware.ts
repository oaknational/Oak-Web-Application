import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { PostHog as PostHogNode } from "posthog-node";

import getBrowserConfig from "./browser-lib/getBrowserConfig";
import { getPosthogIdFromCookie } from "./node-lib/posthog/getPosthogId";
import { resolveOakHref } from "./common-lib/urls";

const posthogApiKey = getBrowserConfig("posthogApiKey");

const getRedirect = (request: NextRequest) => {
  const host = request.headers.get("host");
  if (!host) {
    return null;
  }
  const [scheme, urlPath] = request.url.split(host);
  const urlSegments = urlPath!.split("/");

  // redirect curriculum visualiser to programme page
  // /teachers/curriculum/:subjectPhaseSlug/units
  if (
    urlSegments[1] === "teachers" &&
    urlSegments[2] === "curriculum" &&
    urlSegments[4]?.startsWith("units")
  ) {
    const subjectPhaseSlug = urlSegments[3];
    if (!subjectPhaseSlug) {
      return null;
    }
    const path = resolveOakHref({
      page: "teacher-programme",
      subjectPhaseSlug,
      tab: "units",
    });
    const url = `${scheme}${host}${path}`;
    return { url };
  } else {
    return null;
  }
};

const isApiRoute = (url: string) =>
  !!url.match(/\/(api|trpc)((?!\/classroom))(.*)/)?.[0];

export default async function redirectMiddleware(request: NextRequest) {
  if (isApiRoute(request.url)) {
    return clerkMiddleware();
  }

  const redirect = getRedirect(request);
  if (redirect) {
    const cookies = request.cookies
      .getAll()
      .reduce<Record<string, string>>((acc, cookie) => {
        acc[cookie.name] = cookie.value;
        return acc;
      }, {});

    const posthogUserId = getPosthogIdFromCookie(cookies, posthogApiKey);

    if (posthogUserId) {
      const posthogClient = new PostHogNode(posthogApiKey, {
        host: getBrowserConfig("posthogApiHost"),
      });

      const ffEnabled = await posthogClient.getFeatureFlag(
        "teachers-integrated-journey",
        posthogUserId,
      );

      if (ffEnabled) {
        return NextResponse.redirect(new URL(redirect.url));
      }
    }
  }
}

/**
 * Clerk middleware causes page latency, we're only enabling it for API routes or pages where
 * we need to access the user session in the backend
 */

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    // "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // API routes except /api/classroom/* which is used for Google Classroom Add-on
    "/(api|trpc)((?!/classroom))(.*)",
    // match the curriculum visualiser routes to be redirected
    "/teachers/curriculum/:subjectPhaseSlug/units",
  ],
  runtime: "nodejs",
};
