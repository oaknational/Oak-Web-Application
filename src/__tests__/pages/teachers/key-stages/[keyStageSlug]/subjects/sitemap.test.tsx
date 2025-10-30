import { ParsedUrlQuery } from "node:querystring";

import { getServerSideSitemapLegacy } from "next-sitemap";
import { GetServerSidePropsContext, PreviewData } from "next";

import { getServerSideProps } from "@/pages/teachers/key-stages/sitemap.xml";
import { generatedFields } from "@/node-lib/curriculum-api-2023/fixtures/keyStageSitemap.fixture";

jest.mock("next-sitemap", () => ({
  getServerSideSitemapLegacy: jest.fn(),
}));

type MockedgetServerSideSitemapLegacy = jest.Mock<
  typeof getServerSideSitemapLegacy
>;

type SeoData = {
  loc: string;
  lastmod: string;
};

describe("curriculum phase options sitemap", () => {
  beforeEach(() => {
    process.env.SITEMAP_BASE_URL = "http://example.com";
  });

  afterEach(() => {
    delete process.env.SITEMAP_BASE_URL;
  });

  it("should call getServerSideSitemapLegacy with the expected data", async () => {
    const context = {} as GetServerSidePropsContext<
      ParsedUrlQuery,
      PreviewData
    >;

    await getServerSideProps(context);

    const newDate = new Date();

    (
      getServerSideSitemapLegacy as unknown as MockedgetServerSideSitemapLegacy
    ).mock.calls[0][1].forEach((argument: SeoData, index: number) => {
      expect(argument.loc).toEqual(generatedFields[index]?.loc);
      expect(argument.lastmod.split("T")[0]).toEqual(
        newDate.toISOString().split("T")[0],
      );
    });
  });
});
