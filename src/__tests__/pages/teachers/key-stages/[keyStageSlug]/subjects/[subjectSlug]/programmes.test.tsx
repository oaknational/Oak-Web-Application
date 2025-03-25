import { GetServerSidePropsContext, PreviewData } from "next";
import { screen } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import ProgrammesListingPage, {
  getStaticPaths,
  getStaticProps,
  URLParams,
} from "@/pages/teachers/key-stages/[keyStageSlug]/subjects/[subjectSlug]/programmes";
import { mockSeoResult } from "@/__tests__/__helpers__/cms";
import renderWithSeo from "@/__tests__/__helpers__/renderWithSeo";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import programmeListingFixture, {
  programmeListingWithPathwayFixture,
} from "@/node-lib/curriculum-api-2023/fixtures/programmeListing.fixture";
import curriculumApi from "@/node-lib/curriculum-api-2023/__mocks__";
import { ProgrammeListingPageData } from "@/node-lib/curriculum-api-2023/queries/programmeListing/programmeListing.schema";

const render = renderWithProviders();

const programmesWithExamboards: ProgrammeListingPageData["programmes"] = [
  {
    programmeSlug: "maths-secondary-ks4-aqa",
    subjectTitle: "Maths",
    tierSlug: null,
    tierTitle: null,
    tierDisplayOrder: 1,
    examBoardSlug: "aqa",
    examBoardTitle: "AQA",
    examBoardDisplayOrder: 1,
    pathwayDisplayOrder: null,
    pathwaySlug: null,
    pathwayTitle: null,
  },
  {
    programmeSlug: "maths-secondary-ks4-edexcel",
    subjectTitle: "Maths",
    tierSlug: null,
    tierTitle: null,
    tierDisplayOrder: 3,
    examBoardSlug: "edexcel",
    examBoardTitle: "Edexcel",
    examBoardDisplayOrder: 1,
    pathwayDisplayOrder: null,
    pathwaySlug: null,
    pathwayTitle: null,
  },
];
const programmesWithTiersAndExamboards: ProgrammeListingPageData["programmes"] =
  [
    {
      programmeSlug: "maths-secondary-ks4-foundation",
      subjectTitle: "Maths",
      tierSlug: "foundation",
      tierTitle: "Foundation",
      tierDisplayOrder: 1,
      examBoardSlug: "aqa",
      examBoardTitle: "AQA",
      examBoardDisplayOrder: 1,
      pathwayDisplayOrder: null,
      pathwaySlug: null,
      pathwayTitle: null,
    },
    {
      programmeSlug: "maths-secondary-ks4-higher",
      subjectTitle: "Maths",
      tierSlug: "higher",
      tierTitle: "Higher",
      tierDisplayOrder: 1,
      examBoardSlug: "aqa",
      examBoardTitle: "AQA",
      examBoardDisplayOrder: 1,
      pathwayDisplayOrder: null,
      pathwaySlug: null,
      pathwayTitle: null,
    },
    {
      programmeSlug: "maths-secondary-ks4-higher",
      subjectTitle: "Maths",
      tierSlug: "higher",
      tierTitle: "Higher",
      tierDisplayOrder: 3,
      examBoardSlug: "edexcel",
      examBoardTitle: "Edexcel",
      examBoardDisplayOrder: 1,
      pathwayDisplayOrder: null,
      pathwaySlug: null,
      pathwayTitle: null,
    },

    {
      programmeSlug: "maths-secondary-ks4-foundation",
      subjectTitle: "Maths",
      tierSlug: "foundation",
      tierTitle: "Foundation",
      tierDisplayOrder: 3,
      examBoardSlug: "edexcel",
      examBoardTitle: "Edexcel",
      examBoardDisplayOrder: 1,
      pathwayDisplayOrder: null,
      pathwaySlug: null,
      pathwayTitle: null,
    },
  ];

const programmeSelected = jest.fn();

jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      browseRefined: (...args: unknown[]) => programmeSelected(...args),
    },
  }),
}));

