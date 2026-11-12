import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";

import { getNationalCurriculumInsightsRouteData } from "@/app/(core)/teachers/national-curriculum-insights/[[...segments]]/helpers/getRouteData";
import { NationalCurriculumInsightsView } from "@/app/(core)/teachers/national-curriculum-insights/[[...segments]]/components/View";
import {
  nationalCurriculumInsightsRouteHref,
  parseCurriculumChangeExplainedRoute,
} from "@/common-lib/urls/nationalCurriculumInsights";

export const dynamic = "force-dynamic";

type PageProps = Readonly<{
  params: Promise<{ segments?: string[] }>;
}>;

export const generateMetadata = async ({
  params,
}: PageProps): Promise<Metadata> => {
  const route = parseCurriculumChangeExplainedRoute((await params).segments);

  return {
    title: "Curriculum change explained",
    robots: { index: false, follow: false },
    ...(route
      ? {
          alternates: { canonical: nationalCurriculumInsightsRouteHref(route) },
        }
      : {}),
  };
};

export default async function CurriculumChangeExplainedPage({
  params,
}: PageProps) {
  const route = parseCurriculumChangeExplainedRoute((await params).segments);
  if (!route) return notFound();

  const { isEnabled: previewMode } = await draftMode();
  const data = await getNationalCurriculumInsightsRouteData(route, {
    previewMode,
  });
  if (!data) return notFound();

  return <NationalCurriculumInsightsView data={data} />;
}
