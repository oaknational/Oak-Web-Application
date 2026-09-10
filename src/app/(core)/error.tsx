"use client";

import { useMemo } from "react";

import ErrorFallback from "../components/ErrorHandling/ErrorFallback";

import errorReporter from "@/common-lib/error-reporter";

export default function RootError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  const reportError = useMemo(() => errorReporter("app::core-layout"), []);
  return (
    <ErrorFallback error={error} reset={reset} reportError={reportError} />
  );
}
