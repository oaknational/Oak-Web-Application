/**
 * Tests adapted from https://gist.github.com/JakeCoxon/c7ebf6e6496f8468226fd36b596e1985
 */
import { renderHook } from "@testing-library/react";

import useStableCallback from "./useStableCallback";

describe("hooks/useStableCallback.ts", () => {
  it("keeps identity", () => {
    const hook = renderHook(useStableCallback, {
      initialProps: (x: number) => x + 3,
    });

    const initialIdentity = hook.result.current;
    expect(hook.result.current).toEqual(expect.any(Function));
    expect(hook.result.current(4)).toBe(7);

    hook.rerender((x) => x + 10);
    expect(hook.result.current(4)).toBe(14);

    // Identity is still the same
    expect(hook.result.current).toBe(initialIdentity);
  });

  it("does not get called after unmounting", () => {
    const mockFn = vi.fn();
    const hook = renderHook((callback) => useStableCallback(callback), {
      initialProps: mockFn,
    });
    hook.unmount();

    hook.result.current();
    expect(mockFn).not.toHaveBeenCalled();
  });
});
