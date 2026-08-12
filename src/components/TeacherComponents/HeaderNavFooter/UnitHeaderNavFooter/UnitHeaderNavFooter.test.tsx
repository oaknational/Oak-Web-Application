import { screen } from "@testing-library/dom";

import {
  UnitHeaderNavFooter,
  UnitHeaderNavFooterProps,
} from "./UnitHeaderNavFooter";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const defaultProps: UnitHeaderNavFooterProps = {
  backgroundColorLevel: 3,
  viewHref: "testUrl",
};

const render = renderWithTheme;

const createDownloadButton = () =>
  jest.fn(() => <button>action button</button>);

describe("UnitHeaderNavFooter", () => {
  it("Renders the correct text for the view href", () => {
    render(<UnitHeaderNavFooter {...defaultProps} />);

    const viewLink = screen.getByRole("link", { name: "View all units" });
    expect(viewLink).toBeInTheDocument();
  });
  it("Renders previous and next links with correct text", () => {
    render(
      <UnitHeaderNavFooter
        {...defaultProps}
        prevHref="prevUrl"
        nextHref="nextUrl"
      />,
    );

    const prevLink = screen.getByRole("link", { name: "Previous unit" });
    expect(prevLink).toBeInTheDocument();

    const nextLink = screen.getByRole("link", { name: "Next unit" });
    expect(nextLink).toBeInTheDocument();
  });
  it("renders an action button and passes isStuck=false when not stuck", () => {
    const downloadButton = createDownloadButton();

    render(
      <UnitHeaderNavFooter {...defaultProps} downloadButton={downloadButton} />,
    );

    const actionButton = screen.getByRole("button");
    expect(actionButton).toBeInTheDocument();
    expect(actionButton).toHaveTextContent("action button");
    expect(downloadButton).toHaveBeenCalledWith(false);
  });
  it("renders the title when stuck", () => {
    render(
      <UnitHeaderNavFooter
        {...defaultProps}
        isStuck={true}
        title="Unit title"
      />,
    );

    expect(screen.getByText("Unit title")).toBeInTheDocument();
  });
  it("renders the view all units link when not stuck", () => {
    render(
      <UnitHeaderNavFooter
        {...defaultProps}
        isStuck={false}
        title="Unit title"
        prevHref="prevUrl"
        nextHref="nextUrl"
      />,
    );

    expect(
      screen.getByRole("link", { name: "View all units" }),
    ).toBeInTheDocument();
  });
  it("renders in the stuck state with previous and next links and passes isStuck=true to downloadButton", () => {
    const downloadButton = createDownloadButton();

    render(
      <UnitHeaderNavFooter
        {...defaultProps}
        isStuck={true}
        title="Unit title"
        prevHref="prevUrl"
        nextHref="nextUrl"
        backgroundColorLevel={4}
        downloadButton={downloadButton}
      />,
    );

    expect(downloadButton).toHaveBeenCalledWith(true);
    expect(screen.getByText("Unit title")).toBeInTheDocument();
    expect(screen.getByTestId("unit-header-nav-footer")).toHaveAttribute(
      "data-stuck",
      "true",
    );
    expect(
      screen.getByTestId("unit-header-nav-footer-placeholder"),
    ).toBeInTheDocument();
  });
  it("forwards the sentinel ref", () => {
    const sentinelRef = jest.fn();
    render(<UnitHeaderNavFooter {...defaultProps} sentinelRef={sentinelRef} />);

    expect(sentinelRef).toHaveBeenCalled();
  });
  it("adds and removes the resize fallback when ResizeObserver is unavailable", () => {
    const originalResizeObserver = window.ResizeObserver;
    const addEventListener = jest.spyOn(window, "addEventListener");
    const removeEventListener = jest.spyOn(window, "removeEventListener");
    Object.defineProperty(window, "ResizeObserver", {
      configurable: true,
      value: undefined,
    });

    const { unmount } = render(<UnitHeaderNavFooter {...defaultProps} />);

    const resizeHandler = addEventListener.mock.calls.find(
      ([eventName]) => eventName === "resize",
    )?.[1];
    expect(resizeHandler).toEqual(expect.any(Function));

    unmount();
    expect(removeEventListener).toHaveBeenCalledWith("resize", resizeHandler);

    Object.defineProperty(window, "ResizeObserver", {
      configurable: true,
      value: originalResizeObserver,
    });
    addEventListener.mockRestore();
    removeEventListener.mockRestore();
  });

  it("observes footer size changes and disconnects on unmount", () => {
    const originalResizeObserver = window.ResizeObserver;
    const resizeObserver = {
      disconnect: jest.fn(),
      observe: jest.fn(),
      unobserve: jest.fn(),
    };
    const ResizeObserverMock = jest.fn(() => resizeObserver);
    Object.defineProperty(window, "ResizeObserver", {
      configurable: true,
      value: ResizeObserverMock,
    });

    const { unmount } = render(<UnitHeaderNavFooter {...defaultProps} />);

    expect(ResizeObserverMock).toHaveBeenCalledTimes(1);
    expect(resizeObserver.observe).toHaveBeenCalledWith(
      screen.getByTestId("unit-header-nav-footer"),
    );

    unmount();
    expect(resizeObserver.disconnect).toHaveBeenCalledTimes(1);

    Object.defineProperty(window, "ResizeObserver", {
      configurable: true,
      value: originalResizeObserver,
    });
  });
});
