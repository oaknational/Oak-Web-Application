"use client";
import AnalyticsProvider from "../../context/Analytics/AnalyticsProvider";

export default function CoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // TODO: [integrated-journey] Top Nav & Footer
  return <AnalyticsProvider>{children}</AnalyticsProvider>;
}
