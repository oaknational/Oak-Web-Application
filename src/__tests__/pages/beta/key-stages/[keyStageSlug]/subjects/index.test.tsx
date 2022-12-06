import { screen, waitFor } from "@testing-library/react";

import { subjects } from "../../../../../../browser-lib/fixtures/subjectListing";
import teachersHomePageFixture from "../../../../../../node-lib/curriculum-api/fixtures/teachersHomePage.fixture";
import teachersKeyStageSubjectsFixture from "../../../../../../node-lib/curriculum-api/fixtures/teachersKeyStageSubjects.fixture";
import KeyStageListPage, {
  getStaticPaths,
  getStaticProps,
} from "../../../../../../pages/beta/teachers/key-stages/[keyStageSlug]/subjects";
import { mockSeoResult } from "../../../../../__helpers__/cms";
import renderWithProviders from "../../../../../__helpers__/renderWithProviders";
import renderWithSeo from "../../../../../__helpers__/renderWithSeo";

const teachersHomePage = jest.fn(teachersHomePageFixture);
const teachersKeyStageSubjects = jest.fn(teachersKeyStageSubjectsFixture);
jest.mock("../../../../../../node-lib/curriculum-api", () => ({
  __esModule: true,
  default: {
    teachersHomePage: (...args: []) => teachersHomePage(...args),
    teachersKeyStageSubjects: (...args: []) =>
      teachersKeyStageSubjects(...args),
  },
}));

describe("pages/key-stages/[keyStageSlug]/subjects", () => {
  it("Renders title from props ", async () => {
    renderWithProviders(
      <KeyStageListPage
        curriculumData={{
          keyStageSlug: "ks1",
          keyStageTitle: "Key stage 1",
          subjects,
        }}
      />
    );

    await waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Key stage 1"
      );
    });
  });

  describe("SEO", () => {
    it("renders the correct SEO details", async () => {
      const { seo } = renderWithSeo(
        <KeyStageListPage
          curriculumData={{
            keyStageSlug: "ks1",
            keyStageTitle: "Key stage 1",
            subjects,
          }}
        />
      );

      expect(seo).toEqual({
        ...mockSeoResult,
        ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
        title: "Key stage | NEXT_PUBLIC_SEO_APP_NAME",
        description: "Key stage by subject",
        ogTitle: "Key stage | NEXT_PUBLIC_SEO_APP_NAME",
        ogDescription: "Key stage by subject",
        ogUrl: "NEXT_PUBLIC_SEO_APP_URL",
        canonical: "NEXT_PUBLIC_SEO_APP_URL",
      });
    });
  });

  describe("getStaticPaths", () => {
    it("Should return the paths of all keystages", async () => {
      await getStaticPaths({});

      expect(teachersHomePage).toHaveBeenCalled();
    });
  });

  describe("getStaticProps", () => {
    it("Should fetch the correct data", async () => {
      await getStaticProps({
        params: { keyStageSlug: "ks123" },
      });

      expect(teachersKeyStageSubjects).toHaveBeenCalledWith({
        keyStageSlug: "ks123",
      });
    });
  });
});
