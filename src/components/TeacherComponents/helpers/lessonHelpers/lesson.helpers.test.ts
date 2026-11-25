import { mediaClipCycleFixture } from "@oaknational/oak-curriculum-schema";
import { keysToCamelCase } from "zod-to-camel-case";

import {
  createAttributionObject,
  getCommonPathway,
  getLessonMediaBreadCrumb,
  getMediaClipLabel,
  sortMediaClipsByOrder,
} from "@/components/TeacherComponents/helpers/lessonHelpers/lesson.helpers";
import {
  quizQuestions,
  quizQuestionsNoImages,
} from "@/node-lib/curriculum-api-2023/fixtures/quizElements.fixture";
import type { MediaClip } from "@/node-lib/curriculum-api-2023/queries/lessonMediaClips/lessonMediaClips.schema";

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
      year: null,
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
      year: null,
      yearTitle: null,
      lessonCohort: "2023-2024",
      pathwayTitle: null,
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
      href: "/teachers/programmes/programme-2/units/unit-3/lessons/lesson-1/media",
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
      href: "/teachers/lessons/lesson-1/media",
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
