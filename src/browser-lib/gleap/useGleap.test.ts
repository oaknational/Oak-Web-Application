import { renderHook } from "@testing-library/react-hooks";

import useGleap from ".";

const startGleap = jest.fn();

jest.mock("./startGleap", () => ({
  __esModule: true,
  default: (args: unknown[]) => startGleap(...args),
}));

describe("useGleap", () => {
  describe("with enabled true", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetModules();
    });
    test.skip("should call startGleap() with the correct gleap config", () => {
      renderHook(() => useGleap({ enabled: true }));

      expect(startGleap).toHaveBeenCalled();
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
