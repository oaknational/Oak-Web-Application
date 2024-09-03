import { render, screen } from "@testing-library/react";

import { Wall } from "./";

describe(Wall, () => {
  it("hides the given content", () => {
    render(
      <Wall>
        <div data-testid="canary" />
      </Wall>,
    );

    const content = screen.getByTestId("content");

    expect(content).toHaveStyle(`opacity: 0`);
    expect(content).toHaveAttribute("aria-hidden", "true");
  });
});
