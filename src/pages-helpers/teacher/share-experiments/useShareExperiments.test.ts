import { renderHook } from "@testing-library/react";
import { useFeatureFlagVariantKey } from "posthog-js/react";

import { useShareExperiment } from "./useShareExperiment";
import { getShareIdKey } from "./createShareId";

jest.mock("posthog-js/react", () => ({
  useFeatureFlagVariantKey: jest.fn(),
}));

describe("useShareExperiments", () => {
  it("should return null values if the feature flag is not found", () => {
    // hook wrapper
    const { result } = renderHook(() =>
      useShareExperiment({
        lessonSlug: "lessonSlug",
        unitSlug: "unitSlug",
        programmeSlug: "programmeSlug",
      }),
    );

    const { shareIdRef, shareIdKeyRef } = result.current;
    expect(shareIdRef.current).toBeNull();
    expect(shareIdKeyRef.current).toBeNull();
  });

  it("should generate a shareId if the feature flag is enabled", () => {
    // mock the feature flag
    (useFeatureFlagVariantKey as jest.Mock).mockReturnValue(true);

    // hook wrapper
    const { result } = renderHook(() =>
      useShareExperiment({
        lessonSlug: "lessonSlug",
        unitSlug: "unitSlug",
        programmeSlug: "programmeSlug",
      }),
    );

    const { shareIdRef, shareIdKeyRef } = result.current;
    expect(shareIdRef.current).not.toBeNull();
    expect(shareIdKeyRef.current).not.toBeNull();
  });

  it("should update the window location with the shareId", () => {
    // mock the feature flag
    (useFeatureFlagVariantKey as jest.Mock).mockReturnValue(true);

    // hook wrapper
    renderHook(() =>
      useShareExperiment({
        lessonSlug: "lessonSlug",
        unitSlug: "unitSlug",
        programmeSlug: "programmeSlug",
      }),
    );

    const key = getShareIdKey("lessonSlug_unitSlug_programmeSlug");

    expect(window.location.href).toBe(
      `http://localhost/?${key}=xxxxxxxxxx&sm=0`,
    );
  });
});
