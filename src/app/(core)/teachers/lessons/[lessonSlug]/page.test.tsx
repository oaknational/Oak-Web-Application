import CanonicalLessonHubPage from "./page";

const mockRedirect = jest.fn();
jest.mock("next/navigation", () => ({
  __esModule: true,
  notFound: () => {
    throw new Error("NEXT_HTTP_ERROR_FALLBACK;404");
  },
  redirect: (url: string) => mockRedirect(url),
  unstable_rethrow: jest.fn(),
}));

const mockLessonOverview = jest.fn();
jest.mock("@/node-lib/curriculum-api-2023", () => ({
  __esModule: true,
  default: {
    lessonOverview: (...args: unknown[]) => mockLessonOverview(...args),
  },
}));

describe("Canonical lesson hub page", () => {
  it("returns not found when lesson data is null", async () => {
    mockLessonOverview.mockRejectedValue(
      new Error("NEXT_HTTP_ERROR_FALLBACK;404"),
    );

    await expect(
      CanonicalLessonHubPage({
        params: Promise.resolve({ lessonSlug: "lesson-slug" }),
      }),
    ).rejects.toEqual(new Error("NEXT_HTTP_ERROR_FALLBACK;404"));
  });
  it("redirects when a lesson is in one programme", async () => {
    mockLessonOverview.mockResolvedValue({
      pathways: [
        {
          programmeSlug: "english-primary-ks1",
          unitSlug: "nursery-rhymes-reading-poetry",
          unitTitle: "Nursery rhymes: reading poetry",
          keyStageSlug: "ks1",
          keyStageTitle: "Key Stage 1",
          subjectSlug: "english",
          subjectTitle: "English",
          lessonCohort: "2023-2024",
          examBoardSlug: null,
          examBoardTitle: null,
          tierSlug: null,
          tierTitle: null,
          pathwayTitle: null,
        },
      ],
    });

    await CanonicalLessonHubPage({
      params: Promise.resolve({ lessonSlug: "lesson-slug" }),
    });
    expect(mockRedirect).toHaveBeenCalledWith(
      "/teachers/programmes/english-primary-ks1/units/nursery-rhymes-reading-poetry/lessons/lesson-slug",
    );
  });
});
