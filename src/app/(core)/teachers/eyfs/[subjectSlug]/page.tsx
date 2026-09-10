import { Metadata } from "next";

import { EyfsUnitSection } from "./components/EyfsUnits/EyfsUnits";
import { getCachedEyfsPageData } from "./getCachedEyfsPageData";

import withPageErrorHandling from "@/hocs/withPageErrorHandling";

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

export const dynamic = "force-static";

const InnerEyfsPage = async ({
  params,
}: Readonly<{
  params: Promise<{ subjectSlug: string }>;
}>) => {
  const { subjectSlug } = await params;

  const eyfsPageData = await getCachedEyfsPageData(subjectSlug);
  const units = Object.values(eyfsPageData.units);

  return <EyfsUnitSection units={units} />;
};

const EyfsPage = withPageErrorHandling(InnerEyfsPage, "eyfs-page::app");

export default EyfsPage;
