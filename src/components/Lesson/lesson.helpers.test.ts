import { groupLessonPathways } from "./lesson.helpers";

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
        examBoardTitle: "ExamBoard 1",
        examBoardSlug: "examBoard-1",
      },
    ];

    const result = groupLessonPathways(lessonPathways);

    const expected = {
      subjects: [
        {
          subjectSlug: "math",
          subjectTitle: "Math",
          units: [
            {
              unitTitle: "Unit 1",
              unitSlug: "unit-1",
              examBoards: [
                {
                  examBoardTitle: "ExamBoard 1",
                  examBoardSlug: "examBoard-1",
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
        },
      ],
    };

    expect(result).toEqual(expected);
  });

  it("transforms LessonPathways with no examBoard", () => {
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
        examBoardTitle: "ExamBoard 1",
        examBoardSlug: "examBoard-1",
      },
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
        examBoardTitle: null,
        examBoardSlug: null,
      },
    ];

    const result = groupLessonPathways(lessonPathways);

    const expected = {
      subjects: [
        {
          subjectSlug: "math",
          subjectTitle: "Math",
          units: [
            {
              unitTitle: "Unit 1",
              unitSlug: "unit-1",
              examBoards: [
                {
                  examBoardTitle: "ExamBoard 1",
                  examBoardSlug: "examBoard-1",
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
                {
                  examBoardSlug: null,
                  examBoardTitle: null,
                  subjectSlug: "math",
                  subjectTitle: "Math",
                  tiers: [
                    {
                      programmeSlug: "programme-1",
                      tierSlug: "tier-a",
                      tierTitle: "Tier A",
                    },
                  ],
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
        examBoardTitle: "ExamBoard 1",
        examBoardSlug: "examBoard-1",
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
        examBoardTitle: "ExamBoard 2",
        examBoardSlug: "examBoard-2",
      },
    ];

    const result = groupLessonPathways(lessonPathways);

    const expected = {
      subjects: [
        {
          subjectSlug: "math",
          subjectTitle: "Math",
          units: [
            {
              unitTitle: "Unit 1",
              unitSlug: "unit-1",
              examBoards: [
                {
                  examBoardTitle: "ExamBoard 1",
                  examBoardSlug: "examBoard-1",
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
        },
        {
          subjectSlug: "science",
          subjectTitle: "Science",
          units: [
            {
              unitTitle: "Unit 2",
              unitSlug: "unit-2",
              examBoards: [
                {
                  examBoardTitle: "ExamBoard 2",
                  examBoardSlug: "examBoard-2",
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
        },
      ],
    };

    expect(result).toEqual(expected);
  });

  it("transforms multiple units with multiple examBoards and tiers correctly", () => {
    const lessonPathways = [
      {
        keyStageTitle: "KS1",
        keyStageSlug: "ks1",
        subjectTitle: "Math",
        subjectSlug: "math",
        unitTitle: "Unit 1",
        unitSlug: "unit-1",
        programmeSlug: "math--examBoard-1--tier-a",
        tierTitle: "Tier A",
        tierSlug: "tier-a",
        examBoardTitle: "ExamBoard 1",
        examBoardSlug: "examBoard-1",
      },
      {
        keyStageTitle: "KS2",
        keyStageSlug: "ks2",
        subjectTitle: "Science",
        subjectSlug: "science",
        unitTitle: "Unit 1",
        unitSlug: "unit-1",
        programmeSlug: "science--examBoard-2--tier-b",
        tierTitle: "Tier B",
        tierSlug: "tier-b",
        examBoardTitle: "ExamBoard 2",
        examBoardSlug: "examBoard-2",
      },
      {
        keyStageTitle: "KS1",
        keyStageSlug: "ks1",
        subjectTitle: "Math",
        subjectSlug: "math",
        unitTitle: "Unit 2",
        unitSlug: "unit-2",
        programmeSlug: "math--examBoard-1--tier-a",
        tierTitle: "Tier A",
        tierSlug: "tier-a",
        examBoardTitle: "ExamBoard 1",
        examBoardSlug: "examBoard-1",
      },
      {
        keyStageTitle: "KS1",
        keyStageSlug: "ks1",
        subjectTitle: "Math",
        subjectSlug: "math",
        unitTitle: "Unit 2",
        unitSlug: "unit-2",
        programmeSlug: "math--examBoard-2--tier-c",
        tierTitle: "Tier C",
        tierSlug: "tier-c",
        examBoardTitle: "ExamBoard 2",
        examBoardSlug: "examBoard-2",
      },
      {
        keyStageTitle: "KS2",
        keyStageSlug: "ks2",
        subjectTitle: "Science",
        subjectSlug: "science",
        unitTitle: "Unit 3",
        unitSlug: "unit-3",
        programmeSlug: "science--examBoard-3--tier-d",
        tierTitle: "Tier D",
        tierSlug: "tier-d",
        examBoardTitle: "ExamBoard 3",
        examBoardSlug: "examBoard-3",
      },
    ];

    const result = groupLessonPathways(lessonPathways);

    const expected = {
      subjects: [
        {
          subjectSlug: "math",
          subjectTitle: "Math",
          units: [
            {
              unitTitle: "Unit 1",
              unitSlug: "unit-1",
              examBoards: [
                {
                  examBoardTitle: "ExamBoard 1",
                  examBoardSlug: "examBoard-1",
                  subjectTitle: "Math",
                  subjectSlug: "math",
                  tiers: [
                    {
                      programmeSlug: "math--examBoard-1--tier-a",
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
              examBoards: [
                {
                  examBoardTitle: "ExamBoard 1",
                  examBoardSlug: "examBoard-1",
                  subjectTitle: "Math",
                  subjectSlug: "math",
                  tiers: [
                    {
                      programmeSlug: "math--examBoard-1--tier-a",
                      tierTitle: "Tier A",
                      tierSlug: "tier-a",
                    },
                  ],
                },
                {
                  examBoardTitle: "ExamBoard 2",
                  examBoardSlug: "examBoard-2",
                  subjectTitle: "Math",
                  subjectSlug: "math",
                  tiers: [
                    {
                      programmeSlug: "math--examBoard-2--tier-c",
                      tierTitle: "Tier C",
                      tierSlug: "tier-c",
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          subjectSlug: "science",
          subjectTitle: "Science",
          units: [
            {
              unitTitle: "Unit 1",
              unitSlug: "unit-1",
              examBoards: [
                {
                  examBoardTitle: "ExamBoard 2",
                  examBoardSlug: "examBoard-2",
                  subjectTitle: "Science",
                  subjectSlug: "science",
                  tiers: [
                    {
                      programmeSlug: "science--examBoard-2--tier-b",
                      tierTitle: "Tier B",
                      tierSlug: "tier-b",
                    },
                  ],
                },
              ],
            },
            {
              unitTitle: "Unit 3",
              unitSlug: "unit-3",
              examBoards: [
                {
                  examBoardTitle: "ExamBoard 3",
                  examBoardSlug: "examBoard-3",
                  subjectTitle: "Science",
                  subjectSlug: "science",
                  tiers: [
                    {
                      programmeSlug: "science--examBoard-3--tier-d",
                      tierTitle: "Tier D",
                      tierSlug: "tier-d",
                    },
                  ],
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
