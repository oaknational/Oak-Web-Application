import type { Metadata } from "next";
import { draftMode } from "next/headers";

import { getOpenGraphMetadata, getTwitterMetadata } from "@/app/metadata";
import { getNationalCurriculumInsightsRouteData } from "@/app/(core)/teachers/national-curriculum-insights/[[...segments]]/helpers/getRouteData";
import {
  nationalCurriculumInsightsRouteHref,
  type NationalCurriculumInsightsRoute,
} from "@/common-lib/urls/nationalCurriculumInsights";

export const getCurriculumChangeExplainedMetadata = async (
  route: NationalCurriculumInsightsRoute | null,
): Promise<Metadata> => {
  const metadata: Metadata = {
    title:
      route?.kind === "guidance"
        ? "Curriculum change explained: guidance"
        : "Curriculum change explained",
    robots: { index: false, follow: false },
  };
  if (!route) return metadata;

  metadata.alternates = {
    canonical: nationalCurriculumInsightsRouteHref(route),
  };

  const { isEnabled: previewMode } = await draftMode();
  const data = await getNationalCurriculumInsightsRouteData(route, {
    previewMode,
  });
  const page = data?.page ?? data?.hub;
  if (!page) return metadata;

  const title = page.seo?.title?.trim() || page.title;
  const description = page.seo?.description?.trim() || page.summary;
  const canonical = page.seo?.canonicalURL?.trim();

  return {
    ...metadata,
    title,
    description,
    ...(canonical ? { alternates: { canonical } } : {}),
    openGraph: getOpenGraphMetadata({ title, description }),
    twitter: getTwitterMetadata({ title, description }),
  };
};
