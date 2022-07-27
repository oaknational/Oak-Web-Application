import { renderHook } from "@testing-library/react-hooks";

import useGleap from ".";

const startGleap = jest.fn();

jest.mock("./startGleap", () => ({
  __esModule: true,
  default: (...args: unknown[]) => startGleap(...args),
}));

describe("useGleap", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.resetModules();
  });
  describe("with enabled true", () => {
    test("should call startGleap() with the correct gleap config", () => {
      renderHook(() => useGleap({ enabled: true }));

      expect(startGleap).toHaveBeenCalledWith({
        widgetUrl: "NEXT_PUBLIC_GLEAP_WIDGET_URL",
        apiUrl: "NEXT_PUBLIC_GLEAP_API_URL",
        apiKey: "NEXT_PUBLIC_GLEAP_API_KEY",
      });
    });

    test.todo("re-rendering should not cause startGleap() to be called again");
  });
  describe("with enabled false", () => {
    test("should not call startGleap()", () => {
      renderHook(() => useGleap({ enabled: false }));

      expect(startGleap).not.toHaveBeenCalled();
    });
  });
});
