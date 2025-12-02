import { mediaClipCycleFixture } from "@oaknational/oak-curriculum-schema";

import {
  createAttributionObject,
  getCommonPathway,
  groupLessonPathways,
  getLessonMediaBreadCrumb,
  getMediaClipLabel,
  convertBytesToMegabytes,
  sortMediaClipsByOrder,
  getPageLinksWithSubheadingsForLesson,
} from "@/components/TeacherComponents/helpers/lessonHelpers/lesson.helpers";
import {
  quizQuestions,
  quizQuestionsNoImages,
} from "@/node-lib/curriculum-api-2023/fixtures/quizElements.fixture";
import type { MediaClip } from "@/node-lib/curriculum-api-2023/queries/lessonMediaClips/lessonMediaClips.schema";
import keysToCamelCase from "@/utils/snakeCaseConverter";
import { LessonOverviewProps } from "@/components/TeacherViews/LessonOverview/LessonOverview.view";
import lessonOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/lessonOverview.fixture";

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
      subjectParent: null,
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
      pathwayTitle: null,
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
      subjectParent: null,
      yearSlug: null,
      yearTitle: null,
      lessonCohort: "2023-2024",
      pathwayTitle: null,
    };

    expect(result).toEqual(expected);
  });
});

describe("getPageLinksWithSubheadingsForLesson()", () => {
  const lesson = {
    lessonGuideUrl: "lesson-guide-url",
    presentationUrl: "presentation-url",
    videoMuxPlaybackId: "video-mux-playback-id",
    worksheetUrl: "worksheet-url",
    additionalMaterialUrl: "additional-material-url",
    starterQuiz: [],
    exitQuiz: [],
    hasLegacyCopyrightMaterial: false,
    hasDownloadableResources: true,
    hasMediaClips: false,
  };
  const downloads: LessonOverviewProps["lesson"]["downloads"] =
    lessonOverviewFixture().downloads;

  it("returns only the correct page links for a lesson with no starter or exit quiz", () => {
    const result = getPageLinksWithSubheadingsForLesson(downloads, lesson, []);

    const expected = [
      {
        label: "Lesson guide",
        anchorId: "lesson-guide",
      },
      {
        label: "Lesson slides",
        anchorId: "slide-deck",
      },
      {
        label: "Lesson details",
        anchorId: "lesson-details",
      },
      {
        label: "Lesson video",
        anchorId: "video",
      },
      {
        label: "Worksheet",
        anchorId: "worksheet",
      },
      {
        label: "Additional material",
        anchorId: "additional-material",
      },
    ];
    expect(result).toEqual(expected);
  });

  it("returns only the correct page links for a lesson with starter and exit quiz", () => {
    const currentLesson = {
      ...lesson,
      starterQuiz: quizQuestions,
      exitQuiz: quizQuestions,
    };

    const result = getPageLinksWithSubheadingsForLesson(
      downloads,
      currentLesson,
      [],
    );
    const expected = [
      {
        label: "Lesson guide",
        anchorId: "lesson-guide",
      },
      {
        label: "Lesson slides",
        anchorId: "slide-deck",
      },
      {
        label: "Lesson details",
        anchorId: "lesson-details",
      },
      {
        label: "Lesson video",
        anchorId: "video",
      },
      {
        label: "Worksheet",
        anchorId: "worksheet",
      },
      {
        label: "Quizzes",
        anchorId: "quiz",
        subheading: `Prior knowledge starter quiz \nAssessment exit quiz`,
      },
      {
        anchorId: "additional-material",
        label: "Additional material",
      },
    ];

    expect(result).toEqual(expected);
  });
  it("returns only the correct page links for a lesson only a starter quiz and no exit quiz", () => {
    const currentLesson = {
      ...lesson,
      starterQuiz: quizQuestions,
    };

    const result = getPageLinksWithSubheadingsForLesson(
      downloads,
      currentLesson,
      [],
    );
    const expected = [
      {
        label: "Lesson guide",
        anchorId: "lesson-guide",
      },
      {
        label: "Lesson slides",
        anchorId: "slide-deck",
      },
      {
        label: "Lesson details",
        anchorId: "lesson-details",
      },
      {
        label: "Lesson video",
        anchorId: "video",
      },
      {
        label: "Worksheet",
        anchorId: "worksheet",
      },
      {
        label: "Quizzes",
        anchorId: "starter-quiz",
        subheading: `Prior knowledge starter quiz`,
      },
      {
        label: "Additional material",
        anchorId: "additional-material",
      },
    ];

    expect(result).toEqual(expected);
  });
  it("returns only the correct page links for a lesson only an exit quiz and no starter quiz", () => {
    const newLesson = {
      ...lesson,
      exitQuiz: quizQuestions,
    };

    const result = getPageLinksWithSubheadingsForLesson(
      downloads,
      newLesson,
      [],
    );
    const expected = [
      {
        label: "Lesson guide",
        anchorId: "lesson-guide",
      },
      {
        label: "Lesson slides",
        anchorId: "slide-deck",
      },
      {
        label: "Lesson details",
        anchorId: "lesson-details",
      },
      {
        label: "Lesson video",
        anchorId: "video",
      },
      {
        label: "Worksheet",
        anchorId: "worksheet",
      },
      {
        label: "Quizzes",
        anchorId: "exit-quiz",
        subheading: `Assessment exit quiz`,
      },
      {
        label: "Additional material",
        anchorId: "additional-material",
      },
    ];

    expect(result).toEqual(expected);
  });

  it("doesn't include slidedeck if hasLegacyCopyrightMaterial", () => {
    const newLesson = {
      ...lesson,
      hasLegacyCopyrightMaterial: true,
    };

    const result = getPageLinksWithSubheadingsForLesson(downloads, newLesson, [
      { copyrightInfo: "This lesson contains copyright material." },
    ]);

    const expected = [
      {
        label: "Lesson guide",
        anchorId: "lesson-guide",
      },
      {
        label: "Lesson details",
        anchorId: "lesson-details",
      },
      {
        label: "Lesson video",
        anchorId: "video",
      },
      {
        label: "Worksheet",
        anchorId: "worksheet",
      },
      {
        label: "Additional material",
        anchorId: "additional-material",
      },
    ];

    expect(result).toEqual(expected);
  });
  it("Doesn't include the assets if they don't exist in the bucket", () => {
    const newLesson = {
      ...lesson,
      presentationUrl: "presentation-url",
      worksheetUrl: "worksheet-url",
      starterQuiz: quizQuestions,
      exitQuiz: quizQuestions,
    };

    const downloadsNotInBucket: LessonOverviewProps["lesson"]["downloads"] = [
      {
        type: "presentation",
        exists: true,
        inGcsBucket: false,
        label: "Slide deck",
        ext: "pptx",
        forbidden: null,
      },
      {
        type: "worksheet-pdf",
        exists: true,
        inGcsBucket: false,
        label: "Worksheet",
        ext: "pdf",
        forbidden: null,
      },
      {
        type: "intro-quiz-questions",
        exists: true,
        inGcsBucket: false,
        label: "Starter quiz questions",
        ext: "pdf",
        forbidden: null,
      },
      {
        type: "exit-quiz-questions",
        exists: true,
        inGcsBucket: false,
        label: "Exit quiz questions",
        ext: "pdf",
        forbidden: null,
      },
    ];

    const result = getPageLinksWithSubheadingsForLesson(
      downloadsNotInBucket,
      newLesson,
      [],
    );

    // Excludes: slide-deck (not in bucket), worksheet (not in bucket), quizzes (not in bucket)
    const expected = [
      {
        label: "Lesson guide",
        anchorId: "lesson-guide",
      },
      {
        label: "Lesson details",
        anchorId: "lesson-details",
      },
      {
        label: "Lesson video",
        anchorId: "video",
      },
      {
        label: "Additional material",
        anchorId: "additional-material",
      },
    ];
    expect(result).toEqual(expected);
  });
  it("Includes the asset if inGcsBucket is undefined (server-side check failed)", () => {
    const newLesson = {
      ...lesson,
      presentationUrl: "presentation-url",
      worksheetUrl: "worksheet-url",
      starterQuiz: quizQuestions,
      exitQuiz: quizQuestions,
    };

    const downloadsNotInBucket: LessonOverviewProps["lesson"]["downloads"] = [
      {
        type: "presentation",
        exists: true,
        inGcsBucket: undefined,
        label: "Slide deck",
        ext: "pptx",
        forbidden: null,
      },
      {
        type: "worksheet-pdf",
        exists: true,
        inGcsBucket: undefined,
        label: "Worksheet",
        ext: "pdf",
        forbidden: null,
      },
      {
        type: "intro-quiz-questions",
        exists: true,
        inGcsBucket: undefined,
        label: "Starter quiz questions",
        ext: "pdf",
        forbidden: null,
      },
      {
        type: "exit-quiz-questions",
        exists: true,
        inGcsBucket: undefined,
        label: "Exit quiz questions",
        ext: "pdf",
        forbidden: null,
      },
    ];

    const result = getPageLinksWithSubheadingsForLesson(
      downloadsNotInBucket,
      newLesson,
      [],
    );

    const expected = [
      { label: "Lesson guide", anchorId: "lesson-guide" },
      { label: "Lesson slides", anchorId: "slide-deck" },
      { label: "Lesson details", anchorId: "lesson-details" },
      { label: "Lesson video", anchorId: "video" },
      { label: "Worksheet", anchorId: "worksheet" },
      {
        label: "Quizzes",
        anchorId: "quiz",
        subheading: "Prior knowledge starter quiz \nAssessment exit quiz",
      },
      { label: "Additional material", anchorId: "additional-material" },
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
  it("converts bytes to megabytes and returns string fixed to two coma spaces", () => {
    const result = convertBytesToMegabytes(13456325);
    expect(result).toBe("12.83 MB");
  });

  it("converts bytes to kilobytes and returns string fixed to two coma spaces", () => {
    const result = convertBytesToMegabytes(3456);
    expect(result).toBe("3.38 KB");
  });

  it("doesn't convert bytes if the size is too small to be converted", () => {
    const result = convertBytesToMegabytes(876);
    expect(result).toBe("876 B");
  });
});

describe("sortMediaClipsByOrder", () => {
  it("sorts media clips in ascending order based on the 'order' property", () => {
    const mediaClips: MediaClip[] = keysToCamelCase([
      mediaClipCycleFixture({
        overrides: {
          order: "2",
        },
      }),
      mediaClipCycleFixture({
        overrides: {
          order: "5",
        },
      }),
      mediaClipCycleFixture({
        overrides: {
          order: "1",
        },
      }),
    ]);
    const result = mediaClips.toSorted(sortMediaClipsByOrder);

    expect(result).toEqual(
      keysToCamelCase([
        mediaClipCycleFixture({
          overrides: {
            order: "1",
          },
        }),
        mediaClipCycleFixture({
          overrides: {
            order: "2",
          },
        }),
        mediaClipCycleFixture({
          overrides: {
            order: "5",
          },
        }),
      ]),
    );
  });

  it("returns 0 when two media clips have the same 'order' property", () => {
    const mediaClips: MediaClip[] = keysToCamelCase([
      mediaClipCycleFixture({
        overrides: {
          order: "1",
          media_id: "456",
        },
      }),
      mediaClipCycleFixture({
        overrides: {
          order: "1",
          media_id: "123",
        },
      }),
    ]);

    const result = mediaClips.toSorted(sortMediaClipsByOrder);

    expect(result).toEqual(
      keysToCamelCase([
        mediaClipCycleFixture({
          overrides: {
            order: "1",
            media_id: "456",
          },
        }),
        mediaClipCycleFixture({
          overrides: {
            order: "1",
            media_id: "123",
          },
        }),
      ]),
    );
  });

  it("handles empty arrays without errors", () => {
    const mediaClips: MediaClip[] = [];
    const result = mediaClips.toSorted(sortMediaClipsByOrder);

    expect(result).toEqual([]);
  });

  it("handles media clips with non-numeric 'order' values gracefully", () => {
    const mediaClips: MediaClip[] = keysToCamelCase([
      mediaClipCycleFixture({
        overrides: {
          order: "abc",
          media_id: "123",
        },
      }),
      mediaClipCycleFixture({
        overrides: {
          order: "2",
          media_id: "456",
        },
      }),
      mediaClipCycleFixture({
        overrides: {
          order: "1",
          media_id: "456",
        },
      }),
    ]);

    const result = mediaClips.toSorted(sortMediaClipsByOrder);

    expect(result).toEqual(
      keysToCamelCase([
        mediaClipCycleFixture({
          overrides: {
            order: "abc",
            media_id: "123",
          },
        }),
        mediaClipCycleFixture({
          overrides: {
            order: "1",
            media_id: "456",
          },
        }),
        mediaClipCycleFixture({
          overrides: {
            order: "2",
            media_id: "456",
          },
        }),
      ]),
    );
  });
});
