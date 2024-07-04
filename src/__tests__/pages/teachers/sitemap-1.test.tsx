import { getServerSideSitemap } from "next-sitemap";
import { GetServerSidePropsContext } from "next";

import { getServerSideProps } from "@/pages/teachers/sitemap-1.xml";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";
import { teachersSitemapDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/teachersSiteMap.fixture";

jest.mock("next-sitemap");

describe("getServerSideProps", () => {
  describe("getServerSideProps", () => {
    it("fetches data and generates fields correctly", async () => {
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

      (getServerSideSitemap as jest.Mock).mockReturnValue({
        props: { fields: mockFields },
      });

      const result = await getServerSideProps(context);

      expect(curriculumApi2023.teachersSitemap).toHaveBeenCalled();
      expect(result).toEqual({ props: { fields: mockFields } });
    });
  });
});
