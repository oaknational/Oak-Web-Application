import { draftMode } from "next/headers";
import { notFound } from "next/navigation";

import { getCurriculumChangeExplainedMetadata } from "../getCurriculumChangeExplainedMetadata";

import { getNationalCurriculumInsightsRouteData } from "@/app/(core)/teachers/national-curriculum-insights/[[...segments]]/helpers/getRouteData";
import { NationalCurriculumInsightsView } from "@/app/(core)/teachers/national-curriculum-insights/[[...segments]]/components/View";

export const dynamic = "force-dynamic";

const guidanceRoute = { kind: "guidance" } as const;

export const generateMetadata = () =>
  getCurriculumChangeExplainedMetadata(guidanceRoute);

export default async function CurriculumChangeGuidancePage() {
  const { isEnabled: previewMode } = await draftMode();
  const data = await getNationalCurriculumInsightsRouteData(guidanceRoute, {
    previewMode,
  });
  if (!data) return notFound();
  return <NationalCurriculumInsightsView data={data} />;
}
