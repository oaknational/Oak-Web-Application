import { notFound } from "next/navigation";

import TimetablingProviders from "./TimetablingProviders";

import { useFeatureFlag } from "@/utils/featureFlags";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isEnabled = true;
  if (!isEnabled) {
    return notFound();
  }

  return <TimetablingProviders>{children}</TimetablingProviders>;
}
