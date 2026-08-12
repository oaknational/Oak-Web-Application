import "@testing-library/jest-dom";
import { fireEvent, waitFor } from "@testing-library/react";

import PupilLessonReviewPage, {
  getStaticProps,
} from "@/pages/pupils/programmes/[programmeSlug]/units/[unitSlug]/lessons/[lessonSlug]/review";
import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";
import { lessonBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonBrowseData.fixture";
import { lessonContentFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonContent.fixture";
import { usePupilLessonProgress } from "@/context/PupilLessonProgress";
import { getDefaultLessonProgressState } from "@/context/PupilLessonProgress/pupilLessonProgressHelpers";

const routerPush = jest.fn();
jest.mock("next/router", () => ({
  useRouter: () => ({ asPath: "/review", push: routerPush }),
}));

jest.mock("@/hooks/useAssignmentSearchParams", () => ({
  useAssignmentSearchParams: () => ({
    isClassroomAssignment: false,
    classroomAssignmentChecked: true,
  }),
}));

const logAttempt = jest.fn();
jest.mock("@/hooks/useOakPupil", () => ({
  useOakPupil: () => ({ logAttempt }),
}));

const track = {
  trackLessonSummaryReviewed: jest.fn(),
  trackActivityResultsShared: jest.fn(),
};
jest.mock("@/context/PupilLessonAnalytics/usePupilLessonAnalytics", () => ({
  usePupilLessonAnalytics: () => track,
}));

const getPropsMock = jest.fn();
const buildPageProps = jest.fn();
jest.mock("@/pages-helpers/pupil/lessons-pages/getProps", () => ({
  getProps: (...args: unknown[]) => getPropsMock(...args),
}));
jest.mock("@/node-lib/getPageProps", () => ({
  __esModule: true,
  default: (args: unknown) => buildPageProps(args),
}));

jest.mock("@/components/PupilComponents/PupilLayout/PupilLayout", () => ({
  PupilLayout: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

const writeText = jest.fn();
Object.defineProperty(globalThis.navigator, "clipboard", {
  configurable: true,
  value: { writeText },
});

const render = renderWithProvidersByName(["oakTheme"]);

const renderPage = () =>
  render(
    <PupilLessonReviewPage
      browseData={lessonBrowseDataFixture({})}
      lessonContent={lessonContentFixture({ starterQuiz: [], exitQuiz: [] })}
      backUrl="/back"
      hasWorksheet={false}
      worksheetInfo={null}
      hasAdditionalFiles={false}
      additionalFiles={null}
      variant={null}
      initialSection="review"
      pageType="browse"
    />,
  );

const completeAllSections = () => {
  usePupilLessonProgress.setState({
    sectionResults: {
      intro: { isComplete: true },
      "starter-quiz": {
        isComplete: true,
        grade: 1,
        numQuestions: 1,
        questionResults: [{ mode: "feedback", grade: 1, offerHint: false }],
      },
      "exit-quiz": {
        isComplete: true,
        grade: 0,
        numQuestions: 1,
        questionResults: [{ mode: "feedback", grade: 0, offerHint: true }],
      },
    },
    isLessonComplete: true,
  });
};

beforeEach(() => {
  jest.clearAllMocks();
  usePupilLessonProgress.setState(getDefaultLessonProgressState());
  usePupilLessonProgress.getState().initialiseLessonProgress({
    lessonSlug: "lesson-1",
    lessonReviewSections: ["intro", "starter-quiz", "exit-quiz"],
  });
});

describe("pages/pupils/programmes/[programmeSlug]/units/[unitSlug]/lessons/[lessonSlug]/review", () => {
  it("stores the attempt and tracks the summary on render when the lesson is complete", () => {
    completeAllSections();
    logAttempt.mockReturnValue("attempt-1");
    renderPage();
    expect(logAttempt).toHaveBeenCalledWith(expect.anything(), true);
    expect(track.trackLessonSummaryReviewed).toHaveBeenCalledTimes(1);
  });

  it("redirects to the overview when the lesson is not yet complete", () => {
    renderPage();
    expect(routerPush.mock.calls[0]?.[0]).toContain("overview");
  });

  it("copies the share link and tracks results sharing", async () => {
    completeAllSections();
    logAttempt.mockReturnValueOnce("attempt-1");
    logAttempt.mockReturnValueOnce("share-id");
    const { getByText } = renderPage();
    fireEvent.click(getByText("Copy link"));
    await waitFor(() => expect(writeText).toHaveBeenCalledTimes(1));
    expect(track.trackActivityResultsShared).toHaveBeenCalledTimes(1);
  });

  describe("getStaticProps", () => {
    it("binds the review section and delegates to getProps as browse", async () => {
      buildPageProps.mockResolvedValue({ props: {} });
      await getStaticProps({
        params: { lessonSlug: "lesson-1" },
      } as never);
      expect(getPropsMock).toHaveBeenCalledWith({
        page: "browse",
        context: expect.objectContaining({
          params: expect.objectContaining({
            lessonSlug: "lesson-1",
            section: "review",
          }),
        }),
      });
      expect(buildPageProps).toHaveBeenCalledWith(
        expect.objectContaining({
          page: "pupils-lesson-browse-review::getStaticProps",
        }),
      );
    });

    it("falls back to undefined params when context.params is missing", async () => {
      buildPageProps.mockResolvedValue({ props: {} });
      await getStaticProps({} as never);
      expect(getPropsMock).toHaveBeenCalledWith(
        expect.objectContaining({
          context: expect.objectContaining({ params: undefined }),
        }),
      );
    });
  });
});
