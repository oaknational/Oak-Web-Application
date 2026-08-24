import type { OakUiRoleToken } from "@oaknational/oak-components";

import {
  nationalCurriculumInsightsKeyStageFromSlug,
  type NationalCurriculumInsightsKeyStage,
  type NationalCurriculumInsightsKeyStageSlug,
  type NationalCurriculumInsightsPhase,
} from "@/common-lib/cms-types/nationalCurriculumInsights";
import type { NationalCurriculumInsightsRoute } from "@/common-lib/urls/nationalCurriculumInsights";

const illustrationRoot = "/images/national-curriculum-insights/illustrations";

export const nationalCurriculumInsightsPhaseIllustrations = {
  primary: `${illustrationRoot}/phases/primary.svg`,
  secondary: `${illustrationRoot}/phases/secondary.svg`,
} as const satisfies Record<NationalCurriculumInsightsPhase, string>;

export const nationalCurriculumInsightsKeyStageIllustrations = {
  KS1: `${illustrationRoot}/key-stages/key-stage-1.png`,
  KS2: `${illustrationRoot}/key-stages/key-stage-2.png`,
  KS3: `${illustrationRoot}/key-stages/key-stage-3.png`,
  KS4: `${illustrationRoot}/key-stages/key-stage-4.png`,
} as const satisfies Record<NationalCurriculumInsightsKeyStage, string>;

export const nationalCurriculumInsightsFallbackIllustration =
  "/images/national-curriculum-insights/overview.png";

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
