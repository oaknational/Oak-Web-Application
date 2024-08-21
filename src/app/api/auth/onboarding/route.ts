import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { ZodError } from "zod";

import { onboardingSchema } from "@/common-lib/schemas/onboarding";

export async function POST(req: Request) {
  const user = await currentUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const owaData = onboardingSchema.parse(await req.json());
    const sourceApp = user.publicMetadata.sourceApp ?? getReferrerOrigin(req);
    const region = req.headers.get("x-country") || "XX";

    if (!region) {
      throw new Error(
        `No request country provided. Ensure Netlify is sending "x-country" header`,
      );
    }

    const publicMetadata: UserPublicMetadata = {
      sourceApp,
      owa: {
        ...owaData,
        isOnboarded: true,
      },
      region: user.publicMetadata.region || region,
    };

    await clerkClient().users.updateUserMetadata(user.id, {
      publicMetadata,
    });

    return Response.json(publicMetadata);
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json(error.format(), { status: 400 });
    }

    throw error;
  }
}

function getReferrerOrigin(req: Request) {
  const referrer = req.headers.get("referer")?.toString();

  if (typeof referrer === "string") {
    return new URL(referrer).origin;
  }
}
