import { useRouter } from "next/router";
import { within } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";

import { LessonMedia } from "./LessonMedia.view";

import { resolveOakHref } from "@/common-lib/urls";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import lessonMediaClipsFixtures from "@/node-lib/curriculum-api-2023/fixtures/lessonMediaClips.fixture";
import { VideoPlayerProps } from "@/components/SharedComponents/VideoPlayer/VideoPlayer";

const render = renderWithProviders();

const lesson = lessonMediaClipsFixtures();
const mediaClips = lesson.mediaClips;
const firstMediaClip = mediaClips["intro"];

vi.mock("next/router", () => ({
  useRouter: vi.fn(),
}));

window.history.replaceState = vi.fn();

const mockRouter = {
  query: {},
  replace: vi.fn(),
  pathname: "/test-path",
};

const onPlay = vi.fn();

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

vi.mock("@/components/SharedComponents/VideoPlayer/VideoPlayer", () => ({
  default: ({ userEventCallback }: Partial<VideoPlayerProps>) => (
    <VideoPlayerMock userEventCallback={userEventCallback} />
  ),
}));

vi.mock(
  "@/components/TeacherComponents/helpers/lessonMediaHelpers/lessonMedia.helpers",
  async () => ({
    ...(await vi.importActual(
      "@/components/TeacherComponents/helpers/lessonMediaHelpers/lessonMedia.helpers",
    )),
    getInitialCurrentClip: () => firstMediaClip,
  }),
);

describe("LessonMedia view", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

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
    expect(mediaClipListItems.length).toEqual(9);
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
      "/teachers/programmes/physical-education-ks4/units/running-and-jumping/lessons/running-as-a-team/media?video=introduction-physical-exercise-video",
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
      "/teachers/programmes/physical-education-ks4/units/running-and-jumping/lessons/running-as-a-team/media?video=running",
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
      "/teachers/programmes/physical-education-ks4/units/running-and-jumping/lessons/running-as-a-team/media?video=running",
    );
  });
});
