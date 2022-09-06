import { renderHook } from "@testing-library/react-hooks";

import useVideoTracking from "./useVideoTracking";

describe("useVideoTracking", () => {
  test("calls track.videoStarted only once", () => {
    const { result } = renderHook(useVideoTracking);
    result.current.onPlay();
  });
  test("calls track.videoStarted", () => {
    const { result } = renderHook(useVideoTracking);
    result.current.onPlay();
  });
  test("calls track.videoStarted", () => {
    const { result } = renderHook(useVideoTracking);
  });
});
