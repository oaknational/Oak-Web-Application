import { clerkClient, currentUser, User } from "@clerk/nextjs/server";
import { ZodError } from "zod";

import { onboardingSchema } from "@/common-lib/schemas/onboarding";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";

const reportError = errorReporter("onboardingRoute");

export async function POST(req: Request) {
  const user = await currentUser();

  if (!user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const owaData = onboardingSchema.parse(await req.json());
    const sourceApp = user.publicMetadata.sourceApp ?? getReferrerOrigin(req);
    const region = user.publicMetadata.region ?? getRegion(req, user);

    const publicMetadata: UserPublicMetadata = {
      sourceApp,
      owa: {
        ...owaData,
        isOnboarded: true,
      },
      region,
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

function getRegion(req: Request, user: User) {
  let region = req.headers.get("x-country") || undefined;
  if (process.env.NODE_ENV !== "production") {
    region = getBrowserConfig("developmentUserRegion");
  }

  if (!region) {
    const error = new OakError({
      code: "onboarding/request-error",
      meta: {
        message:
          "Region header not found in header: x-country or developmentUserRegion",
        user: user.id,
      },
    });
    reportError(error);
  }
  return region;
}
