import { GetStaticPropsContext, PreviewData } from "next";
import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/dom";

import LessonListPage, {
  getStaticProps,
  URLParams,
} from "@/pages/teachers/programmes/[programmeSlug]/units/[unitSlug]/lessons";
import { mockSeoResult } from "@/__tests__/__helpers__/cms";
import renderWithSeo from "@/__tests__/__helpers__/renderWithSeo";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import lessonListingFixture, {
  lessonsWithUnpublishedContent,
} from "@/node-lib/curriculum-api-2023/fixtures/lessonListing.fixture";
import curriculumApi from "@/node-lib/curriculum-api-2023/__mocks__/index";

const render = renderWithProviders();

const utilsMock = jest.requireMock("@/utils/resultsPerPage");
jest.mock("@/utils/resultsPerPage", () => ({
  RESULTS_PER_PAGE: 20,
}));

const lessonSelected = jest.fn();

jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      lessonAccessed: (...args: unknown[]) => lessonSelected(...args),
    },
  }),
}));

jest.mock("posthog-js/react", () => ({
  useFeatureFlagEnabled: jest.fn().mockReturnValue(true),
}));

describe("Lesson listing page", () => {
  test("it renders the unit title as page title", () => {
    const { getByRole } = render(
      <LessonListPage curriculumData={lessonListingFixture()} />,
    );

    const pageHeading = getByRole("heading", { level: 1 });

    expect(pageHeading).toBeInTheDocument();
  });

  test("it renders the correct number of lessons", () => {
    const { getByText } = render(
      <LessonListPage curriculumData={lessonListingFixture()} />,
    );
    const lessonCountFixtures = lessonListingFixture().lessons.length;
    const lessonCount = getByText(`Lessons (${lessonCountFixtures})`);

    expect(lessonCount).toBeInTheDocument();
  });

  test("it renders the correct number of lessons when there are unpublished lessons", () => {
    render(
      <LessonListPage
        curriculumData={lessonListingFixture({
          lessons: lessonsWithUnpublishedContent,
        })}
      />,
    );

    const lessonCount = screen.getByText(`3/5 lessons available`);
    expect(lessonCount).toBeInTheDocument();
  });

  test("it renders the correct text for the save button", async () => {
    render(<LessonListPage curriculumData={lessonListingFixture({})} />);
    const saveButton = screen.getByTestId("save-unit-button");
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toHaveTextContent("Save");

    await userEvent.click(saveButton);
    expect(saveButton).toHaveTextContent("Saved");
  });

  describe("SEO", () => {
    it("renders the correct SEO details", async () => {
      const { seo } = renderWithSeo()(
        <LessonListPage curriculumData={lessonListingFixture()} />,
      );
      expect(seo).toEqual({
        ...mockSeoResult,
        ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
        title: "Unit: Adding surds | KS4 Maths | NEXT_PUBLIC_SEO_APP_NAME",
        description: "Free lessons and teaching resources about adding surds",
        ogTitle: "Unit: Adding surds | KS4 Maths | NEXT_PUBLIC_SEO_APP_NAME",
        ogDescription: "Free lessons and teaching resources about adding surds",
        ogUrl: "NEXT_PUBLIC_SEO_APP_URL/",
        canonical: "NEXT_PUBLIC_SEO_APP_URL",
        robots: "index,follow",
      });
    });
    it("renders the correct SEO details with pagination", async () => {
      utilsMock.RESULTS_PER_PAGE = 2;
      const { seo } = renderWithSeo()(
        <LessonListPage curriculumData={lessonListingFixture()} />,
      );
      expect(seo).toEqual({
        ...mockSeoResult,
        ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
        title:
          "Unit: Adding surds | KS4 Maths | Page 1 of 3 | NEXT_PUBLIC_SEO_APP_NAME",
        description: "Free lessons and teaching resources about adding surds",
        ogTitle:
          "Unit: Adding surds | KS4 Maths | Page 1 of 3 | NEXT_PUBLIC_SEO_APP_NAME",
        ogDescription: "Free lessons and teaching resources about adding surds",
        ogUrl: "NEXT_PUBLIC_SEO_APP_URL/",
        canonical: "NEXT_PUBLIC_SEO_APP_URL",
        robots: "index,follow",
      });
    });
  });
  describe("getStaticProps", () => {
    it("Should call curriculum api with correct props", async () => {
      await getStaticProps({
        params: {
          programmeSlug: "maths-secondary-ks4-higher-l",
          unitSlug: "adding-surds-a57d",
        },
      });
      expect(curriculumApi.lessonListing).toHaveBeenCalledWith({
        programmeSlug: "maths-secondary-ks4-higher-l",
        unitSlug: "adding-surds-a57d",
      });
    });
    it("should return notFound when a landing page is missing", async () => {
      (curriculumApi.lessonListing as jest.Mock).mockResolvedValueOnce(
        undefined,
      );

      const context = {
        params: {
          programmeSlug: "maths-secondary-ks4-higher-l",
          unitSlug: "adding-surds-a57d",
        },
      };
      const response = await getStaticProps(context);
      expect(response).toEqual({
        notFound: true,
      });
    });
    it("should throw error when params are missing", async () => {
      const context = {
        params: {
          programmeSlug: "maths-secondary-ks4-higher-l",
        },
      };
      await expect(
        getStaticProps(
          context as GetStaticPropsContext<URLParams, PreviewData>,
        ),
      ).rejects.toThrowError("unexpected context.params");
    });
    it("should throw error", async () => {
      await expect(
        getStaticProps({} as GetStaticPropsContext<URLParams, PreviewData>),
      ).rejects.toThrowError("no context.params");
    });
  });
  describe("tracking", () => {
    test("It calls tracking.lessonSelected with correct props when clicked", async () => {
      const { getByText } = render(
        <LessonListPage curriculumData={lessonListingFixture()} />,
      );

      const lesson = getByText("Add two surds");

      await userEvent.click(lesson);

      expect(lessonSelected).toHaveBeenCalledTimes(1);
      expect(lessonSelected).toHaveBeenCalledWith({
        platform: "owa",
        product: "teacher lesson resources",
        engagementIntent: "use",
        componentType: "lesson_card",
        eventVersion: "2.0.0",
        analyticsUseCase: "Teacher",
        lessonName: "Add two surds",
        lessonSlug: "add-two-surds-6wwk0c",
        unitName: "Adding surds",
        unitSlug: "adding-surds-a57d",
        keyStageSlug: "ks4",
        keyStageTitle: "Key Stage 4",
        yearGroupName: "Year 10",
        yearGroupSlug: "year-10",
      });
    });
  });
});
