import { z } from "zod";

import sanityGraphqlApi from "../../sanity-graphql";
import allWebinarsFixture from "../../sanity-graphql/fixtures/allWebinars.json";
import webinarBySlugFixture from "../../sanity-graphql/fixtures/webinarBySlug.json";
import landingPageBySlugFixture from "../../sanity-graphql/fixtures/landingPageBySlug.json";
import { videoSchema } from "../../../common-lib/cms-types/base";

import { parseResults } from "./parseResults";
import { resolveSanityReferences } from "./resolveSanityReferences";

import getSanityClient from "./";

/**
 * Note: sanity-graphql mocks are configured in
 * sanity-graphql/__mocks__
 */
jest.mock("../../sanity-graphql");

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
  });

  describe("webinarsBySlug", () => {
    it("fetches the specified webinar", async () => {
      await getSanityClient().webinarBySlug("an-upcoming-webinar");

      expect(sanityGraphqlApi.webinarBySlug).toBeCalledWith(
        expect.objectContaining({ slug: "an-upcoming-webinar" })
      );
    });

    it("returns a parsed webinar", async () => {
      const result = await getSanityClient().webinarBySlug(
        "an-upcoming-webinar"
      );

      expect(result?.slug).toBe(
        webinarBySlugFixture.allWebinar[0]?.slug.current
      );
    });

    it("throws when a webinar is invalid", async () => {
      mockSanityGraphqlApi.webinarBySlug.mockResolvedValueOnce(
        {
          allWebinar: [{ slug: "foo" }],
        } as never /* silence error about incorrect slug type */
      );

      await expect(
        getSanityClient().webinarBySlug("an-upcoming-webinar")
      ).rejects.toThrow();
    });
  });

  describe("webinars", () => {
    it("returns parsed webinars", async () => {
      const result = await getSanityClient().webinars();
      expect(result?.[0]?.slug).toBe(
        allWebinarsFixture.allWebinar[0]?.slug.current
      );
      expect(result?.[1]?.slug).toBe(
        allWebinarsFixture.allWebinar[1]?.slug.current
      );
    });

    it("throws when a webinar is invalid", async () => {
      mockSanityGraphqlApi.allWebinars.mockResolvedValueOnce(
        {
          allWebinar: [{ slug: "foo" }],
        } as never /* silence error about incorrect slug type */
      );

      await expect(getSanityClient().webinars()).rejects.toThrow();
    });
  });

  describe("client methods", () => {
    const client = getSanityClient();

    /**
     * Run the same draft/preview mode tests against each endpoint
     * Using describe.each to cut down on LOC for testing each method
     * 2x
     *
     * methodName: the name of the function on CMSClient
     * mockMethodName: the name of a method on sanityGraphqlApi that's been mocked
     *
     * n.b. if some of these fail with an invalid reference error after
     * re-generating fixtures, look for a `markDefs` array in the JSON with
     * a `_type: "reference"` and delete the markDef and associated ID above it `"marks": ["5ba56aeccae2"]`
     *
     * This is because there's only one fixture file for `portableTextReferences`
     * shared between all files that depend on it
     */
    const singletonMethods = [
      ["homepage", "homepage"],
      ["planningPage", "planningCorePage"],
      ["aboutWhoWeArePage", "aboutWhoWeArePage"],
      ["aboutLeadershipPage", "aboutLeadershipPage"],
      ["aboutBoardPage", "aboutBoardPage"],
      ["aboutPartnersPage", "aboutPartnersPage"],
      ["aboutWorkWithUsPage", "aboutWorkWithUsPage"],
      ["curriculumPage", "curriculumCorePage"],
      ["contactPage", "contactCorePage"],
      ["blogListingPage", "newsListingPage"],
    ] as const;

    const listMethods = [
      ["webinars", "allWebinars"],
      ["blogPosts", "allBlogPosts"],
      ["policyPages", "allPolicyPages"],
      ["landingPages", "allLandingPages"],
    ] as const;

    const bySlugMethods = [
      ["webinarBySlug", "webinarBySlug"],
      ["blogPostBySlug", "blogPostBySlug"],
      ["policyPageBySlug", "policyPageBySlug"],
      ["landingPageBySlug", "landingPageBySlug"],
    ] as const;

    describe.each(singletonMethods)(`.%s()`, (methodName, mockMethodName) => {
      const mockMethod = mockSanityGraphqlApi[mockMethodName];
      const clientMethod = client[methodName];

      it("returns null when no content is found", async () => {
        mockMethod.mockResolvedValueOnce({} as never);
        const res = await clientMethod();
        expect(res).toBeNull();
      });

      it("attempts to resolve embedded portable text references", async () => {
        await clientMethod();

        expect(resolveSanityReferences).toBeCalled();
      });

      it("does not fetch draft content by default", async () => {
        await clientMethod();
        expect(mockMethod).toBeCalledWith(
          expect.objectContaining({ isDraftFilter: { is_draft: false } })
        );
      });

      it("fetches draft content when previewMode flag is passed", async () => {
        await clientMethod({ previewMode: true });

        expect(mockMethod).toBeCalledWith(
          expect.objectContaining({ isDraftFilter: { is_draft: undefined } })
        );
      });

      it("passes previewMode flag to parseResults when false", async () => {
        await clientMethod();

        expect(parseResults).toBeCalledWith(
          expect.anything(),
          expect.anything(),
          /* isPreviewMode: */ undefined
        );
      });

      it("passes previewMode flag to parseResults when true", async () => {
        await clientMethod({ previewMode: true });

        expect(parseResults).toBeCalledWith(
          expect.anything(),
          expect.anything(),
          /* isPreviewMode: */ true
        );
      });
    });

    describe.each(listMethods)(`.%s()`, (methodName, mockMethodName) => {
      const mockMethod = mockSanityGraphqlApi[mockMethodName];
      const clientMethod = client[methodName];

      it("returns an empty array when no content is found", async () => {
        mockMethod.mockResolvedValueOnce({} as never);
        const res = await clientMethod();
        expect(res).toEqual([]);
      });

      it("does not fetch draft content by default", async () => {
        await clientMethod();
        expect(mockMethod).toBeCalledWith(
          expect.objectContaining({ isDraftFilter: { is_draft: false } })
        );
      });

      it("fetches draft content when previewMode flag is passed", async () => {
        await clientMethod({ previewMode: true });

        expect(mockMethod).toBeCalledWith(
          expect.objectContaining({ isDraftFilter: { is_draft: undefined } })
        );
      });

      it("passes previewMode flag to parseResults when false", async () => {
        await clientMethod();

        expect(parseResults).toBeCalledWith(
          expect.anything(),
          expect.anything(),
          /* isPreviewMode: */ undefined
        );
      });

      it("passes previewMode flag to parseResults when true", async () => {
        await clientMethod({ previewMode: true });

        expect(parseResults).toBeCalledWith(
          expect.anything(),
          expect.anything(),
          /* isPreviewMode: */ true
        );
      });
    });

    describe.each(bySlugMethods)(`.%s()`, (methodName, mockMethodName) => {
      const mockMethod = mockSanityGraphqlApi[mockMethodName];
      const clientMethod = client[methodName];

      it("returns null when no content is found", async () => {
        mockMethod.mockResolvedValueOnce({} as never);
        const res = await clientMethod("some-slug");
        expect(res).toBeNull();
      });

      it("attempts to resolve embedded portable text references", async () => {
        await clientMethod("some-slug");

        expect(resolveSanityReferences).toBeCalled();
      });

      it("does not fetch draft content by default", async () => {
        await clientMethod("some-slug");
        expect(mockMethod).toBeCalledWith(
          expect.objectContaining({ isDraftFilter: { is_draft: false } })
        );
      });

      it("fetches draft content when previewMode flag is passed", async () => {
        await clientMethod("some-slug", { previewMode: true });

        expect(mockMethod).toBeCalledWith(
          expect.objectContaining({ isDraftFilter: { is_draft: undefined } })
        );
      });

      it("passes previewMode flag to parseResults when false", async () => {
        await clientMethod("some-slug");

        expect(parseResults).toBeCalledWith(
          expect.anything(),
          expect.anything(),
          /* isPreviewMode: */ undefined
        );
      });

      it("passes previewMode flag to parseResults when true", async () => {
        await clientMethod("some-slug", { previewMode: true });

        expect(parseResults).toBeCalledWith(
          expect.anything(),
          expect.anything(),
          /* isPreviewMode: */ true
        );
      });
    });
  });

  describe("landingPageBySlug", () => {
    it("fetches the specified landing page", async () => {
      await getSanityClient().landingPageBySlug("some-landing-page");

      expect(sanityGraphqlApi.landingPageBySlug).toBeCalledWith(
        expect.objectContaining({ slug: "some-landing-page" })
      );
    });

    it("returns a parsed landing page", async () => {
      const result = await getSanityClient().landingPageBySlug(
        "some-landing-page"
      );

      expect(result?.slug).toBe(
        landingPageBySlugFixture.allLandingPage[0]?.slug.current
      );
    });

    it("throws when a landing page is invalid", async () => {
      mockSanityGraphqlApi.landingPageBySlug.mockResolvedValueOnce(
        {
          allLandingPage: [{ slug: "foo" }],
        } as never /* silence error about incorrect slug type */
      );

      await expect(
        getSanityClient().landingPageBySlug("some-landing-page")
      ).rejects.toThrow();
    });
  });

  describe("landingPages", () => {
    it("returns parsed landing pages", async () => {
      const result = await getSanityClient().landingPages();

      expect(result?.[0]?.slug).toBe(
        landingPageBySlugFixture.allLandingPage[0]?.slug.current
      );
    });

    it("throws when a landing page is invalid", async () => {
      mockSanityGraphqlApi.allLandingPages.mockResolvedValueOnce(
        {
          allLandingPage: [{ slug: "foo" }],
        } as never /* silence error about incorrect slug type */
      );

      await expect(getSanityClient().landingPages()).rejects.toThrow();
    });
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

// Silence module error
export {};
