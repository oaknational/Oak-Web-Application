import React, { ErrorInfo, FC } from "react";
import Bugsnag from "@bugsnag/js";

import Layout from "../Layout";
import { initialiseBugsnag } from "../../common-lib/error-handler";
import { DEFAULT_SEO_PROPS } from "../../browser-lib/seo/Seo";

type FallbackComponentProps = {
  error: Error;
  info: ErrorInfo;
  clearError: () => void;
};
const FallbackComponent: FC<FallbackComponentProps> = (props) => {
  console.log(props);

  return (
    <Layout seoProps={DEFAULT_SEO_PROPS}>
      <h1>Error</h1>
      <p>
        Sorry, what a mess. Looks like something's gone wrong, the team has been
        notified!
      </p>
    </Layout>
  );
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
