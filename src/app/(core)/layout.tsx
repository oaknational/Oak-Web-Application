import { Suspense } from "react";

import AnalyticsWrapper from "./AnalyticsWrapper";

export default function CoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // TODO: [integrated-journey] Top Nav & Footer
  return (
    <Suspense fallback={null}>
      <AnalyticsWrapper>{children}</AnalyticsWrapper>
    </Suspense>
  );
}
