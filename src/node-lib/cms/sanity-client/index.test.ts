import { z } from "zod";

import sanityGraphqlApi from "../../sanity-graphql";
import allWebinarsFixture from "../../sanity-graphql/fixtures/allWebinars.json";
import webinarBySlugFixture from "../../sanity-graphql/fixtures/webinarBySlug.json";
import landingPageBySlugFixture from "../../sanity-graphql/fixtures/landingPageBySlug.json";
import { videoSchema } from "../../../common-lib/cms-types/base";

import {
  getNationalCurriculumInsightsHub,
  getNationalCurriculumInsightsSubjectBySlug,
} from "./nationalCurriculumInsightsGroq";

import getSanityClient from "./";

/**
 * Note: sanity-graphql mocks are configured in
 * sanity-graphql/__mocks__
 */
jest.mock("../../sanity-graphql");
jest.mock("./nationalCurriculumInsightsGroq", () => ({
  __esModule: true,
  getNationalCurriculumInsightsHub: jest.fn(),
  getNationalCurriculumInsightsSubjectBySlug: jest.fn(),
}));

jest.mock("./parseResults", () => {
  const original = jest.requireActual("./parseResults");
  return {
    __esModule: true,
    parseResults: jest.fn(original.parseResults),
  };
});

jest.mock("./resolveSanityReferences", () => {
  return {
    __esModule: true,
    // Return self without transform, bypassing any errors caused by
    // dodgy mocks
    resolveSanityReferences: jest.fn((x) => x),
  };
});

const mockSanityGraphqlApi = sanityGraphqlApi as jest.MockedObject<
  typeof sanityGraphqlApi
>;
const mockGetNationalCurriculumInsightsSubjectBySlug =
  getNationalCurriculumInsightsSubjectBySlug as jest.MockedFunction<
    typeof getNationalCurriculumInsightsSubjectBySlug
  >;
const mockGetNationalCurriculumInsightsHub =
  getNationalCurriculumInsightsHub as jest.MockedFunction<
    typeof getNationalCurriculumInsightsHub
  >;

const insightsModule = {
  __typename: "NationalCurriculumInsightsRichTextSection" as const,
  heading: "Introduction",
  contentPortableText: [
    {
      _key: "block",
      _type: "block",
      children: [{ _key: "span", _type: "span", marks: [], text: "Content" }],
      markDefs: [],
      style: "normal",
    },
  ],
};
const insightsSubject = {
  id: "nationalCurriculumInsightsSubject-science",
  pageType: "overview" as const,
  title: "Science",
  summary: "Science overview summary",
  modules: [insightsModule],
  slug: "science",
  curriculumSubjectSlugs: ["biology"],
  tabs: [
    {
      kind: "primary" as const,
      label: "Primary",
      page: {
        id: "nationalCurriculumInsightsPage-science-primary",
        pageType: "primary" as const,
        title: "Primary science",
        summary: "Primary science summary",
        keyStages: [],
        modules: [insightsModule],
      },
    },
  ],
};
const insightsHub = {
  id: "nationalCurriculumInsightsHub",
  title: "National curriculum insights",
  summary: "Explore changes",
  modules: [insightsModule],
  subjects: [
    {
      ...insightsSubject,
      tabs: insightsSubject.tabs.map(({ kind, label, page }) => ({
        kind,
        label,
        page: { id: page.id, pageType: page.pageType, title: page.title },
      })),
    },
  ],
};

const testVideo = {
  title: "Some video from the library because it's the only one I can find",
  video: {
    asset: {
      assetId: "ByqZ4KA9mLdyrtWnAvRMHbcQnNk2uUnf3NNdahrey5o",
      playbackId: "5VfBnOXD87KnXMJrYNG6HtCIizY6q6thP5EjjqkU1kI",
    },
  },
};

