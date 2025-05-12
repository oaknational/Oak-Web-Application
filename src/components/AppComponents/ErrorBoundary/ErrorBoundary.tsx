import React, { Component, ErrorInfo, FC, ReactNode } from "react";
import Bugsnag from "@bugsnag/js";

import { bugsnagInitialised } from "@/browser-lib/bugsnag/useBugsnag";
import ErrorView from "@/components/AppComponents/ErrorView";

const ClientErrorView: FC = () => {
  return (
    <ErrorView headerVariant="client-error" footerVariant="client-error" />
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

export type ErrorBoundaryProps = {
  children?: React.ReactNode;
};
/**
 * ErrorBoundary will catch any uncaught errors, showing the user ClientErrorView
 * and sending a report of the uncaught error to bugsnag.
 */
const ErrorBoundary: FC<ErrorBoundaryProps> = (props) => {
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
