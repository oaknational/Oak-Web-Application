import { act, renderHook } from "@testing-library/react";
import { StrictMode, type ReactNode } from "react";

import { useInsightsDwellTime } from "./useInsightsDwellTime";

describe("useInsightsDwellTime", () => {
  let now: number;
  let visibility: DocumentVisibilityState;
  const record = jest.fn();

  beforeEach(() => {
    jest.useFakeTimers();
    now = 0;
    visibility = "visible";
    record.mockReset();
    jest.spyOn(performance, "now").mockImplementation(() => now);
    jest
      .spyOn(document, "visibilityState", "get")
      .mockImplementation(() => visibility);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  const setVisibility = (value: DocumentVisibilityState) => {
    visibility = value;
    act(() => document.dispatchEvent(new Event("visibilitychange")));
  };

  it("records elapsed seconds on navigation without sending an initial zero", () => {
    const { unmount } = renderHook(() => useInsightsDwellTime(record));
    expect(record).not.toHaveBeenCalled();
    now = 12345;
    unmount();
    expect(record.mock.calls).toEqual([[12.345]]);
  });

  it("excludes hidden time and reports cumulative visible time", () => {
    const { unmount } = renderHook(() => useInsightsDwellTime(record));
    now = 10000;
    setVisibility("hidden");
    expect(record).toHaveBeenLastCalledWith(10);
    now = 70000;
    setVisibility("visible");
    now = 75000;
    setVisibility("hidden");
    expect(record.mock.calls).toEqual([[10], [15]]);
    unmount();
    expect(record).toHaveBeenCalledTimes(2);
  });

  it("waits for a page that starts hidden to become visible", () => {
    visibility = "hidden";
    const { unmount } = renderHook(() => useInsightsDwellTime(record));
    now = 90000;
    setVisibility("visible");
    now = 92000;
    unmount();
    expect(record.mock.calls).toEqual([[2]]);
  });

  it("avoids duplicate snapshots across visibilitychange, pagehide and unmount", () => {
    const { unmount } = renderHook(() => useInsightsDwellTime(record));
    now = 3000;
    setVisibility("hidden");
    act(() => window.dispatchEvent(new Event("pagehide")));
    unmount();
    expect(record.mock.calls).toEqual([[3]]);
  });

  it("records pagehide and resumes after a back/forward cache restore", () => {
    const { unmount } = renderHook(() => useInsightsDwellTime(record));
    now = 4000;
    act(() => window.dispatchEvent(new Event("pagehide")));
    now = 64000;
    act(() => window.dispatchEvent(new Event("pageshow")));
    now = 70000;
    unmount();
    expect(record.mock.calls).toEqual([[4], [10]]);
  });

  it("keeps the clock running across rerenders and uses the latest callback", () => {
    const secondRecord = jest.fn();
    const { rerender, unmount } = renderHook(
      ({ callback }) => useInsightsDwellTime(callback),
      { initialProps: { callback: record } },
    );
    now = 2000;
    rerender({ callback: secondRecord });
    expect(record).not.toHaveBeenCalled();
    now = 5000;
    unmount();
    expect(secondRecord.mock.calls).toEqual([[5]]);
  });

  it("starts a fresh measurement for a new page visit and removes old listeners", () => {
    const firstVisit = renderHook(() => useInsightsDwellTime(record));
    now = 6000;
    firstVisit.unmount();
    const secondRecord = jest.fn();
    const secondVisit = renderHook(() => useInsightsDwellTime(secondRecord));
    now = 9000;
    setVisibility("hidden");
    secondVisit.unmount();
    expect(record.mock.calls).toEqual([[6]]);
    expect(secondRecord.mock.calls).toEqual([[3]]);
  });

  it("does not fabricate a snapshot during Strict Mode setup and cleanup", () => {
    const { unmount } = renderHook(() => useInsightsDwellTime(record), {
      wrapper: ({ children }: { children: ReactNode }) => (
        <StrictMode>{children}</StrictMode>
      ),
    });
    expect(record).not.toHaveBeenCalled();
    now = 5000;
    unmount();
    expect(record.mock.calls).toEqual([[5]]);
  });

  const advance = (ms: number) =>
    act(() => {
      now += ms;
      jest.advanceTimersByTime(ms);
    });

  it("fires the four-minute threshold while the page is visible, once per visit", () => {
    const threshold = jest.fn();
    const { unmount } = renderHook(() =>
      useInsightsDwellTime(record, threshold),
    );
    advance(239999);
    expect(threshold).not.toHaveBeenCalled();
    advance(1);
    expect(threshold.mock.calls).toEqual([[240]]);
    expect(record).not.toHaveBeenCalled();
    advance(120000);
    setVisibility("hidden");
    unmount();
    expect(threshold.mock.calls).toEqual([[240]]);
    expect(record.mock.calls).toEqual([[360]]);
  });

  it("pauses the threshold countdown while hidden and resumes the remaining time", () => {
    const threshold = jest.fn();
    renderHook(() => useInsightsDwellTime(record, threshold));
    advance(100000);
    setVisibility("hidden");
    advance(600000);
    expect(threshold).not.toHaveBeenCalled();
    setVisibility("visible");
    advance(139999);
    expect(threshold).not.toHaveBeenCalled();
    advance(1);
    expect(threshold.mock.calls).toEqual([[240]]);
  });

  it("checks a delayed threshold on exit and does not duplicate it during cleanup", () => {
    const threshold = jest.fn();
    const { unmount } = renderHook(() =>
      useInsightsDwellTime(record, threshold),
    );
    now = 250000; // The browser has not run the scheduled timeout yet.
    act(() => window.dispatchEvent(new Event("pagehide")));
    expect(threshold.mock.calls).toEqual([[250]]);
    unmount();
    advance(300000);
    expect(threshold.mock.calls).toEqual([[250]]);
  });

  it("cancels the old threshold timer and starts fresh after navigation", () => {
    const firstThreshold = jest.fn();
    const firstVisit = renderHook(() =>
      useInsightsDwellTime(record, firstThreshold),
    );
    advance(200000);
    firstVisit.unmount();
    const nextThreshold = jest.fn();
    renderHook(() => useInsightsDwellTime(record, nextThreshold));
    advance(239999);
    expect(firstThreshold).not.toHaveBeenCalled();
    expect(nextThreshold).not.toHaveBeenCalled();
    advance(1);
    expect(nextThreshold.mock.calls).toEqual([[240]]);
  });

  it("preserves the threshold countdown across callback changes", () => {
    const firstThreshold = jest.fn();
    const nextThreshold = jest.fn();
    const { rerender } = renderHook(
      ({ callback }) => useInsightsDwellTime(record, callback),
      { initialProps: { callback: firstThreshold } },
    );
    advance(200000);
    rerender({ callback: nextThreshold });
    advance(40000);
    expect(firstThreshold).not.toHaveBeenCalled();
    expect(nextThreshold.mock.calls).toEqual([[240]]);
  });

  it("resumes the threshold after back/forward cache restoration", () => {
    const threshold = jest.fn();
    renderHook(() => useInsightsDwellTime(record, threshold));
    advance(200000);
    act(() => window.dispatchEvent(new Event("pagehide")));
    advance(600000);
    expect(threshold).not.toHaveBeenCalled();
    act(() => window.dispatchEvent(new Event("pageshow")));
    advance(40000);
    expect(threshold.mock.calls).toEqual([[240]]);
  });
});
