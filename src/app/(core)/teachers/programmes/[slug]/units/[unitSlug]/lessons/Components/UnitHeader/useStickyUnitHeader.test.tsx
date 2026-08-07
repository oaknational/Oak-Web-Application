import { act, render, screen } from "@testing-library/react";

import { useStickyUnitHeader } from "./useStickyUnitHeader";

const observe = jest.fn();
const disconnect = jest.fn();
const unobserve = jest.fn();

const intersectionObserver = {
  disconnect,
  observe,
  root: null,
  rootMargin: "-1px 0px 0px",
  takeRecords: jest.fn(() => []),
  thresholds: [0],
  unobserve,
} as unknown as IntersectionObserver;

let intersectionObserverCallback: IntersectionObserverCallback;

const triggerIntersection = ({
  bottom,
  isIntersecting,
  rootTop,
}: {
  bottom: number;
  isIntersecting: boolean;
  rootTop: number | null;
}) => {
  const entry = {
    boundingClientRect: { bottom },
    isIntersecting,
    rootBounds: rootTop === null ? null : { top: rootTop },
  } as IntersectionObserverEntry;

  act(() => intersectionObserverCallback([entry], intersectionObserver));
};

const StickyHookHarness = () => {
  const { sentinelRef, isStuck } = useStickyUnitHeader();

  return (
    <>
      <div data-testid="is-stuck">{String(isStuck)}</div>
      <div ref={sentinelRef} />
    </>
  );
};

describe("useStickyUnitHeader", () => {
  let intersectionObserverSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    intersectionObserverSpy = jest
      .spyOn(window, "IntersectionObserver")
      .mockImplementation((callback, options) => {
        if (options?.rootMargin === "-1px 0px 0px") {
          intersectionObserverCallback = callback;
        }

        return intersectionObserver;
      });
  });

  afterEach(() => {
    intersectionObserverSpy.mockRestore();
  });

  it("starts unstuck and observes the sentinel", () => {
    render(<StickyHookHarness />);

    expect(screen.getByTestId("is-stuck")).toHaveTextContent("false");
    expect(observe).toHaveBeenCalledTimes(1);
  });

  it("becomes stuck only after the sentinel has moved above the viewport", () => {
    render(<StickyHookHarness />);

    triggerIntersection({ bottom: 100, isIntersecting: false, rootTop: 0 });
    expect(screen.getByTestId("is-stuck")).toHaveTextContent("false");

    triggerIntersection({ bottom: -1, isIntersecting: false, rootTop: null });
    expect(screen.getByTestId("is-stuck")).toHaveTextContent("true");

    triggerIntersection({ bottom: 0, isIntersecting: true, rootTop: 0 });
    expect(screen.getByTestId("is-stuck")).toHaveTextContent("false");
  });

  it("falls back to unstuck when observer callback has no entry", () => {
    render(<StickyHookHarness />);

    act(() => intersectionObserverCallback([], intersectionObserver));

    expect(screen.getByTestId("is-stuck")).toHaveTextContent("false");
  });

  it("disconnects observer on unmount", () => {
    const { unmount } = render(<StickyHookHarness />);

    disconnect.mockClear();
    unmount();

    expect(disconnect).toHaveBeenCalledTimes(1);
  });
});
