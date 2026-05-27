"use client";
import { useOakConsent } from "@oaknational/oak-consent-client";

import { useCheckUserMetadata } from "@/hooks/useCheckUserMetadata";
import { usePostHogAlias } from "@/hooks/usePostHogAlias";
import useGleap from "@/browser-lib/gleap";
import { ServicePolicyMap } from "@/browser-lib/cookie-consent/ServicePolicyMap";

function useAppHooks() {
  const { getConsent } = useOakConsent();
  const consent = getConsent(ServicePolicyMap.GLEAP);

  useGleap({
    enabled: consent === "granted",
  });
  useCheckUserMetadata();
  usePostHogAlias();
}

export function AppHooks() {
  useAppHooks();
  return null;
}
