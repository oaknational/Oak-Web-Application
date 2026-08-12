import { act, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import "@/__tests__/__helpers__/ResizeObserverMock";
import PupilLessonVideoPage, {
  getStaticProps,
} from "@/pages/pupils/programmes/[programmeSlug]/units/[unitSlug]/lessons/[lessonSlug]/video";
import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";
import { lessonBrowseDataFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonBrowseData.fixture";
import { lessonContentFixture } from "@/node-lib/curriculum-api-2023/fixtures/lessonContent.fixture";
import { usePupilLessonProgress } from "@/context/PupilLessonProgress";
import { getDefaultLessonProgressState } from "@/context/PupilLessonProgress/pupilLessonProgressHelpers";

const routerPush = jest.fn();
jest.mock("next/router", () => ({
  useRouter: () => ({ asPath: "/video", push: routerPush }),
}));

const track = {
  trackSectionStarted: jest.fn(),
  trackLessonStarted: jest.fn(),
  trackLessonCompleted: jest.fn(),
  trackVideoCompleted: jest.fn(),
  trackVideoAbandoned: jest.fn(),
};
jest.mock("@/context/PupilLessonAnalytics/usePupilLessonAnalytics", () => ({
  usePupilLessonAnalytics: () => track,
}));

jest.mock(
  "@/components/PupilComponents/Views/ViewHelpers/Intro/useAdditionalFilesDownload",
  () => ({
    useAdditionalFilesDownload: () => ({
      startAdditionalFilesDownload: jest.fn(),
      isAdditionalFilesDownloading: false,
    }),
  }),
);

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

jest.mock("@/components/SharedComponents/VideoPlayer/VideoPlayer", () => ({
  __esModule: true,
  default: (props: {
    userEventCallback: (args: {
      event: string;
      timeElapsed: number;
      duration: number;
      muted: boolean;
    }) => void;
  }) => (
    <button
      data-testid="emit-video-event"
      onClick={() =>
        props.userEventCallback({
          event: "play",
          timeElapsed: 30,
          duration: 60,
          muted: false,
        })
      }
    />
  ),
}));

const render = renderWithProvidersByName(["oakTheme"]);

const renderPage = (
  props: Partial<React.ComponentProps<typeof PupilLessonVideoPage>> = {},
) =>
  render(
    <PupilLessonVideoPage
      browseData={lessonBrowseDataFixture({})}
      lessonContent={lessonContentFixture({})}
      backUrl={null}
      hasWorksheet={false}
      worksheetInfo={null}
      hasAdditionalFiles={false}
      additionalFiles={null}
      variant={null}
      initialSection="video"
      pageType="browse"
      {...props}
    />,
  );

beforeEach(() => {
  jest.clearAllMocks();
  usePupilLessonProgress.setState(getDefaultLessonProgressState());
  usePupilLessonProgress.getState().initialiseLessonProgress({
    lessonSlug: "lesson-1",
    lessonReviewSections: ["intro", "starter-quiz", "video", "exit-quiz"],
  });
});

describe("pages/pupils/programmes/[programmeSlug]/units/[unitSlug]/lessons/[lessonSlug]/video", () => {
  it("completes the video and navigates on proceed", async () => {
    const { getByTestId } = renderPage();
    await act(async () => {
      fireEvent.click(getByTestId("proceed-to-next-section"));
    });
    expect(track.trackVideoCompleted).toHaveBeenCalledTimes(1);
    expect(
      usePupilLessonProgress.getState().sectionResults.video?.isComplete,
    ).toBe(true);
    expect(routerPush).toHaveBeenCalledTimes(1);
  });

  it("tracks video abandoned when the back link is clicked", () => {
    const { getByLabelText } = renderPage();
    fireEvent.click(getByLabelText("Back to overview"));
    expect(track.trackVideoAbandoned).toHaveBeenCalledTimes(1);
  });

  it("persists video state from the player event callback", () => {
    const { getByTestId } = renderPage();
    fireEvent.click(getByTestId("emit-video-event"));
    const video = usePupilLessonProgress.getState().sectionResults.video;
    expect(video?.played).toBe(true);
    expect(video?.duration).toBe(60);
  });

  it("persists a complete video result when proceeding without playing the video", async () => {
    const { getByTestId } = renderPage();
    await act(async () => {
      fireEvent.click(getByTestId("proceed-to-next-section"));
    });
    const video = usePupilLessonProgress.getState().sectionResults.video;
    expect(video?.isComplete).toBe(true);
    expect(video?.played).toBe(false);
    expect(video?.duration).toBe(0);
    expect(video?.timeElapsed).toBe(0);
  });

  describe("getStaticProps", () => {
    it("binds the video section and delegates to getProps as browse", async () => {
      buildPageProps.mockResolvedValue({ props: {} });
      await getStaticProps({
        params: { lessonSlug: "lesson-1" },
      } as never);
      expect(getPropsMock).toHaveBeenCalledWith({
        page: "browse",
        context: expect.objectContaining({
          params: expect.objectContaining({
            lessonSlug: "lesson-1",
            section: "video",
          }),
        }),
      });
      expect(buildPageProps).toHaveBeenCalledWith(
        expect.objectContaining({
          page: "pupils-lesson-browse-video::getStaticProps",
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
