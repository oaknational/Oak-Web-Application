import { fireEvent } from "@testing-library/react";

import { CurricNumberInput } from ".";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

describe("CurricNumberInput", () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders input correctly", () => {
    const { getByTestId } = renderWithTheme(
      <CurricNumberInput id="test-input" value={30} onChange={mockOnChange} />,
    );

    const input = getByTestId("text-input");
    expect(input).toBeInTheDocument();
  });

  test("renders with correct value", () => {
    const { getByTestId } = renderWithTheme(
      <CurricNumberInput id="test-input" value={30} onChange={mockOnChange} />,
    );

    const input = getByTestId("text-input") as HTMLInputElement;
    expect(input).toHaveValue(30);
  });

  test("has correct input attributes", () => {
    const { getByTestId } = renderWithTheme(
      <CurricNumberInput id="test-input" value={30} onChange={mockOnChange} />,
    );

    const input = getByTestId("text-input") as HTMLInputElement;
    expect(input).toHaveAttribute("type", "number");
    expect(input).toHaveAttribute("min", "5");
    expect(input).toHaveAttribute("max", "35");
    expect(input).toHaveAttribute("step", "1");
  });

  test("input is not disabled (interactive)", () => {
    const { getByTestId } = renderWithTheme(
      <CurricNumberInput id="test-input" value={30} onChange={mockOnChange} />,
    );

    const input = getByTestId("text-input") as HTMLInputElement;
    expect(input).not.toBeDisabled();
  });

  test("applies custom min and max values", () => {
    const { getByTestId } = renderWithTheme(
      <CurricNumberInput
        id="test-input"
        value={20}
        onChange={mockOnChange}
        min={10}
        max={50}
      />,
    );

    const input = getByTestId("text-input") as HTMLInputElement;
    expect(input).toHaveAttribute("min", "10");
    expect(input).toHaveAttribute("max", "50");
  });

  test("calls onChange with numeric value when input changes", () => {
    const { getByTestId } = renderWithTheme(
      <CurricNumberInput id="test-input" value={30} onChange={mockOnChange} />,
    );

    const input = getByTestId("text-input") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "25" } });

    expect(mockOnChange).toHaveBeenCalledWith(25);
    expect(mockOnChange).toHaveBeenCalledTimes(1);
  });

  test("handles empty input without calling onChange", () => {
    const { getByTestId } = renderWithTheme(
      <CurricNumberInput id="test-input" value={30} onChange={mockOnChange} />,
    );

    const input = getByTestId("text-input") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "" } });

    // Should NOT call onChange for invalid input
    expect(mockOnChange).not.toHaveBeenCalled();
  });

  test("applies aria-describedby when provided", () => {
    const { getByTestId } = renderWithTheme(
      <CurricNumberInput
        id="test-input"
        value={30}
        onChange={mockOnChange}
        ariaDescribedBy="autumn-heading"
      />,
    );

    const input = getByTestId("text-input") as HTMLInputElement;
    expect(input).toHaveAttribute("aria-describedby", "autumn-heading");
  });

  test("has correct ID attribute", () => {
    const { getByTestId } = renderWithTheme(
      <CurricNumberInput
        id="custom-test-id"
        value={30}
        onChange={mockOnChange}
      />,
    );

    const input = getByTestId("text-input") as HTMLInputElement;
    expect(input).toHaveAttribute("id", "custom-test-id");
  });

  test("handles step attribute correctly", () => {
    const { getByTestId } = renderWithTheme(
      <CurricNumberInput
        id="test-input"
        value={30}
        onChange={mockOnChange}
        step={5}
      />,
    );

    const input = getByTestId("text-input") as HTMLInputElement;
    expect(input).toHaveAttribute("step", "5");
  });

  test("renders with minimum value", () => {
    const { getByTestId } = renderWithTheme(
      <CurricNumberInput id="test-input" value={5} onChange={mockOnChange} />,
    );

    const input = getByTestId("text-input") as HTMLInputElement;
    expect(input).toHaveValue(5);
  });

  test("renders with maximum value", () => {
    const { getByTestId } = renderWithTheme(
      <CurricNumberInput id="test-input" value={35} onChange={mockOnChange} />,
    );

    const input = getByTestId("text-input") as HTMLInputElement;
    expect(input).toHaveValue(35);
  });

  test("does not call onChange for value below minimum", () => {
    const { getByTestId } = renderWithTheme(
      <CurricNumberInput id="test-input" value={30} onChange={mockOnChange} />,
    );

    const input = getByTestId("text-input") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "3" } });

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  test("does not call onChange for value above maximum", () => {
    const { getByTestId } = renderWithTheme(
      <CurricNumberInput id="test-input" value={30} onChange={mockOnChange} />,
    );

    const input = getByTestId("text-input") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "50" } });

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  test("resets to last valid value on blur when input is invalid", () => {
    const { getByTestId } = renderWithTheme(
      <CurricNumberInput id="test-input" value={30} onChange={mockOnChange} />,
    );

    const input = getByTestId("text-input") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "100" } });
    fireEvent.blur(input);

    expect(input).toHaveValue(30);
  });

  test("calls onValidationChange when validation state changes", () => {
    const mockOnValidationChange = jest.fn();
    const { getByTestId } = renderWithTheme(
      <CurricNumberInput
        id="test-input"
        value={30}
        onChange={mockOnChange}
        onValidationChange={mockOnValidationChange}
      />,
    );

    const input = getByTestId("text-input") as HTMLInputElement;

    // Initially valid
    expect(mockOnValidationChange).toHaveBeenCalledWith(true);

    mockOnValidationChange.mockClear();

    // Change to invalid value
    fireEvent.change(input, { target: { value: "100" } });
    expect(mockOnValidationChange).toHaveBeenCalledWith(false);
  });

  test("does not call onChange for non-numeric input", () => {
    const { getByTestId } = renderWithTheme(
      <CurricNumberInput id="test-input" value={30} onChange={mockOnChange} />,
    );

    const input = getByTestId("text-input") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "abc" } });

    expect(mockOnChange).not.toHaveBeenCalled();
  });

  test("keeps dirty value visible when typing invalid input", () => {
    const { getByTestId } = renderWithTheme(
      <CurricNumberInput id="test-input" value={30} onChange={mockOnChange} />,
    );

    const input = getByTestId("text-input") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "100" } });

    // Dirty value should be displayed even though it's invalid
    expect(input).toHaveValue(100);
  });
});
