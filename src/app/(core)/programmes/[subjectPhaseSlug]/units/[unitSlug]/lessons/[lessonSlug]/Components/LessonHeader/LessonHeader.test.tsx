import { screen } from "@testing-library/dom";

import LessonHeader, { LessonHeaderProps } from "./LessonHeader";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { resolveOakHref } from "@/common-lib/urls";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import {
  mockGeorestrictedUser,
  mockLoggedIn,
} from "@/__tests__/__helpers__/mockUser";

const render = renderWithTheme;

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

describe("LessonHeader", () => {
  it("renders prev and next lesson buttons", () => {
    render(<LessonHeader {...defaultProps} />);

    const prevLessonLink = screen.getByRole("link", {
      name: "Previous lesson",
    });
    expect(prevLessonLink).toBeInTheDocument();
    expect(prevLessonLink).toHaveAttribute(
      "href",
      resolveOakHref({
        page: "integrated-lesson-overview",
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
        page: "integrated-lesson-overview",
        lessonSlug: "lesson-3",
        unitSlug: defaultProps.unitSlug,
        programmeSlug: defaultProps.programmeSlug,
      }),
    );
  });
  it("renders a download link", () => {
    render(<LessonHeader {...defaultProps} />);

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
        downloads: "downloads",
        query: { preselected: "all" },
      }),
    );
  });
  it("renders a sign up button for lessons with complex copyright when signed out", () => {
    render(<LessonHeader {...defaultProps} loginRequired={true} />);

    const downloadLink = screen.getByRole("button", { name: "Download all" });
    expect(downloadLink).toBeInTheDocument();
  });
  it("renders a link to downloads page for lessons with complex copyright when signed in", () => {
    setUseUserReturn(mockLoggedIn);

    render(<LessonHeader {...defaultProps} loginRequired={true} />);
    const downloadLink = screen.getByRole("link", {
      name: "Download",
    });
    expect(downloadLink).toBeInTheDocument();
  });
  it("does not render a download page link for georestricted lessons when geoblocked", () => {
    setUseUserReturn(mockGeorestrictedUser);
    render(<LessonHeader {...defaultProps} georestricted={true} />);

    const downloadLink = screen.queryByRole("link", { name: "Download" });
    expect(downloadLink).not.toBeInTheDocument();

    const signUpButton = screen.queryByRole("button", { name: "Download all" });
    expect(signUpButton).not.toBeInTheDocument();
  });
});
