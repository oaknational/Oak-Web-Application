import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/teachers/programmes/(.*)/units/(.*)/lessons/(.*)/downloads-auth",
]);

export default clerkMiddleware((auth, req) => {
  console.log("diego auth", auth());
  if (isProtectedRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
