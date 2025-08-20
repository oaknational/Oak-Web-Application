import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { isClerkAPIResponseError } from "@clerk/nextjs/errors";

import { getRegion, ALLOWED_REGIONS } from "@/utils/onboarding/getRegion";

export async function POST(req: Request) {
  const user = await currentUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const region =
      user.privateMetadata.region ??
      getRegion(req, user.id, "updateRegionRoute");
    const isRegionAuthorised = ALLOWED_REGIONS.includes(region!);

    const userMetadata: {
      publicMetadata: UserPublicMetadata;
      privateMetadata: UserPrivateMetadata;
      unsafeMetadata: UserUnsafeMetadata;
    } = {
      publicMetadata: {
        owa: { isRegionAuthorised },
      },
      privateMetadata: {
        region,
      },
      unsafeMetadata: {
        requiresGeoLocation: false,
      },
    };

    const client = await clerkClient();
    await client.users.updateUserMetadata(user.id, userMetadata);
    console.log("User region metadata updated");

    return Response.json(userMetadata);
  } catch (error) {
    if (isClerkAPIResponseError(error)) {
      console.error("Update user region error:", error);
      return new Response(error.message, { status: error.status });
    }

    throw error;
  }
}
