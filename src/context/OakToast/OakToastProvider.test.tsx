import { act, waitFor } from "@testing-library/react";

import { useOakToastContext } from "./useOakToastContext";

import renderWithProviders from "@/__tests__/__helpers__/renderWithProviders";

const mockIntersectionObserver = jest.fn();
const mockDisconnect = jest.fn();

const render = renderWithProviders();

beforeEach(() => {
  mockIntersectionObserver.mockClear();
  mockDisconnect.mockClear();

  global.IntersectionObserver = jest.fn().mockImplementation((callback) => {
    mockIntersectionObserver.mockImplementation(callback);
    return {
      disconnect: mockDisconnect,
      unobserve: jest.fn(),
    };
  });

  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
  jest.clearAllMocks();
});

const TestComponent = () => {
  const { currentToastProps, setCurrentToastProps } = useOakToastContext();
  return (
    <div>
      <button
        onClick={() =>
          setCurrentToastProps({
            message: "test",
            variant: "success",
            autoDismiss: true,
            showIcon: false,
          })
        }
        data-testid="show-toast"
      >
        Show Toast
      </button>
      {currentToastProps && (
        <div data-testid="toast-message">{currentToastProps.message}</div>
      )}
    </div>
  );
};

describe("OakToastProvider", () => {
  test("sets offset to 32 when header is not visible", async () => {
    const { container } = render(<TestComponent />);

    act(() => {
      jest.advanceTimersByTime(500);
    });

    act(() => {
      mockIntersectionObserver([{ isIntersecting: false }]);
    });

    await waitFor(() => {
      const toastContainer = container.querySelector('[aria-live="polite"]');
      expect(toastContainer).toHaveStyle("top: 32px");
    });
  });

  test("sets offset to 82 when header is visible", async () => {
    const { container } = render(<TestComponent />);

    act(() => {
      jest.advanceTimersByTime(500);
    });

    act(() => {
      mockIntersectionObserver([{ isIntersecting: true }]);
    });

    await waitFor(() => {
      const toastContainer = container.querySelector('[aria-live="polite"]');
      expect(toastContainer).toHaveStyle("top: 82px");
    });
  });

  test("cleans up observer on unmount", () => {
    const { unmount } = render(<TestComponent />);

    unmount();

    expect(mockDisconnect).toHaveBeenCalled();
  });
});
