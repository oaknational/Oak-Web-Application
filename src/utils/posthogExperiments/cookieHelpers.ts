import { NextRequest } from "next/server";

import getServerConfig from "@/node-lib/getServerConfig";

const posthogApiKey = getServerConfig("posthogApiKey");

export const getExperimentCookieKey = (flagKey: string) => {
  return `__experiments:${flagKey}`;
};

export const getConsentFromCookie = (request: NextRequest) => {
  const consentCookie = request.cookies.get("oak_consent");
  if (!consentCookie) {
    return undefined;
  }
  const consentCookieValue = JSON.parse(consentCookie.value).policies.find(
    (p: { slug: string; state: string }) => p.slug === "statistics",
  )?.state;
  return consentCookieValue;
};

export const getDistinctIdFromCookie = (request: NextRequest) => {
  const posthogCookie = request.cookies.get(`ph_${posthogApiKey}_posthog`);
  const cookieValue = posthogCookie ? JSON.parse(posthogCookie.value) : {};
  const distinctId = cookieValue["distinct_id"];

  return distinctId;
};
