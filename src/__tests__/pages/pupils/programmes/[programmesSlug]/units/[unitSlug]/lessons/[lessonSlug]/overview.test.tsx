import "@testing-library/jest-dom";
import { fireEvent } from "@testing-library/react";

import PupilLessonOverviewPage, {
  getStaticProps,
} from "@/pages/pupils/programmes/[programmeSlug]/units/[unitSlug]/lessons/[lessonSlug]/overview";
import * as curriculumApi2023 from "@/node-lib/curriculum-api-2023/__mocks__/index";
import OakError from "@/errors/OakError";
import { lessonContentFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonContent.fixture";
import { lessonBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonBrowseData.fixture";
import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";
import { usePupilLessonProgress } from "@/context/PupilLessonProgress";
import { getDefaultLessonProgressState } from "@/context/PupilLessonProgress/pupilLessonProgressHelpers";

jest.mock(
  "@/components/PupilComponents/pupilUtils/requestLessonResources",
  () => ({
    requestLessonResources: jest
      .fn()
      .mockResolvedValue({ transcriptSentences: [], hasWorksheet: false }),
  }),
);

jest.mock("@/components/PupilComponents/pupilUtils/getWorksheetInfo", () => ({
  getWorksheetInfo: jest.fn().mockResolvedValue({}),
}));

const routerPush = jest.fn();
const routerReplace = jest.fn();
const routerBack = jest.fn();
jest.mock("next/router", () => ({
  useRouter: () => ({
    asPath: "/pupils/programmes/ks123/units/u/lessons/lesson-1/overview?utm=x",
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

const renderPage = (overrides: { backUrl?: string | null } = {}) =>
  render(
    <PupilLessonOverviewPage
      browseData={lessonBrowseDataFixture({})}
      lessonContent={lessonContentFixture({})}
      backUrl={"backUrl" in overrides ? (overrides.backUrl ?? null) : "/back"}
      hasWorksheet={false}
      worksheetInfo={null}
      hasAdditionalFiles={false}
      additionalFiles={null}
      variant={null}
      initialSection="overview"
      pageType="browse"
    />,
  );

describe("pages/pupils/programmes/[programmeSlug]/units/[unitSlug]/lessons/[lessonSlug]/overview", () => {
  describe("page component", () => {
    beforeEach(() => {
      routerPush.mockReset();
      routerReplace.mockReset();
      routerBack.mockReset();
      Object.values(analyticsFns).forEach((fn) => fn.mockReset());
      assignmentSearchParams.isClassroomAssignment = false;
      assignmentSearchParams.classroomAssignmentChecked = true;
      usePupilLessonProgress.setState(getDefaultLessonProgressState());
      usePupilLessonProgress.getState().initialiseLessonProgress({
        lessonSlug: "lesson-1",
        lessonReviewSections: ["intro", "starter-quiz", "video", "exit-quiz"],
      });
    });

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
  });

  describe("getStaticProps", () => {
    it("Should call API:pupilLessonQuery", async () => {
      await getStaticProps({
        params: {
          programmeSlug: "ks123",
          unitSlug: "unitSlug",
          lessonSlug: "lessonSlug",
          section: "overview",
        },
      });

      expect(curriculumApi2023.default.pupilLessonQuery).toHaveBeenCalledWith({
        programmeSlug: "ks123",
        unitSlug: "unitSlug",
        lessonSlug: "lessonSlug",
      });
    });
    it("should return redirect if lesson not found", async () => {
      (
        curriculumApi2023.default.pupilLessonQuery as jest.Mock
      ).mockRejectedValueOnce(
        new OakError({ code: "curriculum-api/not-found" }),
      );
      const res = await getStaticProps({
        params: {
          programmeSlug: "ks123",
          unitSlug: "unitSlug",
          lessonSlug: "lessonSlug",
          section: "overview",
        },
      });

      expect(res).toEqual({
        redirect: {
          destination: "/pupils/lessons/lessonSlug-redirected?redirected=true",
          statusCode: 301, // true = 308, false = 307
          basePath: false,
        },
      });
    });
    it("should return canonical redirect if lesson not found", async () => {
      (
        curriculumApi2023.default.pupilLessonQuery as jest.Mock
      ).mockResolvedValueOnce(null);

      const res = await getStaticProps({
        params: {
          programmeSlug: "ks123",
          unitSlug: "unitSlug",
          lessonSlug: "lessonSlug",
          section: "overview",
        },
      });
      expect(res).toEqual({
        redirect: {
          destination: "/pupils/lessons/lessonSlug-redirected?redirected=true",
          statusCode: 301,
          basePath: false,
        },
      });
    });
    it("should return 404 if lesson not found and redirect not found", async () => {
      (
        curriculumApi2023.default.pupilLessonQuery as jest.Mock
      ).mockRejectedValueOnce(
        new OakError({ code: "curriculum-api/not-found" }),
      );
      (
        curriculumApi2023.default.pupilBrowseLessonRedirectQuery as jest.Mock
      ).mockRejectedValueOnce(
        new OakError({ code: "curriculum-api/not-found" }),
      );
      const res = await getStaticProps({
        params: {
          programmeSlug: "ks123",
          unitSlug: "unitSlug",
          lessonSlug: "lessonSlug",
          section: "overview",
        },
      });

      expect(res).toEqual({
        notFound: true,
      });
    });
    it("should return 404 if lesson not found and redirect not found", async () => {
      (
        curriculumApi2023.default.pupilLessonQuery as jest.Mock
      ).mockResolvedValueOnce(null);
      (
        curriculumApi2023.default.pupilBrowseLessonRedirectQuery as jest.Mock
      ).mockRejectedValueOnce(
        new OakError({ code: "curriculum-api/not-found" }),
      );
      const res = await getStaticProps({
        params: {
          programmeSlug: "ks123",
          unitSlug: "unitSlug",
          lessonSlug: "lessonSlug",
          section: "overview",
        },
      });

      expect(res).toEqual({
        notFound: true,
      });
    });
  });
});
