import { screen } from "@testing-library/react";
import { oakColorTokens } from "@oaknational/oak-components";

import CurricQuote from "./CurricQuote";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

describe("CurricQuote", () => {
  it("renders the title correctly", () => {
    render(
      <CurricQuote title="My title" text="This is test text." barColor={"bg-error"} />,
    );
    expect(screen.getByText("My title")).toBeInTheDocument();
  });

  it("renders the text correctly", () => {
    render(
      <CurricQuote title="My title" text="This is test text." barColor={"bg-error"} />,
    );
    expect(
      screen.getByText("This is the test children content."),
    ).toBeInTheDocument();
  });

  it("applies a transparent background by default", () => {
    render(
      <CurricQuote title="My title" text="This is test text." />,
    );
    const quoteBox = screen.getByTestId("curric-quote");
    expect(quoteBox).toHaveStyle("background-color: transparent");
  });

  it("applies the specified background color", () => {
    render(
      <CurricQuote title="My title" text="This is test text." backgroundColor="bg-decorative5-main" />,
    );
    const quoteBox = screen.getByTestId("curric-quote");
    expect(quoteBox).toHaveStyle(`background-color: ${oakColorTokens.lemon}`);
  });

  it("applies the default bar color", () => {
    render(
      <CurricQuote title="My title" text="This is test text." />,
    );
    const decorativeBar = screen.getByTestId("decorative-bar");
    expect(decorativeBar).toHaveStyle(
      `background-color: ${oakColorTokens.mint30}`,
    );
  });

  it("applies the specified bar color", () => {
    render(
      <CurricQuote title="My title" text="This is test text." barColor={"bg-error"} />,
    );
    const decorativeBar = screen.getByTestId("decorative-bar");
    expect(decorativeBar).toHaveStyle(
      `background-color: ${oakColorTokens.red}`,
    );
  });
});
