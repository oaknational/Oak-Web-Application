import { getSortedPathways } from "./getSortedPathways";

import { CanonicalLessonHubData } from "@/node-lib/curriculum-api-2023/queries/canonicalLessonOverview/canonicalLessonOverview.schema";

type LessonPathway = CanonicalLessonHubData["pathways"][number];

const pathway: LessonPathway = {
  programmeSlug: "maths-secondary-year-10-aqa-foundation",
  unitSlug: "algebra",
  unitTitle: "Algebra",
  subjectTitle: "Maths",
  yearGroupTitle: "Year 10",
  examBoardTitle: "AQA",
  tierTitle: "Foundation",
  pathwayTitle: "Core",
};

describe("getSortedPathways", () => {
  it("maps lesson pathways to hub cards with lesson overview links", () => {
    expect(getSortedPathways([pathway], "solving-equations")).toEqual([
      {
        subject: "Maths",
        unitTitle: "Algebra",
        year: "Year 10",
        examboard: "AQA",
        tier: "Foundation",
        pathway: "Core",
        href: "/teachers/programmes/maths-secondary-year-10-aqa-foundation/units/algebra/lessons/solving-equations",
      },
    ]);
  });

  it.each<{
    level: string;
    first: Partial<LessonPathway>;
    second: Partial<LessonPathway>;
  }>([
    {
      level: "subject",
      first: { subjectTitle: "english", yearGroupTitle: "Year 11" },
      second: { subjectTitle: "Maths", yearGroupTitle: "Year 7" },
    },
    {
      level: "year",
      first: { yearGroupTitle: "Year 9", examBoardTitle: "Edexcel" },
      second: { yearGroupTitle: "Year 10", examBoardTitle: "AQA" },
    },
    {
      level: "exam board",
      first: { examBoardTitle: "AQA", tierTitle: "Higher" },
      second: { examBoardTitle: "Edexcel", tierTitle: "Foundation" },
    },
    {
      level: "tier",
      first: { tierTitle: "Foundation", pathwayTitle: "GCSE" },
      second: { tierTitle: "Higher", pathwayTitle: "Core" },
    },
    {
      level: "pathway",
      first: { pathwayTitle: "Core" },
      second: { pathwayTitle: "GCSE" },
    },
  ])("sorts by $level before lower-priority fields", ({ first, second }) => {
    const pathways = [
      { ...pathway, ...second, unitTitle: "Second" },
      { ...pathway, ...first, unitTitle: "First" },
    ];

    expect(
      getSortedPathways(pathways, "lesson").map((card) => card.unitTitle),
    ).toEqual(["First", "Second"]);
    expect(pathways.map((item) => item.unitTitle)).toEqual(["Second", "First"]);
  });

  it("places missing values last and preserves the order of equal pathways", () => {
    const pathways = [undefined, null, "", "GCSE", "Core"].map(
      (pathwayTitle, index) => ({
        ...pathway,
        pathwayTitle,
        unitTitle: `Unit ${index}`,
      }),
    );

    expect(
      getSortedPathways(pathways, "lesson").map((card) => card.unitTitle),
    ).toEqual(["Unit 4", "Unit 3", "Unit 0", "Unit 1", "Unit 2"]);
  });
});
