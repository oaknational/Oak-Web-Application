export const COOKIE_POLICY_NAMES = [
  "strictlyNecessary",
  "embeddedContent",
  "statistics",
] as const;

export type CookieConsentState = "pending" | "enabled" | "disabled";
export type CookieConsent = {
  state: CookieConsentState;
  version: string;
};
export const defaultConsent: CookieConsent = {
  state: "pending",
  version: "0",
};
export type CookiePolicyName = typeof COOKIE_POLICY_NAMES[number];

export const SERVICE_TYPES = [
  "posthog",
  "gleap",
  "bugsnag",
  "hubspot",
] as const;
export type ServiceType = typeof SERVICE_TYPES[number];
export const servicePolicyMap: Record<ServiceType, CookiePolicyName> = {
  posthog: "statistics",
  gleap: "statistics",
  bugsnag: "statistics",
  hubspot: "statistics",
};
