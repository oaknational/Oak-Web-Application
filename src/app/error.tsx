"use client";

import { useMemo } from "react";

import errorReporter from "@/common-lib/error-reporter";
import LayoutSiteFooter from "@/components/AppComponents/LayoutSiteFooter";
import TopNavMinimal from "@/components/AppComponents/TopNav/TopNavMinimal";
import ErrorFallback from "@/app/components/ErrorHandling/ErrorFallback";

export default function RootError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  const reportError = useMemo(() => errorReporter("app::root-layout"), []);
  return (
    <>
      <TopNavMinimal />
      <ErrorFallback error={error} reset={reset} reportError={reportError} />
      <LayoutSiteFooter />
    </>
  );
}
