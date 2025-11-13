import { ParsedUrlQuery } from "querystring";

import { GetServerSidePropsContext, PreviewData } from "next";

import { getServerSideProps as getServerSidePropsSitemap } from "@/pages/blog/categories/sitemap.xml";

const blogPostsMock = jest.fn();
jest.mock("@/node-lib/cms", () => ({
  __esModule: true,
  default: {
    blogPosts: () => blogPostsMock(),
  },
}));

describe("getServerSideProps", () => {
  beforeEach(() => {
    process.env.SITEMAP_BASE_URL = "http://example.com";
  });

  afterEach(() => {
    process.env.SITEMAP_BASE_URL = "";
  });

  describe("getServerSideProps", () => {
    it("fetches data and generates fields correctly - sitemap.xml ", async () => {
      const context = {
        res: {
          setHeader: jest.fn(() => {}),
          write: jest.fn(() => {}),
          end: jest.fn(() => {}),
        },
      };

      blogPostsMock.mockResolvedValue([
        { category: { slug: "foo" } },
        { category: { slug: "bar" } },
        { category: { slug: "baz" } },
      ]);

      await getServerSidePropsSitemap(
        context as unknown as GetServerSidePropsContext<
          ParsedUrlQuery,
          PreviewData
        >,
      );

      expect(blogPostsMock).toHaveBeenCalled();
      expect(context.res.setHeader).toHaveBeenCalledWith(
        "Content-Type",
        "text/xml",
      );
      for (const expectedString of [
        "http://example.com/blog/categories/foo",
        "http://example.com/blog/categories/bar",
        "http://example.com/blog/categories/baz",
      ]) {
        expect(context.res.write).toHaveBeenCalledWith(
          expect.stringContaining(expectedString),
        );
      }
      expect(context.res.end).toHaveBeenCalled();
    });
  });
});
