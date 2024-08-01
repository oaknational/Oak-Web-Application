import { UserProfile } from "@auth0/nextjs-auth0/client";
import posthog from "posthog-js";

/**
 * Fetches the user profile if the feature flag `use-auth-owa` is enabled
 *
 * this is a sacrificial module that will be removed once the `use-auth-owa` feature flag is removed
 * the intent is to prevent the user profile from being fetched by `UserProvider` if the feature flag is not enabled
 */
export function featureFlaggedUserFetcher(
  /**
   * This is the URL registered by auth0 in our API `/api/auth/me`
   */
  url: string,
): Promise<UserProfile | undefined> {
  return new Promise((res, rej) => {
    const unsubscribe = posthog.onFeatureFlags(() => {
      unsubscribe();
      clearTimeout(timeout);
      if (posthog.isFeatureEnabled("use-auth-owa")) {
        fetchProfile(url).then(res).catch(rej);
      } else {
        res(undefined);
      }
    });

    // If PostHog fails to load in 5 seconds clean-up and resolve as undefined
    const timeout = setTimeout(() => {
      unsubscribe();
      res(undefined);
    }, 5000);
  });
}

async function fetchProfile(url: string) {
  const res = await fetch(url);
  return res.json() as Promise<UserProfile | undefined>;
}
