import { GetServerSidePropsContext } from "next";

import Sitemap, {
  getServerSideProps as sitemapGetServerSideProps,
} from "@/pages/pupils/sitemap.xml";
import Sitemap1, {
  getServerSideProps as sitemap1GetServerSideProps,
} from "@/pages/pupils/sitemap-1.xml";
import * as sitemapPagesHelper from "@/pages-helpers/pupil/sitemap-pages/sitemap-pages-helper";

jest.mock("next-sitemap");
jest.mock("@/pages-helpers/pupil/sitemap-pages/sitemap-pages-helper", () => ({
  __esModule: true,
  ...jest.requireActual(
    "@/pages-helpers/pupil/sitemap-pages/sitemap-pages-helper",
  ),
}));

describe("pupil sitemaps", () => {
  describe("getServerSideProps for sitemap.xml", () => {
    it("fetches data and generates fields correctly", async () => {
      const context = {} as GetServerSidePropsContext;

      const buildAllUrlFieldsSpy = jest.spyOn(
        sitemapPagesHelper,
        "buildAllUrlFields",
      );

      await sitemapGetServerSideProps(context);
      expect(buildAllUrlFieldsSpy).toHaveBeenCalled();
    });
    it("has a default export", () => {
      expect(Sitemap).toBeDefined();
    });
  });
  describe("getServerSideProps for sitemap-1.xml", () => {
    it("fetches data and generates fields correctly", async () => {
      const context = {} as GetServerSidePropsContext;

      const buildAllUrlFieldsSpy = jest.spyOn(
        sitemapPagesHelper,
        "buildAllUrlFields",
      );

      await sitemap1GetServerSideProps(context);
      expect(buildAllUrlFieldsSpy).toHaveBeenCalled();
    });
    it("has a default export", () => {
      expect(Sitemap1).toBeDefined();
    });
  });
});
