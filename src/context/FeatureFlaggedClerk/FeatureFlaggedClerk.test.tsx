import * as posthog from "posthog-js/react";
import { renderHook } from "@testing-library/react";
import { useUser } from "@clerk/nextjs";

import {
  FeatureFlaggedClerkProvider,
  useFeatureFlaggedClerk,
} from "./FeatureFlaggedClerk";

jest.mock("posthog-js/react");

describe(FeatureFlaggedClerkProvider, () => {
  it("provides the real API when the feature flag is enabled", () => {
    const flagSpy = jest
      .spyOn(posthog, "useFeatureFlagEnabled")
      .mockReturnValue(true);

    const { rerender, result } = renderHook(() => useFeatureFlaggedClerk(), {
      wrapper: FeatureFlaggedClerkProvider,
    });

    expect(result.current.useUser).toBe(useUser);

    flagSpy.mockReturnValue(false);

    rerender();

    expect(result.current.useUser).not.toBe(useUser);
  });
});
