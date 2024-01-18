import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";

import useGleap from ".";

const startGleap = vi.fn();
const hasLoaded = vi.fn(() => false);

vi.mock("./startGleap", () => ({
  __esModule: true,
  default: (...args: unknown[]) => startGleap(...args),
  hasLoaded: () => hasLoaded(),
}));
Object.defineProperty(window, "location", {
  value: { reload: vi.fn() },
});

describe("useGleap", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });
  describe("with enabled true", () => {
    it("should call startGleap() with the correct gleap config", () => {
      renderHook(() => useGleap({ enabled: true }));

      expect(startGleap).toHaveBeenCalledWith({
        frameUrl: "NEXT_PUBLIC_GLEAP_FRAME_URL",
        apiUrl: "NEXT_PUBLIC_GLEAP_API_URL",
        apiKey: "NEXT_PUBLIC_GLEAP_API_KEY",
      });
    });

    it("re-rendering should not cause startGleap() to be called again", () => {
      const { rerender } = renderHook(() => useGleap({ enabled: true }));
      hasLoaded.mockImplementationOnce(() => true);
      rerender();
      expect(startGleap).toHaveBeenCalledTimes(1);
    });
  });
  describe("with enabled false", () => {
    it("should not call startGleap()", () => {
      renderHook(() => useGleap({ enabled: false }));

      expect(startGleap).not.toHaveBeenCalled();
    });
    it("should refresh page to unload if previously enabled", async () => {
      const { rerender } = renderHook(
        (props: { enabled: boolean }) => useGleap(props),
        { initialProps: { enabled: true } },
      );
      hasLoaded.mockImplementationOnce(() => true);
      rerender({ enabled: false });
      expect(window.location.reload).toHaveBeenCalled();
    });
  });
});
