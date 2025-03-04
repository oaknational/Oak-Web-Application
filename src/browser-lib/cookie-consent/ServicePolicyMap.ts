/**
 * Provides a mapping between 3rd party services and the policy
 * needed to grant consent for it.
 */
export const ServicePolicyMap = {
  POSTHOG: "statistics",
  GLEAP: "statistics",
  BUGSNAG: "statistics",
  HUBSPOT: "statistics",
} as const;
