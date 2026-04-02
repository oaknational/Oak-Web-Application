import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import LessonShareLinks from "./LessonShareLinks";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

describe("LessonShareLinks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should render", () => {
    renderWithProviders()(
      <LessonShareLinks
        disabled={false}
        lessonSlug="test-slug"
        programmeSlug="test-programme"
        unitSlug="test-unit"
        lessonTitle="Test Lesson"
        selectedActivities={["exit-quiz-questions"]}
        onSubmit={jest.fn}
      />,
    );
    const shareHeader = screen.getByRole("heading");
    expect(shareHeader).toBeInTheDocument();
    expect(shareHeader).toHaveTextContent("Share options:");
  });
  it("should update copy link button", async () => {
    renderWithProviders()(
      <LessonShareLinks
        disabled={false}
        lessonSlug="test-slug"
        programmeSlug="test-programme"
        unitSlug="test-unit"
        lessonTitle="Test Lesson"
        selectedActivities={["exit-quiz-questions"]}
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
  it("should render oak toast", async () => {
    renderWithProviders()(
      <LessonShareLinks
        disabled={false}
        lessonSlug="test-slug"
        programmeSlug="test-programme"
        unitSlug="test-unit"
        lessonTitle="Test Lesson"
        selectedActivities={["exit-quiz-questions"]}
        onSubmit={jest.fn}
      />,
    );
    const copyLinkButton = screen.getByRole("button", {
      name: "Copy link to clipboard",
    });
    const user = userEvent.setup();
    await user.click(copyLinkButton);
    const toast = screen.getAllByText("Link copied to clipboard");
    expect(toast).toHaveLength(2); // One for the button and one for the toast
  });
  it("should call onSubmit with copy-link", async () => {
    const onSubmit = jest.fn();
    renderWithProviders()(
      <LessonShareLinks
        disabled={false}
        lessonSlug="test-slug"
        programmeSlug="test-programme"
        unitSlug="test-unit"
        lessonTitle="Test Lesson"
        selectedActivities={["exit-quiz-questions"]}
        onSubmit={onSubmit}
      />,
    );
    const copyLinkButton = screen.getByRole("button", {
      name: "Copy link to clipboard",
    });
    expect(copyLinkButton).toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(copyLinkButton);
    expect(onSubmit).toHaveBeenCalledWith("copy-link");
  });

  it("should call onSubmit with correct avoMedium when google classroom button clicked", async () => {
    const onSubmit = jest.fn();
    const { getByRole } = renderWithProviders()(
      <LessonShareLinks
        disabled={false}
        lessonSlug="test-slug"
        programmeSlug="test-programme"
        unitSlug="test-unit"
        lessonTitle="Test Lesson"
        selectedActivities={["exit-quiz-questions"]}
        onSubmit={onSubmit}
      />,
    );

    const classroomButton = getByRole("button", {
      name: "Assign to Google Classroom",
    });

    expect(classroomButton).toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(classroomButton);
    expect(onSubmit).toHaveBeenCalledWith("google-classroom");
  });
});
