import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import errorReporter from "@/common-lib/error-reporter";
import OakError from "@/errors/OakError";

export function getRegion(req: Request, userId: string, errorContext: string) {
  const reportError = errorReporter(errorContext);

  let region = req.headers.get("x-vercel-ip-country") || undefined;
  if (process.env.NODE_ENV !== "production") {
    console.log("Using development user region");
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

    reportError(error, {
      message: "Region header not found",
    });
  }
  return region;
}

/**
 * ISO 3166-1 alpha-2 country codes for countries whose users
 * are authorised to download region restricted content
 */
export const ALLOWED_REGIONS = ["GB", "IM", "GG", "JE"];
