import {
  createAttributionObject,
  getCommonPathway,
  getPageLinksForLesson,
  groupLessonPathways,
  getLessonMediaBreadCrumb,
  getMediaClipLabel,
  convertBytesToMegabytes,
} from "@/components/TeacherComponents/helpers/lessonHelpers/lesson.helpers";
import {
  quizQuestions,
  quizQuestionsNoImages,
} from "@/node-lib/curriculum-api-2023/fixtures/quizElements.fixture";

describe("getCommonPathway()", () => {
  it("returns the intersection of a single LessonPathway", () => {
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
        lessonCohort: "2023-2024",
      },
    ];

    const result = getCommonPathway(lessonPathways);

    const expected = {
      keyStageSlug: "ks1",
      keyStageTitle: "KS1",
      subjectTitle: "Math",
      subjectSlug: "math",
      unitTitle: "Unit 1",
      unitSlug: "unit-1",
      programmeSlug: "programme-1",
      tierTitle: "Tier A",
      tierSlug: "tier-a",
      examBoardTitle: "ExamBoard 1",
      examBoardSlug: "examBoard-1",
      yearSlug: null,
      yearTitle: null,
      lessonCohort: "2023-2024",
    };

    expect(result).toEqual(expected);
  });

  it("returns the intersection of multiple LessonPathways", () => {
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
        lessonCohort: "2023-2024",
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
        lessonCohort: "2023-2024",
      },
    ];

    const result = getCommonPathway(lessonPathways);

    const expected = {
      keyStageSlug: null,
      keyStageTitle: null,
      subjectTitle: null,
      subjectSlug: null,
      unitTitle: null,
      unitSlug: null,
      programmeSlug: null,
      tierTitle: null,
      tierSlug: null,
      examBoardTitle: null,
      examBoardSlug: null,
      yearSlug: null,
      yearTitle: null,
      lessonCohort: "2023-2024",
    };

    expect(result).toEqual(expected);
  });
});

describe("getPageLinksForLesson()", () => {
  it("returns only the correct page links for a lesson with no starter or exit quiz", () => {
    const lesson = {
      lessonGuideUrl: "lesson-guide-url",
      presentationUrl: "presentation-url",
      videoMuxPlaybackId: "video-mux-playback-id",
      worksheetUrl: "worksheet-url",
      additionalMaterialUrl: "additional-material-url",
      starterQuiz: [],
      exitQuiz: [],
      hasCopyrightMaterial: false,
      hasDownloadableResources: true,
      hasMediaClips: false,
    };

    const result = getPageLinksForLesson(lesson, []);

    const expected = [
      {
        anchorId: "lesson-guide",
        label: "Lesson guide",
      },
      {
        anchorId: "slide-deck",
        label: "Slide deck",
      },
      {
        anchorId: "lesson-details",
        label: "Lesson details",
      },
      {
        anchorId: "video",
        label: "Lesson video",
      },
      {
        anchorId: "worksheet",
        label: "Worksheet",
      },
      {
        anchorId: "additional-material",
        label: "Additional material",
      },
    ];

    expect(result).toEqual(expected);
  });

  it("returns only the correct page links for a lesson with starter and exit quiz", () => {
    const lesson = {
      presentationUrl: "presentation-url",
      videoMuxPlaybackId: "video-mux-playback-id",
      worksheetUrl: "worksheet-url",
      additionalMaterialUrl: "additional-material-url",
      starterQuiz: ["foo"],
      exitQuiz: ["bar"],
      hasCopyrightMaterial: false,
      hasDownloadableResources: true,
    };

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const result = getPageLinksForLesson(lesson);
    const expected = [
      {
        anchorId: "slide-deck",
        label: "Slide deck",
      },
      {
        anchorId: "lesson-details",
        label: "Lesson details",
      },
      {
        anchorId: "video",
        label: "Lesson video",
      },
      {
        anchorId: "worksheet",
        label: "Worksheet",
      },
      {
        anchorId: "starter-quiz",
        label: "Starter quiz",
      },
      {
        anchorId: "exit-quiz",
        label: "Exit quiz",
      },
      {
        anchorId: "additional-material",
        label: "Additional material",
      },
    ];

    expect(result).toEqual(expected);
  });

  it("doesn't include slidedeck if hasCopyrightMaterial", () => {
    const lesson = {
      lessonGuideUrl: null,
      presentationUrl: "presentation-url",
      hasCopyrightMaterial: true,
      videoMuxPlaybackId: null,
      worksheetUrl: "worksheet-url",
      additionalMaterialUrl: null,
      starterQuiz: [],
      exitQuiz: [],
      hasDownloadableResources: true,
      hasMediaClips: false,
    };

    const result = getPageLinksForLesson(lesson, [
      { copyrightInfo: "This lesson contains copyright material." },
    ]);

    const expected = [
      {
        anchorId: "lesson-details",
        label: "Lesson details",
      },
      {
        anchorId: "worksheet",
        label: "Worksheet",
      },
    ];

    expect(result).toEqual(expected);
  });
});
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

