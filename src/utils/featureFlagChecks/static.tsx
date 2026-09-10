import { FLAGS } from "./flags";

export function isFeatureFlagEnabledStatic(
  featureFlagKey: keyof typeof FLAGS,
): boolean {
  return FLAGS[featureFlagKey] === "true";
}
