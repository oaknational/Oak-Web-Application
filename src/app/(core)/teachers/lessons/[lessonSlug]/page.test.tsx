import { CanonicalLessonHub } from "./CanonicalLessonHub";
import CanonicalLessonHubPage, { generateMetadata } from "./page";

const mockRedirect = jest.fn();
jest.mock("next/navigation", () => ({
  __esModule: true,
  notFound: () => {
    throw new Error("NEXT_HTTP_ERROR_FALLBACK;404");
  },
  redirect: (url: string) => mockRedirect(url),
  unstable_rethrow: jest.fn(),
}));

const mockCanonicalLessonOverview = jest.fn();
jest.mock("@/node-lib/curriculum-api-2023", () => ({
  __esModule: true,
  default: {
    canonicalLessonOverview: (...args: unknown[]) =>
      mockCanonicalLessonOverview(...args),
  },
}));

const props = {
  params: Promise.resolve({ lessonSlug: "lesson-slug" }),
};
const pathway = {
  programmeSlug: "science-secondary-year-10-aqa-foundation",
  unitSlug: "forces",
  subjectTitle: "Science",
  unitTitle: "Forces",
  examBoardTitle: "AQA",
  tierTitle: "Foundation",
  yearGroupTitle: "Year 10",
  pathwayTitle: null,
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Canonical lesson hub page", () => {
  it("passes lesson data and variant links to the shared hub", async () => {
    mockCanonicalLessonOverview.mockResolvedValue({
      subjectSlug: "science",
      lessonTitle: "Lesson title",
      pathways: [
        pathway,
        { ...pathway, programmeSlug: "science-secondary-year-11" },
      ],
    });

    expect(await CanonicalLessonHubPage(props)).toEqual(
      <CanonicalLessonHub
        subjectSlug="science"
        lessonName="Lesson title"
        programmesForLesson={[
          {
            subject: "Science",
            unitTitle: "Forces",
            examboard: "AQA",
            tier: "Foundation",
            year: "Year 10",
            pathway: null,
            href: "/teachers/programmes/science-secondary-year-10-aqa-foundation/units/forces/lessons/lesson-slug",
          },
          {
            subject: "Science",
            unitTitle: "Forces",
            examboard: "AQA",
            tier: "Foundation",
            year: "Year 10",
            pathway: null,
            href: "/teachers/programmes/science-secondary-year-11/units/forces/lessons/lesson-slug",
          },
        ]}
      />,
    );
    expect(mockCanonicalLessonOverview).toHaveBeenCalledWith({
      lessonSlug: "lesson-slug",
    });
  });

  it("propagates unexpected lesson fetch errors", async () => {
    mockCanonicalLessonOverview.mockRejectedValue(new Error("API unavailable"));

    await expect(CanonicalLessonHubPage(props)).rejects.toThrow(
      "API unavailable",
    );
  });

  it("redirects when a lesson is in one programme", async () => {
    mockCanonicalLessonOverview.mockResolvedValue({ pathways: [pathway] });

    await CanonicalLessonHubPage(props);

    expect(mockRedirect).toHaveBeenCalledWith(
      "/teachers/programmes/science-secondary-year-10-aqa-foundation/units/forces/lessons/lesson-slug",
    );
  });
});

describe("generateMetadata", () => {
  it("returns empty metadata when the fetch fails", async () => {
    mockCanonicalLessonOverview.mockRejectedValue(new Error("Not found"));

    await expect(generateMetadata(props)).resolves.toEqual({});
  });

  it("generates metadata with the lesson title and description", async () => {
    mockCanonicalLessonOverview.mockResolvedValue({ lessonTitle: "Title" });

    const result = await generateMetadata(props);

    expect(result.title).toBe("Lesson hub: Title");
    expect(result.openGraph?.title).toBe("Lesson hub: Title");
    expect(result.twitter?.title).toBe("Lesson hub: Title");
    expect(result.description).toBe(
      "View lesson content and choose resources to download or share",
    );
  });
});
