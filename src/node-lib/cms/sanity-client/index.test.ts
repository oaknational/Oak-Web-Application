import { z } from "zod";

import sanityGraphqlApi from "../../sanity-graphql";
import aboutCorePageFixture from "../../sanity-graphql/fixtures/aboutCorePage.json";
import allWebinarsFixture from "../../sanity-graphql/fixtures/allWebinars.json";
import planningCorePageFixture from "../../sanity-graphql/fixtures/planningCorePage.json";
import allBlogPostsFixture from "../../sanity-graphql/fixtures/allBlogPosts.json";
import blogPostBySlugFixture from "../../sanity-graphql/fixtures/blogPostBySlug.json";
import webinarBySlugFixture from "../../sanity-graphql/fixtures/webinarBySlug.json";
import allLandingPagesFixture from "../../sanity-graphql/fixtures/allLandingPages.json";
import curriculumCorePageFixture from "../../sanity-graphql/fixtures/curriculumCorePage.json";
import allPolicyPagesFixture from "../../sanity-graphql/fixtures/allPolicyPages.json";
import policyPageBySlugFixture from "../../sanity-graphql/fixtures/policyPageBySlug.json";
import landingPageBySlugFixture from "../../sanity-graphql/fixtures/landingPageBySlug.json";
import blogPortableTextReferences from "../../sanity-graphql/fixtures/blogPortableTextReferences.json";

import { videoSchema } from "./schemas/base";

import getSanityClient from "./";

jest.mock("../../sanity-graphql");

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

    // @TODO: Can this be moved to a __mocks__ folder?
    mockSanityGraphqlApi.allWebinars.mockResolvedValue(allWebinarsFixture);
    mockSanityGraphqlApi.webinarBySlug.mockResolvedValue(webinarBySlugFixture);
    mockSanityGraphqlApi.allBlogPosts.mockResolvedValue(allBlogPostsFixture);
    mockSanityGraphqlApi.blogPostBySlug.mockResolvedValue(
      blogPostBySlugFixture
    );
    mockSanityGraphqlApi.blogPortableTextReferences.mockResolvedValue(
      blogPortableTextReferences
    );
    // mockSanityGraphqlApi.homepage.mockResolvedValue()
    mockSanityGraphqlApi.planningCorePage.mockResolvedValue(
      planningCorePageFixture
    );
    mockSanityGraphqlApi.aboutCorePage.mockResolvedValue(aboutCorePageFixture);
    mockSanityGraphqlApi.curriculumCorePage.mockResolvedValue(
      curriculumCorePageFixture
    );
    mockSanityGraphqlApi.allPolicyPages.mockResolvedValue(
      allPolicyPagesFixture
    );
    mockSanityGraphqlApi.policyPageBySlug.mockResolvedValue(
      policyPageBySlugFixture
    );
    mockSanityGraphqlApi.allLandingPages.mockResolvedValue(
      allLandingPagesFixture
    );
    mockSanityGraphqlApi.landingPageBySlug.mockResolvedValue(
      landingPageBySlugFixture
    );
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

      expect(result.slug).toBe(
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

  describe("draft content handling", () => {
    const client = getSanityClient();

    /**
     * Run the same draft/preview mode tests against each endpoint
     * Using describe.each to cut down on LOC for testing each method
     * 2x
     *
     * methodName: the name of the function on CMSClient
     * mockMethodName: the name of a method on sanityGraphqlApi that's been mocked
     * methodAcceptsSlug: if a slug should be passed to the client method
     *                    as the methods are variadic
     */
    describe.each([
      ["webinars", "allWebinars", false],
      ["webinarBySlug", "webinarBySlug", true],
      ["blogPosts", "allBlogPosts", false],
      ["blogPostBySlug", "blogPostBySlug", true],
      // ["homepage", "homepage", false],
      ["planningPage", "planningCorePage", false],
      ["aboutPage", "aboutCorePage", false],
      ["curriculumPage", "curriculumCorePage", false],
      ["policyPages", "allPolicyPages", false],
      ["policyPageBySlug", "policyPageBySlug", true],
      ["landingPages", "allLandingPages", false],
      ["landingPageBySlug", "landingPageBySlug", true],
    ])(`.%s()`, (methodName, mockMethodName, methodAcceptsSlug) => {
      const mockMethod = mockMethodName as keyof typeof mockSanityGraphqlApi;
      const clientMethod = client[methodName as keyof typeof client];

      it("does not fetch draft content by default", async () => {
        await clientMethod("some-slug");
        expect(mockSanityGraphqlApi[mockMethod]).toBeCalledWith(
          expect.objectContaining({ isDraft: false })
        );
      });

      it("fetches draft content when previewMode flag is passed", async () => {
        const params = methodAcceptsSlug
          ? ["some-slug", { previewMode: true }]
          : [{ previewMode: true }];

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore Function call works, TS just gets confused
        await clientMethod(...params);

        expect(mockSanityGraphqlApi[mockMethod]).toBeCalledWith(
          expect.objectContaining({ isDraft: true })
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

      expect(result.slug).toBe(
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
