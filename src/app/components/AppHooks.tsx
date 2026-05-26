"use client";
import { useOakConsent } from "@oaknational/oak-consent-client";

import useGleap from "@/browser-lib/gleap";
import { ServicePolicyMap } from "@/browser-lib/cookie-consent/ServicePolicyMap";

function useAppHooks() {
  const { getConsent } = useOakConsent();
  const consent = getConsent(ServicePolicyMap.GLEAP);

  useGleap({
    enabled: consent === "granted",
  });
}

export function AppHooks() {
  useAppHooks();
  return null;
}
