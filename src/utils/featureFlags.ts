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

export async function useFeatureFlag(
  flagName: string,
  assertType?: "boolean" | "string",
) {
  const cookieStore = cookieAsObj(await cookies());

  const posthogUserId = getPosthogIdFromCookie(cookieStore, posthogApiKey);
  let flag: string | boolean | undefined;

  if (posthogUserId) {
    // get the variant key for the user
    flag = await getFeatureFlag({
      featureFlagKey: flagName,
      posthogUserId,
    });
  }

  if (assertType && typeof flag !== assertType) {
    return;
  }
  return flag;
}
