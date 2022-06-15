import { screen } from "@testing-library/react";

import renderWithProviders from "../../../__tests__/__helpers__/renderWithProviders";

import { getIconFlexPosition } from "./CardTitle";

import CardImageIconButton from ".";

describe("Card Variants", () => {
  it("renders a button", () => {
    renderWithProviders(
      <CardImageIconButton
        title="Title"
        text="Short snappy description of what this card is about."
        buttonHref="/"
        buttonLabel="Label"
        textCenter={true}
        icon="Download"
        iconPosition="leading"
        tag={"h3"}
      />
    );

    const button = screen.getByRole("button");

    expect(button).toBeInTheDocument();
  });
  it("renders a image", () => {
    renderWithProviders(
      <CardImageIconButton
        title="Title"
        text="Short snappy description of what this card is about."
        buttonHref="/"
        buttonLabel="Label"
        imageSrc={"images/Image.png"}
        tag={"h3"}
      />
    );
    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("src", "images/Image.png");
    expect(image).toHaveAttribute("alt", "Title");
  });
});

describe("CardTitle - icon position function", () => {
  it("renders returns correct flex properties", () => {
    const returnColumn = getIconFlexPosition("aboveTitle");
    expect(returnColumn).toEqual("column");
    const returnRow = getIconFlexPosition("leading");
    expect(returnRow).toEqual("row");
    const returnRowReverse = getIconFlexPosition("leading");
    expect(returnRowReverse).toEqual("row");
  });
});
