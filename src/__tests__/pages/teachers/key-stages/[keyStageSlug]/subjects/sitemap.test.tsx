import { ParsedUrlQuery } from "node:querystring";

import { Mock, vi, describe, beforeEach, afterEach, expect, it } from "vitest";
import { getServerSideSitemap } from "next-sitemap";
import { GetServerSidePropsContext, PreviewData } from "next";

import { getServerSideProps } from "@/pages/teachers/key-stages/sitemap.xml";
import { generatedFields } from "@/node-lib/curriculum-api-2023/fixtures/keyStageSitemap.fixture";

vi.mock("next-sitemap", () => ({
  getServerSideSitemap: vi.fn(),
}));

type MockedGetServerSideSitemap = Mock;

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

  it("should call getServerSideSitemap with the expected data", async () => {
    const context = {} as GetServerSidePropsContext<
      ParsedUrlQuery,
      PreviewData
    >;

    await getServerSideProps(context);

    const newDate = new Date();

    (
      getServerSideSitemap as unknown as MockedGetServerSideSitemap
    ).mock.calls[0][1].forEach((argument: SeoData, index: number) => {
      expect(argument.loc).toEqual(generatedFields[index]?.loc);
      expect(argument.lastmod.split("T")[0]).toEqual(
        newDate.toISOString().split("T")[0],
      );
    });
  });
});
