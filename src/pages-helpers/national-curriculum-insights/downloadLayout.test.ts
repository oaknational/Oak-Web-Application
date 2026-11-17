import {
  getNationalCurriculumInsightsDownloadLayout,
  NationalCurriculumInsightsDownloadUnavailableError,
} from "./downloadLayout";

import { localNationalCurriculumInsightsFixtures } from "@/app/(core)/teachers/national-curriculum-insights/[[...segments]]/__fixtures__/nationalCurriculumInsights";
import type { NationalCurriculumInsightsPhase } from "@/common-lib/cms-types/nationalCurriculumInsights";

const subject = localNationalCurriculumInsightsFixtures.subjects.find(
  ({ slug }) => slug === "science",
)!;
const phasePage = (phase: NationalCurriculumInsightsPhase) =>
  subject.tabs.find(({ kind }) => kind === phase)!.page;

describe("Insights download layouts", () => {
  it.each([undefined, null])(
    "rejects an unset download layout: %s",
    (downloadLayout) => {
      expect(() =>
        getNationalCurriculumInsightsDownloadLayout(
          { ...phasePage("primary"), downloadLayout },
          "primary",
        ),
      ).toThrow("Guidance downloads are not set up for this subject yet.");
    },
  );

  it("does not infer a whole-phase document from an empty stage list", () => {
    expect(() =>
      getNationalCurriculumInsightsDownloadLayout(
        {
          ...phasePage("primary"),
          downloadLayout: "keyStages",
          expectedKeyStages: [],
          keyStages: [],
        },
        "primary",
      ),
    ).toThrow("Some required guidance is not published yet.");
  });

  it("rejects configured stages on a whole-phase layout", () => {
    expect(() =>
      getNationalCurriculumInsightsDownloadLayout(
        { ...phasePage("primary"), downloadLayout: "phase" },
        "primary",
      ),
    ).toThrow(NationalCurriculumInsightsDownloadUnavailableError);
  });

  it.each([
    ["primary", "primaryKeyStages", ["KS1", "KS2"]],
    ["secondary", "secondaryKeyStages", ["KS3", "KS4"]],
  ] as const)(
    "uses the %s key-stage layout in stage order",
    (phase, layout, stages) => {
      const page = phasePage(phase);
      const result = getNationalCurriculumInsightsDownloadLayout(
        {
          ...page,
          expectedKeyStages: [...stages],
          keyStages: [...page.keyStages].reverse(),
        },
        phase,
      );
      expect(result.layout).toBe(layout);
      expect(result.keyStages.map(({ keyStage }) => keyStage)).toEqual(stages);
    },
  );

  it.each([
    ["primary", "primaryPhase"],
    ["secondary", "secondaryPhase"],
  ] as const)(
    "uses the %s phase layout without key-stage pages",
    (phase, layout) => {
      expect(
        getNationalCurriculumInsightsDownloadLayout(
          {
            ...phasePage(phase),
            downloadLayout: "phase",
            expectedKeyStages: [],
            keyStages: [],
          },
          phase,
        ),
      ).toEqual({ layout, keyStages: [] });
    },
  );

  it.each([
    ["primary", "KS2"],
    ["secondary", "KS3"],
  ] as const)("uses the single-stage layout for %s %s", (phase, keyStage) => {
    const page = phasePage(phase);
    const keyStages = page.keyStages.filter(
      (entry) => entry.keyStage === keyStage,
    );
    expect(
      getNationalCurriculumInsightsDownloadLayout(
        {
          ...page,
          downloadLayout: "singleKeyStage",
          expectedKeyStages: [keyStage],
          keyStages,
        },
        phase,
      ),
    ).toEqual({ layout: "singleKeyStage", keyStages });
  });

  it.each([
    ["primary", "KS1"],
    ["secondary", "KS4"],
  ] as const)(
    "does not choose a different layout for unsupported %s %s content",
    (phase, keyStage) => {
      const page = phasePage(phase);
      expect(() =>
        getNationalCurriculumInsightsDownloadLayout(
          {
            ...page,
            downloadLayout: "singleKeyStage",
            expectedKeyStages: [keyStage],
            keyStages: page.keyStages.filter(
              (entry) => entry.keyStage === keyStage,
            ),
          },
          phase,
        ),
      ).toThrow(NationalCurriculumInsightsDownloadUnavailableError);
    },
  );

  it("rejects missing, duplicate, unexpected and unpublished stage content", () => {
    const page = phasePage("primary");
    const expectedKeyStages = ["KS1" as const, "KS2" as const];
    const cases = [
      { ...page, keyStages: page.keyStages.slice(0, 1) },
      { ...page, keyStages: [] },
      { ...page, keyStages: [page.keyStages[0]!, page.keyStages[0]!] },
      { ...page, keyStages: phasePage("secondary").keyStages },
      {
        ...page,
        keyStages: page.keyStages.map((entry) => ({
          ...entry,
          page: { ...entry.page, id: `drafts.${entry.page.id}` },
        })),
      },
    ];
    for (const value of cases) {
      expect(() =>
        getNationalCurriculumInsightsDownloadLayout(
          { ...value, expectedKeyStages },
          "primary",
        ),
      ).toThrow("Some required guidance is not published yet.");
    }
  });

  it("rejects a mismatched phase or duplicate configuration", () => {
    const page = phasePage("primary");
    expect(() =>
      getNationalCurriculumInsightsDownloadLayout(page, "secondary"),
    ).toThrow(NationalCurriculumInsightsDownloadUnavailableError);
    expect(() =>
      getNationalCurriculumInsightsDownloadLayout(
        { ...page, expectedKeyStages: ["KS1", "KS1"] },
        "primary",
      ),
    ).toThrow(NationalCurriculumInsightsDownloadUnavailableError);
  });

  it("rejects a draft phase page", () => {
    const page = phasePage("primary");
    expect(() =>
      getNationalCurriculumInsightsDownloadLayout(
        { ...page, id: `drafts.${page.id}` },
        "primary",
      ),
    ).toThrow(NationalCurriculumInsightsDownloadUnavailableError);
  });
});
