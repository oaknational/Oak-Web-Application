import { cookies } from "next/headers";

import { isFeatureFlagEnabledServer } from "./server";
import { FLAGS } from "./flags";

export async function useFeatureFlag(key: keyof typeof FLAGS) {
  const cookieStore = await cookies();
  return isFeatureFlagEnabledServer(cookieStore, key);
}
