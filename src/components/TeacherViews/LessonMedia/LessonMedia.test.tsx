import { forwardRef } from "react";
import { useRouter } from "next/router";
import { within } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";
import { waitFor } from "@testing-library/react";

import { LessonMedia } from "./LessonMedia.view";

import { resolveOakHref } from "@/common-lib/urls";
import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import lessonMediaClipsFixtures from "@/node-lib/curriculum-api-2023/fixtures/lessonMediaClips.fixture";

const render = renderWithProviders();

const lesson = lessonMediaClipsFixtures();
const mediaClips = lesson.mediaClips;
const firstMediaClip = mediaClips["intro"][0];

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

window.history.replaceState = jest.fn();

jest.mock("@mux/mux-player-react/lazy", () => {
  // @ts-expect-error - MuxPlayer mock
  return forwardRef(({ onPlay, userEventCallback }, ref) => {
    ref; // This prevents warning about ref not being used
    if (onPlay) {
      userEventCallback({
        event: "play",
        timeElapsed: 20,
        duration: 20,
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
  });
});

const mockRouter = {
  query: {},
  replace: jest.fn(),
  pathname: "/test-path",
};

describe("LessonMedia view", () => {
  beforeEach(() => {
    jest.clearAllMocks();
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

    waitFor(() => {
      expect(window.history.replaceState).toHaveBeenCalledTimes(1);
      expect(window.history.replaceState).toHaveBeenCalledWith(
        null,
        "",
        "/teachers/programmes/physical-education-ks4/units/running-and-jumping/lessons/running-as-a-team/media?video=introduction-physical-exercise-video",
      );
    });
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

    waitFor(() => {
      expect(window.history.replaceState).toHaveBeenCalledTimes(1);
      expect(window.history.replaceState).toHaveBeenCalledWith(
        null,
        "",
        "/teachers/programmes/physical-education-ks4/units/running-and-jumping/lessons/running-as-a-team/media?video=running",
      );
    });
  });

  // it("it updates correctly when 'Play' is pressed on the video", async () => {
  //   const { getByTestId } = render(
  //     <LessonMedia lesson={lesson} isCanonical={false} />,
  //   );

  //   const videoPlayerWrapper = getByTestId("mux-player");
  //   expect(videoPlayerWrapper).toBeInTheDocument();
  //   const playButton = within(videoPlayerWrapper).getByText("Play");

  //   await userEvent.click(playButton);

  //   expect(window.history.replaceState).toHaveBeenCalledTimes(1);
  // });
});
