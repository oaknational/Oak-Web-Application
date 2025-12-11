"use client";

import AnalyticsProvider from "../../context/Analytics/AnalyticsProvider";

export default function AnalyticsWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AnalyticsProvider>{children}</AnalyticsProvider>;
}
