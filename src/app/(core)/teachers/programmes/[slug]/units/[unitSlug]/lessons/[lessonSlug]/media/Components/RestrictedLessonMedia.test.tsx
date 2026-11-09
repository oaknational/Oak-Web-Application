import { render, screen, waitFor } from "@testing-library/react";
import { SWRConfig } from "swr";
import type { ReactNode } from "react";

import { RestrictedLessonMedia } from "./RestrictedLessonMedia";

import lessonMediaClipsFixtures from "@/node-lib/curriculum-api-2023/fixtures/lessonMediaClips.fixture";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import {
  mockLoadingUser,
  mockLoggedIn,
  mockLoggedOut,
} from "@/__tests__/__helpers__/mockUser";

const mockLessonMedia = jest.fn();
jest.mock("@/components/TeacherViews/LessonMedia/LessonMedia.view", () => ({
  LessonMedia: (props: { lesson: { mediaClips: object } }) => {
    mockLessonMedia(props);
    return (
      <div data-testid="clip-count">
        {Object.keys(props.lesson.mediaClips).length}
      </div>
    );
  },
}));

const mockReportError = jest.fn();
jest.mock("@/common-lib/error-reporter", () => ({
  __esModule: true,
  default:
    () =>
    (...args: unknown[]) =>
      mockReportError(...args),
}));

const fullLesson = lessonMediaClipsFixtures({ loginRequired: true });
const strippedLesson = { ...fullLesson, mediaClips: {} };
const mediaClipsCount = Object.keys(fullLesson.mediaClips).length;

const mockFetch = jest.fn();
const originalFetch = global.fetch;

const renderComponent = () =>
  render(
    <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
      <RestrictedLessonMedia
        lesson={strippedLesson}
        breadcrumbsSlot={null as ReactNode}
      />
    </SWRConfig>,
  );

describe("RestrictedLessonMedia", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setUseUserReturn(mockLoggedIn);
    global.fetch = mockFetch;
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ mediaClips: fullLesson.mediaClips }),
    });
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it.each([
    ["clerk is loading", mockLoadingUser],
    ["the user is signed out", mockLoggedOut],
  ])("does not fetch media clips when %s", (_, user) => {
    setUseUserReturn(user);

    renderComponent();

    expect(mockFetch).not.toHaveBeenCalled();
    expect(screen.getByTestId("clip-count")).toHaveTextContent("0");
  });

  it("fetches and renders media clips when the user is signed in", async () => {
    renderComponent();

    await waitFor(() =>
      expect(screen.getByTestId("clip-count")).toHaveTextContent(
        String(mediaClipsCount),
      ),
    );
    expect(mockFetch).toHaveBeenCalledWith(
      `/api/lesson-media/${fullLesson.programmeSlug}/${fullLesson.unitSlug}/${fullLesson.lessonSlug}`,
    );
  });

  it.each([401, 403])(
    "renders no clips without reporting an error when the route returns %s",
    async (status) => {
      mockFetch.mockResolvedValue({ ok: false, status });

      renderComponent();

      await waitFor(() => expect(mockFetch).toHaveBeenCalled());
      expect(screen.getByTestId("clip-count")).toHaveTextContent("0");
      expect(mockReportError).not.toHaveBeenCalled();
    },
  );

  it("reports an error and renders no clips when the fetch fails", async () => {
    mockFetch.mockResolvedValue({ ok: false, status: 500 });

    renderComponent();

    await waitFor(() => expect(mockReportError).toHaveBeenCalled());
    expect(screen.getByTestId("clip-count")).toHaveTextContent("0");
  });
});
