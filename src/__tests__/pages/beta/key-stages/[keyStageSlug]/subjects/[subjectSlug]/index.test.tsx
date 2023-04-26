import { screen, waitFor } from "@testing-library/react";
import { GetServerSidePropsContext, PreviewData } from "next";

import teachersKeyStageSubjectUnitsFixture from "../../../../../../../node-lib/curriculum-api/fixtures/teachersKeyStageSubjectUnits.fixture";
import SubjectUnitsListPage, {
  getServerSideProps,
  SubjectUnitsListPageProps,
  URLParams,
} from "../../../../../../../pages/beta/teachers/key-stages/[keyStageSlug]/subjects/[subjectSlug]/units";
import { mockSeoResult } from "../../../../../../__helpers__/cms";
import renderWithProviders from "../../../../../../__helpers__/renderWithProviders";
import renderWithSeo from "../../../../../../__helpers__/renderWithSeo";

const curriculumData = teachersKeyStageSubjectUnitsFixture();
const emptyTieredCurriculumData = {
  keyStageSlug: "ks4",
  keyStageTitle: "Key stage 4",
  subjectSlug: "maths",
  subjectTitle: "Maths",
  tierSlug: "core",
  tiers: [],
  units: [
    {
      slug: "some-unit-slug",
      title: "Unit title",
      keyStageSlug: "ks4",
      keyStageTitle: "Key stage 4",
      subjectSlug: "maths",
      subjectTitle: "Maths",
      themeSlug: "some-theme-slug",
      themeTitle: "Some theme title",
      lessonCount: 18,
      quizCount: 1,
      unitStudyOrder: 1,
      year: "Year 7",
      expired: false,
      expiredLessonCount: null,
    },
  ],
  learningThemes: [],
};

jest.mock("next/dist/client/router", () => require("next-router-mock"));

const render = renderWithProviders();

describe("pages/teachers/key-stages/[keyStageSlug]/subjects/[subjectSlug]/units.tsx", () => {
  it("Renders title from props ", () => {
    render(
      <SubjectUnitsListPage
        curriculumData={curriculumData}
        learningThemeSlug={null}
      />
    );

    waitFor(() => {
      expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
        "Art and design"
      );
    });
  });

  describe("SEO", () => {
    it("renders the correct SEO details", () => {
      const { seo } = renderWithSeo()(
        <SubjectUnitsListPage
          curriculumData={emptyTieredCurriculumData}
          learningThemeSlug={null}
        />
      );

      expect(seo).toEqual({
        ...mockSeoResult,
        ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
        title:
          "Free KS4 Maths Teaching Resources for Lesson Planning | NEXT_PUBLIC_SEO_APP_NAME",
        description: "Subject units",
        ogTitle:
          "Free KS4 Maths Teaching Resources for Lesson Planning | NEXT_PUBLIC_SEO_APP_NAME",
        ogDescription: "Subject units",
        ogUrl: "NEXT_PUBLIC_SEO_APP_URL",
        canonical: "NEXT_PUBLIC_SEO_APP_URL",
        robots: "noindex,nofollow",
      });
    });

    it("renders the correct SEO details when passed tiered data", () => {
      const { seo } = renderWithSeo()(
        <SubjectUnitsListPage
          curriculumData={curriculumData}
          learningThemeSlug={null}
        />
      );

      expect(seo).toEqual({
        ...mockSeoResult,
        ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
        title: "Key stage 4 Maths tiers | NEXT_PUBLIC_SEO_APP_NAME",
        description: "We have resources for tiers: Foundation, Core, Higher",
        ogTitle: "Key stage 4 Maths tiers | NEXT_PUBLIC_SEO_APP_NAME",
        ogDescription: "We have resources for tiers: Foundation, Core, Higher",
        ogUrl: "NEXT_PUBLIC_SEO_APP_URL",
        canonical: "NEXT_PUBLIC_SEO_APP_URL",
        robots: "noindex,nofollow",
      });
    });
  });

  describe("getServerSideProps", () => {
    it("Should fetch the correct data", async () => {
      const propsResult = (await getServerSideProps({
        params: {
          subjectSlug: "art",
          keyStageSlug: "ks4",
        },
        query: {},
      } as GetServerSidePropsContext<URLParams, PreviewData>)) as {
        props: SubjectUnitsListPageProps;
      };

      expect(propsResult.props.curriculumData).toEqual(
        teachersKeyStageSubjectUnitsFixture()
      );
    });
  });

  describe("conditional SubjectTierListing component rendering", () => {
    it("when tiered data array is not empty SubjectTierListing component rendered", () => {
      render(
        <SubjectUnitsListPage
          curriculumData={curriculumData}
          learningThemeSlug={null}
        />
      );

      expect(screen.getByText("Learning tiers")).toBeInTheDocument();
    });
    it("when tiered data array is not empty SubjectTierListing component rendered", () => {
      render(
        <SubjectUnitsListPage
          curriculumData={emptyTieredCurriculumData}
          learningThemeSlug={null}
        />
      );

      expect(screen.getByText("Units")).toBeInTheDocument();
    });
  });
});
