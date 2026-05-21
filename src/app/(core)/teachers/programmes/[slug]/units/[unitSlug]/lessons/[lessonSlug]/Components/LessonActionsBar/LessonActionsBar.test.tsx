import { screen } from "@testing-library/react";

import LessonActionsBar from "./LessonActionsBar";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";
import { resolveOakHref } from "@/common-lib/urls";

const defaultProps = {
  showPupilShare: true,
  lessonSlug: "lesson-1",
  unitSlug: "unit-1",
  programmeSlug: "programme-1",
};

describe("LessonShareBar", () => {
  it("renders pupil share link when showPupilShare is true", () => {
    renderWithTheme(<LessonActionsBar {...defaultProps} />);
    const pupilShareLink = screen.getByRole("link", {
      name: "Share lesson with pupils",
    });

    expect(pupilShareLink).toHaveAttribute(
      "href",
      resolveOakHref({
        page: "lesson-share",
        lessonSlug: defaultProps.lessonSlug,
        unitSlug: defaultProps.unitSlug,
        programmeSlug: defaultProps.programmeSlug,
        query: { preselected: "all" },
      }),
    );
    expect(pupilShareLink).toHaveAttribute(
      "rel",
      expect.stringContaining("nofollow"),
    );
  });

  it("does not render pupil share link when showPupilShare is false", () => {
    renderWithTheme(
      <LessonActionsBar {...defaultProps} showPupilShare={false} />,
    );

    expect(
      screen.queryByRole("link", { name: "Share lesson with pupils" }),
    ).not.toBeInTheDocument();
  });

  it("always renders create more with AI link", () => {
    renderWithTheme(
      <LessonActionsBar
        {...defaultProps}
        showPupilShare={false}
        createWithAiProps={{
          lessonSlug: "lesson-1",
          programmeSlug: "programme-1",
          keyStageSlug: "ks1",
          subjectCategories: [],
          actions: {},
          trackCreateWithAiButtonClicked: jest.fn,
          trackTeachingMaterialsSelected: jest.fn,
          subjectSlug: "maths",
        }}
      />,
    );

    expect(
      screen.getByRole("button", {
        name: "Create more with AI",
      }),
    ).toBeInTheDocument();
  });
});
