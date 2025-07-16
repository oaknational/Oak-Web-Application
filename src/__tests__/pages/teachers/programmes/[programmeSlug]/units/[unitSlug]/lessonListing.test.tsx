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
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import { mockLoggedIn } from "@/__tests__/__helpers__/mockUser";
import curriculumApi2023, {
  CurriculumApi,
} from "@/node-lib/curriculum-api-2023";
import OakError from "@/errors/OakError";

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
      teacherShareInitiated: () => jest.fn(),
      contentSaved: () => jest.fn(),
      contentUnsaved: () => jest.fn(),
    },
  }),
}));

// mock save functionality
window.global.fetch = jest.fn().mockResolvedValue({ ok: true });

jest.mock("posthog-js/react", () => ({
  useFeatureFlagEnabled: jest.fn().mockReturnValue(true),
}));

jest.mock("@/node-lib/educator-api/helpers/saveUnits/useSaveUnits", () => {
  return {
    useSaveUnits: () => ({
      onSaveToggle: jest.fn(),
      isUnitSaved: jest.fn().mockResolvedValue(true),
      showSignIn: false,
      setShowSignIn: jest.fn(),
      isUnitSaving: jest.fn().mockResolvedValue(false),
    }),
  };
});

jest.mock("@/hooks/useMediaQuery.tsx", () => ({
  __esModule: true,
  default: () => ({
    isMobile: false,
  }),
}));

describe("Lesson listing page", () => {
  beforeEach(() => {
    setUseUserReturn(mockLoggedIn);
  });
  test("it renders the unit title as page title", () => {
    const { getByRole } = render(
      <LessonListPage curriculumData={lessonListingFixture()} />,
    );

    const pageHeading = getByRole("heading", { level: 1 });

    expect(global.fetch).toHaveBeenCalledWith(
      "https://mockdownloads.com/api/unit/adding-surds-1/check-files",
    );
    expect(pageHeading).toBeInTheDocument();
  });

  test("it renders the correct number of lessons", () => {
    const { getByText } = render(
      <LessonListPage curriculumData={lessonListingFixture()} />,
    );
    const lessonCountFixtures = lessonListingFixture().lessons.length;
    const lessonCount = getByText(`Lessons (${lessonCountFixtures})`);

    expect(global.fetch).toHaveBeenCalledWith(
      "https://mockdownloads.com/api/unit/adding-surds-1/check-files",
    );
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

  test("it renders the correct text for the save button when signed in", async () => {
    setUseUserReturn(mockLoggedIn);

    render(<LessonListPage curriculumData={lessonListingFixture({})} />);
    const saveButton = screen.getByTestId("save-unit-button");
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).toHaveTextContent("Saved");
  });
  it("does not show the save button for legacy units", () => {
    setUseUserReturn(mockLoggedIn);
    render(
      <LessonListPage
        curriculumData={lessonListingFixture({
          programmeSlug: "maths-secondary-ks4-l",
        })}
      />,
    );
    const saveButton = screen.queryByTestId("save-unit-button");
    expect(saveButton).not.toBeInTheDocument();
  });
  it("sets an error for an invalid email address on incomplete units signup", async () => {
    render(
      <LessonListPage
        curriculumData={lessonListingFixture({
          lessons: lessonsWithUnpublishedContent,
        })}
      />,
    );

    const emailInput = screen.getByPlaceholderText("Enter email address");
    const user = userEvent.setup();
    user.type(emailInput, "invalid-email");
    const signupButton = screen.getByText("Sign up");
    await userEvent.click(signupButton);
    const errorMessage = await screen.findByText(
      "Please enter a valid email address",
    );
    expect(errorMessage).toBeInTheDocument();
  });
});

describe("SEO", () => {
  it("renders the correct SEO details", async () => {
    const { seo } = renderWithSeo()(
      <LessonListPage curriculumData={lessonListingFixture()} />,
    );
    expect(global.fetch).toHaveBeenCalledWith(
      "https://mockdownloads.com/api/unit/adding-surds-1/check-files",
    );
    expect(seo).toEqual({
      ...mockSeoResult,
      ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
      title:
        "Adding surds KS4 | Y10 Maths Lesson Resources | NEXT_PUBLIC_SEO_APP_NAME",
      description: "Free lessons and teaching resources about adding surds",
      ogTitle:
        "Adding surds KS4 | Y10 Maths Lesson Resources | NEXT_PUBLIC_SEO_APP_NAME",
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
    expect(global.fetch).toHaveBeenCalledWith(
      "https://mockdownloads.com/api/unit/adding-surds-1/check-files",
    );
    expect(seo).toEqual({
      ...mockSeoResult,
      ogSiteName: "NEXT_PUBLIC_SEO_APP_NAME",
      title:
        "Adding surds KS4 | Y10 Maths Lesson Resources | Page 1 of 3 | NEXT_PUBLIC_SEO_APP_NAME",
      description: "Free lessons and teaching resources about adding surds",
      ogTitle:
        "Adding surds KS4 | Y10 Maths Lesson Resources | Page 1 of 3 | NEXT_PUBLIC_SEO_APP_NAME",
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
  it("should return redirect when a landing page is missing", async () => {
    if (!curriculumApi2023.browseUnitRedirectQuery) {
      (curriculumApi2023 as CurriculumApi).browseUnitRedirectQuery = jest.fn();
    }

    (curriculumApi.lessonListing as jest.Mock).mockResolvedValueOnce(undefined);
    (
      curriculumApi2023.browseUnitRedirectQuery as jest.Mock
    ).mockResolvedValueOnce({
      browseUnitRedirectData: {
        incomingPath: "lessons/old-lesson-slug",
        outgoingPath: "lessons/new-lesson-slug",
      },
    });

    const context = {
      params: {
        programmeSlug: "maths-secondary-ks4-higher-l",
        unitSlug: "adding-surds-a57d",
      },
    };
    const response = await getStaticProps(context);
    expect(response).toEqual({
      redirect: {
        basePath: false,
        destination: "/teachers/lessons/new-lesson-slug/lessons",
        permanent: true,
      },
    });
  });
  it("should return notFound when no lessons are found and no redirect", async () => {
    if (!curriculumApi2023.browseUnitRedirectQuery) {
      (curriculumApi2023 as CurriculumApi).browseUnitRedirectQuery = jest.fn();
    }

    (curriculumApi.lessonListing as jest.Mock).mockResolvedValueOnce(undefined);
    (
      curriculumApi2023.browseUnitRedirectQuery as jest.Mock
    ).mockRejectedValueOnce(new OakError({ code: "curriculum-api/not-found" }));

    const context = {
      params: {
        programmeSlug: "maths-secondary-ks4-higher-l",
        unitSlug: "adding-surds-a57d",
      },
    };
    const response = await getStaticProps(context);
    expect(response).toEqual({ notFound: true });
  });
  it("should throw error when params are missing", async () => {
    const context = {
      params: {
        programmeSlug: "maths-secondary-ks4-higher-l",
      },
    };
    await expect(
      getStaticProps(context as GetStaticPropsContext<URLParams, PreviewData>),
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

    expect(global.fetch).toHaveBeenCalledWith(
      "https://mockdownloads.com/api/unit/adding-surds-1/check-files",
    );
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
      tierName: null,
      examBoard: null,
      lessonReleaseCohort: "2023-2026",
      lessonReleaseDate: "2025-09-29T14:00:00.000Z",
      pathway: null,
    });
  });
});
