import { renderHook, act } from "@testing-library/react";

import { KeyStage, SearchProvider } from "./SearchContext";
import useKeyStageToggle from "./useKeyStageToggle";

jest.mock("next/dist/client/router", () => require("next-router-mock"));

const testKeyStage: KeyStage = "1";
describe("useKeyStageToggle()", () => {
  test("'checked' should default to false", () => {
    const { result } = renderHook(() => useKeyStageToggle(testKeyStage), {
      wrapper: SearchProvider,
    });
    const { checked } = result.current;

    expect(checked).toBe(false);
  });
  test("onChange should toggle checked", () => {
    const { result } = renderHook(() => useKeyStageToggle(testKeyStage), {
      wrapper: SearchProvider,
    });
    const { onChange, checked } = result.current;

    act(() => {
      onChange();
    });

    expect(checked).toBe(true);
  });
});
