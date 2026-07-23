import "@testing-library/jest-dom";
import { fireEvent } from "@testing-library/react";

import PupilLessonOverviewNewPage, {
  getStaticProps,
} from "@/pages/pupils/lessons/[lessonSlug]/shared/[variant]/overview";
import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";
import { lessonBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonBrowseData.fixture";
import { lessonContentFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonContent.fixture";
import { usePupilLessonProgress } from "@/context/PupilLessonProgress";
import { getDefaultLessonProgressState } from "@/context/PupilLessonProgress/pupilLessonProgressHelpers";

const routerPush = jest.fn();
const routerReplace = jest.fn();
const routerBack = jest.fn();
jest.mock("next/router", () => ({
  useRouter: () => ({
    asPath: "/pupils/lessons/lesson-1/shared/abc/overview?utm=x",
    push: routerPush,
    replace: routerReplace,
    back: routerBack,
  }),
}));

const assignmentSearchParams = {
  isClassroomAssignment: false as boolean,
  classroomAssignmentChecked: true,
};
jest.mock("@/hooks/useAssignmentSearchParams", () => ({
  useAssignmentSearchParams: () => assignmentSearchParams,
}));

const analyticsFns = {
  trackSectionStarted: jest.fn(),
  trackLessonStarted: jest.fn(),
  trackLessonAbandoned: jest.fn(),
  trackContentGuidanceAccepted: jest.fn(),
  trackContentGuidanceDeclined: jest.fn(),
};
jest.mock("@/context/PupilLessonAnalytics/usePupilLessonAnalytics", () => ({
  usePupilLessonAnalytics: () => analyticsFns,
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
  PupilLayout: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="pupil-layout">{children}</div>
  ),
}));

jest.mock(
  "@/components/PupilComponents/Views/PupilLessonOverview/PupilLessonOverviewContentGuidanceModal/PupilLessonOverviewContentGuidanceModal",
  () => ({
    PupilLessonOverviewContentGuidanceModal: (props: {
      onAccept: (args: unknown) => void;
      onDecline: (args: unknown) => void;
    }) => (
      <div>
        <button
          data-testid="cg-accept"
          onClick={() => props.onAccept({ contentGuidanceLabel: "violence" })}
        />
        <button
          data-testid="cg-decline"
          onClick={() => props.onDecline({ contentGuidanceLabel: "violence" })}
        />
      </div>
    ),
  }),
);

jest.mock(
  "@/components/PupilComponents/PupilRedirectedOverlay/PupilRedirectedOverlay",
  () => ({
    PupilRedirectedOverlay: (props: {
      onLoaded: (isShowing: boolean) => void;
      onClose: () => void;
    }) => (
      <div>
        <button
          data-testid="overlay-loaded"
          onClick={() => props.onLoaded(false)}
        />
        <button data-testid="overlay-close" onClick={() => props.onClose()} />
      </div>
    ),
  }),
);

const render = renderWithProvidersByName(["oakTheme"]);

const renderPage = (
  overrides: {
    backUrl?: string | null;
    variant?: React.ComponentProps<
      typeof PupilLessonOverviewNewPage
    >["variant"];
  } = {},
) =>
  render(
    <PupilLessonOverviewNewPage
      browseData={lessonBrowseDataFixture({})}
      lessonContent={lessonContentFixture({})}
      backUrl={"backUrl" in overrides ? (overrides.backUrl ?? null) : "/back"}
      hasWorksheet={false}
      worksheetInfo={null}
      hasAdditionalFiles={false}
      additionalFiles={null}
      variant={overrides.variant ?? null}
      initialSection="overview"
      pageType="canonical"
    />,
  );

beforeEach(() => {
  routerPush.mockReset();
  routerReplace.mockReset();
  routerBack.mockReset();
  Object.values(analyticsFns).forEach((fn) => fn.mockReset());
  getPropsMock.mockReset();
  buildPageProps.mockReset();
  assignmentSearchParams.isClassroomAssignment = false;
  assignmentSearchParams.classroomAssignmentChecked = true;
  usePupilLessonProgress.setState(getDefaultLessonProgressState());
  usePupilLessonProgress.getState().initialiseLessonProgress({
    lessonSlug: "lesson-1",
    lessonReviewSections: ["intro", "starter-quiz", "video", "exit-quiz"],
  });
});

describe("pages/pupils/lessons/[lessonSlug]/shared/[variant]/overview", () => {
  describe("page component", () => {
    it("renders the overview view inside the PupilLayout", () => {
      const { getByTestId } = renderPage();
      expect(getByTestId("pupil-layout")).toBeInTheDocument();
      expect(getByTestId("proceed-to-next-section")).toBeInTheDocument();
    });

    it("hides the back button when the lesson is opened from Google Classroom", () => {
      assignmentSearchParams.isClassroomAssignment = true;
      const { queryByText } = renderPage();
      expect(queryByText("View all lessons")).not.toBeInTheDocument();
    });

    it("starts the lesson and navigates on proceed", () => {
      const { getByTestId } = renderPage();
      fireEvent.click(getByTestId("proceed-to-next-section"));
      expect(analyticsFns.trackLessonStarted).toHaveBeenCalledTimes(1);
      expect(analyticsFns.trackSectionStarted).toHaveBeenCalled();
      expect(usePupilLessonProgress.getState().lessonStarted).toBe(true);
      expect(routerPush).toHaveBeenCalledTimes(1);
    });

    it("does not double-track lesson start when already started", () => {
      usePupilLessonProgress.setState({ lessonStarted: true });
      const { getByTestId } = renderPage();
      fireEvent.click(getByTestId("proceed-to-next-section"));
      expect(analyticsFns.trackLessonStarted).not.toHaveBeenCalled();
    });

    it("tracks the lesson as abandoned when leaving an incomplete lesson", () => {
      const { getByText } = renderPage();
      fireEvent.click(getByText("View all lessons"));
      expect(analyticsFns.trackLessonAbandoned).toHaveBeenCalledTimes(1);
    });

    it("does not track lesson abandoned when leaving an already complete lesson", () => {
      usePupilLessonProgress.setState({ isLessonComplete: true });
      const { getByText } = renderPage();
      fireEvent.click(getByText("View all lessons"));
      expect(analyticsFns.trackLessonAbandoned).not.toHaveBeenCalled();
    });

    it("tracks section starts when clicking a section in the sections nav", () => {
      const { getByTestId } = renderPage();
      fireEvent.click(getByTestId("intro"));
      expect(analyticsFns.trackLessonStarted).toHaveBeenCalledTimes(1);
      expect(analyticsFns.trackSectionStarted).toHaveBeenCalled();
    });

    it("dismisses content guidance and tracks accept", () => {
      const { getByTestId } = renderPage();
      fireEvent.click(getByTestId("cg-accept"));
      expect(usePupilLessonProgress.getState().contentGuidanceDismissed).toBe(
        true,
      );
      expect(analyticsFns.trackContentGuidanceAccepted).toHaveBeenCalled();
    });

    it("posts a closeIframe message when declining inside Google Classroom", () => {
      assignmentSearchParams.isClassroomAssignment = true;
      const postMessage = jest.fn();
      const parentSpy = jest
        .spyOn(globalThis.window, "parent", "get")
        .mockReturnValue({ postMessage } as never);

      const { getByTestId } = renderPage();
      fireEvent.click(getByTestId("cg-decline"));

      expect(analyticsFns.trackContentGuidanceDeclined).toHaveBeenCalled();
      expect(postMessage).toHaveBeenCalledWith(
        { type: "Classroom", action: "closeIframe" },
        "https://classroom.google.com",
      );
      parentSpy.mockRestore();
    });

    it("uses router.replace when declining and a backUrl is available", () => {
      const { getByTestId } = renderPage({ backUrl: "/somewhere-back" });
      fireEvent.click(getByTestId("cg-decline"));
      expect(routerReplace).toHaveBeenCalledWith("/somewhere-back");
    });

    it("falls back to router.back when declining without a backUrl", () => {
      const { getByTestId } = renderPage({ backUrl: null });
      fireEvent.click(getByTestId("cg-decline"));
      expect(routerBack).toHaveBeenCalledTimes(1);
    });

    it("renders without throwing when redirect overlay callbacks fire", () => {
      const { getByTestId } = renderPage();
      fireEvent.click(getByTestId("overlay-loaded"));
      fireEvent.click(getByTestId("overlay-close"));
      expect(getByTestId("proceed-to-next-section")).toBeInTheDocument();
    });

    it("shows the shared activities banner for a partial lesson variant", () => {
      const { getAllByText } = renderPage({
        variant: {
          sections: ["overview", "intro", "starter-quiz"],
          reviewSections: ["intro", "starter-quiz"],
        },
      });

      expect(
        getAllByText(
          "You can only click on the activities your teacher has shared with you today.",
        ).length,
      ).toBeGreaterThan(0);
    });

    it("does not show the shared activities banner for a full lesson variant", () => {
      const { queryByText } = renderPage({
        variant: {
          sections: ["overview", "intro", "starter-quiz", "video", "exit-quiz"],
          reviewSections: ["intro", "starter-quiz", "video", "exit-quiz"],
          hideYearGroup: true,
        },
      });

      expect(
        queryByText(
          "You can only click on the activities your teacher has shared with you today.",
        ),
      ).not.toBeInTheDocument();
    });
  });

  describe("getStaticProps", () => {
    it("returns notFound when the variant is invalid", async () => {
      const res = await getStaticProps({
        params: { lessonSlug: "lesson-1", variant: "no-variant" },
      } as never);
      expect(res).toEqual({ notFound: true });
    });

    it("delegates to getPageProps with an overview-bound context", async () => {
      buildPageProps.mockResolvedValue({ props: { ok: true } });
      getPropsMock.mockReturnValue("getProps-result");

      const result = await getStaticProps({
        params: { lessonSlug: "lesson-1", variant: "quizzes-only" },
      } as never);

      expect(getPropsMock).toHaveBeenCalledWith({
        page: "canonical",
        context: expect.objectContaining({
          params: expect.objectContaining({ section: "overview" }),
        }),
      });
      expect(result).toEqual({ props: { ok: true } });
    });

    it("passes undefined params when context.params is missing", async () => {
      buildPageProps.mockResolvedValue({ props: {} });
      getPropsMock.mockReturnValue("getProps-result");
      await getStaticProps({ params: { variant: "quizzes-only" } } as never);
      expect(getPropsMock).toHaveBeenCalled();
    });
  });
});
