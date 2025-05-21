import React, { ErrorInfo, FC, useMemo } from "react";
import Bugsnag from "@bugsnag/js";
import * as Sentry from "@sentry/nextjs";

import ErrorView from "@/components/AppComponents/ErrorView";
import { bugsnagInitialised } from "@/browser-lib/bugsnag/useBugsnag";

const ClientErrorView: FC = () => {
  return (
    <ErrorView headerVariant="client-error" footerVariant="client-error" />
  );
};

type FallbackComponentProps = {
  error: Error;
  info: ErrorInfo;
  clearError: () => void;
};

const FallbackComponent: FC<FallbackComponentProps> = () => {
  return <ClientErrorView />;
};

export type ErrorBoundaryProps = {
  children?: React.ReactNode;
};

/**
 * Wrapper around the respective error boundaries for both Bugsnag and Sentry.
 * This will catch any uncaught errors and show the user {@link ClientErrorView},
 * whilst also reporting the error to the respective error reporting service
 * (if consent has been given).
 *
 * We can safely use both the Bugsnag and Sentry error boundaries without
 * risking they'll send error reports when the user has not consented to the
 * relevant cookie policy. This is because the error boundaries will only
 * send error reports if the service has been initialised, which only happens
 * if the user has consented.
 */
const ErrorBoundary: FC<ErrorBoundaryProps> = (props) => {
  const isBugsnagInitialised = bugsnagInitialised();
  const BugsnagErrorBoundary = useMemo(() => {
    if (isBugsnagInitialised) {
      return Bugsnag.getPlugin("react")?.createErrorBoundary(React);
    }
  }, [isBugsnagInitialised]);

  return (
    <Sentry.ErrorBoundary fallback={<ClientErrorView />}>
      {BugsnagErrorBoundary ? (
        <BugsnagErrorBoundary
          FallbackComponent={FallbackComponent}
          {...props}
        />
      ) : (
        props.children
      )}
    </Sentry.ErrorBoundary>
  );
};

export default ErrorBoundary;
