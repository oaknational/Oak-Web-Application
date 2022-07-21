import { screen } from "@testing-library/react";

import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import LessonControl from ".";

describe("LessonControl", () => {
  it("renders a button", () => {
    renderWithProviders(
      <LessonControl
        onClick={jest.fn()}
        label="Outro"
        status="current"
        badgeProps={{ text: "20%" }}
      />
    );

    const button = screen.getByRole("button");

    expect(button).toBeInTheDocument();
  });
});
