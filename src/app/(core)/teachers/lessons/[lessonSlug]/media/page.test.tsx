import { screen, within } from "@testing-library/react";

import CanonicalLessonMediaHubPage, { generateMetadata } from "./page";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import OakError from "@/errors/OakError";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { lessonMediaClipsCanonicalFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonMediaClips.fixture";
import { CanonicalLessonMediaClips } from "@/node-lib/curriculum-api-2023/queries/lessonMediaClips/lessonMediaClips.schema";

jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  redirect: (url: string) => {
    throw new Error(`REDIRECT:${url}`);
  },
  notFound: () => {
    throw new Error("NOT_FOUND");
  },
  unstable_rethrow: jest.fn(),
  usePathname: () => "/",
}));

jest.mock("@/node-lib/curriculum-api-2023", () => ({
  __esModule: true,
  default: {
    lessonMediaClips: jest.fn(),
    canonicalLessonRedirectQuery: jest.fn(),
  },
}));

const render = renderWithProviders();
const props = {
  params: Promise.resolve({ lessonSlug: "lesson-slug" }),
};
const fixture = lessonMediaClipsCanonicalFixture();
const basePathway = fixture.pathways[0]!;
const firstPathway = {
  ...basePathway,
  subjectSlug: "science",
  subjectTitle: "Science",
  programmeSlug: "science-secondary-year-10-aqa-foundation",
  unitSlug: "forces",
  unitTitle: "Forces",
  yearGroupTitle: "Year 10",
  examBoardTitle: "AQA",
  tierTitle: "Foundation",
} satisfies CanonicalLessonMediaClips["pathways"][number];
const secondPathway = {
  ...firstPathway,
  programmeSlug: "science-secondary-year-11-edexcel-higher",
  unitSlug: "motion",
  unitTitle: "Motion",
  yearGroupTitle: "Year 11",
  examBoardTitle: "Edexcel",
  tierTitle: "Higher",
} satisfies CanonicalLessonMediaClips["pathways"][number];

const mockMedia = jest.mocked(curriculumApi2023.lessonMediaClips);
const mockRedirect = jest.mocked(
  curriculumApi2023.canonicalLessonRedirectQuery,
);

beforeEach(() => {
  jest.clearAllMocks();
  mockMedia.mockResolvedValue(
    lessonMediaClipsCanonicalFixture({
      pathways: [firstPathway, secondPathway],
    }),
  );
  mockRedirect.mockRejectedValue(
    new OakError({ code: "curriculum-api/not-found" }),
  );
});

