import { renderHook, act } from "@testing-library/react";
import { useRouter } from "next/router";

import { KeyStage, SearchProvider } from "./SearchContext";
import useKeyStageToggle from "./useKeyStageToggle";

jest.mock("next/dist/client/router", () => require("next-router-mock"));

beforeEach(() => {
  jest.clearAllMocks();
});

const testKeyStage: KeyStage = "1";

describe("useKeyStageToggle()", () => {
  test("'checked' should default to false", () => {
    const useKeyStageToggleHook = renderHook(
      () => useKeyStageToggle(testKeyStage),
      {
        wrapper: SearchProvider,
      }
    );
    const { checked } = useKeyStageToggleHook.result.current;

    expect(checked).toBe(false);
  });

  test("onChange should toggle checked", async () => {
    const useKeyStageToggleHook = renderHook(
      () => useKeyStageToggle(testKeyStage),
      {
        wrapper: SearchProvider,
      }
    );

    const { onChange } = useKeyStageToggleHook.result.current;

    act(() => {
      onChange();
    });

    expect(useKeyStageToggleHook.result.current.checked).toBe(true);
  });

  test("onChange should update router keystages query params", async () => {
    const useKeyStageToggleHook = renderHook(() => useKeyStageToggle("2"), {
      wrapper: SearchProvider,
    });

    const useRouterHook = renderHook(() => useRouter(), {
      wrapper: SearchProvider,
    });

    const { onChange } = useKeyStageToggleHook.result.current;

    act(() => {
      onChange();
    });

    expect(useRouterHook.result.current.query.keystages).toEqual("1,2");
  });
});
