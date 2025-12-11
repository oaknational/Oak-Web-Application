// middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { MiddlewareConfig } from "next/server";

const BYPASS_SECRET = "yUVOKr6i7Rp7ISic84OgJhgZ1VCKBELq";

export default clerkMiddleware((auth, req) => {
  const url = req.nextUrl;

  // 🔐 Google Classroom add-on route
  // Change this if your add-on path is different
  if (url.pathname === "/classroom/browse") {
    const isPreview = process.env.VERCEL_ENV === "preview";

    // Only touch preview deployments and only if the secret is configured
    if (isPreview && BYPASS_SECRET) {
      const hasBypass = url.searchParams.has("x-vercel-protection-bypass");

      // Avoid redirect loops – only redirect if the bypass param is missing
      if (!hasBypass) {
        // Preserve all existing Classroom query params and just append ours
        url.searchParams.set("x-vercel-protection-bypass", BYPASS_SECRET);
        url.searchParams.set("x-vercel-set-bypass-cookie", "true");

        return NextResponse.redirect(url);
      }
    }

    // For this route we don't call auth.protect()
    // → it's effectively public but still gets Clerk context if needed
    return;
  }

  // 🧑‍💻 Your existing behavior: only protect certain routes with Clerk
  // You can still use createRouteMatcher here if you want fine-grained protection.
  // Right now you're only enabling Clerk on API/TRPC routes via the matcher below,
  // and not calling auth.protect() at all here, which is fine.
});

export const config: MiddlewareConfig = {
  matcher: [
    // ➕ Run middleware for the Classroom add-on iframe route
    "/classroom/browse",

    // ✅ Your existing matcher:
    // API routes except /api/classroom/* which is used for Google Classroom Add-on
    "/(api|trpc)((?!/classroom))(.*)",
  ],
};
