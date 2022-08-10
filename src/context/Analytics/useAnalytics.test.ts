import { act, renderHook } from "@testing-library/react-hooks";

import { AllTheProviders } from "../../__tests__/__helpers__/renderWithProviders";

import useAnalytics from "./useAnalytics";

const posthogCapture = jest.fn();
const posthogInit = jest.fn();
jest.mock("posthog-js", () => ({
  __esModule: true,
  default: {
    ...jest.requireActual("posthog-js"),
    capture: (...args: []) => posthogCapture(...args),
    init: (...args: []) => posthogInit(...args),
  },
}));

describe("useAnalytics", () => {
  test("track should not work if statistics consent not given", () => {
    const { result } = renderHook(useAnalytics, { wrapper: AllTheProviders });

    act(() => {
      result.current.track.buttonClicked({ buttonIdentifier: "test" });
    });

    expect(posthogCapture).not.toHaveBeenCalled();
  });
  test("posthog should not be initialised if statistics consent not given", () => {
    const { result } = renderHook(useAnalytics, { wrapper: AllTheProviders });
    act(() => {
      result.current.track.buttonClicked({ buttonIdentifier: "test" });
    });

    expect(posthogInit).not.toHaveBeenCalled();
  });
});
