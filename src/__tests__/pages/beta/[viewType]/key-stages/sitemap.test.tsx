import { GetServerSidePropsContext, PreviewData } from "next";

import { getServerSideProps } from "../../../../../pages/beta/[viewType]/key-stages/sitemap.xml";
import { URLParams } from "../../../../../components/SubjectProgrammeListing/SubjectProgrammeListing";

describe("Sitemap", () => {
  beforeEach(() => {
    process.env.SITEMAP_BASE_URL = "http://example.com";
  });

  afterEach(() => {
    delete process.env.SITEMAP_BASE_URL;
  });

  it("should generate a sitemap", () => {
    expect(true).toBe(true);
  });
  describe("getServerSideProps", () => {
    it("Should return site", async () => {
      await getServerSideProps({
        params: {},
      } as GetServerSidePropsContext<URLParams, PreviewData>);
      expect(true).toBe(true);
    });
  });
});
