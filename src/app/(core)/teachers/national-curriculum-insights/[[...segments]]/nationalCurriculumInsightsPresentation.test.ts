import { existsSync } from "node:fs";
import { join } from "node:path";

import {
  nationalCurriculumInsightsFallbackIllustration,
  nationalCurriculumInsightsKeyStageIllustrations,
  nationalCurriculumInsightsPhaseIllustrations,
  nationalCurriculumInsightsPresentation,
  nationalCurriculumInsightsSubjectIllustration,
  nationalCurriculumInsightsSubjectIllustrations,
} from "./nationalCurriculumInsightsPresentation";

describe("nationalCurriculumInsightsPresentation", () => {
  it("maps every configured subject to a dedicated illustration", () => {
    expect(Object.keys(nationalCurriculumInsightsSubjectIllustrations)).toEqual(
      [
        "art-and-design",
        "citizenship",
        "computing",
        "cooking-and-nutrition",
        "design-and-technology",
        "english",
        "french",
        "geography",
        "german",
        "history",
        "maths",
        "music",
        "physical-education",
        "rshe",
        "science",
        "spanish",
      ],
    );
    expect(
      new Set(Object.values(nationalCurriculumInsightsSubjectIllustrations))
        .size,
    ).toBe(16);
  });

  it("uses a neutral fallback for an unknown subject", () => {
    expect(
      nationalCurriculumInsightsSubjectIllustration("future-subject"),
    ).toBe(nationalCurriculumInsightsFallbackIllustration);
  });

  it("maps phases and key stages to shared illustrations", () => {
    expect(nationalCurriculumInsightsPhaseIllustrations).toEqual({
      primary:
        "/images/national-curriculum-insights/illustrations/phases/primary.svg",
      secondary:
        "/images/national-curriculum-insights/illustrations/phases/secondary.svg",
    });
    expect(
      Object.keys(nationalCurriculumInsightsKeyStageIllustrations),
    ).toEqual(["KS1", "KS2", "KS3", "KS4"]);
  });

  it("keeps every mapped illustration in the public bundle", () => {
    const illustrations = [
      ...Object.values(nationalCurriculumInsightsSubjectIllustrations),
      ...Object.values(nationalCurriculumInsightsPhaseIllustrations),
      ...Object.values(nationalCurriculumInsightsKeyStageIllustrations),
      nationalCurriculumInsightsFallbackIllustration,
    ];

    illustrations.forEach((illustration) => {
      expect(existsSync(join(process.cwd(), "public", illustration))).toBe(
        true,
      );
    });
  });

  it("returns the Figma hierarchy tokens and illustration", () => {
    expect(
      nationalCurriculumInsightsPresentation({
        kind: "subject",
        subjectSlug: "science",
      }),
    ).toMatchObject({
      heroBackground: "bg-decorative2-very-subdued",
      overviewBackground: "bg-decorative2-subdued",
      accent: "bg-decorative2-main",
      illustration:
        "/images/national-curriculum-insights/illustrations/subjects/science.png",
    });
    expect(
      nationalCurriculumInsightsPresentation({
        kind: "subjectPhase",
        subjectSlug: "science",
        phase: "primary",
      }),
    ).toMatchObject({
      heroBackground: "bg-decorative1-subdued",
      overviewBackground: "bg-decorative1-very-subdued",
      accent: "bg-decorative1-main",
      illustration:
        "/images/national-curriculum-insights/illustrations/phases/primary.svg",
    });
    expect(
      nationalCurriculumInsightsPresentation({
        kind: "subjectPhaseKeyStage",
        subjectSlug: "science",
        phase: "secondary",
        keyStageSlug: "key-stage-4",
      }),
    ).toMatchObject({
      heroBackground: "bg-decorative3-subdued",
      overviewBackground: "bg-decorative3-very-subdued",
      accent: "border-decorative3-stronger",
      illustration:
        "/images/national-curriculum-insights/illustrations/key-stages/key-stage-4.png",
    });
  });
});
