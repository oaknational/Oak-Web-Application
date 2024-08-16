import React from "react";
import { screen, fireEvent } from "@testing-library/react";
import { oakDefaultTheme, OakThemeProvider } from "@oaknational/oak-components";

import SchoolDetailsInputBox from "./SchoolDetailsInputBox";

import { OakColorName } from "@/styles/theme";
import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("SchoolDetailsInputBox", () => {
  const defaultProps = {
    placeholder: "Enter school name",
    background: "blue" as OakColorName,
    labelText: "School Name",
    onBlur: jest.fn(),
    onChange: jest.fn(),
  };

  it("renders correctly", () => {
    const { getByText, getByPlaceholderText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <SchoolDetailsInputBox {...defaultProps} />
      </OakThemeProvider>,
    );
    expect(getByPlaceholderText("Enter school name")).toBeInTheDocument();
    expect(getByText("School Name")).toBeInTheDocument();
    expect(getByText("(required)")).toBeInTheDocument();
  });

  it("calls onBlur handler", () => {
    renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <SchoolDetailsInputBox {...defaultProps} />
      </OakThemeProvider>,
    );
    const input = screen.getByPlaceholderText("Enter school name");
    fireEvent.blur(input);
    expect(defaultProps.onBlur).toHaveBeenCalled();
  });

  it("calls onChange handler", () => {
    const { getByPlaceholderText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <SchoolDetailsInputBox {...defaultProps} />
      </OakThemeProvider>,
    );
    const input = getByPlaceholderText("Enter school name");
    fireEvent.change(input, { target: { value: "New School" } });
    expect(defaultProps.onChange).toHaveBeenCalled();
  });

  it("displays error state correctly", () => {
    const { getByText } = renderWithTheme(
      <OakThemeProvider theme={oakDefaultTheme}>
        <SchoolDetailsInputBox {...defaultProps} />
      </OakThemeProvider>,
    );
    expect(getByText("School Name")).toHaveStyle("color: #222222");
  });
});
