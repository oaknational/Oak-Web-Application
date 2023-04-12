import userEvent from "@testing-library/user-event";

import renderWithProviders from "../../../../__tests__/__helpers__/renderWithProviders";

import LessonListItem from "./LessonListItem";

const props = {
  title: "Macbeth",
  slug: "macbeth-lesson-1",
  presentationCount: 1,
  quizCount: 2,
  subjectSlug: "english",
  keyStageSlug: "4",
  description: "In this lesson",
  unitSlug: "foo",
  unitTitle: "Unit title",
  videoCount: 1,
  worksheetCount: 2,
  keyStageTitle: "Key stage 3",
  subjectTitle: "Maths",
  themeSlug: "circles",
  themeTitle: "Circles",
  hasCopyrightMaterial: false,
  expired: false,
};

const lessonSelected = jest.fn();
jest.mock("../../../../context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      lessonSelected: (...args: unknown[]) => lessonSelected(...args),
    },
  }),
}));

const render = renderWithProviders();

describe("Lesson List Item", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("It shows lesson title", () => {
    const { getByRole } = render(<LessonListItem {...props} />);
    const lessonHeading = getByRole("heading", { level: 3 });

    expect(lessonHeading).toBeInTheDocument();
  });

  test("It shows lesson description", () => {
    const { getAllByText } = render(<LessonListItem {...props} />);

    const description = getAllByText("In this lesson")[0];

    expect(description).toBeInTheDocument();
  });

  test("It is a link to the lesson overview page", () => {
    const { getByText } = render(<LessonListItem {...props} />);

    expect(getByText("Macbeth").closest("a")).toHaveAttribute(
      "href",
      "/beta/teachers/key-stages/4/subjects/english/units/foo/lessons/macbeth-lesson-1"
    );
  });
  test("It renders expired message is expired lesson", () => {
    const { getByText } = render(
      <LessonListItem {...{ ...props, expired: true }} />
    );

    expect(
      getByText("Unfortunately this lesson is now unavailable.")
    ).toBeInTheDocument();
  });
  test("It calls tracking.lessonSelected with correct props when clicked", async () => {
    const { getByText } = render(<LessonListItem {...props} />);

    const lesson = getByText("Macbeth");

    const user = userEvent.setup();
    await user.click(lesson);

    expect(lessonSelected).toHaveBeenCalledTimes(1);
    expect(lessonSelected).toHaveBeenCalledWith({
      keyStageTitle: "Key stage 3",
      keyStageSlug: "4",
      analyticsUseCase: ["Teacher"],
      subjectTitle: "Maths",
      subjectSlug: "english",
      unitName: "Unit title",
      unitSlug: "foo",
      lessonName: "Macbeth",
      lessonSlug: "macbeth-lesson-1",
    });
  });
});
