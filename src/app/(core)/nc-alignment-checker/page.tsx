import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies, draftMode } from "next/headers";
import { cache } from "react";

import { NcAlignmentCheckerPage } from "./Components/NcAlignmentCheckerPage";

import withPageErrorHandling from "@/hocs/withPageErrorHandling";
import { isFeatureFlagEnabledServer } from "@/utils/featureFlagChecks/server";
import { cacheData } from "@/node-lib/cache";
import CMSClient from "@/node-lib/cms";

export const metadata: Metadata = {
  title: "NC Alignment Checker",
};

const getCachedNcAlignmentCheckerCms = cache(
  cacheData(
    async ({ isPreviewMode }: { isPreviewMode?: boolean }) => {
      const pageData = await CMSClient.ncAlignmentCheckerLandingPage({
        previewMode: isPreviewMode,
      });

      return {
        pageData,
      };
    },
    ["nc-alignment-checker-cms"],
  ),
);

const InnerMcpPage = async () => {
  const cookieStore = await cookies();
  const isEnabled =
    (await isFeatureFlagEnabledServer(cookieStore, "nc-alignment-checker")) ??
    false;

  if (!isEnabled) {
    return notFound();
  }

  const { isEnabled: isPreviewMode } = await draftMode();

  const { pageData } = await getCachedNcAlignmentCheckerCms({
    isPreviewMode: isPreviewMode,
  });

  console.log({ pageData });

  if (!pageData) {
    return notFound();
  }

  return <NcAlignmentCheckerPage pageData={pageData} />;
};

// export default InnerMcpPage;
export default withPageErrorHandling(
  async () => <InnerMcpPage />,
  "nc-alignment-checker",
);
