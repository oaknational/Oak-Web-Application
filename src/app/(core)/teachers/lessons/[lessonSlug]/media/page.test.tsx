import { CanonicalLessonHub } from "../CanonicalLessonHub";

import CanonicalLessonMediaHubPage, { generateMetadata } from "./page";

import OakError from "@/errors/OakError";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import canonicalLessonMediaFixture from "@/node-lib/curriculum-api-2023/fixtures/canonicalLessonMedia.fixture";
import type { CanonicalLessonMediaData } from "@/node-lib/curriculum-api-2023/queries/canonicalLessonMedia/canonicalLessonMedia.schema";

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
    canonicalLessonMedia: jest.fn(),
    canonicalLessonRedirectQuery: jest.fn(),
  },
}));

const props = {
  params: Promise.resolve({ lessonSlug: "lesson-slug" }),
};
const fixture = canonicalLessonMediaFixture();
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
} satisfies CanonicalLessonMediaData["pathways"][number];
const secondPathway = {
  ...firstPathway,
  programmeSlug: "science-secondary-year-11-edexcel-higher",
  unitSlug: "motion",
  unitTitle: "Motion",
  yearGroupTitle: "Year 11",
  examBoardTitle: "Edexcel",
  tierTitle: "Higher",
} satisfies CanonicalLessonMediaData["pathways"][number];

const mockMedia = jest.mocked(curriculumApi2023.canonicalLessonMedia);
const mockRedirect = jest.mocked(
  curriculumApi2023.canonicalLessonRedirectQuery,
);

beforeEach(() => {
  jest.clearAllMocks();
  mockMedia.mockResolvedValue(
    canonicalLessonMediaFixture({
      subjectSlug: "science",
      pathways: [firstPathway, secondPathway],
    }),
  );
  mockRedirect.mockRejectedValue(
    new OakError({ code: "curriculum-api/not-found" }),
  );
});

describe("Canonical lesson media hub", () => {
  it.each([undefined, "123"])(
    "passes media data and variant links to the shared hub with clip %s",
    async (video) => {
      const page = await CanonicalLessonMediaHubPage({
        ...props,
        searchParams: Promise.resolve({ video }),
      });
      const query = video ? `?video=${video}` : "";

      expect(page).toEqual(
        <CanonicalLessonHub
          subjectSlug="science"
          lessonName={fixture.lessonTitle}
          listingTitle="Media clips appear in"
          programmesForLesson={[
            {
              subject: "Science",
              unitTitle: "Forces",
              examboard: "AQA",
              tier: "Foundation",
              year: "Year 10",
              pathway: null,
              href: `/teachers/programmes/science-secondary-year-10-aqa-foundation/units/forces/lessons/lesson-slug/media${query}`,
            },
            {
              subject: "Science",
              unitTitle: "Motion",
              examboard: "Edexcel",
              tier: "Higher",
              year: "Year 11",
              pathway: null,
              href: `/teachers/programmes/science-secondary-year-11-edexcel-higher/units/motion/lessons/lesson-slug/media${query}`,
            },
          ]}
        />,
      );
      expect(mockMedia).toHaveBeenCalledWith({ lessonSlug: "lesson-slug" });
    },
  );

  it.each([undefined, "123"])(
    "redirects a single variant to its media page with clip %s",
    async (video) => {
      mockMedia.mockResolvedValue(
        canonicalLessonMediaFixture({ pathways: [firstPathway] }),
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
      canonicalLessonMediaFixture({
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

  it.each([
    [
      "/teachers/lessons/new-slug",
      "/teachers/lessons/new-slug/media?video=123&redirected=true",
    ],
    [
      "/teachers/programmes/programme/units/unit/lessons/new-slug",
      "/teachers/programmes/programme/units/unit/lessons/new-slug/media?video=123&redirected=true",
    ],
    [
      "/teachers/programmes/programme/units/unit/lessons",
      "/teachers/programmes/programme/units/unit/lessons?redirected=true",
    ],
  ])(
    "redirects an old media URL targeting %s",
    async (outgoingPath, destination) => {
      mockMedia.mockRejectedValue(
        new OakError({ code: "curriculum-api/not-found" }),
      );
      mockRedirect.mockResolvedValue({
        canonicalLessonRedirectData: {
          incomingPath: "/teachers/lessons/lesson-slug",
          outgoingPath,
          redirectType: 301,
        },
      });

      await expect(
        CanonicalLessonMediaHubPage({
          ...props,
          searchParams: Promise.resolve({ video: "123" }),
        }),
      ).rejects.toThrow(new Error(`REDIRECT:${destination}`));
      expect(mockRedirect).toHaveBeenCalledWith({
        incomingPath: "/teachers/lessons/lesson-slug",
      });
    },
  );

  it("returns not found when the lesson has no redirect", async () => {
    mockMedia.mockRejectedValue(
      new OakError({ code: "curriculum-api/not-found" }),
    );

    await expect(CanonicalLessonMediaHubPage(props)).rejects.toThrow(
      "NOT_FOUND",
    );
  });

  it("returns not found when there are no pathways", async () => {
    mockMedia.mockResolvedValue(canonicalLessonMediaFixture({ pathways: [] }));

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
