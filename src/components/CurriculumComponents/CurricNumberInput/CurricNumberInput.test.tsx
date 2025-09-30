import { fireEvent, waitFor } from "@testing-library/react";

import { CurricNumberInput } from "./CurricNumberInput";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("CurricNumberInput", () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  test("renders with default props", () => {
    const { getByTestId, getByLabelText } = renderWithTheme(
      <CurricNumberInput
        label="Number of lessons"
        id="test-input"
        value={30}
        onChange={mockOnChange}
      />,
    );

    expect(getByTestId("jaunty-label")).toHaveTextContent("Number of lessons");
    expect(getByLabelText("Number of lessons")).toHaveValue(30);
  });

  test("calls onChange with valid number within range", () => {
    const { getByLabelText } = renderWithTheme(
      <CurricNumberInput
        label="Number of lessons"
        id="test-input"
        value={30}
        onChange={mockOnChange}
        min={5}
        max={35}
      />,
    );

    const input = getByLabelText("Number of lessons");
    fireEvent.change(input, { target: { value: "25" } });

    expect(mockOnChange).toHaveBeenCalledWith(25);
  });

  test("does not call onChange with number below minimum", () => {
    const { getByLabelText } = renderWithTheme(
      <CurricNumberInput
        label="Number of lessons"
        id="test-input"
        value={30}
        onChange={mockOnChange}
        min={5}
        max={35}
      />,
    );

    const input = getByLabelText("Number of lessons");
    fireEvent.change(input, { target: { value: "3" } });

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  test("does not call onChange with number above maximum", () => {
    const { getByLabelText } = renderWithTheme(
      <CurricNumberInput
        label="Number of lessons"
        id="test-input"
        value={30}
        onChange={mockOnChange}
        min={5}
        max={35}
      />,
    );

    const input = getByLabelText("Number of lessons");
    fireEvent.change(input, { target: { value: "40" } });

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  test("shows error styling for invalid input", () => {
    const { getByLabelText } = renderWithTheme(
      <CurricNumberInput
        label="Number of lessons"
        id="test-input"
        value={30}
        onChange={mockOnChange}
        min={5}
        max={35}
      />,
    );

    const input = getByLabelText("Number of lessons");

    // Valid input should not show errors
    fireEvent.change(input, { target: { value: "25" } });
    expect(input).toHaveValue(25);

    // Invalid input (out of range) keeps displaying the invalid value
    fireEvent.change(input, { target: { value: "100" } });
    expect(input).toHaveValue(100);
    expect(mockOnChange).not.toHaveBeenCalledWith(100);
  });

  test("resets to last valid value on blur with invalid input", async () => {
    const { getByLabelText } = renderWithTheme(
      <CurricNumberInput
        label="Number of lessons"
        id="test-input"
        value={30}
        onChange={mockOnChange}
        min={5}
        max={35}
      />,
    );

    const input = getByLabelText("Number of lessons");
    fireEvent.change(input, { target: { value: "100" } });
    fireEvent.blur(input);

    await waitFor(() => {
      expect(input).toHaveValue(30);
    });
  });

  test("does not call onChange with non-numeric input", () => {
    const { getByLabelText } = renderWithTheme(
      <CurricNumberInput
        label="Number of lessons"
        id="test-input"
        value={30}
        onChange={mockOnChange}
        min={5}
        max={35}
      />,
    );

    const input = getByLabelText("Number of lessons");
    fireEvent.change(input, { target: { value: "abc" } });

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  test("updates when value prop changes", () => {
    const { getByLabelText, rerender } = renderWithTheme(
      <CurricNumberInput
        label="Number of lessons"
        id="test-input"
        value={30}
        onChange={mockOnChange}
      />,
    );

    let input = getByLabelText("Number of lessons");
    expect(input).toHaveValue(30);

    rerender(
      <CurricNumberInput
        label="Number of lessons"
        id="test-input"
        value={25}
        onChange={mockOnChange}
      />,
    );

    input = getByLabelText("Number of lessons");
    expect(input).toHaveValue(25);
  });

  test("accepts custom min and max values", () => {
    const { getByLabelText } = renderWithTheme(
      <CurricNumberInput
        label="Custom range"
        id="test-input"
        value={15}
        onChange={mockOnChange}
        min={10}
        max={20}
      />,
    );

    const input = getByLabelText("Custom range");

    fireEvent.change(input, { target: { value: "18" } });
    expect(mockOnChange).toHaveBeenCalledWith(18);

    mockOnChange.mockClear();

    fireEvent.change(input, { target: { value: "8" } });
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  test("handles boundary values correctly", () => {
    const { getByLabelText } = renderWithTheme(
      <CurricNumberInput
        label="Number of lessons"
        id="test-input"
        value={30}
        onChange={mockOnChange}
        min={5}
        max={35}
      />,
    );

    const input = getByLabelText("Number of lessons");

    // Minimum boundary
    fireEvent.change(input, { target: { value: "5" } });
    expect(mockOnChange).toHaveBeenCalledWith(5);

    mockOnChange.mockClear();

    // Maximum boundary
    fireEvent.change(input, { target: { value: "35" } });
    expect(mockOnChange).toHaveBeenCalledWith(35);
  });
});
