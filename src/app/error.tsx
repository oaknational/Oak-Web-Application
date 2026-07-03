"use client";

import { OakMaxWidth } from "@oaknational/oak-components";

import errorReporter from "@/common-lib/error-reporter";
import LayoutSiteFooter from "@/components/AppComponents/LayoutSiteFooter";
import TopNavMinimal from "@/components/AppComponents/TopNav/TopNavMinimal";
import ErrorFallback from "@/app/components/ErrorHandling/ErrorFallback";

export default function CoreError({
  error,
  reset,
}: Readonly<{
  error: Error & { digest?: string };
  reset: () => void;
}>) {
  return (
    <>
      <TopNavMinimal />
      <OakMaxWidth $alignItems={"flex-end"}>
        <ErrorFallback
          error={error}
          reset={reset}
          reportError={errorReporter("app::error-boundary")}
        />
      </OakMaxWidth>
      <LayoutSiteFooter />
    </>
  );
}
