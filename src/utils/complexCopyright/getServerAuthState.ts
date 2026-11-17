import { auth } from "@clerk/nextjs/server";

import { AuthState } from "./complexCopyright.types";
import { clerkMetadataSchema, getAuthState } from "./getAuthState";

import { getCopyrightRestrictionForSubject } from "@/utils/getCopyrightRestrictionForSubject";

const SIGNED_OUT_AUTH_STATE: AuthState = {
  isSignedIn: false,
  isOnboarded: false,
  isRegionAuthorised: false,
};

/**
 * Resolves the signed-in user's auth state on the server. The route must be
 * in the middleware matcher.
 *
 * Auth state doesn't affect access to unrestricted content, so the Clerk
 * lookup is skipped and a signed-out state is returned instead. Only use the
 * result for copyright decisions.
 */
export async function getServerAuthState(
  restriction: Parameters<typeof getCopyrightRestrictionForSubject>[0],
): Promise<AuthState> {
  const { resourceIsGeorestricted, resourceRequiresLogin } =
    getCopyrightRestrictionForSubject(restriction);

  if (!resourceIsGeorestricted && !resourceRequiresLogin) {
    return SIGNED_OUT_AUTH_STATE;
  }

  const { sessionClaims, isAuthenticated } = await auth();
  const metadata = clerkMetadataSchema.safeParse(sessionClaims)?.data;
  return getAuthState({ isSignedIn: isAuthenticated, metadata });
}
