import userEvent from "@testing-library/user-event";

import renderWithProviders from "../../../../__tests__/__helpers__/renderWithProviders";

import LessonListItem from "./LessonListItem";

const props = {
  unitTitle: "Adding surds",
  programmeSlug: "maths-secondary-ks4-higher",
  expired: false,
  lessonSlug: "add-two-surds-6wwk0c",
  lessonTitle: "Add two surds",
  description: "In this lesson",
  keyStageSlug: "ks4",
  keyStageTitle: "Key stage 4",
  subjectSlug: "maths",
  subjectTitle: "Maths",
  unitSlug: "adding-surds-a57d",
  themeSlug: "number-n-56",
  themeTitle: "Number (N)",
  quizCount: 1,
  videoCount: 1,
  presentationCount: 1,
  worksheetCount: 1,
  hasCopyrightMaterial: false,
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

    expect(getByText("Add two surds").closest("a")).toHaveAttribute(
      "href",
      "/beta/teachers/programmes/maths-secondary-ks4-higher/units/adding-surds-a57d/lessons/add-two-surds-6wwk0c"
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

    const lesson = getByText("Add two surds");

    const user = userEvent.setup();
    await user.click(lesson);

    expect(lessonSelected).toHaveBeenCalledTimes(1);
    expect(lessonSelected).toHaveBeenCalledWith({
      analyticsUseCase: ["Teacher"],
      keyStageSlug: "ks4",
      keyStageTitle: "Key stage 4",
      lessonName: "Add two surds",
      lessonSlug: "add-two-surds-6wwk0c",
      subjectSlug: "maths",
      unitName: "Adding surds",
      unitSlug: "adding-surds-a57d",
      subjectTitle: "Maths",
    });
  });
});
