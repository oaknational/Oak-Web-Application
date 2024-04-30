import { renderHook } from "@testing-library/react";
import { useEffect } from "react";

/*
 * renderHook from "@testing-library/react" with initial state
 * @example
 *   const hook = renderHookWithInitialState(() => {
 *      return useFoobar();
 *   })
 *
 *   // Pre-rendered result
 *   expect(hook.initialResult).toEqual(...)
 *   // Rendered result
 *   expect(hook.result.current).toEqual(...)
 */
export function renderHookWithInitialState(fn: () => unknown) {
  let initialResult: unknown;
  const out = renderHook(() => {
    const data = fn();
    useEffect(() => {
      if (initialResult === undefined) {
        initialResult = data;
      }
    }, [data]);
    return data;
  });

  return {
    ...out,
    initialResult,
  };
}
