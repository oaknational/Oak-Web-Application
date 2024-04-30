import { renderHook } from "@testing-library/react";
import { useEffect } from "react";

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
