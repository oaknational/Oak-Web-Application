import { renderHook } from "@testing-library/react";
import { act } from "react-dom/test-utils";

import { useStateCallback } from "./useStateCallback";

describe("useStateCallback", () => {
  it("calls the callback when the state is updated", () => {
    const mockFn = jest.fn();
    const { result } = renderHook(() => useStateCallback(0));
    const [state, setState] = result.current;

    expect(state).toBe(0);
    act(() => {
      setState(1, mockFn);
    });
    expect(mockFn).toHaveBeenCalledWith(1);
  });
});
