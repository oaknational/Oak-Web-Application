/**
 * @jest-environment node
 */
import LessonMediaPage, { generateMetadata } from "./page";

import { LessonMediaClipsData } from "@/node-lib/curriculum-api-2023/queries/lessonMediaClips/lessonMediaClips.schema";
import lessonMediaClipsFixtures from "@/node-lib/curriculum-api-2023/fixtures/lessonMediaClips.fixture";

jest.mock("next/navigation", () => ({
  __esModule: true,
  notFound: () => {
    throw new Error("NEXT_HTTP_ERROR_FALLBACK;404");
  },
}));

const mockLessonMediaClips = jest.fn();
jest.mock("@/node-lib/curriculum-api-2023", () => ({
  __esModule: true,
  default: {
    lessonMediaClips: (...args: unknown[]) => mockLessonMediaClips(...args),
  },
}));

jest.mock("@/utils/handleTranscript", () => ({
  populateMediaClipsWithTranscripts: async (
    clips: LessonMediaClipsData["mediaClips"],
  ) => clips,
}));

const mockErrorReporter = jest.fn();
jest.mock("@/common-lib/error-reporter", () => ({
  __esModule: true,
  initialiseBugsnag: jest.fn(),
  initialiseSentry: jest.fn(),
  default:
    () =>
    (...args: []) =>
      mockErrorReporter(...args),
}));

const lessonMediaFixture: LessonMediaClipsData = lessonMediaClipsFixtures({
  programmeSlug: "maths-primary",
  unitSlug: "geometry-abc123",
  lessonSlug: "intro-to-geometry-abc123",
  lessonTitle: "Introduction to Geometry",
  keyStageSlug: "ks2",
  keyStageTitle: "Key Stage 2",
  subjectSlug: "maths",
  subjectTitle: "Maths",
  phaseSlug: "primary",
  phaseTitle: "Primary",
  yearGroupTitle: "Year 4",
  subjectParent: null,
  pathwaySlug: null,
  pathwayTitle: null,
  examBoardSlug: null,
  examBoardTitle: null,
  tierTitle: null,
});

const defaultParams = {
  slug: "maths-primary",
  unitSlug: "geometry-abc123",
  lessonSlug: "intro-to-geometry-abc123",
};

describe("LessonMediaPage", () => {
  beforeEach(() => {
    mockLessonMediaClips.mockResolvedValue(lessonMediaFixture);
  });

  it("renders the lesson media page", async () => {
    const result = await LessonMediaPage({
      params: Promise.resolve(defaultParams),
      searchParams: Promise.resolve({}),
    });

    expect(result).toBeDefined();
    expect(mockLessonMediaClips).toHaveBeenCalledWith({
      programmeSlug: defaultParams.slug,
      unitSlug: defaultParams.unitSlug,
      lessonSlug: defaultParams.lessonSlug,
    });
    expect(result).toMatchObject({
      props: {
        useIntegratedJourneyLinks: true,
        breadcrumbsSlot: expect.anything(),
      },
    });
  });

  it("returns 404 when media clips are missing", async () => {
    mockLessonMediaClips.mockResolvedValue({
      ...lessonMediaFixture,
      mediaClips: null as unknown as LessonMediaClipsData["mediaClips"],
    });

    await expect(
      LessonMediaPage({
        params: Promise.resolve(defaultParams),
        searchParams: Promise.resolve({}),
      }),
    ).rejects.toEqual(new Error("NEXT_HTTP_ERROR_FALLBACK;404"));
  });
});

describe("generateMetadata", () => {
  it("returns empty object when fetch fails", async () => {
    mockLessonMediaClips.mockRejectedValue(new Error("Not found"));

    const result = await generateMetadata({
      params: Promise.resolve(defaultParams),
      searchParams: Promise.resolve({}),
    });

    expect(result).toEqual({});
  });

  it("returns metadata with noindex and nofollow when fetch succeeds", async () => {
    mockLessonMediaClips.mockResolvedValue(lessonMediaFixture);

    const result = await generateMetadata({
      params: Promise.resolve(defaultParams),
      searchParams: Promise.resolve({}),
    });

    expect(result).toMatchObject({
      title: "Lesson Media: Introduction to Geometry | KS2 Maths",
      description: "Extra video and audio for the lesson",
      robots: {
        index: false,
        follow: false,
      },
    });
  });
});
