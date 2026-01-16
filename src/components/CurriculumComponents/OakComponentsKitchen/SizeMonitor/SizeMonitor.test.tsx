import { waitFor } from "@testing-library/dom";

import SizeMonitor from ".";

import { renderWithProvidersByName } from "@/__tests__/__helpers__/renderWithProviders";

const render = renderWithProvidersByName(["oakTheme"]);

const width = 100;
const height = 100;
const observeSpy = jest.fn();
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
  unobserve = jest.fn();
  disconnect = jest.fn();
};

describe("SizeMonitor", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  test("render", () => {
    const { baseElement } = render(
      <SizeMonitor onChange={() => {}}>testing</SizeMonitor>,
    );

    expect(baseElement).toMatchSnapshot();
  });

  test("resize", async () => {
    const spy = jest.spyOn(
      window.HTMLElement.prototype,
      "getBoundingClientRect",
    );
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

    const onChange = jest.fn();
    const { getByTestId } = render(
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
