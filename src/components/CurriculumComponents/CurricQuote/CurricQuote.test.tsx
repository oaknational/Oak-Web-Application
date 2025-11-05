import { screen } from "@testing-library/react";
import { oakColorTokens } from "@oaknational/oak-components";

import CurricQuote from "./CurricQuote";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("CurricQuote", () => {
  it("renders the title correctly", () => {
    render(
      <CurricQuote title="My title" barColor={"red"}>
        This is the test children content.
      </CurricQuote>,
    );
    expect(screen.getByText("My title")).toBeInTheDocument();
  });

  it("renders the children correctly", () => {
    render(
      <CurricQuote title="My title" barColor={"red"}>
        This is the test children content.
      </CurricQuote>,
    );
    expect(
      screen.getByText("This is the test children content."),
    ).toBeInTheDocument();
  });

  it("applies a transparent background by default", () => {
    render(
      <CurricQuote title="My title">
        This is the test children content.
      </CurricQuote>,
    );
    const quoteBox = screen.getByTestId("curric-quote");
    expect(quoteBox).toHaveStyle("background-color: transparent");
  });

  it("applies the specified background color", () => {
    render(
      <CurricQuote title="My title" backgroundColor="lemon">
        This is the test children content.
      </CurricQuote>,
    );
    const quoteBox = screen.getByTestId("curric-quote");
    expect(quoteBox).toHaveStyle(`background-color: ${oakColorTokens.lemon}`);
  });

  it("applies the default bar color", () => {
    render(
      <CurricQuote title="My title">
        This is the test children content.
      </CurricQuote>,
    );
    const decorativeBar = screen.getByTestId("decorative-bar");
    expect(decorativeBar).toHaveStyle(
      `background-color: ${oakColorTokens.mint30}`,
    );
  });

  it("applies the specified bar color", () => {
    render(
      <CurricQuote title="My title" barColor={"red"}>
        This is the test children content.
      </CurricQuote>,
    );
    const decorativeBar = screen.getByTestId("decorative-bar");
    expect(decorativeBar).toHaveStyle(
      `background-color: ${oakColorTokens.red}`,
    );
  });
});
