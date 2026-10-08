import { insightsAssetUrl } from "./assets";
import {
  nationalCurriculumInsightsFallbackIllustration,
  nationalCurriculumInsightsKeyStageIllustrations,
  nationalCurriculumInsightsPhaseIllustrations,
  nationalCurriculumInsightsPresentation,
  nationalCurriculumInsightsSubjectIllustration,
} from "./presentation";

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
      primary: insightsAssetUrl("primary"),
      secondary: insightsAssetUrl("secondary"),
    });
    expect(
      Object.keys(nationalCurriculumInsightsKeyStageIllustrations),
    ).toEqual(["KS1", "KS2", "KS3", "KS4"]);
  });

  it("serves every mapped illustration from the configured asset CDN", () => {
    const illustrations = [
      ...Object.values(nationalCurriculumInsightsPhaseIllustrations),
      ...Object.values(nationalCurriculumInsightsKeyStageIllustrations),
      nationalCurriculumInsightsFallbackIllustration,
    ];

    illustrations.forEach((illustration) => {
      expect(illustration).toMatch(
        /^https:\/\/[^/]+\/images\/[^/]+\/[^/]+\/[^/]+\.(png|svg)$/,
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
      illustration: insightsAssetUrl("primary"),
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
      illustration: insightsAssetUrl("keyStage4"),
    });
  });
});
