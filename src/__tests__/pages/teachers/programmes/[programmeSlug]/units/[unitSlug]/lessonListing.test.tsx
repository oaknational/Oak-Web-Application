import { describe, expect, it, vi } from "vitest";
import { GetStaticPropsContext, PreviewData } from "next";
import userEvent from "@testing-library/user-event";
import { act } from "react-dom/test-utils";

import lessonListingFixture from "@/node-lib/curriculum-api/fixtures/lessonListing.fixture";
import LessonListPage, {
  getStaticProps,
  LessonListingPageProps,
  URLParams,
} from "@/pages/teachers/programmes/[programmeSlug]/units/[unitSlug]/lessons";
import { mockSeoResult } from "@/__tests__/__helpers__/cms";
import renderWithSeo from "@/__tests__/__helpers__/renderWithSeo";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import * as resultsPerPage from "@/utils/resultsPerPage";

const render = renderWithProviders();

vi.mock("@/utils/resultsPerPage", () => ({
  RESULTS_PER_PAGE: 20,
}));

const lessonSelected = vi.fn();

vi.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      lessonSelected: (...args: unknown[]) => lessonSelected(...args),
    },
  }),
}));

describe("Lesson listing page", () => {
  it("it renders the unit title as page title", () => {
    const { getByRole } = render(
      <LessonListPage curriculumData={lessonListingFixture()} />,
    );

    const pageHeading = getByRole("heading", { level: 1 });

    expect(pageHeading).toBeInTheDocument();
  });

  it("it renders the correct number of lessons", () => {
    const { getByText } = render(
      <LessonListPage curriculumData={lessonListingFixture()} />,
    );
    const lessonCountFixtures = lessonListingFixture().lessons.length;
    const lessonCount = getByText(`Lessons (${lessonCountFixtures})`);

    expect(lessonCount).toBeInTheDocument();
  });

  describe("SEO", () => {
    it.skip("renders the correct SEO details", async () => {
      const { seo } = renderWithSeo()(
        <LessonListPage curriculumData={lessonListingFixture()} />,
      );
      expect(seo).toEqual({
        ...mockSeoResult,
        ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
        title: "Unit: Adding surds | KS4 Maths | NEXT_PUBLIC_SEO_APP_NAME",
        description: "Lessons in Unit",
        ogTitle: "Unit: Adding surds | KS4 Maths | NEXT_PUBLIC_SEO_APP_NAME",
        ogDescription: "Lessons in Unit",
        ogUrl: "NEXT_PUBLIC_SEO_APP_URL",
        canonical: "NEXT_PUBLIC_SEO_APP_URL",
        robots: "noindex,nofollow",
      });
    });
    it.skip("renders the correct SEO details with pagination", async () => {
      Object.defineProperty(resultsPerPage, "RESULTS_PER_PAGE", { value: 10 });
      const { seo } = renderWithSeo()(
        <LessonListPage curriculumData={lessonListingFixture()} />,
      );
      expect(seo).toEqual({
        ...mockSeoResult,
        ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
        title:
          "Unit: Adding surds | KS4 Maths | Page 1 of 3 | NEXT_PUBLIC_SEO_APP_NAME",
        description: "Lessons in Unit",
        ogTitle:
          "Unit: Adding surds | KS4 Maths | Page 1 of 3 | NEXT_PUBLIC_SEO_APP_NAME",
        ogDescription: "Lessons in Unit",
        ogUrl: "NEXT_PUBLIC_SEO_APP_URL",
        canonical: "NEXT_PUBLIC_SEO_APP_URL",
        robots: "noindex,nofollow",
      });
    });
  });
  describe("getStaticProps", () => {
    it("Should fetch the correct data", async () => {
      const propsResult = (await getStaticProps({
        params: {
          programmeSlug: "maths-secondary-ks4-higher-l",
          unitSlug: "adding-surds-a57d",
        },
        query: {},
      } as GetStaticPropsContext<URLParams, PreviewData>)) as {
        props: LessonListingPageProps;
      };

      expect(propsResult.props.curriculumData).toEqual(lessonListingFixture());
    });
    it("should throw error", async () => {
      await expect(
        getStaticProps({} as GetStaticPropsContext<URLParams, PreviewData>),
      ).rejects.toThrowError("no context.params");
    });
  });
  describe("tracking", () => {
    it("It calls tracking.lessonSelected with correct props when clicked", async () => {
      const { getByText } = render(
        <LessonListPage curriculumData={lessonListingFixture()} />,
      );

      const lesson = getByText("Add two surds");

      await act(async () => {
        await userEvent.click(lesson);
      });

      expect(lessonSelected).toHaveBeenCalledTimes(1);
      expect(lessonSelected).toHaveBeenCalledWith({
        analyticsUseCase: null,
        keyStageSlug: "ks4",
        keyStageTitle: "Key stage 4",
        lessonName: "Add two surds",
        lessonSlug: "add-two-surds-6wwk0c",
        subjectSlug: "maths",
        unitName: "Adding surds",
        unitSlug: "adding-surds-a57d",
        subjectTitle: "Maths",
      });
    });
  });
});
