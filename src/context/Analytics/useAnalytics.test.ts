import { act } from "@testing-library/react";

import { renderHookWithProviders } from "../../__tests__/__helpers__/renderWithProviders";

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
  beforeEach(() => {
    jest.clearAllMocks();
  });
  test("track should not work if statistics consent not given", () => {
    const { result } = renderHookWithProviders()(useAnalytics);

    act(() => {
      result.current.track.aboutSelected();
    });

    expect(posthogCapture).not.toHaveBeenCalled();
  });
  test("posthog should not be initialised if statistics consent not given", () => {
    const { result } = renderHookWithProviders()(useAnalytics);
    act(() => {
      result.current.track.developYourCurriculumSelected();
    });

    expect(posthogInit).not.toHaveBeenCalled();
  });
});
