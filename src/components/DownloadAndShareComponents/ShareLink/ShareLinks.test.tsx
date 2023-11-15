import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ShareLinks from "./ShareLinks";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const mockLessonShared = jest.fn();

describe("ShareLinks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should render", () => {
    renderWithTheme(
      <ShareLinks
        disabled={false}
        lessonSlug="test-slug"
        lessonTitle="Test slug"
        schoolName="Test school"
        emailSupplied={true}
        selectedActivities={["exit-quiz-questions"]}
        lessonShared={mockLessonShared}
        onSubmit={jest.fn}
      />,
    );
    const shareHeader = screen.getByRole("heading");
    expect(shareHeader).toBeInTheDocument();
    expect(shareHeader).toHaveTextContent("Share options:");
  });
  it("should update copy link button", async () => {
    renderWithTheme(
      <ShareLinks
        disabled={false}
        lessonSlug="test-slug"
        lessonTitle="Test slug"
        schoolName="Test school"
        emailSupplied={true}
        selectedActivities={["exit-quiz-questions"]}
        lessonShared={mockLessonShared}
        onSubmit={jest.fn}
      />,
    );
    const copyLinkButton = screen.getByRole("button", {
      name: "Copy link to clipboard",
    });
    expect(copyLinkButton).toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(copyLinkButton);
    expect(copyLinkButton).toHaveTextContent("Link copied to clipboard");
  });

  it.only("should invoke lessonShared function", async () => {
    const user = userEvent.setup();

    renderWithTheme(
      <ShareLinks
        disabled={false}
        lessonSlug="test-slug"
        lessonTitle="Test slug"
        schoolName="Test school"
        emailSupplied={true}
        selectedActivities={["exit-quiz-questions"]}
        lessonShared={mockLessonShared}
        onSubmit={jest.fn}
      />,
    );

    const copyLinkButton = screen.getByRole("button", {
      name: "Copy link to clipboard",
    });
    await user.click(copyLinkButton);
    expect(mockLessonShared).toHaveBeenCalledTimes(1);
    expect(mockLessonShared).toHaveBeenCalledWith({
      lessonSlug: "test-slug",
      lessonName: "Test slug",
      schoolName: "Test school",
      schoolOption: "Selected school",
      emailSupplied: true,
      schoolUrn: 0,
      shareMedium: "copy-link",
      pupilActivityResourceTypes: ["exit-quiz"],
    });
  });
});
