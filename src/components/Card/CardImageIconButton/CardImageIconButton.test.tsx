import { screen } from "@testing-library/react";

import renderWithProviders from "../../../__tests__/__helpers__/renderWithProviders";

import CardImageIconButton from ".";

describe("Card Variants", () => {
  it("renders a button", () => {
    renderWithProviders(
      <CardImageIconButton
        title="Title"
        text="Short snappy description of what this card is about."
        buttonHref="/"
        buttonLabel="Label"
        icon="Download"
        iconPosition="leading"
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
        imageUrl={"images/Image.png"}
      />
    );
    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("src", "images/Image.png");
    expect(image).toHaveAttribute("alt", "Title");
  });
});
