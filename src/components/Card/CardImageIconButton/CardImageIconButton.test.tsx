import { screen } from "@testing-library/react";

import renderWithProviders from "../../../__tests__/__helpers__/renderWithProviders";

import CardImageIconButton from ".";

describe("LessonControl", () => {
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
});
