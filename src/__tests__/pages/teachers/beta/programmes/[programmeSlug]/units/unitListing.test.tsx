import mockRouter from "next-router-mock";
import userEvent from "@testing-library/user-event";
import { act } from "@testing-library/react";

import curriculumApi from "@/node-lib/curriculum-api-2023/__mocks__/index";
import UnitListingPage, {
  getStaticPaths,
  getStaticProps,
  getLegacyProgrammeSlug,
} from "@/pages/teachers/beta/programmes/[programmeSlug]/units";
import unitListingFixture, {
  unitListingWithTiers,
} from "@/node-lib/curriculum-api-2023/fixtures/unitListing.fixture";
import { mockSeoResult } from "@/__tests__/__helpers__/cms";
import renderWithSeo from "@/__tests__/__helpers__/renderWithSeo";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

jest.mock("next/router", () => require("next-router-mock"));

const utilsMock = jest.requireMock("@/utils/resultsPerPage");
jest.mock("@/utils/resultsPerPage", () => ({
  RESULTS_PER_PAGE: 20,
}));

beforeEach(() => {
  window.HTMLElement.prototype.scrollIntoView = jest.fn();
});

const unitSelected = jest.fn();

jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      unitAccessed: (...args: unknown[]) => unitSelected(...args),
    },
  }),
}));

const render = renderWithProviders();

describe("pages/beta/programmes/[programmeSlug]/units", () => {
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
      <UnitListingPage curriculumData={unitListingWithTiers()} />,
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

  it("finance banners are displayed", () => {
    const { getAllByTestId } = render(
      <UnitListingPage
        curriculumData={{
          ...unitListingFixture(),
          examBoardTitle: "OCR",
          relatedSubjects: ["financial-education"],
        }}
      />,
    );

    expect(getAllByTestId("financial-education-banner").length).toBeGreaterThan(
      0,
    );
  });

  it("finance banners are not displayed", () => {
    const { queryAllByTestId } = render(
      <UnitListingPage
        curriculumData={{
          ...unitListingFixture(),
          examBoardTitle: "OCR",
        }}
      />,
    );
    expect(queryAllByTestId("financial-education-banner")).toHaveLength(0);
  });

  describe("SEO", () => {
    it("renders the correct SEO details for programme", async () => {
      const { seo } = renderWithSeo()(
        <UnitListingPage curriculumData={unitListingWithTiers()} />,
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
        ogUrl: "NEXT_PUBLIC_SEO_APP_URL/",
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
        ogUrl: "NEXT_PUBLIC_SEO_APP_URL/",
        canonical: "NEXT_PUBLIC_SEO_APP_URL",
        robots: "index,follow",
      });
    });
  });
  describe("unit search filters", () => {
    it("unit filtered by the learningTheme const ", () => {
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

    it("skip filters button becomes visible when focussed", async () => {
      const { getByText } = render(
        <UnitListingPage curriculumData={unitListingFixture()} />,
      );

      const skipUnits = getByText("Skip to units").closest("a");

      if (!skipUnits) {
        throw new Error("Could not find filter button");
      }

      act(() => {
        skipUnits.focus();
      });
      expect(skipUnits).toHaveFocus();
      expect(skipUnits).not.toHaveStyle("position: absolute");

      act(() => {
        skipUnits.blur();
      });
      expect(skipUnits).not.toHaveFocus();
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
    it("Should fetch the correct data", async () => {
      await getStaticProps({
        params: {
          programmeSlug: "maths-primary-ks1",
        },
      });

      expect(curriculumApi.teachersPreviewUnitListing).toHaveBeenCalledTimes(2);
      expect(curriculumApi.teachersPreviewUnitListing).toHaveBeenCalledWith({
        programmeSlug: "maths-primary-ks1-l",
      });
    });
  });
});

describe("tracking", () => {
  test("It calls tracking.unitAccessed with correct props when clicked", async () => {
    const { getByText } = render(
      <UnitListingPage curriculumData={unitListingFixture()} />,
    );

    const unit = getByText("Data Representation");

    await userEvent.click(unit);

    expect(unitSelected).toHaveBeenCalledTimes(1);

    expect(unitSelected).toHaveBeenCalledWith({
      platform: "owa",
      product: "teacher lesson resources",
      engagementIntent: "refine",
      componentType: "unit_card",
      eventVersion: "2.0.0",
      analyticsUseCase: "Teacher",
      unitName: "Data Representation",
      unitSlug: "data-representation-618b",
      keyStageSlug: "ks4",
      keyStageTitle: "Key Stage 4",
      subjectTitle: "Computing",
      subjectSlug: "computing",
      yearGroupName: "Year 10",
      yearGroupSlug: "year-10",
      tierName: null,
      examBoard: null,
    });
  });
});

describe("getLegacyProgrammeSlug", () => {
  it('replaces examBoardSlug with "l" if examBoardSlug is present at the end of programmeSlug', () => {
    const result = getLegacyProgrammeSlug("spanish-secondary-ks4-aqa", "aqa");
    expect(result).toBe("spanish-secondary-ks4-l");
  });

  it('appends "-l" if examBoardSlug is null', () => {
    const result = getLegacyProgrammeSlug("history-programme", null);
    expect(result).toBe("history-programme-l");
  });
});
