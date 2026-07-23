import { renderHook } from "@testing-library/react";

import { useCaptureFeatureFlag } from "./useCaptureFeatureFlag";

const mockTrackFeatureFlag = jest.fn();
jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    trackFeatureFlag: mockTrackFeatureFlag,
  }),
}));

const getCookies = jest.fn().mockReturnValue("control");
jest.mock("js-cookie", () => ({
  __esModule: true,
  default: {
    get: () => getCookies(),
  },
}));

describe("useCaptureFeatureFlag", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });
  it("calls trackFeatureFlag when an experiment cookie is present", () => {
    renderHook(() => useCaptureFeatureFlag("test-flag"));

    expect(mockTrackFeatureFlag).toHaveBeenCalledWith({
      $feature_flag: "test-flag",
      $feature_flag_response: "control",
    });
  });
  it("does not call trackFeatureFlag when no cookie is present", () => {
    getCookies.mockReturnValue(undefined);
    renderHook(() => useCaptureFeatureFlag("test-flag"));

    expect(mockTrackFeatureFlag).not.toHaveBeenCalled();
  });
});
