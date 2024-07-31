import { auth0 } from "./node-lib/auth/auth0";

export default auth0.withMiddlewareAuthRequired();

export const config = {
  matcher: [
    // Require authentication to download lesson resources
    "/teachers/lessons/:lessonSlug/downloads",
    "/teachers/programmes/:programmeSlug/units/:unitSlug/lessons/:lessonSlug/downloads",
  ],
};
