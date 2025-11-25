import { getServerSideSitemapLegacy } from "next-sitemap";
import { GetServerSidePropsContext } from "next";

import { getServerSideProps as getServerSidePropsSitemap } from "@/pages/teachers/sitemap.xml";
import { getServerSideProps as getServerSidePropsSitemap1 } from "@/pages/teachers/sitemap-1.xml";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { teachersSitemapDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/teachersSiteMap.fixture";

jest.mock("next-sitemap");

describe("getServerSideProps", () => {
  describe("getServerSideProps", () => {
    it("fetches data and generates fields correctly - sitemap.xml ", async () => {
      const context = {} as GetServerSidePropsContext;
      const mockSiteMap = teachersSitemapDataFixture;
      const mockFields = [
        {
          loc: "https://example.com",
          lastmod: new Date().toISOString(),
        },
      ];

      (curriculumApi2023.teachersSitemap as jest.Mock).mockResolvedValue(
        mockSiteMap,
      );

      (getServerSideSitemapLegacy as jest.Mock).mockReturnValue({
        props: { fields: mockFields },
      });

      const result = await getServerSidePropsSitemap(context);

      expect(curriculumApi2023.teachersSitemap).toHaveBeenCalled();
      expect(result).toEqual({ props: { fields: mockFields } });
    });
    it("fetches data and generates fields correctly - sitemap-1.xml", async () => {
      const context = {} as GetServerSidePropsContext;
      const mockSiteMap = teachersSitemapDataFixture;
      const mockFields = [
        {
          loc: "https://example.com",
          lastmod: new Date().toISOString(),
        },
      ];

      (curriculumApi2023.teachersSitemap as jest.Mock).mockResolvedValue(
        mockSiteMap,
      );

      (getServerSideSitemapLegacy as jest.Mock).mockReturnValue({
        props: { fields: mockFields },
      });

      const result = await getServerSidePropsSitemap1(context);

      expect(curriculumApi2023.teachersSitemap).toHaveBeenCalled();
      expect(result).toEqual({ props: { fields: mockFields } });
    });
  });
});
