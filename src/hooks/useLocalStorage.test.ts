import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { z } from "zod";

import "../__tests__/__helpers__/LocalStorageMock";

import useLocalStorage from "./useLocalStorage";

const consoleWarnSpy = vi.spyOn(console, "warn").mockImplementation(() => null);

describe("useLocalStorage()", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("initial state is in the returned state", () => {
    const { result } = renderHook(() => useLocalStorage("key", "value"));

    expect(result.current[0]).toBe("value");
  });

  it("Local storage is initially set with initialValue", async () => {
    renderHook(() => useLocalStorage("key", "value"));

    expect(window.localStorage.getItem("key")).toBe(JSON.stringify("value"));
  });

  it("Initial state is a callback function", () => {
    const { result } = renderHook(() => useLocalStorage("key", () => "value"));

    expect(result.current[0]).toBe("value");
  });

  it("Local storage is initially set with initialValue as callback function", async () => {
    renderHook(() => useLocalStorage("key", () => "value"));

    expect(window.localStorage.getItem("key")).toBe(JSON.stringify("value"));
  });

  it("Initial state is an array", () => {
    const { result } = renderHook(() => useLocalStorage("digits", [1, 2]));

    expect(result.current[0]).toEqual([1, 2]);
  });

  it("Update the state", () => {
    const { result } = renderHook(() => useLocalStorage("key", "value"));

    act(() => {
      const setState = result.current[1];
      setState("edited");
    });

    expect(result.current[0]).toBe("edited");
  });

  it("Update the state writes localStorage", () => {
    const { result } = renderHook(() => useLocalStorage("key", "value"));

    act(() => {
      const setState = result.current[1];
      setState("edited");
    });

    expect(window.localStorage.getItem("key")).toBe(JSON.stringify("edited"));
  });

  it("Update the state with undefined", () => {
    const { result } = renderHook(() =>
      useLocalStorage<string | undefined>("keytest", "value"),
    );

    act(() => {
      const setState = result.current[1];
      setState(undefined);
    });

    expect(result.current[0]).toBeUndefined();
  });

  it("Update the state with a callback function", () => {
    const { result } = renderHook(() => useLocalStorage("count", 2));

    act(() => {
      const setState = result.current[1];
      setState((prev) => prev + 1);
    });

    expect(result.current[0]).toBe(3);
    expect(window.localStorage.getItem("count")).toEqual("3");
  });

  it("[Event] Update one hook updates the others", () => {
    const initialValues: [string, unknown] = ["key", "initial"];
    const { result: A } = renderHook(() => useLocalStorage(...initialValues));
    const { result: B } = renderHook(() => useLocalStorage(...initialValues));

    act(() => {
      const setState = A.current[1];
      setState("edited");
    });

    expect(B.current[0]).toBe("edited");
  });

  it("doesn't update if schema parse fails setting", () => {
    const { result } = renderHook(() =>
      useLocalStorage("key", "value", (a, b) => a === b, z.string()),
    );

    act(() => {
      const setState = result.current[1];
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      setState(49);
    });

    expect(result.current[0]).toBe("value");
    expect(consoleWarnSpy).toHaveBeenCalledTimes(1);
  });

  it("updates if schema parse succeeds", () => {
    const { result } = renderHook(() =>
      useLocalStorage("key", "value", (a, b) => a === b, z.string()),
    );

    act(() => {
      const setState = result.current[1];
      setState("49");
    });

    expect(result.current[0]).toBe("49");
    expect(consoleWarnSpy).toHaveBeenCalledTimes(0);
  });
});
