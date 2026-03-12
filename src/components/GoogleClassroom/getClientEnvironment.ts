import { ClientEnvironmentValueType } from "@/browser-lib/avo/Avo";
import { isInIframe } from "@/components/SharedComponents/helpers/downloadAndShareHelpers/createAndClickHiddenDownloadLink";

export function getClientEnvironment(): ClientEnvironmentValueType {
  // could be extended for native app use in future
  return isInIframe() ? "iframe" : "web-browser";
}
