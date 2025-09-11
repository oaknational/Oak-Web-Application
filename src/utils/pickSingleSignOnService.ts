import { SingleSignOnServiceValueType } from "../browser-lib/avo/Avo";

export function pickSingleSignOnService(
  providers: string[],
): SingleSignOnServiceValueType {
  if (providers.includes("google") || providers.includes("oauth_google")) {
    return "Google";
  }

  if (providers.includes("microsoft")) {
    return "Microsoft";
  }

  return "Email";
}
