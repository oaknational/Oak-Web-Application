/* istanbul ignore file */
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/teachers/lessons/:lessonSlug/downloads-auth",
  "/teachers/programmes/:programmeSlug/units/:unitSlug/lessons/:lessonSlug/downloads-auth",
  "/teachers/specialist/programmes/:programmeSlug/units/:unitSlug/lessons/:lessonSlug/downloads-auth",
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
