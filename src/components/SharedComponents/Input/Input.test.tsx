import { screen } from "@testing-library/react";

import Input from "./Input";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("Input", () => {
  it("renders an input", () => {
    renderWithTheme(
      <Input
        id="test-input"
        label="An input"
        value="Hello world"
        onChange={jest.fn()}
      />,
    );

    const input = screen.getByRole("textbox");

    expect(input).toBeInTheDocument();
  });
  test("has accessible name", () => {
    const { getByRole } = renderWithTheme(
      <Input
        id="test-input"
        label="A particular label"
        value="Hello world"
        onChange={jest.fn()}
      />,
    );
    const input = getByRole("textbox");
    expect(input).toHaveAccessibleName("A particular label");
  });
  test("has accessible error message", () => {
    const { getByRole } = renderWithTheme(
      <Input
        id="test-input"
        label="A particular label"
        value="Hello world"
        onChange={jest.fn()}
        error="You done wrong"
      />,
    );
    const input = getByRole("textbox");
    expect(input).toHaveAccessibleDescription("Error You done wrong");
  });
});
