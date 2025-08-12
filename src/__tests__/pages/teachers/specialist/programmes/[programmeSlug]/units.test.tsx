import mockRouter from "next-router-mock";

import SpecialistUnitListingPage, {
  getStaticPaths,
  getStaticProps,
} from "@/pages/teachers/specialist/programmes/[programmeSlug]/units";
import { mockSeoResult } from "@/__tests__/__helpers__/cms";
import renderWithSeo from "@/__tests__/__helpers__/renderWithSeo";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import specialistUnitListingFixture from "@/components/TeacherViews/SpecialistUnitListing/SpecialistUnitListing.fixture";
import curriculumApi2023 from "@/node-lib/curriculum-api-2023/__mocks__";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import { mockLoggedIn } from "@/__tests__/__helpers__/mockUser";

jest.mock("next/router", () => require("next-router-mock"));

const render = renderWithProviders();

describe("pages/specialist/programmes/[programmeSlug]/units", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });

  it("renders title from props ", () => {
    setUseUserReturn(mockLoggedIn);
    const { getByRole } = render(
      <SpecialistUnitListingPage
        curriculumData={specialistUnitListingFixture()}
      />,
    );

    expect(getByRole("heading", { level: 1 })).toHaveTextContent(
      "Communication and Language",
    );
  });

  it("renders nav for development stages for programme that included development stages", () => {
    const { getByTestId } = render(
      <SpecialistUnitListingPage
        curriculumData={specialistUnitListingFixture()}
      />,
    );

    expect(getByTestId("development-nav")).toBeInTheDocument();
  });
  it("title card render correct title", () => {
    const { getByRole } = render(
      <SpecialistUnitListingPage
        curriculumData={specialistUnitListingFixture()}
      />,
    );

    expect(getByRole("heading", { level: 1 })).toHaveTextContent(
      "Communication and Language",
    );
  });

  describe("SEO", () => {
    it("renders the correct SEO details for development stages programme", async () => {
      const { seo } = renderWithSeo()(
        <SpecialistUnitListingPage
          curriculumData={specialistUnitListingFixture()}
        />,
      );
      expect(seo).toEqual({
        ...mockSeoResult,
        ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
        title:
          "Free Specialist Communication and Language Teaching Resources for Lesson Planning | NEXT_PUBLIC_SEO_APP_NAME",
        description:
          "We have resources for development stages: Building Understanding, Applying Learning",
        ogTitle:
          "Free Specialist Communication and Language Teaching Resources for Lesson Planning | NEXT_PUBLIC_SEO_APP_NAME",
        ogDescription:
          "We have resources for development stages: Building Understanding, Applying Learning",
        ogUrl: "NEXT_PUBLIC_SEO_APP_URL/",
        canonical: "NEXT_PUBLIC_SEO_APP_URL",
        robots: "index,follow",
      });
    });
    it("renders the correct SEO details when no development stages programme", async () => {
      const { seo } = renderWithSeo()(
        <SpecialistUnitListingPage
          curriculumData={{
            ...specialistUnitListingFixture(),
            developmentStage: [],
            developmentStageSlug: "",
          }}
        />,
      );
      expect(seo).toEqual({
        ...mockSeoResult,
        ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
        title:
          "Free Specialist Communication and Language Teaching Resources for Lesson Planning | NEXT_PUBLIC_SEO_APP_NAME",
        description: "Specialist programme units",
        ogTitle:
          "Free Specialist Communication and Language Teaching Resources for Lesson Planning | NEXT_PUBLIC_SEO_APP_NAME",
        ogDescription: "Specialist programme units",
        ogUrl: "NEXT_PUBLIC_SEO_APP_URL/",
        canonical: "NEXT_PUBLIC_SEO_APP_URL",
        robots: "index,follow",
      });
    });
  });

  it("unitsFilteredByLearningTheme filters units by the learningTheme const ", () => {
    mockRouter.push({
      pathname:
        "/teachers/specialist/programmes/communication-and-language/units",
      query: {
        learningTheme: "test-theme-primary",
      },
    });
    const { getByRole, queryByText } = render(
      <SpecialistUnitListingPage
        curriculumData={specialistUnitListingFixture()}
      />,
    );

    const unit = queryByText("2. Out and about");

    expect(unit).not.toBeInTheDocument();

    expect(getByRole("heading", { level: 1 })).toHaveTextContent(
      "Communication and Language",
    );
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
    it("Should call specialistUnitListing on curriculum 2023 api", async () => {
      await getStaticProps({
        params: {
          programmeSlug: "art-primary-ks1-l",
        },
      });

      expect(curriculumApi2023.specialistUnitListing).toHaveBeenCalledTimes(1);
    });
  });
});
