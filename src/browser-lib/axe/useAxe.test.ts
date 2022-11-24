import { renderHook } from "@testing-library/react";

import useAxe from "./useAxe";

const startAxe = jest.fn();
jest.mock("./startAxe", () => ({
  __esModule: true,
  default: () => startAxe(),
}));

describe("useAxe", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("calls startAxe() if enabled, only once", () => {
    const { rerender } = renderHook(() => useAxe({ enabled: true }));

    rerender();
    expect(startAxe).toHaveBeenCalledTimes(1);
  });
  test("not calls startAxe() if disabled", () => {
    renderHook(() => useAxe({ enabled: false }));
    expect(startAxe).not.toHaveBeenCalled();
  });
});
