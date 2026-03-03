import { notFound } from "next/navigation";
import { Metadata } from "next";

import { EyfsUnitSection } from "./components/EyfsUnits/EyfsUnits";

import withPageErrorHandling from "@/hocs/withPageErrorHandling";
import { getFeatureFlagValue } from "@/utils/featureFlags";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";

export const metadata: Metadata = {
  title: "Early years foundation stage lesson resources",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

const InnerEyfsPage = async ({
  params,
}: Readonly<{
  params: Promise<{ subjectSlug: string }>;
}>) => {
  const isEnabled = await getFeatureFlagValue("teachers-eyfs-page", "boolean");
  if (!isEnabled) {
    return notFound();
  }

  const { subjectSlug } = await params;

  const eyfsPageData = await curriculumApi2023.eyfsPage({ subjectSlug });
  const units = Object.values(eyfsPageData.units);

  return <EyfsUnitSection units={units} />;
};

const EyfsPage = withPageErrorHandling(InnerEyfsPage, "eyfs-page::app");

export default EyfsPage;
