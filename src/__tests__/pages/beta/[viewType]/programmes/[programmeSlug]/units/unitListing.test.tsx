import { beforeEach, describe, expect, it, vi } from "vitest";
import mockRouter from "next-router-mock";

import curriculumApi from "@/node-lib/curriculum-api/__mocks__";
import UnitListingPage, {
  getStaticPaths,
  getStaticProps,
} from "@/pages/teachers/programmes/[programmeSlug]/units";
import { mockSeoResult } from "@/__tests__/__helpers__/cms";
import renderWithSeo from "@/__tests__/__helpers__/renderWithSeo";
import unitListingFixture from "@/node-lib/curriculum-api/fixtures/unitListing.fixture";
import unitListingWithTiersFixture from "@/node-lib/curriculum-api/fixtures/unitListingWithTiers.fixture";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import * as resultsPerPage from "@/utils/resultsPerPage";

vi.mock("@/utils/resultsPerPage", () => ({
  RESULTS_PER_PAGE: 20,
}));
vi.mock("next/router", () => require("next-router-mock"));

const render = renderWithProviders();

describe("pages/programmes/[programmeSlug]/units", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
  it("title card renderd correct title when exam board is present", () => {
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
    it.skip("renders the correct SEO details for tiered programme", async () => {
      const { seo } = renderWithSeo()(
        <UnitListingPage curriculumData={unitListingWithTiersFixture()} />,
      );
      expect(seo).toEqual({
        ...mockSeoResult,
        ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
        title: "Key stage 4 Computing tiers | NEXT_PUBLIC_SEO_APP_NAME",
        description: "We have resources for tiers: Foundation, Core, Higher",
        ogTitle: "Key stage 4 Computing tiers | NEXT_PUBLIC_SEO_APP_NAME",
        ogDescription: "We have resources for tiers: Foundation, Core, Higher",
        ogUrl: "NEXT_PUBLIC_SEO_APP_URL",
        canonical: "NEXT_PUBLIC_SEO_APP_URL",
        robots: "noindex,nofollow",
      });
    });
    it.skip("renders the correct SEO details for non tiered programme", async () => {
      const { seo } = renderWithSeo()(
        <UnitListingPage curriculumData={unitListingFixture()} />,
      );
      expect(seo).toEqual({
        ...mockSeoResult,
        ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
        title:
          "Free KS4 Computing Teaching Resources for Lesson Planning | NEXT_PUBLIC_SEO_APP_NAME",
        description: "Programme units",
        ogTitle:
          "Free KS4 Computing Teaching Resources for Lesson Planning | NEXT_PUBLIC_SEO_APP_NAME",
        ogDescription: "Programme units",
        ogUrl: "NEXT_PUBLIC_SEO_APP_URL",
        canonical: "NEXT_PUBLIC_SEO_APP_URL",
        robots: "noindex,nofollow",
      });
    });

    it.skip("renders the correct SEO details for programmes with pagination", async () => {
      Object.defineProperty(resultsPerPage, "RESULTS_PER_PAGE", { value: 10 });
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
          "Free KS4 Computing Teaching Resources for Lesson Planning | Page 1 of 2 | NEXT_PUBLIC_SEO_APP_NAME",
        description: "Programme units",
        ogTitle:
          "Free KS4 Computing Teaching Resources for Lesson Planning | Page 1 of 2 | NEXT_PUBLIC_SEO_APP_NAME",
        ogDescription: "Programme units",
        ogUrl: "NEXT_PUBLIC_SEO_APP_URL",
        canonical: "NEXT_PUBLIC_SEO_APP_URL",
        robots: "noindex,nofollow",
      });
    });
  });

  it("runitsFilteredByLearningTheme filters units by the learningTheme const ", () => {
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
