import { useUser } from "@clerk/nextjs";

export async function useCheckUserMetadata() {
  const { isSignedIn, user } = useUser();

  const updateRegionApiRoute = "/api/update-region";

  if (!isSignedIn || !user) {
    return;
  }
  const requiresGeoLocation = user.unsafeMetadata?.requiresGeoLocation;

  if (!requiresGeoLocation) {
    return;
  } else {
    await fetch(updateRegionApiRoute, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}
