import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

import useAnalytics from "@/context/Analytics/useAnalytics";
import type { UserResource } from "clerk";
import { SingleSignOnServiceValueType } from "@/browser-lib/avo/Avo";

/**
 * Tracks when a user returns to the app after
 * signing up through OWA
 */
export function useTrackRegistration() {
  const { track } = useAnalytics();
  const { user } = useUser();

  // Would prefer that this were dealt with in an event driven manner.
  // However Clerk only offer webhooks for this which would be a lot of
  // infrastructure work and require orchestration to tie the event back to
  // the correct person in analytics. If we do decide to invest time in Clerk
  // webhooks later this would be a great candidate to be lift off the client
  useEffect(() => {
    // Skip if the sign-in has already been tracked
    if (
      !user ||
      user.unsafeMetadata.owa?.lastTrackedSignInAt ===
        user.lastSignInAt?.valueOf()
    ) {
      return;
    }

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
        singleSignOnService: pickSingleSignOnService(user),
      });
    } else {
      track.userSignIn({ userId_: user.id });
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
  }, [user, track]);
}

function pickSingleSignOnService(
  user: UserResource,
): SingleSignOnServiceValueType {
  const providers = user.externalAccounts.map((account) => account.provider);

  if (providers.includes("google")) {
    return "Google";
  }

  if (providers.includes("microsoft")) {
    return "Microsoft";
  }

  return "Email";
}
