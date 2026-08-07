import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";

import { getNationalCurriculumInsightsRouteData } from "./getNationalCurriculumInsightsData";
import { NationalCurriculumInsightsView } from "./NationalCurriculumInsightsView";

import {
  nationalCurriculumInsightsRouteHref,
  parseNationalCurriculumInsightsRoute,
} from "@/common-lib/urls/nationalCurriculumInsights";

const robots: Metadata["robots"] = {
  index: false,
  follow: false,
  googleBot: {
    index: false,
    follow: false,
  },
};

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ segments?: string[] }>;
}): Promise<Metadata> => {
  const route = parseNationalCurriculumInsightsRoute((await params).segments);

  return {
    title: "National curriculum insights",
    robots,
    ...(route
      ? {
          alternates: {
            canonical: nationalCurriculumInsightsRouteHref(route),
          },
        }
      : {}),
  };
};

const NationalCurriculumInsightsPage = async ({
  params,
}: {
  params: Promise<{ segments?: string[] }>;
}) => {
  const { segments } = await params;
  const route = parseNationalCurriculumInsightsRoute(segments);
  if (!route) {
    return notFound();
  }

  const { isEnabled: previewMode } = await draftMode();
  const data = await getNationalCurriculumInsightsRouteData(route, {
    previewMode,
  });
  if (!data) {
    return notFound();
  }

  return <NationalCurriculumInsightsView data={data} />;
};

export default NationalCurriculumInsightsPage;
