import DownloadConfirmation from "./DownloadConfirmation";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("DownloadConfirmation component", () => {
  it("should render", () => {
    const { getByText } = renderWithTheme(
      <DownloadConfirmation
        lessonSlug="test-lesson"
        programmeSlug="test-programme"
        unitSlug="test-unit"
      />,
    );

    expect(getByText("Thanks for downloading")).toBeInTheDocument();
  });

  it("Back to lesson link", async () => {
    const { getByTestId } = renderWithTheme(
      <DownloadConfirmation
        lessonSlug="test-lesson"
        programmeSlug="test-programme"
        unitSlug="test-unit"
      />,
    );

    const link = getByTestId("back-to-lesson-link");

    expect(link).toHaveAttribute(
      "href",
      "/teachers/programmes/test-programme/units/test-unit/lessons/test-lesson",
    );
  });
});
