import React, { Component, ErrorInfo, FC, ReactNode, useMemo } from "react";
import Bugsnag from "@bugsnag/js";
import * as Sentry from "@sentry/nextjs";

import ErrorView from "@/components/AppComponents/ErrorView";
import { bugsnagInitialised } from "@/browser-lib/bugsnag/useBugsnag";
import getBrowserConfig from "@/browser-lib/getBrowserConfig";

const ClientErrorView: FC = () => {
  return (
    <ErrorView headerVariant="client-error" footerVariant="client-error" />
  );
};

class NonBugsnagErrorBoundary extends Component<
  { children?: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children?: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    console.error(error);

    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <ClientErrorView />;
    }

    return this.props.children;
  }
}

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
function BugsnagErrorBoundary(props: ErrorBoundaryProps) {
  const isBugsnagInitialised = bugsnagInitialised();
  const BugsnagErrorBoundary = useMemo(() => {
    if (isBugsnagInitialised) {
      return Bugsnag.getPlugin("react")?.createErrorBoundary(React);
    }
  }, [isBugsnagInitialised]);

  if (!BugsnagErrorBoundary) {
    return <NonBugsnagErrorBoundary {...props} />;
  }

  return (
    <>
      {BugsnagErrorBoundary ? (
        <BugsnagErrorBoundary
          FallbackComponent={FallbackComponent}
          {...props}
        />
      ) : (
        props.children
      )}
    </>
  );
}

function SentryErrorBoundary({ children }: ErrorBoundaryProps) {
  return (
    <Sentry.ErrorBoundary fallback={<ClientErrorView />}>
      {children}
    </Sentry.ErrorBoundary>
  );
}

export default function ErrorBoundary({ children }: ErrorBoundaryProps) {
  if (getBrowserConfig("sentryEnabled") === "true") {
    return <SentryErrorBoundary>{children}</SentryErrorBoundary>;
  } else {
    return <BugsnagErrorBoundary>{children}</BugsnagErrorBoundary>;
  }
}
