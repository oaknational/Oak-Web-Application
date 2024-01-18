import { waitFor, renderHook } from "@testing-library/react";

import useIconAnimation from "./useIconAnimation";

describe("useIconAnimation", () => {
  it("returns correct initial value", () => {
    const { result } = renderHook(() =>
      useIconAnimation({ shouldAnimate: false }),
    );
    expect(result.current).toMatchObject({
      rotate: "rotate(0)",
      scale: "scale(1)",
      stage: "pre",
    });
  });

  it("returns correct value at 'in' stage", () => {
    const { result } = renderHook(() =>
      useIconAnimation({ shouldAnimate: true }),
    );
    expect(result.current).toMatchObject({
      rotate: "rotate(720deg)",
      scale: "scale(0.5)",
      stage: "in",
    });
  });
  it("returns correct value at 'out' stage", async () => {
    const { result } = renderHook(() =>
      useIconAnimation({ shouldAnimate: true, timeIn: 5 }),
    );
    await waitFor(() => {
      expect(result.current).toMatchObject({
        rotate: "rotate(720deg)",
        scale: "scale(0.5)",
        stage: "in",
      });
    });
  });
  it("returns correct value at 'back' stage", async () => {
    const { result } = renderHook(() =>
      useIconAnimation({
        shouldAnimate: true,
        timeIn: 5,
        timeOut: 5,
        timeBack: 5,
      }),
    );
    await waitFor(() => {
      expect(result.current).toMatchObject({
        rotate: "rotate(0)",
        scale: "scale(1)",
        stage: "pre",
      });
    });
  });
});
