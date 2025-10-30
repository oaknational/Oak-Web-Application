import { ParsedUrlQuery } from "querystring";

import { GetServerSidePropsContext, PreviewData } from "next";

import { getServerSideProps as getServerSidePropsSitemap } from "@/pages/teachers/curriculum/sitemap.xml";

const curriculumPhaseOptionsMock = jest.fn();
jest.mock("@/node-lib/curriculum-api-2023", () => ({
  __esModule: true,
  default: {
    curriculumPhaseOptions: () => curriculumPhaseOptionsMock(),
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

      curriculumPhaseOptionsMock.mockResolvedValue([
        {
          title: "Physical education",
          slug: "physical-education",
          phases: [
            {
              slug: "primary",
              title: "Primary",
            },
            {
              slug: "secondary",
              title: "Secondary",
            },
          ],
          keystages: [
            {
              slug: "ks1",
              title: "Key Stage 1",
            },
            {
              slug: "ks2",
              title: "Key Stage 2",
            },
            {
              slug: "ks3",
              title: "Key Stage 3",
            },
            {
              slug: "ks4",
              title: "Key Stage 4",
            },
          ],
          ks4_options: [
            {
              slug: "aqa",
              title: "AQA",
            },
            {
              slug: "core",
              title: "Core",
            },
            {
              slug: "edexcel",
              title: "Edexcel",
            },
            {
              slug: "gcse",
              title: "GCSE",
            },
            {
              slug: "ocr",
              title: "OCR",
            },
          ],
        },
        {
          title: "Maths",
          slug: "maths",
          phases: [
            {
              slug: "primary",
              title: "Primary",
            },
            {
              slug: "secondary",
              title: "Secondary",
            },
          ],
          keystages: [
            {
              slug: "ks1",
              title: "Key Stage 1",
            },
            {
              slug: "ks2",
              title: "Key Stage 2",
            },
            {
              slug: "ks3",
              title: "Key Stage 3",
            },
            {
              slug: "ks4",
              title: "Key Stage 4",
            },
          ],
          ks4_options: [],
        },
      ]);

      await getServerSidePropsSitemap(
        context as unknown as GetServerSidePropsContext<
          ParsedUrlQuery,
          PreviewData
        >,
      );

      expect(curriculumPhaseOptionsMock).toHaveBeenCalled();
      expect(context.res.setHeader).toHaveBeenCalledWith(
        "Content-Type",
        "text/xml",
      );
      for (const expectedString of [
        "http://example.com/teachers/curriculum/physical-education-primary/overview",
        "http://example.com/teachers/curriculum/physical-education-secondary-aqa/overview",
        "http://example.com/teachers/curriculum/physical-education-secondary-core/overview",
        "http://example.com/teachers/curriculum/physical-education-secondary-edexcel/overview",
        "http://example.com/teachers/curriculum/physical-education-secondary-gcse/overview",
        "http://example.com/teachers/curriculum/physical-education-secondary-ocr/overview",
        "http://example.com/teachers/curriculum/maths-primary/overview",
        "http://example.com/teachers/curriculum/physical-education-primary/units",
        "http://example.com/teachers/curriculum/physical-education-secondary-aqa/units",
        "http://example.com/teachers/curriculum/physical-education-secondary-core/units",
        "http://example.com/teachers/curriculum/physical-education-secondary-edexcel/units",
        "http://example.com/teachers/curriculum/physical-education-secondary-gcse/units",
        "http://example.com/teachers/curriculum/physical-education-secondary-ocr/units",
        "http://example.com/teachers/curriculum/maths-primary/units",
      ]) {
        expect(context.res.write).toHaveBeenCalledWith(
          expect.stringContaining(expectedString),
        );
      }
      expect(context.res.end).toHaveBeenCalled();
    });
  });
});
