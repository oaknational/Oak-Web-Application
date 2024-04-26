import { getServerSideSitemap } from "next-sitemap";
import { GetServerSidePropsContext } from "next";

import {
  getServerSideProps,
  URLFields,
  generateURLFields,
} from "@/pages/teachers/sitemap.xml";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023";

jest.mock("next-sitemap");

describe("getServerSideProps", () => {
  describe("generateURLFields function", () => {
    it("should map each url.urls to loc and generate a lastmod date", () => {
      const urls = [
        { urls: "https://example.com" },
        { urls: "https://example.org" },
      ];
      const result = generateURLFields(urls);
      expect(result.length).toBe(urls.length);
      expect(result[0]).toEqual(
        expect.objectContaining({
          loc: "https://example.com",
          lastmod: expect.any(String),
        }),
      );
      expect(result[1]).toEqual(
        expect.objectContaining({
          loc: "https://example.org",
          lastmod: expect.any(String),
        }),
      );
    });

    it("should handle an empty array", () => {
      const urls = [] as URLFields;
      const result = generateURLFields(urls);
      expect(result).toEqual([]);
    });

    it("should generate an ISO date string for lastmod", () => {
      const urls = [{ urls: "https://example.com" }];
      const result = generateURLFields(urls);
      const dateRegex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z/;
      expect(result[0]?.lastmod).toMatch(dateRegex);
    });

    it("should generate the same lastmod date for all URLs in a single call", () => {
      const urls = [
        { urls: "https://example.com" },
        { urls: "https://example.org" },
      ];
      const result = generateURLFields(urls);
      expect(result[0]?.lastmod).toBe(result[1]?.lastmod);
    });
  });

  describe.only("getServerSideProps", () => {
    beforeEach(() => {
      jest.mock("@/pages/teachers/sitemap.xml", () => ({
        generateURLFields: jest.fn(),
      }));
    });
    afterAll(() => {
      jest.clearAllMocks();
    });

    it("fetches data and generates fields correctly", async () => {
      const context = {} as GetServerSidePropsContext;
      const mockSiteMap = [{ urls: "https://example.com" }];
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
      expect(getServerSideSitemap).toHaveBeenCalledWith(context, mockFields);
      expect(result).toEqual({ props: { fields: mockFields } });
    });
  });
});
