import { useRouter } from "next/router";
import { within } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

import { LessonMedia } from "./LessonMedia.view";

import { resolveOakHref } from "@/common-lib/urls";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import lessonMediaClipsFixtures from "@/node-lib/curriculum-api-2023/fixtures/lessonMediaClips.fixture";
import { VideoPlayerProps } from "@/components/SharedComponents/VideoPlayer/VideoPlayer";

const render = renderWithProviders();

const lesson = {
  ...lessonMediaClipsFixtures(),
  lessonOutline: [{ lessonOutline: "Sample outline" }],
  actions: [{ action: "Sample action" }],
};
const mediaClips = lesson.mediaClips;
const firstMediaClip = mediaClips ? mediaClips["intro"] : null;

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

window.history.replaceState = jest.fn();

const mockRouter = {
  query: {},
  replace: jest.fn(),
  pathname: "/test-path",
};

const onPlay = jest.fn();

const VideoPlayerMock = ({ userEventCallback }: Partial<VideoPlayerProps>) => {
  if (userEventCallback) {
    userEventCallback({
      event: "end",
      timeElapsed: 100,
      duration: 100,
      muted: false,
    });
  }
  return (
    <div data-testid="mux-player">
      <button data-testid="play-button" onClick={onPlay}>
        Play
      </button>
    </div>
  );
};

jest.mock("@/components/SharedComponents/VideoPlayer/VideoPlayer", () => {
  return ({ userEventCallback }: Partial<VideoPlayerProps>) => (
    <VideoPlayerMock userEventCallback={userEventCallback} />
  );
});

describe("LessonMedia view", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  jest.mock(
    "@/components/TeacherComponents/helpers/lessonMediaHelpers/lessonMedia.helpers",
    () => ({
      __esModule: true,
      default: () => ({
        getInitialCurrentClip: () => firstMediaClip,
      }),
    }),
  );

  it("renders 'Back to lesson' button with correct link", () => {
    const { getByTestId } = render(
      <LessonMedia lesson={lesson} isCanonical={false} />,
    );
    const backToLessonButton = getByTestId("back-to-lesson-button");

    expect(backToLessonButton).toHaveTextContent("Back to lesson");
    expect(backToLessonButton).toHaveAttribute(
      "href",
      resolveOakHref({
        page: "lesson-overview",
        programmeSlug: lesson.programmeSlug,
        lessonSlug: lesson.lessonSlug,
        unitSlug: lesson.unitSlug,
      }),
    );
  });

  it("renders media clip player with correct amount of items", () => {
    const { getByTestId } = render(
      <LessonMedia lesson={lesson} isCanonical={false} />,
    );

    const mediaClipWrapper = getByTestId("media-clip-wrapper");
    const mediaClipList = within(mediaClipWrapper).getByRole("list");
    const mediaClipListItems = within(mediaClipList).getAllByRole("listitem");

    expect(mediaClipList).toBeInTheDocument();
    expect(mediaClipListItems.length).toEqual(3);
  });

  it("calls window.history.replaceState with correct parameters when video is clicked", async () => {
    const { getByTestId } = render(
      <LessonMedia lesson={lesson} isCanonical={false} />,
    );

    const mediaClipWrapper = getByTestId("media-clip-wrapper");
    const mediaClipList = within(mediaClipWrapper).getByRole("list");
    const mediaClipListItems = within(mediaClipList).getAllByRole("listitem");
    const videoItem =
      mediaClipListItems[0] &&
      within(mediaClipListItems[0]).getByRole("button");

    const user = userEvent.setup();
    videoItem && (await user.click(videoItem));

    expect(window.history.replaceState).toHaveBeenCalled();
    expect(window.history.replaceState).toHaveBeenCalledWith(
      null,
      "",
      "/teachers/programmes/physical-education-ks4/units/running-and-jumping/lessons/running-as-a-team/media?video=191189",
    );
  });

  it("calls window.history.replaceState with correct parameters when audio is clicked", async () => {
    const { getByTestId } = render(
      <LessonMedia lesson={lesson} isCanonical={false} />,
    );

    const mediaClipWrapper = getByTestId("media-clip-wrapper");
    const mediaClipList = within(mediaClipWrapper).getByRole("list");
    const mediaClipListItems = within(mediaClipList).getAllByRole("listitem");
    const audioItem =
      mediaClipListItems[1] &&
      within(mediaClipListItems[1]).getByRole("button");

    const user = userEvent.setup();
    audioItem && (await user.click(audioItem));

    expect(window.history.replaceState).toHaveBeenCalled();
    expect(window.history.replaceState).toHaveBeenCalledWith(
      null,
      "",
      "/teachers/programmes/physical-education-ks4/units/running-and-jumping/lessons/running-as-a-team/media?video=191189",
    );
  });

  it("it updates correctly when 'Play' is pressed on the video end video is ended", async () => {
    const { getByTestId } = render(
      <LessonMedia lesson={lesson} isCanonical={false} />,
    );

    const videoPlayerWrapper = getByTestId("video-player-wrapper");
    expect(videoPlayerWrapper).toBeInTheDocument();
    const playButton = within(videoPlayerWrapper).getByText("Play");

    await userEvent.click(playButton);

    expect(onPlay).toHaveBeenCalled();
    expect(window.history.replaceState).toHaveBeenCalledWith(
      null,
      "",
      "/teachers/programmes/physical-education-ks4/units/running-and-jumping/lessons/running-as-a-team/media?video=191189",
    );
  });

  it("renders link to the help article", () => {
    const { getAllByTestId } = render(
      <LessonMedia lesson={lesson} isCanonical={false} />,
    );

    const helpArticleLink = getAllByTestId("help-article-link");
    expect(helpArticleLink[0]).toHaveAttribute(
      "href",
      "https://support.thenational.academy/video-and-audio-clips",
    );
    expect(helpArticleLink[0]).toHaveAttribute(
      "aria-label",
      "Read help article for this page (opens in a new tab)",
    );
  });
});
