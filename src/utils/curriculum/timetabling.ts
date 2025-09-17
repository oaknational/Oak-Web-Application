import { cookies } from "next/headers";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

import { getFeatureFlag } from "@/node-lib/posthog/getFeatureFlag";
import { getPosthogIdFromCookie } from "@/node-lib/posthog/getPosthogId";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";

function cookieAsObj(c: ReadonlyRequestCookies) {
  const out: Record<string, string> = {};
  for (const item of c.getAll()) {
    out[item.name] = item.value;
  }
  return out;
}

const posthogApiKey = getBrowserConfig("posthogApiKey");

export async function useTimetablingRoute() {
  const cookieStore = cookieAsObj(await cookies());

  const posthogUserId = getPosthogIdFromCookie(cookieStore, posthogApiKey);

  let variantKey: string | boolean | undefined;

  if (posthogUserId) {
    // get the variant key for the user
    variantKey = await getFeatureFlag({
      featureFlagKey: "adopt-timetabling-proto",
      posthogUserId,
    });
  }

  return variantKey;
}
