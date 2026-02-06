import { notFound } from "next/navigation";

import { getFeatureFlagValue } from "@/utils/featureFlags";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isEnabled = await getFeatureFlagValue(
    "adopt-timetabling-proto",
    "boolean",
  );
  if (!isEnabled) {
    return notFound();
  }

  return <>{children}</>;
}
