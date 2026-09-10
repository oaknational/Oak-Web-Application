import { type ReactNode } from "react";
import { act, renderHook, waitFor } from "@testing-library/react";

import {
  CurrentSectionIdProvider,
  pickSectionClosestToReferenceLine,
  useCurrentSectionId,
} from "./CurrentSectionIdProvider";

function makeRect(top: number) {
  return {
    top,
    bottom: top + 40,
    left: 0,
    right: 100,
    width: 100,
    height: 40,
    x: 0,
    y: top,
    toJSON() {
      return {};
    },
  };
}

function mockIntersectionObserver() {
  let ioCallback: IntersectionObserverCallback | undefined;
  const observe = jest.fn();
  const disconnect = jest.fn();
  const unobserve = jest.fn();

  const ioSpy = jest
    .spyOn(globalThis, "IntersectionObserver")
    .mockImplementation((cb: IntersectionObserverCallback) => {
      ioCallback = cb;
      return {
        observe,
        disconnect,
        unobserve,
        takeRecords: () => [],
      } as unknown as IntersectionObserver;
    });

  return {
    trigger: () => ioCallback?.([], {} as IntersectionObserver),
    observe,
    disconnect,
    unobserve,
    restore: () => ioSpy.mockRestore(),
  };
}

function flushRafAndDebounceTimers() {
  // 1) RAF callback scheduled by IO trigger
  jest.runOnlyPendingTimers();
  // 2) debounce timeout
  jest.runOnlyPendingTimers();
}

describe("pickSectionClosestToReferenceLine", () => {
  function mockSection(id: string, top: number): HTMLElement {
    const el = document.createElement("div");
    el.id = id;
    el.getBoundingClientRect = jest.fn(() => makeRect(top));
    return el;
  }

  it("returns the section whose top is closest to top of the viewport", () => {
    const nodes = [
      mockSection("slide-deck", -20),
      mockSection("lesson-details", -5),
      mockSection("video", 40),
    ];
    expect(pickSectionClosestToReferenceLine(nodes, -1)).toBe("lesson-details");
  });

  it("can select a section below the top when it is closer", () => {
    const nodes = [mockSection("a", 80), mockSection("b", 400)];
    expect(pickSectionClosestToReferenceLine(nodes, -1)).toBe("a");
  });

  it("returns null when sentinel is in viewport", () => {
    const nodes = [mockSection("a", -50), mockSection("b", 160)];
    expect(pickSectionClosestToReferenceLine(nodes, 10)).toBeNull();
  });

  it("can select sections when sentinel is above viewport", () => {
    const nodes = [mockSection("a", -50), mockSection("b", 160)];
    expect(pickSectionClosestToReferenceLine(nodes, -10)).toBe("a");
  });

  it("returns null when there are no sections", () => {
    expect(pickSectionClosestToReferenceLine([], -1)).toBeNull();
  });
});

describe("CurrentSectionIdProvider", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <CurrentSectionIdProvider>{children}</CurrentSectionIdProvider>
  );

  beforeEach(() => {
    globalThis.location.hash = "";
    document.body.replaceChildren();
  });

  it("exposes null after mount when there is no hash", async () => {
    const { result } = renderHook(() => useCurrentSectionId(), { wrapper });

    await waitFor(() => {
      expect(result.current).toBeNull();
    });
  });

  it("does not derive current section from URL hash alone", async () => {
    globalThis.location.hash = "#worksheet";

    const { result } = renderHook(() => useCurrentSectionId(), { wrapper });

    await waitFor(() => {
      expect(result.current).toBeNull();
    });
  });

  it("recomputes current section when hash changes", async () => {
    const section = document.createElement("div");
    section.id = "quiz";
    section.className = "anchor-section";
    section.getBoundingClientRect = jest.fn(() => makeRect(10));
    document.body.append(section);

    const { result } = renderHook(() => useCurrentSectionId(), { wrapper });

    await waitFor(() => {
      expect(result.current).toBeNull();
    });

    act(() => {
      globalThis.location.hash = "#quiz";
      globalThis.dispatchEvent(new HashChangeEvent("hashchange"));
    });

    await waitFor(() => {
      expect(result.current).toBe("quiz");
    });
  });

  it("treats an empty hash as null", async () => {
    globalThis.location.hash = "#";

    const { result } = renderHook(() => useCurrentSectionId(), { wrapper });

    await waitFor(() => {
      expect(result.current).toBeNull();
    });
  });

  it("recomputes from section proximity when IntersectionObserver fires", async () => {
    const ioMock = mockIntersectionObserver();

    const a = document.createElement("div");
    a.id = "slide-deck";
    a.className = "anchor-section";
    a.getBoundingClientRect = jest.fn(() => makeRect(120));

    const b = document.createElement("div");
    b.id = "lesson-details";
    b.className = "anchor-section";
    b.getBoundingClientRect = jest.fn(() => makeRect(400));

    document.body.append(a, b);

    try {
      const { result } = renderHook(() => useCurrentSectionId(), { wrapper });

      await waitFor(() => {
        expect(result.current).toBe("slide-deck");
      });

      act(() => {
        a.getBoundingClientRect = jest.fn(() => makeRect(-30));
        b.getBoundingClientRect = jest.fn(() => makeRect(15));
        ioMock.trigger();
      });

      await waitFor(() => {
        expect(result.current).toBe("lesson-details");
      });

      act(() => {
        b.getBoundingClientRect = jest.fn(() => makeRect(-2));
        ioMock.trigger();
      });

      await waitFor(() => {
        expect(result.current).toBe("lesson-details");
      });
    } finally {
      ioMock.restore();
    }
  });

  it("updates the address bar with replaceState after scroll when the section changes", async () => {
    const replaceStateSpy = jest.spyOn(history, "replaceState");
    const ioMock = mockIntersectionObserver();

    const a = document.createElement("div");
    a.id = "a";
    a.className = "anchor-section";
    a.getBoundingClientRect = jest.fn(() => makeRect(100));

    const b = document.createElement("div");
    b.id = "b";
    b.className = "anchor-section";
    b.getBoundingClientRect = jest.fn(() => makeRect(400));

    document.body.append(a, b);

    renderHook(() => useCurrentSectionId(), { wrapper });

    expect(replaceStateSpy).not.toHaveBeenCalled();

    act(() => {
      a.getBoundingClientRect = jest.fn(() => makeRect(-20));
      b.getBoundingClientRect = jest.fn(() => makeRect(80));
      ioMock.trigger();
      flushRafAndDebounceTimers();
    });

    expect(replaceStateSpy).toHaveBeenCalledWith(
      null,
      "",
      expect.stringMatching(/#a$/),
    );

    act(() => {
      b.getBoundingClientRect = jest.fn(() => makeRect(-1));
      ioMock.trigger();
      flushRafAndDebounceTimers();
    });

    expect(replaceStateSpy).toHaveBeenCalledWith(
      null,
      "",
      expect.stringMatching(/#b$/),
    );

    replaceStateSpy.mockRestore();
    ioMock.restore();
  });

  it("removes the hash when current section becomes null", async () => {
    globalThis.location.hash = "#worksheet";
    const replaceStateSpy = jest.spyOn(history, "replaceState");

    const { result } = renderHook(() => useCurrentSectionId(), { wrapper });

    act(() => {
      globalThis.dispatchEvent(new HashChangeEvent("hashchange"));
      flushRafAndDebounceTimers();
    });
    expect(result.current).toBeNull();
    expect(replaceStateSpy).toHaveBeenCalledWith(
      null,
      "",
      expect.not.stringContaining("#"),
    );

    replaceStateSpy.mockRestore();
  });
});
