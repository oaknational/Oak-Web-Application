import { screen } from "@testing-library/react";

import { CalloutSection } from "./CalloutSection";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("CalloutSection", () => {
  it("renders the quote", () => {
    renderWithTheme(
      <CalloutSection quote="Clear explanations help pupils learn." />,
    );

    expect(
      screen.getByText(/Clear explanations help pupils learn\./),
    ).toBeInTheDocument();
  });

  it("renders each line of a multi-part quote", () => {
    renderWithTheme(<CalloutSection quote={["First line", "Second line"]} />);

    expect(screen.getByText(/First line/)).toBeInTheDocument();
    expect(screen.getByText(/Second line/)).toBeInTheDocument();
  });
});
