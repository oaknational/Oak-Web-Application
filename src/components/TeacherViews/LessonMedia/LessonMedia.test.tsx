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
const firstMediaClip = mediaClips["intro"] ? mediaClips["intro"][0] : undefined;

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

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
    jest.resetAllMocks();
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

  it("renders media clip player", () => {
    const { getByTestId } = render(
      <LessonMedia lesson={lesson} isCanonical={false} />,
    );

    const mediaClipWrapper = getByTestId("media-clip-wrapper");
    expect(mediaClipWrapper).toBeInTheDocument();
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
    const mediaClipItem =
      mediaClipListItems[0] &&
      within(mediaClipListItems[0]).getByRole("button");

    if (mediaClipItem) {
      const user = userEvent.setup();
      await user.click(mediaClipItem);

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
});
