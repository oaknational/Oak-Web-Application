import { screen } from "@testing-library/react";

import { ShortReadsHeading } from "./ShortReadsHeading";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("ShortReadsHeading", () => {
  it("renders the page heading and intro", () => {
    renderWithTheme(<ShortReadsHeading />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "The thinking behind Oak lessons",
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/See how our lessons are designed to support learning/),
    ).toBeInTheDocument();
  });
});
