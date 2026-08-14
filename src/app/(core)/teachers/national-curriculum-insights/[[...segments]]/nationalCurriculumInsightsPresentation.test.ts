import { existsSync } from "node:fs";
import { join } from "node:path";

import {
  nationalCurriculumInsightsFallbackIllustration,
  nationalCurriculumInsightsKeyStageIllustrations,
  nationalCurriculumInsightsPhaseIllustrations,
  nationalCurriculumInsightsPresentation,
  nationalCurriculumInsightsSubjectIllustration,
} from "./nationalCurriculumInsightsPresentation";

describe("nationalCurriculumInsightsPresentation", () => {
  it("uses a Sanity subject illustration with a neutral fallback", () => {
    const sanityImage =
      "https://cdn.sanity.io/images/cuvjke51/feat-national-curriculum-insights/science.png";

    expect(nationalCurriculumInsightsSubjectIllustration(sanityImage)).toBe(
      sanityImage,
    );
    expect(nationalCurriculumInsightsSubjectIllustration()).toBe(
      nationalCurriculumInsightsFallbackIllustration,
    );
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
      nationalCurriculumInsightsPresentation(
        {
          kind: "subject",
          subjectSlug: "science",
        },
        "https://cdn.sanity.io/images/cuvjke51/feat-national-curriculum-insights/science.png",
      ),
    ).toMatchObject({
      heroBackground: "bg-decorative2-very-subdued",
      overviewBackground: "bg-decorative2-subdued",
      accent: "bg-decorative2-main",
      illustration:
        "https://cdn.sanity.io/images/cuvjke51/feat-national-curriculum-insights/science.png",
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
