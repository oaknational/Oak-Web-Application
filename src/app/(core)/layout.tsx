import AnalyticsWrapper from "./AnalyticsWrapper";

export default function CoreLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // TODO: [integrated-journey] Top Nav & Footer
  return <AnalyticsWrapper>{children}</AnalyticsWrapper>;
}
