import { screen } from "@testing-library/dom";
import { act } from "@testing-library/react";

import LessonHeader, { LessonHeaderProps } from "./LessonHeader";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { resolveOakHref } from "@/common-lib/urls";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import {
  mockGeorestrictedUser,
  mockLoggedIn,
} from "@/__tests__/__helpers__/mockUser";
import { TeacherBrowseAnalyticsStoreProvider } from "@/context/TeacherBrowseAnalytics/TeacherBrowseAnalyticsProvider";
import { getProgrammeStateForLesson } from "@/context/TeacherBrowseAnalytics/utils/getProgrammeState";
import teachersLessonOverviewFixture from "@/node-lib/curriculum-api-2023/fixtures/teachersLessonOverview.fixture";

const lessonResourceDownloadStarted = jest.fn();
jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    getSessionId: jest.fn(),
    track: {
      lessonResourceDownloadStarted: (...args: unknown[]) =>
        lessonResourceDownloadStarted(...args),
    },
  }),
}));

const render = renderWithTheme;

const baseProps = teachersLessonOverviewFixture();
const programmeState = getProgrammeStateForLesson(baseProps);

const defaultProps: LessonHeaderProps = {
  heading: "Lesson title",
  heroImage: "imageSrc",
  currentLessonSlug: "lesson-2",
  programmeSlug: "programme-1",
  unitSlug: "unit-1",
  prevLesson: {
    lessonIndex: 1,
    lessonSlug: "lesson-1",
    lessonTitle: "Lesson 1",
  },
  nextLesson: {
    lessonIndex: 3,
    lessonSlug: "lesson-3",
    lessonTitle: "Lesson 3",
  },
  loginRequired: false,
  georestricted: false,
};

const renderLessonHeader = (props?: Partial<LessonHeaderProps>) => {
  return render(
    <TeacherBrowseAnalyticsStoreProvider
      programmeState={{
        programmeState,
      }}
    >
      <LessonHeader {...defaultProps} {...props} />
    </TeacherBrowseAnalyticsStoreProvider>,
  );
};

describe("LessonHeader", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders prev and next lesson buttons", () => {
    renderLessonHeader();

    const prevLessonLink = screen.getByRole("link", {
      name: "Previous lesson",
    });
    expect(prevLessonLink).toBeInTheDocument();
    expect(prevLessonLink).toHaveAttribute(
      "href",
      resolveOakHref({
        page: "lesson-overview",
        lessonSlug: "lesson-1",
        unitSlug: defaultProps.unitSlug,
        programmeSlug: defaultProps.programmeSlug,
      }),
    );

    const nextLessonLink = screen.getByRole("link", { name: "Next lesson" });
    expect(nextLessonLink).toBeInTheDocument();
    expect(nextLessonLink).toHaveAttribute(
      "href",
      resolveOakHref({
        page: "lesson-overview",
        lessonSlug: "lesson-3",
        unitSlug: defaultProps.unitSlug,
        programmeSlug: defaultProps.programmeSlug,
      }),
    );
  });
  it("renders a download link", () => {
    renderLessonHeader();
    const downloadLink = screen.getByRole("link", {
      name: "Download",
    });
    expect(downloadLink).toBeInTheDocument();
    expect(downloadLink).toHaveAttribute(
      "href",
      resolveOakHref({
        page: "lesson-downloads",
        lessonSlug: defaultProps.currentLessonSlug,
        programmeSlug: defaultProps.programmeSlug,
        unitSlug: defaultProps.unitSlug,
        query: { preselected: "all" },
      }),
    );
  });
  it("fires lesson resource download started when download link is clicked", () => {
    renderLessonHeader();
    const downloadLink = screen.getByTestId("download-all-button");

    act(() => {
      downloadLink.click();
    });

    expect(lessonResourceDownloadStarted).toHaveBeenCalledWith(
      expect.objectContaining({
        downloadResourceButtonName: "all",
      }),
    );
  });
  it("renders a sign up button for lessons with complex copyright when signed out", () => {
    renderLessonHeader({ loginRequired: true });

    const downloadLink = screen.getByRole("button", {
      name: "Sign in to download",
    });
    expect(downloadLink).toBeInTheDocument();
  });
  it("renders a link to downloads page for lessons with complex copyright when signed in", () => {
    setUseUserReturn(mockLoggedIn);

    renderLessonHeader({ loginRequired: true });
    const downloadLink = screen.getByRole("link", {
      name: "Download",
    });
    expect(downloadLink).toBeInTheDocument();
  });
  it("does not render a download page link for georestricted lessons when geoblocked", () => {
    setUseUserReturn(mockGeorestrictedUser);
    renderLessonHeader({ georestricted: true });

    const downloadLink = screen.queryByRole("link", { name: "Download" });
    expect(downloadLink).not.toBeInTheDocument();

    const signUpButton = screen.queryByRole("button", { name: "Download all" });
    expect(signUpButton).not.toBeInTheDocument();
  });
});
