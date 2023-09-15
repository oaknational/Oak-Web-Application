import { screen, waitFor } from "@testing-library/react";

import SubjectListingPage, {
  getStaticPaths,
  getStaticProps,
} from "@/pages/teachers/key-stages/[keyStageSlug]/subjects";
import { mockSeoResult } from "@/__tests__/__helpers__/cms";
import renderWithSeo from "@/__tests__/__helpers__/renderWithSeo";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import subjectPagePropsFixture from "@/node-lib/curriculum-api/fixtures/subjectPageProps";
import * as curriculumApi2023 from "@/node-lib/curriculum-api-2023/__mocks__/index";
import curriculumApi from "@/node-lib/curriculum-api/__mocks__";

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

  describe("SEO", () => {
    it("renders the correct SEO details", async () => {
      const { seo } = renderWithSeo()(<SubjectListingPage {...props} />);
      expect(seo).toEqual({
        ...mockSeoResult,
        ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
        title:
          "Free KS4 Teaching Resources for Lesson Planning | NEXT_PUBLIC_SEO_APP_NAME",
        description: "Key stage by subject",
        ogTitle:
          "Free KS4 Teaching Resources for Lesson Planning | NEXT_PUBLIC_SEO_APP_NAME",
        ogDescription: "Key stage by subject",
        ogUrl: "NEXT_PUBLIC_SEO_APP_URL",
        canonical: "NEXT_PUBLIC_SEO_APP_URL",
        robots: "noindex,nofollow",
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
    it("Should call legacy API:subjectListing on 'teachers'", async () => {
      await getStaticProps({
        params: {
          keyStageSlug: "ks123",
        },
      });

      expect(curriculumApi.subjectListing).toHaveBeenCalledWith({
        keyStageSlug: "ks123",
      });
      expect(
        curriculumApi2023.default.subjectListingPage,
      ).not.toHaveBeenCalled();
    });
    it("Should call both API::subjectListing on 'teachers-2023'", async () => {
      await getStaticProps({
        params: {
          keyStageSlug: "ks123",
        },
      });

      expect(curriculumApi.subjectListing).toHaveBeenCalledWith({
        keyStageSlug: "ks123",
      });
      expect(curriculumApi2023.default.subjectListingPage).toHaveBeenCalledWith(
        {
          keyStageSlug: "ks123",
        },
      );
    });
  });
});
