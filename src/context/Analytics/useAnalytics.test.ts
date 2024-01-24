import { beforeEach, describe, expect, it, vi } from "vitest";
import { act } from "@testing-library/react";

import { renderHookWithProviders } from "../../__tests__/__helpers__/renderWithProviders";

import useAnalytics from "./useAnalytics";

const posthogCapture = vi.fn();
const posthogInit = vi.fn();
vi.mock("posthog-js", async () => ({
  __esModule: true,
  default: {
    ...(await vi.importActual("posthog-js")),
    capture: (...args: []) => posthogCapture(...args),
    init: (...args: []) => posthogInit(...args),
  },
}));

describe("useAnalytics", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("track should not work if statistics consent not given", () => {
    const { result } = renderHookWithProviders()(useAnalytics);

    act(() => {
      result.current.track.aboutSelected();
    });

    expect(posthogCapture).not.toHaveBeenCalled();
  });
  it("posthog should not be initialised if statistics consent not given", () => {
    const { result } = renderHookWithProviders()(useAnalytics);
    act(() => {
      result.current.track.developYourCurriculumSelected();
    });

    expect(posthogInit).not.toHaveBeenCalled();
  });
});
