"use client";

import { analyticsContext } from "@/context/Analytics/AnalyticsProvider";
import { getMockAnalytics } from "@/context/Analytics/getMockAnalytics";

/**
 * Temporary analytics provider for app router routes
 * The main AnalyticsProvider uses next/router which doesn't exist in app router
 * This provides a mock analytics context until AnalyticsProvider is updated
 */
export default function TimetablingProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const mockAnalytics = getMockAnalytics();

  return (
    <analyticsContext.Provider value={mockAnalytics}>
      {children}
    </analyticsContext.Provider>
  );
}
