import { screen } from "@testing-library/react";

import renderWithProviders from "../../__tests__/__helpers__/renderWithProviders";

import Input from "./Input";

describe("Input", () => {
  it("renders an input", () => {
    renderWithProviders(<Input id="test-input" value="Hello world" />);

    const input = screen.getByRole("textbox");

    expect(input).toBeInTheDocument();
  });
});
