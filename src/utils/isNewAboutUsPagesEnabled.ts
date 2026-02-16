import { getFeatureFlag } from "@/node-lib/posthog/getFeatureFlag";
import { getPosthogIdFromCookie } from "@/node-lib/posthog/getPosthogId";

export default async function isNewAboutUsPagesEnabled(
  posthogApiKey: string,
  cookies: Partial<{ [key: string]: string }>,
) {
  const posthogUserId = getPosthogIdFromCookie(cookies, posthogApiKey);

  let enableV2: boolean = false;

  if (posthogUserId) {
    // get the variant key for the user
    enableV2 =
      (await getFeatureFlag({
        featureFlagKey: "about-us--who-we-are--v2",
        posthogUserId,
      })) === true;
  }

  return enableV2;
}
