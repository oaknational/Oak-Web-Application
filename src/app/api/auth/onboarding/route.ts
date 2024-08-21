import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { ZodError } from "zod";

import { onboardingSchema } from "@/common-lib/schemas/onboarding";

export async function POST(req: Request) {
  const user = await currentUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const data = onboardingSchema.parse(await req.json());
    const sourceApp = user.publicMetadata.sourceApp ?? getReferrerOrigin(req);
    const region = req.headers.get("cf-ipcountry") || "FR";

    // const region = req.headers.get("cf-ipcountry") || DEVELOPMENT_USER_REGION;

    if (!region) {
      throw new Error(
        `No request country provided. Ensure Cloudflare is sending cf-ipcountry header`,
      );
    }
    const publicMetadata = {
      ...data,
      sourceApp,
      "owa:onboarded": true,
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
