import { describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";

import { useInitialChange } from "./useInitialChange";

describe("useInitialChange", () => {
  it("should call onInitialChange when the value changes for the first time", () => {
    // Arrange
    const onInitialChange = vi.fn();
    const onChange = vi.fn();
    const { result } = renderHook(useInitialChange, {
      initialProps: {
        onInitialChange,
        onChange,
      },
    });
    // Act
    result.current.handleOnChange();
    // Assert
    expect(onInitialChange).toHaveBeenCalled();
  });

  it("should call onChange when the value changes for the second time", () => {
    // Arrange
    const onInitialChange = vi.fn();
    const onChange = vi.fn();
    const { result } = renderHook(useInitialChange, {
      initialProps: {
        onInitialChange,
        onChange,
      },
    });
    // Act
    result.current.handleOnChange();
    result.current.handleOnChange();
    // Assert
    expect(onInitialChange).toHaveBeenCalled();
    expect(onChange).toHaveBeenCalled();
  });
});
