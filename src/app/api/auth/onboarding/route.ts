import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { ZodError } from "zod";

import { onboardingSchema } from "@/common-lib/schemas/onboarding";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";

const reportError = errorReporter("onboardingRoute");

/**
 * ISO 3166-1 alpha-2 country codes for countries whose users
 * are authorised to download region restricted content
 */
const ALLOWED_REGIONS = ["GB", "IM", "GG", "JE"];

export async function POST(req: Request) {
  const user = await currentUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const owaData = onboardingSchema.parse(await req.json());
    const sourceApp = user.publicMetadata.sourceApp ?? getReferrerOrigin(req);
    const region = user.privateMetadata.region ?? getRegion(req, user.id);
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

function getRegion(req: Request, userId: string) {
  let region = req.headers.get("x-vercel-ip-country") || undefined;
  if (process.env.NODE_ENV !== "production") {
    region = getBrowserConfig("developmentUserRegion");
  }

  if (!region) {
    const error = new OakError({
      code: "onboarding/request-error",
      meta: {
        message:
          "Region header not found in header: x-vercel-ip-country or developmentUserRegion",
        user: userId,
      },
    });

    reportError(error);
  }
  return region;
}
