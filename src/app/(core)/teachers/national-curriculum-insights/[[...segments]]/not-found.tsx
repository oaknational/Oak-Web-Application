"use client";

import { OakHeading, OakLink, OakP } from "@oaknational/oak-components";

import { nationalCurriculumInsightsHubHref } from "@/common-lib/urls/nationalCurriculumInsights";

export default function NationalCurriculumInsightsNotFound() {
  return (
    <main>
      <OakHeading tag="h1">National Curriculum Insight not found</OakHeading>
      <OakP>
        This phase and subject combination is not available in the published
        catalogue.
      </OakP>
      <OakLink href={nationalCurriculumInsightsHubHref()}>
        Browse National Curriculum Insights
      </OakLink>
    </main>
  );
}
