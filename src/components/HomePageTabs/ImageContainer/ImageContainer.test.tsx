import React from "react";

import ImageContainer from "./ImageContainer";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("ImageContainer Component", () => {
  const mockImageSlug = "hero-pupils";
  const mockChildren = <div>Mock Children</div>;

  it("renders with provided props", () => {
    const { getByTestId } = renderWithTheme(
      <ImageContainer imageSlug={mockImageSlug} data-testid="image-container">
        {mockChildren}
      </ImageContainer>,
    );

    const imageContainer = getByTestId("image-container");
    expect(imageContainer).toBeInTheDocument();
  });

  it("renders children content", () => {
    const { getByText } = renderWithTheme(
      <ImageContainer imageSlug={mockImageSlug} data-testid="image-container">
        {mockChildren}
      </ImageContainer>,
    );

    const childElement = getByText("Mock Children");

    // Test whether children content is rendered
    expect(childElement).toBeInTheDocument();
  });
});
