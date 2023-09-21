import { z } from "zod";

import sanityGraphqlApi from "../../sanity-graphql";
import allWebinarsFixture from "../../sanity-graphql/fixtures/allWebinars.json";
import webinarBySlugFixture from "../../sanity-graphql/fixtures/webinarBySlug.json";
import landingPageBySlugFixture from "../../sanity-graphql/fixtures/landingPageBySlug.json";
import { videoSchema } from "../../../common-lib/cms-types/base";

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

  describe("aboutBoardPage", () => {
    it("document urls are proxied", async () => {
      const result = await getSanityClient().aboutBoardPage();

      expect(result?.documents[0]?.file.asset.url).toMatch(
        /^https:\/\/NEXT_PUBLIC_SANITY_ASSET_CDN_HOST\/files/
      );
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