describe("createAttributionObject", () => {
  it("returns test attribute away with image attribution data", () => {
    const testAttribution = createAttributionObject(quizQuestions);
    expect(testAttribution).toEqual([
      { questionNumber: "Q2", attribution: "test attribution picture" },
      {
        questionNumber: "Q3 image 1",
        attribution: "test attribution picture",
      },
      {
        questionNumber: "Q3 image 2",
        attribution: "test attribution picture",
      },
      {
        questionNumber: "Q3 image 3",
        attribution: "test attribution picture",
      },
    ]);
  });

  it("when no image metadata is present function returns an empty array", () => {
    const testAttribution = createAttributionObject(quizQuestionsNoImages);
    expect(testAttribution).toEqual([]);
  });
});

describe("getLessonMediaBreadCrumb", () => {
  it("when programmeSlug and unitSlug are passed", () => {
    expect(
      getLessonMediaBreadCrumb({
        lessonSlug: "lesson-1",
        programmeSlug: "programme-2",
        unitSlug: "unit-3",
        subjectSlug: "math",
        disabled: false,
      }),
    ).toEqual({
      oakLinkProps: {
        page: "lesson-media",
        programmeSlug: "programme-2",
        unitSlug: "unit-3",
        lessonSlug: "lesson-1",
      },
      label: "Video & audio clips",
      disabled: false,
    });
  });

  it("when programmeSlug and unitSlug are null", () => {
    expect(
      getLessonMediaBreadCrumb({
        lessonSlug: "lesson-1",
        subjectSlug: "math",
        programmeSlug: null,
        unitSlug: null,
      }),
    ).toEqual({
      oakLinkProps: {
        page: "lesson-media-canonical",
        lessonSlug: "lesson-1",
      },
      label: "Video & audio clips",
      disabled: undefined,
    });
  });
});

describe("getMediaClipLabel", () => {
  it("returns 'Demonstration videos' for 'physical-education'", () => {
    const result = getMediaClipLabel("physical-education");
    expect(result).toBe("Demonstration videos");
  });

  it("returns 'Audio clips' for 'spanish'", () => {
    const result = getMediaClipLabel("spanish");
    expect(result).toBe("Audio clips");
  });

  it("returns 'Audio clips' for 'french'", () => {
    const result = getMediaClipLabel("french");
    expect(result).toBe("Audio clips");
  });

  it("returns 'Audio clips' for 'german'", () => {
    const result = getMediaClipLabel("german");
    expect(result).toBe("Audio clips");
  });

  it("returns 'Video & audio clips' for any other subject", () => {
    const result = getMediaClipLabel("math");
    expect(result).toBe("Video & audio clips");
  });
});

describe("convertBytesToMegabytes", () => {
  it("converts bytes to megabytes and returns string fixed to one coma space", () => {
    const result = convertBytesToMegabytes(13456325);
    expect(result).toBe("12.8");
  });
});
