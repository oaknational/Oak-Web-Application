import posthog from "posthog-js";
import fetchMock from "jest-fetch-mock";

import { featureFlaggedUserFetcher } from "./user-fetcher";

describe(featureFlaggedUserFetcher, () => {
  const profileUrl = "http://example.com/api/auth/me";

  it("should fetch the user when the feature flag is enabled", async () => {
    fetchMock.enableMocks();
    const unsubscribe = jest.fn();
    const profileData = { name: "Phillip J Fry" };
    fetchMock.mockIf(profileUrl, JSON.stringify(profileData));

    jest.spyOn(posthog, "onFeatureFlags").mockImplementation((cb) => {
      setTimeout(() => cb([], {}), 0);
      return unsubscribe;
    });
    jest.spyOn(posthog, "isFeatureEnabled").mockReturnValue(true);

    const result = await featureFlaggedUserFetcher(profileUrl);

    expect(posthog.isFeatureEnabled).toHaveBeenCalledWith("use-auth-owa");
    expect(result).toEqual(profileData);
    expect(unsubscribe).toHaveBeenCalled();

    fetchMock.disableMocks();
  });

  it("should resolve undefined when the feature flag is disabled", async () => {
    const unsubscribe = jest.fn();
    jest.spyOn(posthog, "onFeatureFlags").mockImplementation((cb) => {
      setTimeout(() => cb([], {}), 0);
      return unsubscribe;
    });
    jest.spyOn(posthog, "isFeatureEnabled").mockReturnValue(false);

    const result = await featureFlaggedUserFetcher(profileUrl);

    expect(result).toBeUndefined();
    expect(unsubscribe).toHaveBeenCalled();
  });

  it("should time out and resolve undefined if PostHog fails to load feature flags", async () => {
    jest.useFakeTimers();
    const unsubscribe = jest.fn();
    jest.spyOn(posthog, "onFeatureFlags").mockImplementation(() => {
      return unsubscribe;
    });

    const result = featureFlaggedUserFetcher(profileUrl);
    jest.advanceTimersByTime(5000);

    await expect(result).resolves.toBeUndefined();
    expect(unsubscribe).toHaveBeenCalled();

    jest.useRealTimers();
  });
});