describe("cms/sanity-client", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
    mockGetNationalCurriculumInsightsHub.mockResolvedValue(insightsHub);
    mockGetNationalCurriculumInsightsSubjectBySlug.mockImplementation(
      async (_subjectSlug, params) =>
        params?.previewMode
          ? {
              ...insightsSubject,
              tabs: insightsSubject.tabs.map((tab) =>
                tab.kind === "primary"
                  ? {
                      ...tab,
                      page: {
                        ...tab.page,
                        id: `drafts.${tab.page.id}`,
                        title: "Draft primary science",
                      },
                    }
                  : tab,
              ),
            }
          : insightsSubject,
    );
  });

  describe("webinarsBySlug", () => {
    it("fetches the specified webinar", async () => {
      await getSanityClient().webinarBySlug("an-upcoming-webinar");

      expect(sanityGraphqlApi.webinarBySlug).toBeCalledWith(
        expect.objectContaining({ slug: "an-upcoming-webinar" }),
      );
    });

    it("returns a parsed webinar", async () => {
      const result = await getSanityClient().webinarBySlug(
        "an-upcoming-webinar",
      );

      expect(result?.slug).toBe(
        webinarBySlugFixture.allWebinar[0]?.slug.current,
      );
    });

    it("throws when a webinar is invalid", async () => {
      mockSanityGraphqlApi.webinarBySlug.mockResolvedValueOnce(
        {
          allWebinar: [{ slug: "foo" }],
        } as never /* silence error about incorrect slug type */,
      );

      await expect(
        getSanityClient().webinarBySlug("an-upcoming-webinar"),
      ).rejects.toThrow();
    });
  });

  describe("webinars", () => {
    it("returns parsed webinars", async () => {
      const result = await getSanityClient().webinars();
      expect(result?.[0]?.slug).toBe(
        allWebinarsFixture.allWebinar[0]?.slug.current,
      );
      expect(result?.[1]?.slug).toBe(
        allWebinarsFixture.allWebinar[1]?.slug.current,
      );
    });

    it("throws when a webinar is invalid", async () => {
      mockSanityGraphqlApi.allWebinars.mockResolvedValueOnce(
        {
          allWebinar: [{ slug: "foo" }],
        } as never /* silence error about incorrect slug type */,
      );

      await expect(getSanityClient().webinars()).rejects.toThrow();
    });
  });

  describe("landingPageBySlug", () => {
    it("fetches the specified landing page", async () => {
      await getSanityClient().landingPageBySlug("some-landing-page");

      expect(sanityGraphqlApi.landingPageBySlug).toBeCalledWith(
        expect.objectContaining({ slug: "some-landing-page" }),
      );
    });

    it("returns a parsed landing page", async () => {
      const result =
        await getSanityClient().landingPageBySlug("some-landing-page");

      expect(result?.slug).toBe(
        landingPageBySlugFixture.allLandingPage[0]?.slug.current,
      );
    });

    it("throws when a landing page is invalid", async () => {
      mockSanityGraphqlApi.landingPageBySlug.mockResolvedValueOnce(
        {
          allLandingPage: [{ slug: "foo" }],
        } as never /* silence error about incorrect slug type */,
      );

      await expect(
        getSanityClient().landingPageBySlug("some-landing-page"),
      ).rejects.toThrow();
    });
  });

  describe("landingPages", () => {
    it("returns parsed landing pages", async () => {
      const result = await getSanityClient().landingPages();

      expect(result?.[0]?.slug).toBe(
        landingPageBySlugFixture.allLandingPage[0]?.slug.current,
      );
    });

    it("throws when a landing page is invalid", async () => {
      mockSanityGraphqlApi.allLandingPages.mockResolvedValueOnce(
        {
          allLandingPage: [{ slug: "foo" }],
        } as never /* silence error about incorrect slug type */,
      );

      await expect(getSanityClient().landingPages()).rejects.toThrow();
    });
  });

  describe("national curriculum insights", () => {
    it("returns the independently editable hub and ordered catalogue", async () => {
      const result = await getSanityClient().nationalCurriculumInsightsHub();

      expect(result?.subjects[0]?.slug).toBe("science");
      expect(result?.modules).toEqual([insightsModule]);
      expect(mockGetNationalCurriculumInsightsHub).toBeCalledWith({});
    });

    it("returns the subject Overview and its independently referenced phase pages", async () => {
      const result =
        await getSanityClient().nationalCurriculumInsightsSubjectBySlug(
          "science",
        );

      expect(result?.pageType).toBe("overview");
      expect(result?.modules).toEqual([insightsModule]);
      expect(result?.tabs.map(({ kind }) => kind)).toEqual(["primary"]);
      expect(result?.id).not.toBe(result?.tabs[0]?.page.id);
      expect(mockGetNationalCurriculumInsightsSubjectBySlug).toBeCalledWith(
        "science",
        {},
      );
    });

    it("passes preview mode through to the subject reader", async () => {
      const result =
        await getSanityClient().nationalCurriculumInsightsSubjectBySlug(
          "science",
          { previewMode: true },
        );

      expect(result?.tabs[0]?.page.id).toBe(
        "drafts.nationalCurriculumInsightsPage-science-primary",
      );
      expect(mockGetNationalCurriculumInsightsSubjectBySlug).toBeCalledWith(
        "science",
        { previewMode: true },
      );
    });

    it("returns null for an unknown subject", async () => {
      mockGetNationalCurriculumInsightsSubjectBySlug.mockResolvedValueOnce(
        null,
      );

      await expect(
        getSanityClient().nationalCurriculumInsightsSubjectBySlug(
          "unknown-subject",
        ),
      ).resolves.toBeNull();
    });

    it.each([
      ["an empty subject slug", ""],
      ["a malformed subject slug", "science!"],
    ])(
      "returns null without querying for %s",
      async (_description, subjectSlug) => {
        await expect(
          getSanityClient().nationalCurriculumInsightsSubjectBySlug(
            subjectSlug,
          ),
        ).resolves.toBeNull();

        expect(
          mockGetNationalCurriculumInsightsSubjectBySlug,
        ).not.toHaveBeenCalled();
      },
    );
  });

  describe("videoSchema", () => {
    it("transforms an undefined thumbnail to null", async () => {
      // Serializing `undefined` from getStaticProps causes nextjs errors
      // so explicitly cast it to null
      type video = z.infer<typeof videoSchema>;
      const passResult = videoSchema.safeParse(testVideo) as { data: video };
      expect(passResult.data.video.asset.thumbTime).toBeNull();
    });
  });
});
