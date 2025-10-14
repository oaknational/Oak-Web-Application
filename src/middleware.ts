import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextRequest, NextResponse, NextFetchEvent } from "next/server";

/**
 * Clerk middleware causes page latency, we're only enabling it for API routes or pages where
 * we need to access the user session in the backend
 *
 * The middleware also handles adding X-Robots-Tag: noindex for URLs with sid parameters
 * to prevent crawl/index bloat from session IDs
 */
export default function middleware(req: NextRequest, ev: NextFetchEvent) {
  const url = new URL(req.url);
  const hasSidParam = Array.from(url.searchParams.keys()).some((key) =>
    key.startsWith("sid"),
  );

  // Only run Clerk on API/TRPC routes
  if (url.pathname.startsWith("/api") || url.pathname.startsWith("/trpc")) {
    const handler = clerkMiddleware();
    const result = handler(req, ev);

    // Ensure header is present even when Clerk handles the response
    return Promise.resolve(result).then((res) => {
      if (hasSidParam && res) {
        res.headers.set("X-Robots-Tag", "noindex");
      }
      return res;
    });
  }

  const res = NextResponse.next();
  if (hasSidParam) {
    res.headers.set("X-Robots-Tag", "noindex");
  }
  return res;
}

export const config = {
  matcher: [
    // Run on all routes except Next.js internals and static assets
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
  ],
};
