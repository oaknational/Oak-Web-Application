import { groupLessonPathways } from "./teachersLessonOverview.helpers"; // Replace with the actual import path

describe("groupLessonPathways()", () => {
  it("transforms a single LessonPathway correctly", () => {
    const lessonPathways = [
      {
        keyStageTitle: "KS1",
        keyStageSlug: "ks1",
        subjectTitle: "Math",
        subjectSlug: "math",
        unitTitle: "Unit 1",
        unitSlug: "unit-1",
        programmeSlug: "programme-1",
        tierTitle: "Tier A",
        tierSlug: "tier-a",
        examboardTitle: "ExamBoard 1",
        examboardSlug: "examboard-1",
      },
    ];

    const result = groupLessonPathways(lessonPathways);

    const expected = {
      units: [
        {
          unitTitle: "Unit 1",
          unitSlug: "unit-1",
          examboards: [
            {
              examboardTitle: "ExamBoard 1",
              examboardSlug: "examboard-1",
              subjectTitle: "Math",
              subjectSlug: "math",
              tiers: [
                {
                  programmeSlug: "programme-1",
                  tierTitle: "Tier A",
                  tierSlug: "tier-a",
                },
              ],
            },
          ],
        },
      ],
    };

    expect(result).toEqual(expected);
  });

  it("transforms multiple LessonPathways correctly", () => {
    const lessonPathways = [
      {
        keyStageTitle: "KS1",
        keyStageSlug: "ks1",
        subjectTitle: "Math",
        subjectSlug: "math",
        unitTitle: "Unit 1",
        unitSlug: "unit-1",
        programmeSlug: "programme-1",
        tierTitle: "Tier A",
        tierSlug: "tier-a",
        examboardTitle: "ExamBoard 1",
        examboardSlug: "examboard-1",
      },
      {
        keyStageTitle: "KS2",
        keyStageSlug: "ks2",
        subjectTitle: "Science",
        subjectSlug: "science",
        unitTitle: "Unit 2",
        unitSlug: "unit-2",
        programmeSlug: "programme-2",
        tierTitle: "Tier B",
        tierSlug: "tier-b",
        examboardTitle: "ExamBoard 2",
        examboardSlug: "examboard-2",
      },
    ];

    const result = groupLessonPathways(lessonPathways);

    const expected = {
      units: [
        {
          unitTitle: "Unit 1",
          unitSlug: "unit-1",
          examboards: [
            {
              examboardTitle: "ExamBoard 1",
              examboardSlug: "examboard-1",
              subjectTitle: "Math",
              subjectSlug: "math",
              tiers: [
                {
                  programmeSlug: "programme-1",
                  tierTitle: "Tier A",
                  tierSlug: "tier-a",
                },
              ],
            },
          ],
        },
        {
          unitTitle: "Unit 2",
          unitSlug: "unit-2",
          examboards: [
            {
              examboardTitle: "ExamBoard 2",
              examboardSlug: "examboard-2",
              subjectTitle: "Science",
              subjectSlug: "science",
              tiers: [
                {
                  programmeSlug: "programme-2",
                  tierTitle: "Tier B",
                  tierSlug: "tier-b",
                },
              ],
            },
          ],
        },
      ],
    };

    expect(result).toEqual(expected);
  });

  it("transforms multiple units with multiple examboards and tiers correctly", () => {
    const lessonPathways = [
      {
        keyStageTitle: "KS1",
        keyStageSlug: "ks1",
        subjectTitle: "Math",
        subjectSlug: "math",
        unitTitle: "Unit 1",
        unitSlug: "unit-1",
        programmeSlug: "math--examboard-1--tier-a",
        tierTitle: "Tier A",
        tierSlug: "tier-a",
        examboardTitle: "ExamBoard 1",
        examboardSlug: "examboard-1",
      },
      {
        keyStageTitle: "KS2",
        keyStageSlug: "ks2",
        subjectTitle: "Science",
        subjectSlug: "science",
        unitTitle: "Unit 1",
        unitSlug: "unit-1",
        programmeSlug: "science--examboard-2--tier-b",
        tierTitle: "Tier B",
        tierSlug: "tier-b",
        examboardTitle: "ExamBoard 2",
        examboardSlug: "examboard-2",
      },
      {
        keyStageTitle: "KS1",
        keyStageSlug: "ks1",
        subjectTitle: "Math",
        subjectSlug: "math",
        unitTitle: "Unit 2",
        unitSlug: "unit-2",
        programmeSlug: "math--examboard-1--tier-a",
        tierTitle: "Tier A",
        tierSlug: "tier-a",
        examboardTitle: "ExamBoard 1",
        examboardSlug: "examboard-1",
      },
      {
        keyStageTitle: "KS1",
        keyStageSlug: "ks1",
        subjectTitle: "Math",
        subjectSlug: "math",
        unitTitle: "Unit 2",
        unitSlug: "unit-2",
        programmeSlug: "math--examboard-2--tier-c",
        tierTitle: "Tier C",
        tierSlug: "tier-c",
        examboardTitle: "ExamBoard 2",
        examboardSlug: "examboard-2",
      },
      {
        keyStageTitle: "KS2",
        keyStageSlug: "ks2",
        subjectTitle: "Science",
        subjectSlug: "science",
        unitTitle: "Unit 3",
        unitSlug: "unit-3",
        programmeSlug: "science--examboard-3--tier-d",
        tierTitle: "Tier D",
        tierSlug: "tier-d",
        examboardTitle: "ExamBoard 3",
        examboardSlug: "examboard-3",
      },
    ];

    const result = groupLessonPathways(lessonPathways);

    const expected = {
      units: [
        {
          unitTitle: "Unit 1",
          unitSlug: "unit-1",
          examboards: [
            {
              examboardTitle: "ExamBoard 1",
              examboardSlug: "examboard-1",
              subjectTitle: "Math",
              subjectSlug: "math",
              tiers: [
                {
                  programmeSlug: "math--examboard-1--tier-a",
                  tierTitle: "Tier A",
                  tierSlug: "tier-a",
                },
              ],
            },
            {
              examboardTitle: "ExamBoard 2",
              examboardSlug: "examboard-2",
              subjectTitle: "Science",
              subjectSlug: "science",
              tiers: [
                {
                  programmeSlug: "science--examboard-2--tier-b",
                  tierTitle: "Tier B",
                  tierSlug: "tier-b",
                },
              ],
            },
          ],
        },
        {
          unitTitle: "Unit 2",
          unitSlug: "unit-2",
          examboards: [
            {
              examboardTitle: "ExamBoard 1",
              examboardSlug: "examboard-1",
              subjectTitle: "Math",
              subjectSlug: "math",
              tiers: [
                {
                  programmeSlug: "math--examboard-1--tier-a",
                  tierTitle: "Tier A",
                  tierSlug: "tier-a",
                },
              ],
            },
            {
              examboardTitle: "ExamBoard 2",
              examboardSlug: "examboard-2",
              subjectTitle: "Math",
              subjectSlug: "math",
              tiers: [
                {
                  programmeSlug: "math--examboard-2--tier-c",
                  tierTitle: "Tier C",
                  tierSlug: "tier-c",
                },
              ],
            },
          ],
        },
        {
          unitTitle: "Unit 3",
          unitSlug: "unit-3",
          examboards: [
            {
              examboardTitle: "ExamBoard 3",
              examboardSlug: "examboard-3",
              subjectTitle: "Science",
              subjectSlug: "science",
              tiers: [
                {
                  programmeSlug: "science--examboard-3--tier-d",
                  tierTitle: "Tier D",
                  tierSlug: "tier-d",
                },
              ],
            },
          ],
        },
      ],
    };

    expect(result).toEqual(expected);
  });
});
