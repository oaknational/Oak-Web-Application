import { notFound } from "next/navigation";

import TimetablingProvider from "./TimetablingProvider";

import { useFeatureFlag } from "@/utils/featureFlags";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isEnabled = await useFeatureFlag("adopt-timetabling-proto", "boolean");
  if (!isEnabled) {
    return notFound();
  }

  return <TimetablingProvider>{children}</TimetablingProvider>;
}
