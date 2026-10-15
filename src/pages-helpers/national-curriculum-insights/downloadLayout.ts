import {
  nationalCurriculumInsightsKeyStagesForPhase,
  type NationalCurriculumInsightsPage,
  type NationalCurriculumInsightsPhase,
} from "@/common-lib/cms-types/nationalCurriculumInsights";

export class NationalCurriculumInsightsDownloadUnavailableError extends Error {}

export type NationalCurriculumInsightsDownloadLayout =
  | "primaryKeyStages"
  | "secondaryKeyStages"
  | "primaryPhase"
  | "secondaryPhase"
  | "singleKeyStage";

const getConfiguredKeyStages = (
  layout: NonNullable<NationalCurriculumInsightsPage["downloadLayout"]>,
  phase: NationalCurriculumInsightsPhase,
) => {
  if (layout === "phase") return [];
  if (layout === "singleKeyStage") {
    return [phase === "primary" ? "KS2" : "KS3"];
  }
  return nationalCurriculumInsightsKeyStagesForPhase[phase];
};

export const getNationalCurriculumInsightsDownloadLayout = (
  page: NationalCurriculumInsightsPage,
  phase: NationalCurriculumInsightsPhase,
): {
  layout: NationalCurriculumInsightsDownloadLayout;
  keyStages: NationalCurriculumInsightsPage["keyStages"];
} => {
  if (!page.downloadLayout) {
    throw new NationalCurriculumInsightsDownloadUnavailableError(
      "Guidance downloads are not set up for this subject yet.",
    );
  }

  const phaseKeyStages = nationalCurriculumInsightsKeyStagesForPhase[phase];
  const configuredStages = getConfiguredKeyStages(page.downloadLayout, phase);
  const expected =
    page.expectedKeyStages ?? page.keyStages.map(({ keyStage }) => keyStage);
  const validPhase = page.pageType === phase && !page.id?.startsWith("drafts.");
  const uniqueExpected = new Set(expected).size === expected.length;
  const validExpected =
    expected.length === configuredStages.length &&
    expected.every((keyStage) =>
      (configuredStages as readonly string[]).includes(keyStage),
    );
  const completePages =
    page.keyStages.length === expected.length &&
    expected.every(
      (keyStage) =>
        page.keyStages.filter(
          (entry) =>
            entry.keyStage === keyStage &&
            entry.page.keyStage === keyStage &&
            !entry.page.id?.startsWith("drafts."),
        ).length === 1,
    );

  if (!validPhase || !uniqueExpected || !validExpected || !completePages) {
    throw new NationalCurriculumInsightsDownloadUnavailableError(
      "Some required guidance is not published yet.",
    );
  }

  if (page.downloadLayout === "phase") {
    return {
      layout: phase === "primary" ? "primaryPhase" : "secondaryPhase",
      keyStages: [],
    };
  }

  if (page.downloadLayout === "singleKeyStage") {
    return { layout: "singleKeyStage", keyStages: page.keyStages };
  }

  return {
    layout: phase === "primary" ? "primaryKeyStages" : "secondaryKeyStages",
    keyStages: [...page.keyStages].sort(
      (a, b) =>
        (phaseKeyStages as readonly string[]).indexOf(a.keyStage) -
        (phaseKeyStages as readonly string[]).indexOf(b.keyStage),
    ),
  };
};
