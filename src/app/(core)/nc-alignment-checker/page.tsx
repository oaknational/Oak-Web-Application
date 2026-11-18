import { Metadata } from "next";
import { notFound } from "next/navigation";
import { cookies, draftMode } from "next/headers";
import { cache } from "react";

import { NcAlignmentCheckerLandingPage } from "./Components/NcAlignmentCheckerLandingPage";

import { cookiesToObject } from "@/utils/cookiesToObject";
import withPageErrorHandling from "@/hocs/withPageErrorHandling";
import { isFeatureFlagEnabledServer } from "@/utils/featureFlagChecks/server";
import { cacheData } from "@/node-lib/cache";
import CMSClient from "@/node-lib/cms";

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
    // TODO: Re-address in chat with teach squad
    { revalidate: 300 },
  ),
);

export async function generateMetadata(): Promise<Metadata> {
  const { isEnabled: isPreviewMode } = await draftMode();
  const { pageData } = await getCachedNcAlignmentCheckerCms({ isPreviewMode });

  return {
    title: pageData?.seo?.title ?? "NC Alignment Checker",
    description: pageData?.seo?.description ?? undefined,
    ...(pageData?.seo?.canonicalURL && {
      alternates: { canonical: pageData.seo.canonicalURL },
    }),
  };
}

const NcAlignmentCheckerServerPage = async () => {
  const cookieStore = await cookies();
  const isEnabled =
    (await isFeatureFlagEnabledServer(
      cookiesToObject(cookieStore),
      "nc-alignment-checker",
    )) ?? false;

  if (!isEnabled) {
    return notFound();
  }

  const { isEnabled: isPreviewMode } = await draftMode();

  const { pageData } = await getCachedNcAlignmentCheckerCms({
    isPreviewMode: isPreviewMode,
  });

  if (!pageData) {
    return notFound();
  }

  return <NcAlignmentCheckerLandingPage pageData={pageData} />;
};

export default withPageErrorHandling(
  NcAlignmentCheckerServerPage,
  "nc-alignment-checker",
);
