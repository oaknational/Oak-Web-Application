import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse, NextFetchEvent } from "next/server";
import type { NextRequest } from "next/server";

import { generateNonce } from "./lib/csp/generateNonce";
import { getCspHeader } from "./config/contentSecurityPolicy";

// Wrap clerkMiddleware to add CSP nonce support
const clerkMiddlewareHandler = clerkMiddleware();

export default async function middleware(
  request: NextRequest,
  event: NextFetchEvent,
) {
  // Generate nonce for CSP
  const nonce = generateNonce();

  // Get CSP header with nonce
  const cspHeaderValue = getCspHeader(nonce).replaceAll(/\n/g, "");

  // Run Clerk middleware first (it returns a Response or Promise<Response>)
  const clerkResponse = await clerkMiddlewareHandler(request, event);

  // Clone or create response
  const response = clerkResponse || NextResponse.next();

  // Set CSP header with nonce
  response.headers.set("Content-Security-Policy", cspHeaderValue);

  // Store nonce in a custom header so it can be accessed by the app
  response.headers.set("X-CSP-Nonce", nonce);

  return response;
}

/**
 * Clerk middleware causes page latency, we're only enabling it for API routes or pages where
 * we need to access the user session in the backend.
 *
 * CSP middleware runs on all routes to inject nonces.
 */
export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
