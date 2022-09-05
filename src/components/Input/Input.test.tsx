import { screen } from "@testing-library/react";

import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import Input from "./Input";

describe("Input", () => {
  it("renders an input", () => {
    renderWithProviders(
      <Input
        id="test-input"
        label="An input"
        value="Hello world"
        onChange={jest.fn()}
      />
    );

    const input = screen.getByRole("textbox");

    expect(input).toBeInTheDocument();
  });
  test("has accessible name", () => {
    const { getByRole } = renderWithProviders(
      <Input
        id="test-input"
        label="A particular label"
        value="Hello world"
        onChange={jest.fn()}
      />
    );
    const input = getByRole("textbox");
    expect(input).toHaveAccessibleName("A particular label");
  });
  test("has accessible error message", () => {
    const { getByRole } = renderWithProviders(
      <Input
        id="test-input"
        label="A particular label"
        value="Hello world"
        onChange={jest.fn()}
        error="You done wrong"
      />
    );
    const input = getByRole("textbox");
    expect(input).toHaveAccessibleDescription("You done wrong");
  });
});
