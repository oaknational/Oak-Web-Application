import { render, screen } from "@testing-library/react";
import {
  OakThemeProvider,
  oakDefaultTheme,
  oakColorTokens,
} from "@oaknational/oak-components";

import CurricQuote from "./CurricQuote";

const renderWithTheme = (ui: React.ReactElement) => {
  return render(
    <OakThemeProvider theme={oakDefaultTheme}>{ui}</OakThemeProvider>,
  );
};

describe("CurricQuote", () => {
  it("renders the title correctly", () => {
    renderWithTheme(
      <CurricQuote title="Test Title">Test children content.</CurricQuote>,
    );
    expect(
      screen.getByRole("heading", { name: "Test Title", level: 3 }),
    ).toBeInTheDocument();
  });

  it("renders the children content correctly", () => {
    renderWithTheme(
      <CurricQuote title="Test Title">
        This is the test children content.
      </CurricQuote>,
    );
    expect(
      screen.getByText("This is the test children content."),
    ).toBeInTheDocument();
  });

  it("applies the specified background and bar colors", () => {
    const { container } = renderWithTheme(
      <CurricQuote
        title="Color Test"
        backgroundColor="lemon50"
        barColor="mint30"
      >
        Testing colors.
      </CurricQuote>,
    );
    const quoteBox = container.firstChild as HTMLElement;
    expect(quoteBox).toHaveStyle(`background-color: ${oakColorTokens.lemon50}`);

    const decorativeBar = screen.getByTestId("decorative-bar");
    expect(decorativeBar).toBeInTheDocument();
  });
});
