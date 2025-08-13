import { useUser } from "@clerk/nextjs";

export async function useCheckUserMetadata() {
  const { isSignedIn, user } = useUser();

  const regionOnboardingApiRoute = "/api/onboarding";

  if (!isSignedIn || !user) {
    return;
  }
  const requiresGeoLocation = user.unsafeMetadata?.requiresGeoLocation;

  if (!requiresGeoLocation) {
    return;
  } else {
    await fetch(regionOnboardingApiRoute, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
