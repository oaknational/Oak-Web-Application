import { fireEvent, screen } from "@testing-library/react";

import LessonActionsBar from "./LessonActionsBar";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";
import { resolveOakHref } from "@/common-lib/urls";

const lessonShareStarted = jest.fn();
jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    getSessionId: jest.fn(),
    track: {
      lessonShareStarted: (...args: unknown[]) => lessonShareStarted(...args),
    },
  }),
}));

const render = renderWithProviders();

const defaultProps = {
  showPupilShare: true,
  lessonSlug: "lesson-1",
  unitSlug: "unit-1",
  programmeSlug: "programme-1",
};

describe("LessonActionsBar", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders pupil share link when showPupilShare is true", () => {
    render(<LessonActionsBar {...defaultProps} />);
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

  it("tracks lessonShareStarted when pupil share link is clicked", () => {
    render(<LessonActionsBar {...defaultProps} />);

    fireEvent.click(
      screen.getByRole("link", { name: "Share lesson with pupils" }),
    );

    expect(lessonShareStarted).toHaveBeenCalledTimes(1);
  });

  it("does not render pupil share link when showPupilShare is false", () => {
    render(<LessonActionsBar {...defaultProps} showPupilShare={false} />);

    expect(
      screen.queryByRole("link", { name: "Share lesson with pupils" }),
    ).not.toBeInTheDocument();
  });

  it("always renders create more with AI link", () => {
    render(
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
