import type { OakUiRoleToken } from "@oaknational/oak-components";

import { insightsAssetUrl } from "./nationalCurriculumInsightsAssets";

import {
  nationalCurriculumInsightsKeyStageFromSlug,
  type NationalCurriculumInsightsKeyStage,
  type NationalCurriculumInsightsKeyStageSlug,
  type NationalCurriculumInsightsPhase,
} from "@/common-lib/cms-types/nationalCurriculumInsights";
import type { NationalCurriculumInsightsRoute } from "@/common-lib/urls/nationalCurriculumInsights";

export const nationalCurriculumInsightsPhaseIllustrations = {
  primary: insightsAssetUrl("primary"),
  secondary: insightsAssetUrl("secondary"),
} as const satisfies Record<NationalCurriculumInsightsPhase, string>;

export const nationalCurriculumInsightsKeyStageIllustrations = {
  KS1: insightsAssetUrl("keyStage1"),
  KS2: insightsAssetUrl("keyStage2"),
  KS3: insightsAssetUrl("keyStage3"),
  KS4: insightsAssetUrl("keyStage4"),
} as const satisfies Record<NationalCurriculumInsightsKeyStage, string>;

export const nationalCurriculumInsightsFallbackIllustration =
  insightsAssetUrl("overview");

export const nationalCurriculumInsightsSubjectIllustration = (
  illustrationUrl?: string | null,
) => illustrationUrl ?? nationalCurriculumInsightsFallbackIllustration;

export const nationalCurriculumInsightsPhaseIllustration = (
  phase: NationalCurriculumInsightsPhase,
) => nationalCurriculumInsightsPhaseIllustrations[phase];

export const nationalCurriculumInsightsKeyStageIllustration = (
  keyStage: NationalCurriculumInsightsKeyStage,
) => nationalCurriculumInsightsKeyStageIllustrations[keyStage];

export type NationalCurriculumInsightsPresentation = {
  level: "hub" | "guidance" | "subject" | "phase" | "keyStage";
  heroBackground: OakUiRoleToken;
  overviewBackground: OakUiRoleToken;
  accent: OakUiRoleToken;
  illustration: string | null;
};

const keyStageIllustrationFromSlug = (
  keyStageSlug: NationalCurriculumInsightsKeyStageSlug,
) =>
  nationalCurriculumInsightsKeyStageIllustration(
    nationalCurriculumInsightsKeyStageFromSlug(keyStageSlug),
  );

export const nationalCurriculumInsightsPresentation = (
  route: NationalCurriculumInsightsRoute,
  subjectIllustrationUrl?: string | null,
): NationalCurriculumInsightsPresentation => {
  switch (route.kind) {
    case "hub":
      return {
        level: "hub",
        heroBackground: "bg-decorative2-very-subdued",
        overviewBackground: "bg-decorative2-subdued",
        accent: "bg-decorative2-main",
        illustration: null,
      };
    case "guidance":
      return {
        level: "guidance",
        heroBackground: "bg-decorative2-very-subdued",
        overviewBackground: "bg-decorative2-subdued",
        accent: "bg-decorative2-main",
        illustration: null,
      };
    case "subject":
      return {
        level: "subject",
        heroBackground: "bg-decorative2-very-subdued",
        overviewBackground: "bg-decorative2-subdued",
        accent: "bg-decorative2-main",
        illustration: nationalCurriculumInsightsSubjectIllustration(
          subjectIllustrationUrl,
        ),
      };
    case "subjectPhase":
      return {
        level: "phase",
        heroBackground: "bg-decorative1-subdued",
        overviewBackground: "bg-decorative1-very-subdued",
        accent: "bg-decorative1-main",
        illustration: nationalCurriculumInsightsPhaseIllustration(route.phase),
      };
    case "subjectPhaseKeyStage":
      return {
        level: "keyStage",
        heroBackground: "bg-decorative3-subdued",
        overviewBackground: "bg-decorative3-very-subdued",
        accent: "border-decorative3-stronger",
        illustration: keyStageIllustrationFromSlug(route.keyStageSlug),
      };
  }
};
