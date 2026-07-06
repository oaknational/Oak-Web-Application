import { screen } from "@testing-library/dom";

import LessonOverviewPresentation from "./LessonOverviewPresentation";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProviders();

describe("LessonOverviewPresentation", () => {
  it("renders a non-tabbable slide iframe to avoid focus traps", () => {
    render(
      <LessonOverviewPresentation
        asset="https://docs.google.com/presentation/d/1234567890/edit"
        title="Test lesson"
        isWorksheet={false}
      />,
    );

    const iframe = screen.getByTestId("overview-presentation");
    const focusTarget = screen.getByTestId(
      "overview-presentation-focus-target",
    );

    expect(iframe).toBeInTheDocument();
    expect(focusTarget).toBeInTheDocument();
    expect(focusTarget).toHaveAttribute("tabindex", "0");
    expect(iframe).toHaveAttribute("tabindex", "-1");
  });
});
