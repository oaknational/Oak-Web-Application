import * as Sentry from "@sentry/nextjs";
import { BrowserOptions, ErrorEvent } from "@sentry/nextjs";

import { PosthogDistinctId } from "@/browser-lib/posthog/posthog";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";
import {
  matchesIgnoredErrorSentry,
  matchesUserAgent,
} from "@/common-lib/error-reporter/errorFiltering";

type Logger = Pick<typeof console, "log" | "warn" | "error">;

/**
 * Create a Sentry `beforeSend` function that filters out errors based on
 * known issues and user agents.
 *
 * @param logger - logger instance to use (default: `console`)
 */
const getSentryBeforeSend = (
  { logger }: { logger: Logger } = { logger: console },
) => {
  return (event: ErrorEvent) => {
    const userAgent = event.request?.headers?.["User-Agent"];
    if (userAgent && matchesUserAgent(userAgent)) {
      console.debug(`Ignoring error for user agent: ${userAgent}`);
      return null;
    }

    const error = event.exception?.values?.[0];
    if (error && matchesIgnoredErrorSentry(error)) {
      logger.warn(`Ignoring known issue: ${error.value}`);
      return null;
    }

    return event;
  };
};

const getSentryConfig = ({
  dsn,
  environment,
  release,
  userId,
}: {
  dsn: string;
  environment: string;
  release: string;
  userId: string | null;
}): BrowserOptions => {
  return {
    dsn,
    release,
    environment,
    beforeSend: getSentryBeforeSend(),
    sendDefaultPii: false,
    tracesSampleRate: 0.2,
    initialScope: {
      user: userId ? { id: userId } : undefined,
    },
  };
};

const initialiseSentry = (userId: PosthogDistinctId | null) => {
  const sentryConfig = getSentryConfig({
    dsn: getBrowserConfig("sentryDsn"),
    environment: getBrowserConfig("releaseStage"),
    release: getBrowserConfig("appVersion"),
    userId,
  });

  Sentry.init(sentryConfig);
};

export { initialiseSentry, getSentryBeforeSend };
