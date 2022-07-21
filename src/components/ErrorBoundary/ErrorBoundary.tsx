import React, { Component, ErrorInfo, FC, ReactNode, useEffect } from "react";
import Bugsnag from "@bugsnag/js";

import { initialiseBugsnag } from "../../common-lib/error-reporter";
import { useCookieConsent } from "../../browser-lib/cookie-consent/CookieConsentProvider";

const ClientErrorView: FC = () => {
  return (
    <div>
      <h1>
        Client error occurred (<em>style me</em>)
      </h1>
    </div>
  );
};

/**
 * NonBusgnagErrorBoundary is used in the case that the user has
 * not accepted the appropriate cookie policy. It means in the case
 * of unhandled errors, the user will be shown ClientErrorView, but that
 * the error will not be reported to bugsnag.
 */
class NonBugsnagErrorBoundary extends Component<
  { children?: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children?: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: unknown) {
    console.log(error);

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
  // Here we might want to allow the user to clearError(), reset state etc
  return <ClientErrorView />;
};

const bugsnagInitialised = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return Boolean(Bugsnag._client);
};

/**
 * ErrorBoundary will catch any uncaught errors, showing the user ClientErrorView
 * and sending a report of the uncaught error to bugsnag.
 */
const ErrorBoundary: FC = (props) => {
  const { hasConsentedTo } = useCookieConsent();
  const bugsnagAllowed = hasConsentedTo("statistics");

  useEffect(() => {
    // This should happen once per app load.
    if (bugsnagAllowed && !bugsnagInitialised()) {
      initialiseBugsnag();
    }
    if (!bugsnagAllowed && bugsnagInitialised()) {
      // @TODO disable bugsnag here!?
      // If we can't disable bugsnag globally, we'll have to configure
      // in error-reporter to stop sending reports
    }
  }, [bugsnagAllowed]);

  const BugsnagErrorBoundary =
    bugsnagInitialised() &&
    Bugsnag.getPlugin("react")?.createErrorBoundary(React);

  if (!BugsnagErrorBoundary) {
    return <NonBugsnagErrorBoundary {...props} />;
  }

  return (
    <BugsnagErrorBoundary FallbackComponent={FallbackComponent} {...props} />
  );
};

export default ErrorBoundary;
