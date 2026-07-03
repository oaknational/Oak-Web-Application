"use client";

import ErrorFallback from "../components/ErrorHandling/ErrorFallback";

import errorReporter from "@/common-lib/error-reporter";

export default function RootError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  return (
    <ErrorFallback
      error={error}
      reset={reset}
      reportError={errorReporter("app::core-layout")}
    />
  );
}