describe("Canonical lesson media hub", () => {
  it("shows the subject image and a card with details for each variant", async () => {
    const page = await CanonicalLessonMediaHubPage(props);
    const { container } = render(<>{page}</>);

    expect(
      screen.getByRole("heading", { name: "Media clips appear in" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: fixture.lessonTitle }),
    ).toBeInTheDocument();
    expect(
      container.querySelector('img[src*="subject-icons/science.svg"]'),
    ).toBeInTheDocument();

    const cards = screen.getAllByRole("listitem");
    expect(cards).toHaveLength(2);
    [firstPathway, secondPathway].forEach((pathway, index) => {
      const card = within(cards[index]!);
      [
        pathway.subjectTitle,
        pathway.unitTitle,
        pathway.yearGroupTitle,
        pathway.examBoardTitle,
        pathway.tierTitle,
      ].forEach((text) => expect(card.getByText(text)).toBeInTheDocument());
      expect(card.getByRole("link")).toHaveAttribute(
        "href",
        `/teachers/programmes/${pathway.programmeSlug}/units/${pathway.unitSlug}/lessons/lesson-slug/media`,
      );
    });
  });

  it("shows a separate card and tag for each citizenship pathway", async () => {
    mockMedia.mockResolvedValue(
      lessonMediaClipsCanonicalFixture({
        pathways: [
          {
            ...basePathway,
            subjectSlug: "citizenship",
            subjectTitle: "Citizenship",
            programmeSlug: "citizenship-secondary-year-10-core",
            pathwayTitle: "Core",
          },
          {
            ...basePathway,
            subjectSlug: "citizenship",
            subjectTitle: "Citizenship",
            programmeSlug: "citizenship-secondary-year-10-gcse",
            pathwayTitle: "GCSE",
          },
        ],
      }),
    );

    const page = await CanonicalLessonMediaHubPage(props);
    render(<>{page}</>);

    expect(screen.getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getAllByText("Citizenship")).toHaveLength(2);
    expect(screen.getByText("Core")).toBeInTheDocument();
    expect(screen.getByText("GCSE")).toBeInTheDocument();
  });

  it("preserves the selected clip on every variant link", async () => {
    const page = await CanonicalLessonMediaHubPage({
      ...props,
      searchParams: Promise.resolve({ video: "123" }),
    });
    render(<>{page}</>);

    screen.getAllByRole("link").forEach((link) => {
      expect(link.getAttribute("href")).toMatch(/\/media\?video=123$/);
    });
  });

  it.each([undefined, "123"])(
    "redirects a single variant to its media page with clip %s",
    async (video) => {
      mockMedia.mockResolvedValue(
        lessonMediaClipsCanonicalFixture({ pathways: [firstPathway] }),
      );

      await expect(
        CanonicalLessonMediaHubPage({
          ...props,
          searchParams: Promise.resolve({ video }),
        }),
      ).rejects.toThrow(
        `REDIRECT:/teachers/programmes/${firstPathway.programmeSlug}/units/forces/lessons/lesson-slug/media${video ? `?video=${video}` : ""}`,
      );
    },
  );

  it("preserves EYFS redirects", async () => {
    mockMedia.mockResolvedValue(
      lessonMediaClipsCanonicalFixture({
        pathways: [
          {
            ...basePathway,
            keyStageSlug: "early-years-foundation-stage",
            subjectSlug: "communication-and-language",
          },
        ],
      }),
    );

    await expect(CanonicalLessonMediaHubPage(props)).rejects.toThrow(
      "REDIRECT:/teachers/eyfs/communication-and-language",
    );
  });

  it("keeps redirects for renamed lessons on the media route", async () => {
    mockMedia.mockRejectedValue(
      new OakError({ code: "curriculum-api/not-found" }),
    );
    mockRedirect.mockResolvedValue({
      canonicalLessonRedirectData: {
        incomingPath: "/teachers/lessons/lesson-slug",
        outgoingPath: "/teachers/lessons/new-slug",
        redirectType: 301,
      },
    });

    await expect(
      CanonicalLessonMediaHubPage({
        ...props,
        searchParams: Promise.resolve({ video: "123" }),
      }),
    ).rejects.toThrow(
      "REDIRECT:/teachers/lessons/new-slug/media?video=123&redirected=true",
    );
    expect(mockRedirect).toHaveBeenCalledWith({
      incomingPath: "/teachers/lessons/lesson-slug",
    });
  });

  it("returns not found when the lesson has no redirect", async () => {
    mockMedia.mockRejectedValue(
      new OakError({ code: "curriculum-api/not-found" }),
    );

    await expect(CanonicalLessonMediaHubPage(props)).rejects.toThrow(
      "NOT_FOUND",
    );
  });

  it("returns not found when there are no pathways", async () => {
    mockMedia.mockResolvedValue(
      lessonMediaClipsCanonicalFixture({ pathways: [] }),
    );

    await expect(CanonicalLessonMediaHubPage(props)).rejects.toThrow(
      "NOT_FOUND",
    );
  });

  it("returns not found when the lesson has no media clips", async () => {
    mockMedia.mockResolvedValue({ ...fixture, mediaClips: null });

    await expect(CanonicalLessonMediaHubPage(props)).rejects.toThrow(
      "NOT_FOUND",
    );
  });

  it("propagates unexpected API failures instead of redirecting", async () => {
    mockMedia.mockRejectedValue(new Error("API unavailable"));

    await expect(CanonicalLessonMediaHubPage(props)).rejects.toThrow(
      "API unavailable",
    );
    expect(mockRedirect).not.toHaveBeenCalled();
  });
});

describe("generateMetadata", () => {
  it("provides media hub metadata without indexing", async () => {
    const metadata = await generateMetadata(props);

    expect(metadata.title).toBe(`Lesson media hub: ${fixture.lessonTitle}`);
    expect(metadata.openGraph?.title).toBe(metadata.title);
    expect(metadata.twitter?.title).toBe(metadata.title);
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });

  it("returns empty metadata for missing lessons", async () => {
    mockMedia.mockRejectedValue(
      new OakError({ code: "curriculum-api/not-found" }),
    );

    await expect(generateMetadata(props)).resolves.toEqual({});
  });

  it("propagates unexpected API failures", async () => {
    mockMedia.mockRejectedValue(new Error("API unavailable"));

    await expect(generateMetadata(props)).rejects.toThrow("API unavailable");
  });
});
