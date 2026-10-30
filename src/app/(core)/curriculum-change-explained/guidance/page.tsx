import type { Metadata } from "next";
import { draftMode } from "next/headers";
import { notFound } from "next/navigation";

import { getNationalCurriculumInsightsRouteData } from "@/app/(core)/teachers/national-curriculum-insights/[[...segments]]/helpers/getRouteData";
import { NationalCurriculumInsightsView } from "@/app/(core)/teachers/national-curriculum-insights/[[...segments]]/components/View";
import { nationalCurriculumInsightsGuidanceHref } from "@/common-lib/urls/nationalCurriculumInsights";

export const dynamic = "force-dynamic";

export const generateMetadata = (): Metadata => {
  return {
    title: "Curriculum change explained: guidance",
    alternates: { canonical: nationalCurriculumInsightsGuidanceHref() },
    robots: { index: false, follow: false },
  };
};

export default async function CurriculumChangeGuidancePage() {
  const { isEnabled: previewMode } = await draftMode();
  const data = await getNationalCurriculumInsightsRouteData(
    { kind: "guidance" },
    { previewMode },
  );
  if (!data) return notFound();
  return <NationalCurriculumInsightsView data={data} />;
}
