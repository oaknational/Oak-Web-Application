import { useUser } from "@clerk/nextjs";
import { useEffect, useRef } from "react";

import useAnalytics from "@/context/Analytics/useAnalytics";
import { pickSingleSignOnService } from "@/utils/pickSingleSignOnService";

let hasAlreadyTrackedEvent = false;

/**
 * Resets the module state for testing
 */
export function resetUseTrackingRegistration() {
  hasAlreadyTrackedEvent = false;
}

/**
 * Tracks when a user returns to the app after
 * signing up through OWA
 */
export function useTrackRegistration() {
  const { track, posthogDistinctId, alias } = useAnalytics();
  const { user } = useUser();
  const lastUserRef = useRef(user);

  // Would prefer that this were dealt with in an event driven manner.
  // However Clerk only offer webhooks for this which would be a lot of
  // infrastructure work and require orchestration to tie the event back to
  // the correct person in analytics. If we do decide to invest time in Clerk
  // webhooks later this would be a great candidate to be lift off the client
  useEffect(() => {
    // If there is no user, nothing to do
    if (!user || !posthogDistinctId) {
      return;
    }

    // Skip if the sign-in has already been tracked on a previous page
    if (
      user.unsafeMetadata.owa?.lastTrackedSignInAt ===
      user.lastSignInAt?.valueOf()
    ) {
      return;
    }

    // Skip tracking when the hook has been re-mounted/re-rendered
    // this guards against a race condition caused by the hook being unmounted
    // and re-rendered while the Clerk user metadata is being updated
    if (hasAlreadyTrackedEvent) {
      return;
    }

    hasAlreadyTrackedEvent = true;

    // `lastTrackedSignInAt` is initialised as `null` by the sign-up form
    // we use this to determine if the sign-up originated in OWA
    // when this is set a non-null value we can trigger sign-in tracking
    if (user.unsafeMetadata.owa?.lastTrackedSignInAt === null) {
      track.userSignUpCompleted({
        platform: "owa",
        product: "user account management",
        engagementIntent: "explore",
        componentType: "signup_form",
        eventVersion: "2.0.0",
        analyticsUseCase: null,
        singleSignOnService: pickSingleSignOnService(
          user.externalAccounts.map((account) => account.provider),
        ),
        userId_: user.id,
      });
    } else {
      track.userSignIn({ userId_: user.id });
      alias?.(posthogDistinctId, user.id);
    }

    // Set `lastTrackedSignInAt` to `lastSignInAt` so that we
    // know not to track again.
    user.update({
      unsafeMetadata: {
        ...user.unsafeMetadata,
        owa: {
          ...user.unsafeMetadata.owa,
          lastTrackedSignInAt: user.lastSignInAt?.valueOf(),
        },
      },
    });
  }, [user, track, posthogDistinctId, alias]);

  // When the user is unset they have signed-out so we should track it
  useEffect(() => {
    if (!user && lastUserRef.current) {
      track.userSignOut();
    }
    lastUserRef.current = user;
  }, [user, track]);
}
