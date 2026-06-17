import { fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";

import "@/__tests__/__helpers__/ResizeObserverMock";
import PupilLessonVideoNewPage, {
  getStaticProps,
} from "@/pages/pupils/lessons/[lessonSlug]/shared/[variant]/video";
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
  "@/components/PupilViews/PupilIntro/useAdditionalFilesDownload",
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
  props: Partial<React.ComponentProps<typeof PupilLessonVideoNewPage>> = {},
) =>
  render(
    <PupilLessonVideoNewPage
      browseData={lessonBrowseDataFixture({})}
      lessonContent={lessonContentFixture({})}
      backUrl={null}
      hasWorksheet={false}
      worksheetInfo={null}
      hasAdditionalFiles={false}
      additionalFiles={null}
      variant={null}
      initialSection="video"
      pageType="canonical"
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

describe("video page", () => {
  it("completes the video and navigates on proceed", () => {
    const { getByTestId } = renderPage();
    fireEvent.click(getByTestId("proceed-to-next-section"));
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

  it("persists a complete video result when proceeding without playing the video", () => {
    const { getByTestId } = renderPage();
    fireEvent.click(getByTestId("proceed-to-next-section"));
    const video = usePupilLessonProgress.getState().sectionResults.video;
    expect(video?.isComplete).toBe(true);
    expect(video?.played).toBe(false);
    expect(video?.duration).toBe(0);
    expect(video?.timeElapsed).toBe(0);
  });

  it("returns notFound from getStaticProps when the variant is invalid", async () => {
    expect(
      await getStaticProps({ params: { variant: "no" } } as never),
    ).toEqual({ notFound: true });
  });

  it("calls getPageProps with a video-bound context", async () => {
    buildPageProps.mockResolvedValue({ props: {} });
    await getStaticProps({
      params: { lessonSlug: "lesson-1", variant: "quizzes-only" },
    } as never);
    expect(getPropsMock).toHaveBeenCalledWith(
      expect.objectContaining({
        context: expect.objectContaining({
          params: expect.objectContaining({ section: "video" }),
        }),
      }),
    );
  });
});
