import { clerkClient, currentUser } from "@clerk/nextjs/server";

import { onboardingSchema } from "@/common-lib/schemas/onboarding";
import { getRegion, ALLOWED_REGIONS } from "@/utils/onboarding/getRegion";

export async function POST(req: Request) {
  const user = await currentUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  const parsed = onboardingSchema.safeParse(await req.json());
  if (!parsed.success) {
    return Response.json(parsed.error.format(), { status: 400 });
  }
  const owaData = parsed.data;
  const sourceApp = user.publicMetadata.sourceApp ?? getReferrerOrigin(req);
  const region =
    user.privateMetadata.region ?? getRegion(req, user.id, "onboardingRoute");
  const isRegionAuthorised = ALLOWED_REGIONS.includes(region!);

  const publicMetadata: UserPublicMetadata = {
    sourceApp,
    owa: {
      ...owaData,
      isRegionAuthorised,
      isOnboarded: true,
    },
  };
  const client = await clerkClient();
  await client.users.updateUserMetadata(user.id, {
    publicMetadata,
    privateMetadata: {
      region,
    },
  });

  return Response.json(publicMetadata);
}

function getReferrerOrigin(req: Request) {
  const referrer = req.headers.get("referer")?.toString();

  if (typeof referrer === "string") {
    return new URL(referrer).origin;
  }
}
