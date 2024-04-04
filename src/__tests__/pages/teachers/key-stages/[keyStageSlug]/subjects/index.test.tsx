import { screen, waitFor } from "@testing-library/react";

import SubjectListingPage, {
  getStaticPaths,
  getStaticProps,
} from "@/pages/teachers/key-stages/[keyStageSlug]/subjects";
import { mockSeoResult } from "@/__tests__/__helpers__/cms";
import renderWithSeo from "@/__tests__/__helpers__/renderWithSeo";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import curriculumApi from "@/node-lib/curriculum-api-2023/__mocks__/index";
import subjectPagePropsFixture from "@/node-lib/curriculum-api-2023/fixtures/subjectListing.fixture";

jest.mock("next/dist/client/router", () => require("next-router-mock"));
const props = subjectPagePropsFixture();

describe("pages/key-stages/[keyStageSlug]/subjects", () => {
  it("Renders title from props ", async () => {
    renderWithProviders()(<SubjectListingPage {...props} />);

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Key stage 4",
      );
    });
  });
  it("Renders eyfs keystage", async () => {
    renderWithProviders()(
      <SubjectListingPage
        {...props}
        keyStageSlug="early-years-foundation-stage"
        keyStageTitle="Early years foundation stage"
      />,
    );
    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Early years foundation stage",
      );
    });
  });

  describe("SEO", () => {
    it("renders the correct SEO details", async () => {
      const { seo } = renderWithSeo()(<SubjectListingPage {...props} />);
      expect(seo).toEqual({
        ...mockSeoResult,
        ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
        title:
          "Free KS4 Teaching Resources for Lesson Planning | NEXT_PUBLIC_SEO_APP_NAME",
        description:
          "Search by subject for free KS4 teaching resources to download and share",
        ogTitle:
          "Free KS4 Teaching Resources for Lesson Planning | NEXT_PUBLIC_SEO_APP_NAME",
        ogDescription:
          "Search by subject for free KS4 teaching resources to download and share",
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
    it("Should call API::subjectListing for legacy and new data", async () => {
      await getStaticProps({
        params: {
          keyStageSlug: "ks123",
        },
      });
      expect(curriculumApi.subjectListingPage).toHaveBeenCalledTimes(2);

      expect(curriculumApi.subjectListingPage).toHaveBeenNthCalledWith(1, {
        keyStageSlug: "ks123",
        isLegacy: false,
      });
      expect(curriculumApi.subjectListingPage).toHaveBeenNthCalledWith(2, {
        keyStageSlug: "ks123",
        isLegacy: true,
      });
    });
    it("should return notFound when a landing page is missing", async () => {
      (curriculumApi.subjectListingPage as jest.Mock).mockResolvedValueOnce(
        undefined,
      );

      const context = { params: { keyStageSlug: "test-key-stage" } };
      const response = await getStaticProps(context);
      expect(response).toEqual({
        notFound: true,
      });
    });
    it("should throw error when not provided context params", async () => {
      await expect(getStaticProps({})).rejects.toThrowError("No keyStageSlug");
    });
  });
});
