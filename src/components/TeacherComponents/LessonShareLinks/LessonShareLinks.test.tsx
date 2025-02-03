import { vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import LessonShareLinks from "./LessonShareLinks";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("LessonShareLinks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("should render", () => {
    renderWithTheme(
      <LessonShareLinks
        disabled={false}
        lessonSlug="test-slug"
        selectedActivities={["exit-quiz-questions"]}
        onSubmit={vi.fn()}
      />,
    );
    const shareHeader = screen.getByRole("heading");
    expect(shareHeader).toBeInTheDocument();
    expect(shareHeader).toHaveTextContent("Share options:");
  });
  it("should update copy link button", async () => {
    renderWithTheme(
      <LessonShareLinks
        disabled={false}
        lessonSlug="test-slug"
        selectedActivities={["exit-quiz-questions"]}
        onSubmit={vi.fn()}
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

  it("should call onSubmit with copy-link", async () => {
    const onSubmit = vi.fn();
    renderWithTheme(
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
    const onSubmit = vi.fn();
    const { getByRole } = renderWithTheme(
      <LessonShareLinks
        disabled={false}
        lessonSlug="test-slug"
        selectedActivities={["exit-quiz-questions"]}
        onSubmit={onSubmit}
      />,
    );

    const copyLinkButton = getByRole("link", {
      name: "Share to Google Classroom",
    });

    expect(copyLinkButton).toBeInTheDocument();
    const user = userEvent.setup();
    await user.click(copyLinkButton);
    expect(onSubmit).toHaveBeenCalledWith("google-classroom");
  });
});
