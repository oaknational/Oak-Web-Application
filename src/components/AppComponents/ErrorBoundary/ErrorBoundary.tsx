import Bugsnag from "@bugsnag/js";
import * as Sentry from "@sentry/react";
import React, { ErrorInfo, FC, PropsWithChildren } from "react";

import { bugsnagInitialised } from "@/browser-lib/bugsnag/useBugsnag";
import ErrorView from "@/components/AppComponents/ErrorView";

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
  // Here we might want to allow the user to clearError(), reset state etc
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
const ErrorBoundary: FC<PropsWithChildren> = (props) => {
  const BugsnagErrorBoundary =
    bugsnagInitialised() &&
    Bugsnag.getPlugin("react")?.createErrorBoundary(React);

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
