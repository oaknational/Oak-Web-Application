import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";

import VisualCheckbox from "./VisualCheckbox";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

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
