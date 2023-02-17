import { screen } from "@testing-library/react";

import renderWithTheme from "../../__tests__/__helpers__/renderWithTheme";

import VisualCheckbox from "./VisualCheckbox";

describe("VisualCheckbox", () => {
  it("renders a visual checkbox", () => {
    renderWithTheme(<VisualCheckbox checked={false} />);

    const visualCheckbox = screen.getByTestId("visual-checkbox");
    expect(visualCheckbox).toBeInTheDocument();
  });

  it("renders a visual checkbox with a tick icon if checked is set to true", () => {
    renderWithTheme(<VisualCheckbox checked={true} />);

    const visualCheckbox = screen.getByTestId("visual-checkbox");
    const tickIcon = screen.getByTestId("tick-icon");

    expect(visualCheckbox).toBeInTheDocument();
    expect(tickIcon).toBeInTheDocument();
  });
});
