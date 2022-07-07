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
