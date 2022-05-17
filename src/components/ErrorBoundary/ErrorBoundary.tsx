import React, { ErrorInfo, FC } from "react";
import Bugsnag from "@bugsnag/js";

import { initialiseBugsnag } from "../../common-lib/error-handler";
import ErrorPage from "../../pages/_error";

type FallbackComponentProps = {
  error: Error;
  info: ErrorInfo;
  clearError: () => void;
};
const FallbackComponent: FC<FallbackComponentProps> = (props) => {
  console.log(props);

  return <ErrorPage />;
};

// This should happen once per app load.
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
if (!Bugsnag._client) {
  initialiseBugsnag();
}

const BugsnagErrorBoundary =
  Bugsnag.getPlugin("react")?.createErrorBoundary(React);

const ErrorBoundary: FC = ({ children }) => {
  if (!BugsnagErrorBoundary) {
    return null;
  }

  return (
    <BugsnagErrorBoundary FallbackComponent={FallbackComponent}>
      {children}
    </BugsnagErrorBoundary>
  );
};

export default ErrorBoundary;
