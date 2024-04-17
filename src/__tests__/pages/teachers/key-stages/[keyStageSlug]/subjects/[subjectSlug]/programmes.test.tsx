import { GetServerSidePropsContext, PreviewData } from "next";

import ProgrammesListingPage, {
  getStaticPaths,
  getStaticProps,
  URLParams,
} from "@/pages/teachers/key-stages/[keyStageSlug]/subjects/[subjectSlug]/programmes";
import { mockSeoResult } from "@/__tests__/__helpers__/cms";
import renderWithSeo from "@/__tests__/__helpers__/renderWithSeo";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import programmeListingFixture from "@/node-lib/curriculum-api-2023/fixtures/programmeListing.fixture";
import curriculumApi from "@/node-lib/curriculum-api-2023/__mocks__";

const render = renderWithProviders();

describe("programmes listing page", () => {
  describe("component rendering on page", () => {
    it("renders title from props ", () => {
      const { getByRole } = render(
        <ProgrammesListingPage {...programmeListingFixture()} />,
      );

      expect(getByRole("heading", { level: 1 })).toHaveTextContent("Maths");
    });

    it("renders the correct number of tiers and tier cards", () => {
      const { getAllByTestId } = render(
        <ProgrammesListingPage {...programmeListingFixture()} />,
      );

      expect(getAllByTestId("programme-list-item")).toHaveLength(2);
    });
  });

  describe("SEO and Tracking", () => {
    it("renders the correct SEO details for programmes with only tiers", async () => {
      const { seo } = renderWithSeo()(
        <ProgrammesListingPage {...programmeListingFixture()} />,
      );

      expect(seo).toEqual({
        ...mockSeoResult,
        ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
        title: "Key stage 4 Maths tiers | NEXT_PUBLIC_SEO_APP_NAME",
        description: "Choose foundation or higher tier for GCSE Maths",
        ogTitle: "Key stage 4 Maths tiers | NEXT_PUBLIC_SEO_APP_NAME",
        ogDescription: "Choose foundation or higher tier for GCSE Maths",
        ogUrl: "NEXT_PUBLIC_SEO_APP_URL",
        canonical: "NEXT_PUBLIC_SEO_APP_URL",
        robots: "index,follow",
      });
    });
    it("correctly formats more than 2 tiers", async () => {
      const { seo } = renderWithSeo()(
        <ProgrammesListingPage
          {...programmeListingFixture({
            programmes: [
              {
                programmeSlug: "maths-secondary-ks4-foundation",
                subjectTitle: "Maths",
                tierSlug: "core",
                tierTitle: "Core",
                tierDisplayOrder: "1",
                examBoardSlug: null,
                examBoardTitle: null,
                examBoardDisplayOrder: null,
              },
              {
                programmeSlug: "maths-secondary-ks4-higher",
                subjectTitle: "Maths",
                tierSlug: "foundation",
                tierTitle: "Foundation",
                tierDisplayOrder: "3",
                examBoardSlug: null,
                examBoardTitle: null,
                examBoardDisplayOrder: null,
              },
              {
                programmeSlug: "maths-secondary-ks4-foundation",
                subjectTitle: "Maths",
                tierSlug: "higher",
                tierTitle: "Higher",
                tierDisplayOrder: "2",
                examBoardSlug: null,
                examBoardTitle: null,
                examBoardDisplayOrder: null,
              },
            ],
          })}
        />,
      );

      expect(seo).toEqual({
        ...mockSeoResult,
        ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
        title: "Key stage 4 Maths tiers | NEXT_PUBLIC_SEO_APP_NAME",
        description: "Choose core, foundation or higher tier for GCSE Maths",
        ogTitle: "Key stage 4 Maths tiers | NEXT_PUBLIC_SEO_APP_NAME",
        ogDescription: "Choose core, foundation or higher tier for GCSE Maths",
        ogUrl: "NEXT_PUBLIC_SEO_APP_URL",
        canonical: "NEXT_PUBLIC_SEO_APP_URL",
        robots: "index,follow",
      });
    });
    it("renders the correct SEO details for programmes with only examboards", async () => {
      const { seo } = renderWithSeo()(
        <ProgrammesListingPage
          {...programmeListingFixture({
            programmes: [
              {
                programmeSlug: "maths-secondary-ks4-foundation",
                subjectTitle: "Maths",
                tierSlug: null,
                tierTitle: null,
                tierDisplayOrder: "1",
                examBoardSlug: "aqa",
                examBoardTitle: "AQA",
                examBoardDisplayOrder: "1",
              },
              {
                programmeSlug: "maths-secondary-ks4-higher",
                subjectTitle: "Maths",
                tierSlug: null,
                tierTitle: null,
                tierDisplayOrder: "3",
                examBoardSlug: "aqa",
                examBoardTitle: "AQA",
                examBoardDisplayOrder: "1",
              },
            ],
          })}
        />,
      );

      expect(seo).toEqual({
        ...mockSeoResult,
        ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
        title: "Key stage 4 Maths exam boards | NEXT_PUBLIC_SEO_APP_NAME",
        description: "Choose from the most popular exam boards in GCSE Maths",
        ogTitle: "Key stage 4 Maths exam boards | NEXT_PUBLIC_SEO_APP_NAME",
        ogDescription: "Choose from the most popular exam boards in GCSE Maths",
        ogUrl: "NEXT_PUBLIC_SEO_APP_URL",
        canonical: "NEXT_PUBLIC_SEO_APP_URL",
        robots: "index,follow",
      });
    });
    it("renders correct SEO for programmes with tiers and examboards", async () => {
      const { seo } = renderWithSeo()(
        <ProgrammesListingPage
          {...programmeListingFixture({
            programmes: [
              {
                programmeSlug: "maths-secondary-ks4-foundation",
                subjectTitle: "Maths",
                tierSlug: "foundation",
                tierTitle: "Foundation",
                tierDisplayOrder: "1",
                examBoardSlug: "aqa",
                examBoardTitle: "AQA",
                examBoardDisplayOrder: "1",
              },
              {
                programmeSlug: "maths-secondary-ks4-higher",
                subjectTitle: "Maths",
                tierSlug: "higher",
                tierTitle: "Higher",
                tierDisplayOrder: "3",
                examBoardSlug: "aqa",
                examBoardTitle: "AQA",
                examBoardDisplayOrder: "1",
              },
            ],
          })}
        />,
      );

      expect(seo).toEqual({
        ...mockSeoResult,
        ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
        title: "Key stage 4 Maths exam boards | NEXT_PUBLIC_SEO_APP_NAME",
        description:
          "Choose foundation or higher tier from the most popular exam boards in GCSE Maths",
        ogTitle: "Key stage 4 Maths exam boards | NEXT_PUBLIC_SEO_APP_NAME",
        ogDescription:
          "Choose foundation or higher tier from the most popular exam boards in GCSE Maths",
        ogUrl: "NEXT_PUBLIC_SEO_APP_URL",
        canonical: "NEXT_PUBLIC_SEO_APP_URL",
        robots: "index,follow",
      });
    });
  });

  describe("getStaticPaths", () => {
    it("Should not generate pages at build time", async () => {
      const res = await getStaticPaths();

      expect(res).toEqual({
        fallback: "blocking",
        paths: [],
      });
    });
  });
  describe("getStaticProps", () => {
    it("Should fetch the correct data for legacy subject slugs", async () => {
      await getStaticProps({
        params: {
          keyStageSlug: "ks4",
          subjectSlug: "maths-l",
        },
      });

      expect(curriculumApi.programmeListingPage).toHaveBeenCalledWith({
        keyStageSlug: "ks4",
        subjectSlug: "maths",
        isLegacy: true,
      });
    });
    it("Should fetch the correct data for non legacy subject slugs", async () => {
      await getStaticProps({
        params: {
          keyStageSlug: "ks4",
          subjectSlug: "maths",
        },
      });

      expect(curriculumApi.programmeListingPage).toHaveBeenCalledWith({
        keyStageSlug: "ks4",
        subjectSlug: "maths",
        isLegacy: false,
      });
    });

    it("should throw error when not provided context params", async () => {
      await expect(
        getStaticProps({} as GetServerSidePropsContext<URLParams, PreviewData>),
      ).rejects.toThrowError("No context params");
    });
  });
});
