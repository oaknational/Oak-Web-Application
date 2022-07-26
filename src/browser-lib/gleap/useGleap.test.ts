import { renderHook } from "@testing-library/react-hooks";

import useGleap from ".";

const configGetSpy = jest.fn((key: string) => {
  return {
    gleapWidgetUrl: "widget-url",
    gleapApiUrl: "api-url",
    gleapApiKey: "api-key",
  }[key];
});
const startGleap = jest.fn();

describe("useGleap", () => {
  describe("with enabled true", () => {
    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetModules();
      jest.mock("../../config", () => ({
        get: configGetSpy,
      }));
      jest.mock("./startGleap", () => ({
        __esModule: true,
        default: startGleap,
      }));
    });

    test.skip("should call startGleap() with the correct gleap config", () => {
      /**
       * @todo: fix this test, not sure why it's failing
       */
      renderHook(() => useGleap({ enabled: true }));

      expect(startGleap).toHaveBeenCalledWith({
        widgetUrl: "widget-url",
        apiUrl: "api-url",
        apiKey: "api-key",
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
