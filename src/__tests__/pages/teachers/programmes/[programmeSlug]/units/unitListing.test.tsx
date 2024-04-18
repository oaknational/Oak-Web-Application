import mockRouter from "next-router-mock";
import userEvent from "@testing-library/user-event";

import curriculumApi from "@/node-lib/curriculum-api-2023/__mocks__/index";
import UnitListingPage, {
  getStaticPaths,
  getStaticProps,
} from "@/pages/teachers/programmes/[programmeSlug]/units";
import unitListingFixture from "@/node-lib/curriculum-api/fixtures/unitListing.fixture";
import unitListingWithTiersFixture from "@/node-lib/curriculum-api/fixtures/unitListingWithTiers.fixture";
import { mockSeoResult } from "@/__tests__/__helpers__/cms";
import renderWithSeo from "@/__tests__/__helpers__/renderWithSeo";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

jest.mock("next/router", () => require("next-router-mock"));

const utilsMock = jest.requireMock("@/utils/resultsPerPage");
jest.mock("@/utils/resultsPerPage", () => ({
  RESULTS_PER_PAGE: 20,
}));

const unitSelected = jest.fn();

jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      unitSelected: (...args: unknown[]) => unitSelected(...args),
    },
  }),
}));

const render = renderWithProviders();

describe("pages/programmes/[programmeSlug]/units", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it("renders title from props ", () => {
    const { getByRole } = render(
      <UnitListingPage curriculumData={unitListingFixture()} />,
    );

    expect(getByRole("heading", { level: 1 })).toHaveTextContent("Computing");
  });

  it("renders nav for tiers for programme that included tiers", () => {
    const { getByTestId } = render(
      <UnitListingPage curriculumData={unitListingWithTiersFixture()} />,
    );

    expect(getByTestId("tiers-nav")).toBeInTheDocument();
  });
  it("title card render correct title", () => {
    const { getByRole } = render(
      <UnitListingPage curriculumData={unitListingFixture()} />,
    );

    expect(getByRole("heading", { level: 1 })).toHaveTextContent("Computing");
  });
  it("title card rendered correct title when exam board is present", () => {
    const { getByRole } = render(
      <UnitListingPage
        curriculumData={{
          ...unitListingFixture(),
          examBoardTitle: "OCR",
        }}
      />,
    );

    expect(getByRole("heading", { level: 1 })).toHaveTextContent(
      "Computing OCR",
    );
  });

  describe("SEO", () => {
    it("renders the correct SEO details for programme", async () => {
      const { seo } = renderWithSeo()(
        <UnitListingPage curriculumData={unitListingWithTiersFixture()} />,
      );
      expect(seo).toEqual({
        ...mockSeoResult,
        ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
        title:
          "Free KS4 Computing teaching resources | NEXT_PUBLIC_SEO_APP_NAME",
        description:
          "Get fully sequenced teaching resources and lesson plans in KS4 Computing",
        ogTitle:
          "Free KS4 Computing teaching resources | NEXT_PUBLIC_SEO_APP_NAME",
        ogDescription:
          "Get fully sequenced teaching resources and lesson plans in KS4 Computing",
        ogUrl: "NEXT_PUBLIC_SEO_APP_URL",
        canonical: "NEXT_PUBLIC_SEO_APP_URL",
        robots: "index,follow",
      });
    });

    it("renders the correct SEO details for programmes with pagination", async () => {
      utilsMock.RESULTS_PER_PAGE = 10;
      const { seo } = renderWithSeo()(
        <UnitListingPage
          curriculumData={{
            ...unitListingFixture(),
          }}
        />,
      );
      expect(seo).toEqual({
        ...mockSeoResult,
        ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
        title:
          "Free KS4 Computing teaching resources | Page 1 of 2 | NEXT_PUBLIC_SEO_APP_NAME",
        description:
          "Get fully sequenced teaching resources and lesson plans in KS4 Computing",
        ogTitle:
          "Free KS4 Computing teaching resources | Page 1 of 2 | NEXT_PUBLIC_SEO_APP_NAME",
        ogDescription:
          "Get fully sequenced teaching resources and lesson plans in KS4 Computing",
        ogUrl: "NEXT_PUBLIC_SEO_APP_URL",
        canonical: "NEXT_PUBLIC_SEO_APP_URL",
        robots: "index,follow",
      });
    });
  });

  it("unitsFilteredByLearningTheme filters units by the learningTheme const ", () => {
    mockRouter.push({
      pathname: "/teachers/programmes/art-primary-ks1/units",
      query: {
        learningTheme: "computer-science-2",
      },
    });
    const { getByRole } = render(
      <UnitListingPage curriculumData={unitListingFixture()} />,
    );

    expect(getByRole("heading", { level: 1 })).toHaveTextContent("Computing");
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
    it("Should fetch the correct data", async () => {
      await getStaticProps({
        params: {
          programmeSlug: "art-primary-ks1-l",
        },
      });

      expect(curriculumApi.unitListing).toHaveBeenCalledTimes(1);
      expect(curriculumApi.unitListing).toHaveBeenCalledWith({
        programmeSlug: "art-primary-ks1-l",
      });
    });
  });
});

describe("tracking", () => {
  test("It calls tracking.unitSelected with correct props when clicked", async () => {
    const { getByRole } = render(
      <UnitListingPage curriculumData={unitListingFixture()} />,
    );

    const unit = getByRole("link", { name: "1. Data Representation" });

    await userEvent.click(unit);

    expect(unitSelected).toHaveBeenCalledTimes(1);

    expect(unitSelected).toHaveBeenCalledWith({
      keyStageTitle: "Key stage 4",
      keyStageSlug: "ks4",
      analyticsUseCase: "Teacher",
      subjectTitle: "Computing",
      subjectSlug: "computing",
      unitName: "Data Representation",
      unitSlug: "data-representation-618b",
    });
  });
});
