import { forwardRef } from "react";
import { useRouter } from "next/router";
import { within } from "@testing-library/dom";
import userEvent from "@testing-library/user-event";

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

const currentErrorEvent = { detail: { data: { type: "networkError" } } };

jest.mock("@mux/mux-player-react/lazy", () => {
  // @ts-expect-error - MuxPlayer mock
  return forwardRef(({ onError, onPlay, onPause }, ref) => {
    ref; // This prevents warning about ref not being used

    return (
      <div data-testid="mux-player">
        <button
          data-testid="error-button"
          onClick={() => {
            onError(currentErrorEvent);
          }}
        >
          Error
        </button>
        <button data-testid="play-button" onClick={onPlay}>
          Play
        </button>
        <button data-testid="pause-button" onClick={onPause}>
          Pause
        </button>
      </div>
    );
  });
});

const localStorageMock = (() => {
  let store = {} as Storage;

  return {
    getItem(key: string) {
      return store[key];
    },

    setItem(key: string, value: string) {
      store[key] = value;
    },

    removeItem(key: string) {
      delete store[key];
    },

    clear() {
      store = {} as Storage;
    },
  };
})();

Object.defineProperty(window, "sessionStorage", {
  value: localStorageMock,
});

describe("LessonMedia view", () => {
  jest.mock(
    "@/components/TeacherComponents/helpers/lessonMediaHelpers/lessonMedia.helpers",
    () => ({
      __esModule: true,
      default: () => ({
        getInitialCurrentClip: () => firstMediaClip,
      }),
    }),
  );

  const mockRouter = {
    query: {},
    replace: jest.fn(),
    pathname: "/test-path",
  };
  beforeEach(() => {
    jest.clearAllMocks();
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

  it("calls router with correct parameters when video is clicked", async () => {
    const { getByTestId } = render(
      <LessonMedia lesson={lesson} isCanonical={false} />,
    );

    const mediaClipWrapper = getByTestId("media-clip-wrapper");
    const mediaClipList = within(mediaClipWrapper).getByRole("list");
    const mediaClipListItems = within(mediaClipList).getAllByRole("listitem");
    const videoItem =
      mediaClipListItems[0] &&
      within(mediaClipListItems[0]).getByRole("button");

    if (videoItem) {
      const user = userEvent.setup();
      await user.click(videoItem);

      expect(mockRouter.replace).toHaveBeenCalledTimes(1);
      expect(mockRouter.replace).toHaveBeenCalledWith(
        {
          pathname: "/test-path",
          query: {
            lessonSlug: "running-as-a-team",
            programmeSlug: "physical-education-ks4",
            unitSlug: "running-and-jumping",
            video: "introduction-physical-exercise-video",
          },
        },
        undefined,
        { shallow: true },
      );
    }
  });

  it("calls router with correct parameters when audio is clicked", async () => {
    const { getByTestId } = render(
      <LessonMedia lesson={lesson} isCanonical={false} />,
    );

    const mediaClipWrapper = getByTestId("media-clip-wrapper");
    const mediaClipList = within(mediaClipWrapper).getByRole("list");
    const mediaClipListItems = within(mediaClipList).getAllByRole("listitem");
    const audioItem =
      mediaClipListItems[1] &&
      within(mediaClipListItems[1]).getByRole("button");

    if (audioItem) {
      const user = userEvent.setup();
      await user.click(audioItem);

      expect(mockRouter.replace).toHaveBeenCalledTimes(1);
      expect(mockRouter.replace).toHaveBeenCalledWith(
        {
          pathname: "/test-path",
          query: {
            lessonSlug: "running-as-a-team",
            programmeSlug: "physical-education-ks4",
            unitSlug: "running-and-jumping",
            video: "running",
          },
        },
        undefined,
        { shallow: true },
      );
    }
  });

  it("adds video slug to session storage when 'play' is pressed on the video", async () => {
    const { getByTestId } = render(
      <LessonMedia lesson={lesson} isCanonical={false} />,
    );

    const videoPlayerWrapper = getByTestId("video-player-wrapper");
    const playButton = within(videoPlayerWrapper).getByText("Play");

    await userEvent.click(playButton);

    expect(sessionStorage.getItem("playedVideosList")).toBe(
      "introduction-physical-exercise-video",
    );
  });
});
