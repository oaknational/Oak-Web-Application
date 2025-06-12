import { screen } from "@testing-library/react";
import { oakColorTokens } from "@oaknational/oak-components";

import CurricQuote from "./CurricQuote";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("CurricQuote", () => {
  it("renders the title correctly", () => {
    renderWithTheme(
      <CurricQuote title="My title" barColor={"red"}>
        This is the test children content.
      </CurricQuote>,
    );
    expect(screen.getByText("My title")).toBeInTheDocument();
  });

  it("renders the children correctly", () => {
    renderWithTheme(
      <CurricQuote title="My title" barColor={"red"}>
        This is the test children content.
      </CurricQuote>,
    );
    expect(
      screen.getByText("This is the test children content."),
    ).toBeInTheDocument();
  });

  it("applies correct background and bar colours", () => {
    renderWithTheme(
      <CurricQuote title="My title" barColor={"red"} backgroundColor="lemon">
        This is the test children content.
      </CurricQuote>,
    );
    const quoteBox = screen.getByTestId("curric-quote");
    expect(quoteBox).toHaveStyle(`background-color: ${oakColorTokens.lemon}`);

    const decorativeBar = screen.getByTestId("decorative-bar");
    expect(decorativeBar).toHaveStyle(
      `background-color: ${oakColorTokens.red}`,
    );
  });
});
