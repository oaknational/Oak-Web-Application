import { waitFor } from "@testing-library/dom";

import SizeMonitor from ".";

import renderWithTheme from "@/__tests__/__helpers__/renderWithTheme";

const width = 100;
const height = 100;
const observeSpy = vi.fn();
window.ResizeObserver = class MockedResizeObserver {
  constructor(cb: ResizeObserverCallback) {
    setTimeout(() => {
      cb(
        [
          {
            contentRect: {
              height,
              width,
            },
          },
        ] as ResizeObserverEntry[],
        this,
      );
    }, 0);
  }
  // Attaching spy to "observe" function.
  observe = observeSpy;
  unobserve = vi.fn();
  disconnect = vi.fn();
};

describe("SizeMonitor", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });
  test("render", () => {
    const { baseElement } = renderWithTheme(
      <SizeMonitor onChange={() => {}}>testing</SizeMonitor>,
    );

    expect(baseElement).toMatchSnapshot();
  });

  test("resize", async () => {
    const spy = vi.spyOn(window.HTMLElement.prototype, "getBoundingClientRect");
    spy.mockImplementation(
      () =>
        ({
          bottom: height,
          height,
          right: width,
          width,
          left: 0,
          top: 0,
        }) as DOMRect,
    );

    const onChange = vi.fn();
    const { getByTestId } = renderWithTheme(
      <SizeMonitor onChange={onChange}>
        <div style={{ width, height }}>testing</div>
      </SizeMonitor>,
    );

    expect(observeSpy).toHaveBeenCalledTimes(1);
    expect(observeSpy).toHaveBeenCalledWith(getByTestId("size-container"));

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith({ width, height });
    });
  });
});