describe("programmes listing page", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });
  describe("component rendering on page", () => {
    it("renders title from props ", () => {
      const { getByRole } = render(
        <ProgrammesListingPage {...programmeListingFixture()} />,
      );

      expect(getByRole("heading", { level: 1 })).toHaveTextContent("Maths");
    });

    it("renders title with pathway from props ", () => {
      const { getByRole } = render(
        <ProgrammesListingPage {...programmeListingWithPathwayFixture()} />,
      );

      expect(getByRole("heading", { level: 1 })).toHaveTextContent(
        "Citizenship Core",
      );
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
        title: "Key Stage 4 Maths tiers | NEXT_PUBLIC_SEO_APP_NAME",
        description: "Choose foundation or higher tier for GCSE Maths",
        ogTitle: "Key Stage 4 Maths tiers | NEXT_PUBLIC_SEO_APP_NAME",
        ogDescription: "Choose foundation or higher tier for GCSE Maths",
        ogUrl: "NEXT_PUBLIC_SEO_APP_URL/",
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
                tierSlug: "foundation",
                tierTitle: "Foundation",
                tierDisplayOrder: 3,
                examBoardSlug: null,
                examBoardTitle: null,
                examBoardDisplayOrder: null,
                pathwayDisplayOrder: null,
                pathwaySlug: null,
                pathwayTitle: null,
              },
              {
                programmeSlug: "maths-secondary-ks4-higher",
                subjectTitle: "Maths",
                tierSlug: "higher",
                tierTitle: "Higher",
                tierDisplayOrder: 2,
                examBoardSlug: null,
                examBoardTitle: null,
                examBoardDisplayOrder: null,
                pathwayDisplayOrder: null,
                pathwaySlug: null,
                pathwayTitle: null,
              },
            ],
          })}
        />,
      );

      expect(seo).toEqual({
        ...mockSeoResult,
        ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
        title: "Key Stage 4 Maths tiers | NEXT_PUBLIC_SEO_APP_NAME",
        description: "Choose foundation or higher tier for GCSE Maths",
        ogTitle: "Key Stage 4 Maths tiers | NEXT_PUBLIC_SEO_APP_NAME",
        ogDescription: "Choose foundation or higher tier for GCSE Maths",
        ogUrl: "NEXT_PUBLIC_SEO_APP_URL/",
        canonical: "NEXT_PUBLIC_SEO_APP_URL",
        robots: "index,follow",
      });
    });
    it("renders the correct SEO details for programmes with only examboards", async () => {
      const { seo } = renderWithSeo()(
        <ProgrammesListingPage
          {...programmeListingFixture({
            programmes: programmesWithExamboards,
          })}
        />,
      );

      expect(seo).toEqual({
        ...mockSeoResult,
        ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
        title: "Key Stage 4 Maths exam boards | NEXT_PUBLIC_SEO_APP_NAME",
        description: "Choose from the most popular exam boards in GCSE Maths",
        ogTitle: "Key Stage 4 Maths exam boards | NEXT_PUBLIC_SEO_APP_NAME",
        ogDescription: "Choose from the most popular exam boards in GCSE Maths",
        ogUrl: "NEXT_PUBLIC_SEO_APP_URL/",
        canonical: "NEXT_PUBLIC_SEO_APP_URL",
        robots: "index,follow",
      });
    });
    it("renders correct SEO for programmes with tiers and examboards", async () => {
      const { seo } = renderWithSeo()(
        <ProgrammesListingPage
          {...programmeListingFixture({
            programmes: programmesWithTiersAndExamboards,
          })}
        />,
      );

      expect(seo).toEqual({
        ...mockSeoResult,
        ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
        title: "Key Stage 4 Maths exam boards | NEXT_PUBLIC_SEO_APP_NAME",
        description:
          "Choose foundation or higher tier from the most popular exam boards in GCSE Maths",
        ogTitle: "Key Stage 4 Maths exam boards | NEXT_PUBLIC_SEO_APP_NAME",
        ogDescription:
          "Choose foundation or higher tier from the most popular exam boards in GCSE Maths",
        ogUrl: "NEXT_PUBLIC_SEO_APP_URL/",
        canonical: "NEXT_PUBLIC_SEO_APP_URL",
        robots: "index,follow",
      });
    });
    it("should track a browse refined event when programme with tiers is selected", async () => {
      render(<ProgrammesListingPage {...programmeListingFixture()} />);

      const programmeCard = screen.getByRole("link", { name: "Foundation" });
      await userEvent.click(programmeCard);
      expect(programmeSelected).toHaveBeenCalledWith({
        activeFilters: {
          keyStage: ["ks4"],
          subject: ["maths"],
        },
        analyticsUseCase: "Teacher",
        componentType: "programme_card",
        engagementIntent: "refine",
        eventVersion: "2.0.0",
        filterType: "Tier filter",
        filterValue: "Foundation",
        platform: "owa",
        product: "teacher lesson resources",
      });
    });
    it("should track a browse refined event when programme with examboards is selected", async () => {
      render(
        <ProgrammesListingPage
          {...programmeListingFixture({
            programmes: programmesWithExamboards,
          })}
        />,
      );

      const programmeCard = screen.getByRole("link", { name: "AQA" });
      await userEvent.click(programmeCard);
      expect(programmeSelected).toHaveBeenCalledWith({
        activeFilters: {
          keyStage: ["ks4"],
          subject: ["maths"],
        },
        analyticsUseCase: "Teacher",
        componentType: "programme_card",
        engagementIntent: "refine",
        eventVersion: "2.0.0",
        filterType: "Exam board filter",
        filterValue: "AQA",
        platform: "owa",
        product: "teacher lesson resources",
      });
    });
    it("should track a browse refined event when programme with tiers and examboards is selected", async () => {
      render(
        <ProgrammesListingPage
          {...programmeListingFixture({
            programmes: programmesWithTiersAndExamboards,
          })}
        />,
      );
      const programmeCard = screen.getByRole("link", {
        name: "Foundation AQA",
      });
      await userEvent.click(programmeCard);

      expect(programmeSelected).toHaveBeenCalledWith({
        activeFilters: {
          keyStage: ["ks4"],
          subject: ["maths"],
        },
        analyticsUseCase: "Teacher",
        componentType: "programme_card",
        engagementIntent: "refine",
        eventVersion: "2.0.0",
        filterType: "Exam board / tier filter",
        filterValue: "AQA, Foundation",
        platform: "owa",
        product: "teacher lesson resources",
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
