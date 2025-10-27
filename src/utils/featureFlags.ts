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

type TypeMap = {
  string: string;
  boolean: boolean;
};

function assertType<T extends keyof TypeMap, F = unknown>(
  kind: T,
  value: TypeMap[T],
  fallback: F,
): TypeMap[T] | F {
  if (typeof value !== kind) {
    return fallback;
  }
  return value;
}

export async function useFeatureFlag<T extends keyof TypeMap>(
  flagName: string,
  expectedFlagType: T,
): Promise<TypeMap[T] | undefined> {
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

  if (flag) {
    console.log(
      "[%cfeature-flag%c] %s=%o",
      "color: green",
      "color: initial",
      flagName,
      flag,
    );
  }

  return assertType(expectedFlagType, flag as TypeMap[T], undefined);
}
