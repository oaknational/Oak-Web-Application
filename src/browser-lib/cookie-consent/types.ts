export const COOKIE_POLICY_NAMES = [
  "strictlyNecessary",
  "embeddedContent",
  "statistics",
] as const;

export type CookieConsentChoice = {
  enabled: boolean;
  version: string;
};
export const defaultConsentChoice = {
  enabled: false,
  version: "0",
};
export type CookiePolicyName = typeof COOKIE_POLICY_NAMES[number];

export const SERVICE_TYPES = ["posthog", "gleap", "bugsnag"] as const;
export type ServiceType = typeof SERVICE_TYPES[number];
export const servicePolicyMap: Record<ServiceType, CookiePolicyName> = {
  posthog: "statistics",
  gleap: "statistics",
  bugsnag: "statistics",
};
