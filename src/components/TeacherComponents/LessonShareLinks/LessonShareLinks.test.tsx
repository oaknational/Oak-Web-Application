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

  it("should call onSubmit with correct avoMedium", async () => {
    const onSubmit = jest.fn();
    const { getByRole } = renderWithProviders()(
      <LessonShareLinks
        disabled={false}
        lessonSlug="test-slug"
        selectedActivities={["exit-quiz-questions"]}
        onSubmit={onSubmit}
      />,
    );

    const googleClassroomButton = getByRole("button", {
      name: "Assign to Google Classroom",
    });

    expect(googleClassroomButton).toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(googleClassroomButton);
    expect(onSubmit).toHaveBeenCalledWith("google-classroom");
  });
});

/**
 * ! - 1. Fix Modal so it matches previously made modal with copy update
 * Step :one: - copy changes on heading + text

Save to Google Classroom
Sign in with Google to save this assignment as a draft in your Google Classroom

Step :two: - copy changes on heading + button
Save to Google Classroom
[Input field + radio buttons go here]
Button: Share assignment

Step :three: - copy changes heading + text + button
Assignment saved
"[name of assignment]" has been saved to your Google Classroom as a draft assignment. Open it in Google Classroom to publish it for your students.
Button: View draft
 * ! - 2. Fix the sonarcloud and add tests
 * ! - 3. Record video
 */
