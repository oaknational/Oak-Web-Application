import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import ShareLinks from "./ShareLinks";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("ShareLinks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should render", () => {
    renderWithTheme(
      <ShareLinks
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
    renderWithTheme(
      <ShareLinks
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
});
