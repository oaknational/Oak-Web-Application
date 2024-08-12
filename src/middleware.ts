import { auth0 } from "@/edge-lib/auth/auth0";

export default auth0.withMiddlewareAuthRequired();

export const config = {
  matcher: "/onboarding/:path*",
};
