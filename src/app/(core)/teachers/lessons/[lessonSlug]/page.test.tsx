import { screen } from "@testing-library/react";

import CanonicalLessonHubPage from "./page";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const mockRedirect = jest.fn();
jest.mock("next/navigation", () => ({
  __esModule: true,
  notFound: () => {
    throw new Error("NEXT_HTTP_ERROR_FALLBACK;404");
  },
  redirect: (url: string) => mockRedirect(url),
  unstable_rethrow: jest.fn(),
  usePathname: () => "/",
}));

const mockLessonOverview = jest.fn();
jest.mock("@/node-lib/curriculum-api-2023", () => ({
  __esModule: true,
  default: {
    lessonOverview: (...args: unknown[]) => mockLessonOverview(...args),
  },
}));

type LessonPathway = {
  programmeSlug: string;
  unitSlug: string;
  unitTitle: string;
  subjectTitle: string;
  examBoardTitle: string | null;
  tierTitle: string | null;
};

describe("Canonical lesson hub page", () => {
  const render = renderWithProviders();

  const renderPageWithPathways = async (
    lessonSlug: string,
    pathways: LessonPathway[],
  ) => {
    mockLessonOverview.mockResolvedValue({
      subjectSlug: "maths",
      lessonTitle: "Lesson title",
      yearTitle: "Year 9",
      pathways,
    });

    const page = await CanonicalLessonHubPage({
      params: Promise.resolve({ lessonSlug }),
    });

    render(<>{page}</>);
  };

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
  it("renders a card for each examboard option", async () => {
    const pathways: LessonPathway[] = [
      {
        subjectTitle: "Mathematics",
        unitTitle: "Algebra Basics",
        examBoardTitle: "AQA",
        tierTitle: null,
        programmeSlug: "maths-ks4-aqa",
        unitSlug: "algebra",
      },
      {
        subjectTitle: "Mathematics",
        unitTitle: "Algebra Basics",
        examBoardTitle: "Edexcel",
        tierTitle: null,
        programmeSlug: "maths-ks4-edexcel",
        unitSlug: "algebra",
      },
    ];

    await renderPageWithPathways("examboard-options", pathways);

    expect(screen.getAllByTestId("card-listing-container")).toHaveLength(2);
    expect(screen.getByText("AQA")).toBeInTheDocument();
    expect(screen.getByText("Edexcel")).toBeInTheDocument();
    expect(
      screen.getAllByRole("link").map((link) => link.getAttribute("href")),
    ).toEqual([
      expect.stringContaining(
        "/teachers/programmes/maths-ks4-aqa/units/algebra/lessons/examboard-options",
      ),
      expect.stringContaining(
        "/teachers/programmes/maths-ks4-edexcel/units/algebra/lessons/examboard-options",
      ),
    ]);
  });

  it("renders a card for each subject option", async () => {
    const pathways: LessonPathway[] = [
      {
        subjectTitle: "English",
        unitTitle: "Poetry Analysis",
        examBoardTitle: null,
        tierTitle: null,
        programmeSlug: "english-ks4",
        unitSlug: "poetry",
      },
      {
        subjectTitle: "Literature",
        unitTitle: "Poetry Analysis",
        examBoardTitle: null,
        tierTitle: null,
        programmeSlug: "literature-ks4",
        unitSlug: "poetry",
      },
    ];

    await renderPageWithPathways("subject-options", pathways);

    expect(screen.getAllByTestId("card-listing-container")).toHaveLength(2);
    expect(screen.getByText("English")).toBeInTheDocument();
    expect(screen.getByText("Literature")).toBeInTheDocument();
    expect(
      screen.getAllByRole("link").map((link) => link.getAttribute("href")),
    ).toEqual([
      expect.stringContaining(
        "/teachers/programmes/english-ks4/units/poetry/lessons/subject-options",
      ),
      expect.stringContaining(
        "/teachers/programmes/literature-ks4/units/poetry/lessons/subject-options",
      ),
    ]);
  });

  it("renders a card for each tier option", async () => {
    const pathways: LessonPathway[] = [
      {
        subjectTitle: "Mathematics",
        unitTitle: "Number Sense",
        examBoardTitle: null,
        tierTitle: "Foundation",
        programmeSlug: "maths-ks4-foundation",
        unitSlug: "numbers",
      },
      {
        subjectTitle: "Mathematics",
        unitTitle: "Number Sense",
        examBoardTitle: null,
        tierTitle: "Higher",
        programmeSlug: "maths-ks4-higher",
        unitSlug: "numbers",
      },
    ];

    await renderPageWithPathways("tier-options", pathways);

    expect(screen.getAllByTestId("card-listing-container")).toHaveLength(2);
    expect(screen.getByText("Foundation")).toBeInTheDocument();
    expect(screen.getByText("Higher")).toBeInTheDocument();
    expect(
      screen.getAllByRole("link").map((link) => link.getAttribute("href")),
    ).toEqual([
      expect.stringContaining(
        "/teachers/programmes/maths-ks4-foundation/units/numbers/lessons/tier-options",
      ),
      expect.stringContaining(
        "/teachers/programmes/maths-ks4-higher/units/numbers/lessons/tier-options",
      ),
    ]);
  });
});
