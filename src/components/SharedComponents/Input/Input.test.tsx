import { describe, expect, it } from "vitest";
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
        onChange={vi.fn()}
      />,
    );

    const input = screen.getByRole("textbox");

    expect(input).toBeInTheDocument();
  });
  it("has accessible name", () => {
    const { getByRole } = renderWithTheme(
      <Input
        id="test-input"
        label="A particular label"
        value="Hello world"
        onChange={vi.fn()}
      />,
    );
    const input = getByRole("textbox");
    expect(input).toHaveAccessibleName("A particular label");
  });
  it("has accessible error message", () => {
    const { getByRole } = renderWithTheme(
      <Input
        id="test-input"
        label="A particular label"
        value="Hello world"
        onChange={vi.fn()}
        error="You done wrong"
      />,
    );
    const input = getByRole("textbox");
    expect(input).toHaveAccessibleDescription("You done wrong");
  });
});
