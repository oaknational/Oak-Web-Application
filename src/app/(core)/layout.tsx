"use client";
import { Suspense } from "react";

import AnalyticsProvider from "../../context/Analytics/AnalyticsProvider";

export default function CoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // TODO: [integrated-journey] Top Nav & Footer
  return (
    <Suspense fallback={null}>
      <AnalyticsProvider>{children}</AnalyticsProvider>
    </Suspense>
  );
}
