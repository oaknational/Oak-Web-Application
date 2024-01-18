import userEvent from "@testing-library/user-event";
import { act, screen } from "@testing-library/react";

import LessonListItem from "./LessonListItem";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const onClick = vi.fn();

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
  hitCount: 10,
  index: 3,
  currentPage: 1,
  onClick: onClick,
};

let render: ReturnType<typeof renderWithProviders>;

describe("Lesson List Item", () => {
  beforeAll(() => {
    render = renderWithProviders();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("It shows lesson title", () => {
    const { getByRole } = render(<LessonListItem {...props} />);
    const lessonHeading = getByRole("heading", { level: 3 });

    expect(lessonHeading).toBeInTheDocument();
  });

  it("It shows lesson description", () => {
    const { getAllByText } = render(<LessonListItem {...props} />);

    const description = getAllByText("In this lesson")[0];

    expect(description).toBeInTheDocument();
  });

  it("It is a link to the lesson overview page", () => {
    const { getByText } = render(<LessonListItem {...props} />);

    expect(getByText("Add two surds").closest("a")).toHaveAttribute(
      "href",
      "/teachers/programmes/maths-secondary-ks4-higher/units/adding-surds-a57d/lessons/add-two-surds-6wwk0c",
    );
  });
  it("It renders expired message is expired lesson", () => {
    const { getByText } = render(
      <LessonListItem {...{ ...props, expired: true }} />,
    );

    expect(
      getByText("This lesson is currently unavailable."),
    ).toBeInTheDocument();
  });
  it("It calls onClick with correct props when clicked", async () => {
    const { getByText } = render(<LessonListItem {...props} />);

    const lesson = getByText("Add two surds");

    userEvent.setup();
    await act(async () => {
      await userEvent.click(lesson);
    });

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith({
      ...props,
    });
  });

  it("it changes the card background colour on hover", async () => {
    render(<LessonListItem {...props} />);
    const cardContainer = screen.getByTestId("list-item-card-container");
    expect(cardContainer).toHaveStyle("background-color: #ffffff");

    const user = userEvent.setup();

    await act(async () => {
      await user.hover(cardContainer);
    });
    expect(cardContainer).toHaveStyle("background-color: #f2f2f2");
  });
});
