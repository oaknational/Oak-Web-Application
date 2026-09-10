import { render } from "@testing-library/react";

import TrackScrolledTo from "./index";

import useAnalytics from "@/context/Analytics/useAnalytics";

jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: jest.fn(),
}));

const mockUseAnalytics = jest.mocked(useAnalytics);

describe("TrackScrolledTo", () => {
  let observerCallback: IntersectionObserverCallback;
  const observe = jest.fn();
  const disconnect = jest.fn();
  const unobserve = jest.fn();

  const scrolledTo = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    mockUseAnalytics.mockReturnValue({
      track: {
        scrolledTo,
      },
    } as never);

    jest
      .spyOn(window, "IntersectionObserver")
      .mockImplementation((cb: IntersectionObserverCallback) => {
        observerCallback = cb;
        return {
          observe,
          disconnect,
          unobserve,
        } as unknown as IntersectionObserver;
      });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("renders an element", () => {
    const { container } = render(<TrackScrolledTo eventKey="support_you" />);

    expect(container.firstChild).toBeInTheDocument();
  });

  test("registers an observer and observes the rendered element", () => {
    const { container } = render(<TrackScrolledTo eventKey="support_you" />);

    expect(window.IntersectionObserver).toHaveBeenCalledWith(
      expect.any(Function),
      { threshold: 0, rootMargin: "-1px 0px 0px" },
    );
    expect(observe).toHaveBeenCalledWith(container.firstChild);
  });

  test("tracks when the component scrolls into view", () => {
    render(<TrackScrolledTo eventKey="support_you" />);

    observerCallback(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );

    expect(scrolledTo).toHaveBeenCalledWith({ key: "support_you" });
  });

  test("tracks only once when intersecting multiple times", () => {
    render(<TrackScrolledTo eventKey="support_you" />);

    observerCallback(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );

    observerCallback(
      [{ isIntersecting: true } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );

    expect(scrolledTo).toHaveBeenCalledTimes(1);
  });

  test("does not track when the component is not intersecting", () => {
    render(<TrackScrolledTo eventKey="support_you" />);

    observerCallback(
      [{ isIntersecting: false } as IntersectionObserverEntry],
      {} as IntersectionObserver,
    );

    expect(scrolledTo).not.toHaveBeenCalled();
  });

  test("disconnects observer on unmount", () => {
    const { unmount } = render(<TrackScrolledTo eventKey="support_you" />);

    unmount();

    expect(disconnect).toHaveBeenCalled();
  });
});
