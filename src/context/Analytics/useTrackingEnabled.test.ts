import { renderHook } from "@testing-library/react-hooks";

import "../../__tests__/__helpers__/LocalStorageMock";
import { AllTheProviders } from "../../__tests__/__helpers__/renderWithProviders";

import useTrackingEnabled from "./useTrackingEnabled";

describe("useTrackingEnabled()", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });
  test("should return false if statistics consent not given", () => {
    const { result } = renderHook(useTrackingEnabled, {
      wrapper: AllTheProviders,
    });

    expect(result.current).toBe(false);
  });
  test("should return true if statistics consent given", () => {
    localStorage.setItem(
      "metomic-consented-pol:b109d120-ec88-4dd7-9f6e-fc67ab6f0ffb",
      JSON.stringify({ enabled: true, version: 1 })
    );
    const { result } = renderHook(useTrackingEnabled, {
      wrapper: AllTheProviders,
    });

    expect(result.current).toBe(true);
  });
});
