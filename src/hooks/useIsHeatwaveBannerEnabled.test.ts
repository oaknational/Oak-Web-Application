const mockUseFeatureFlagEnabled = jest.fn();

const loadHook = (enableHeatwaveBannerOverride: boolean) => {
  jest.resetModules();

  jest.doMock("posthog-js/react", () => ({
    useFeatureFlagEnabled: (...args: unknown[]) =>
      mockUseFeatureFlagEnabled(...args),
  }));

  jest.doMock("@/config/flags", () => ({
    ENABLE_HEATWAVE_BANNER: enableHeatwaveBannerOverride,
  }));

  return require("./useIsHeatwaveBannerEnabled")
    .useIsHeatwaveBannerEnabled as () => boolean;
};

describe("useIsHeatwaveBannerEnabled", () => {
  beforeEach(() => {
    mockUseFeatureFlagEnabled.mockReset();
  });

  it("returns false when override is off and feature flag is disabled", () => {
    mockUseFeatureFlagEnabled.mockReturnValue(false);
    const useIsHeatwaveBannerEnabled = loadHook(false);

    expect(useIsHeatwaveBannerEnabled()).toBe(false);
  });

  it("returns true when override is off and feature flag is enabled", () => {
    mockUseFeatureFlagEnabled.mockReturnValue(true);
    const useIsHeatwaveBannerEnabled = loadHook(false);

    expect(useIsHeatwaveBannerEnabled()).toBe(true);
  });

  it("returns true when override is on even if feature flag is disabled", () => {
    mockUseFeatureFlagEnabled.mockReturnValue(false);
    const useIsHeatwaveBannerEnabled = loadHook(true);

    expect(useIsHeatwaveBannerEnabled()).toBe(true);
  });

  it("checks the heatwave-banner feature flag", () => {
    mockUseFeatureFlagEnabled.mockReturnValue(false);
    const useIsHeatwaveBannerEnabled = loadHook(false);

    useIsHeatwaveBannerEnabled();

    expect(mockUseFeatureFlagEnabled).toHaveBeenCalledWith("heatwave-banner");
  });
});
