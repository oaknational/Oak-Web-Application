import { renderHook } from "@testing-library/react";
import { useFeatureFlagVariantKey } from "posthog-js/react";

import {
  CurriculumTrackingProps,
  useShareExperiment,
} from "./useShareExperiment";
import { getShareIdKey, createAndStoreShareId } from "./createShareId";

import useAnalytics from "@/context/Analytics/useAnalytics";

jest.mock("posthog-js/react", () => ({
  useFeatureFlagVariantKey: jest.fn(),
}));

jest.mock("@/context/Analytics/useAnalytics", () => {
  const track = {
    teacherShareInitiated: jest.fn(),
    teacherShareConverted: jest.fn(),
  };

  return {
    __esModule: true,
    default: jest.fn(() => ({
      track,
    })),
  };
});

//mock console.error
console.error = jest.fn();

interface MockLocation {
  href: string;
}

describe("useShareExperiments", () => {
  const curriculumTrackingProps: CurriculumTrackingProps = {
    lessonName: "lessonName",
    unitName: "unitName",
    subjectSlug: "subjectSlug",
    subjectTitle: "subjectTitle",
    keyStageSlug: "keyStageSlug",
    keyStageTitle: "Key stage 1",
  };

  beforeEach(() => {
    jest.clearAllMocks();

    //clear the cookies
    document.cookie.split(";").forEach((cookie) => {
      document.cookie = cookie
        .replace(/^ +/, "")
        .replace(/=.*/, `=;expires=${new Date(0).toUTCString()}`);
    });

    Object.defineProperty(window, "location", {
      writable: true,
      value: {
        href: "http://localhost",
        assign: jest.fn(),
        replace: jest.fn(),
        search: "",
      } as MockLocation,
    });
  });

  it("should return null values if the feature flag is not found", () => {
    // hook wrapper
    const { result } = renderHook(() =>
      useShareExperiment({
        lessonSlug: "lessonSlug",
        unitSlug: "unitSlug",
        programmeSlug: "programmeSlug",
        source: "lesson-canonical",
        curriculumTrackingProps,
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
        source: "lesson-canonical",
        curriculumTrackingProps,
      }),
    );

    const { shareIdRef, shareIdKeyRef } = result.current;
    expect(shareIdRef.current).not.toBeNull();
    expect(shareIdKeyRef.current).not.toBeNull();
  });

  it("should update the window location with the shareId", () => {
    jest.spyOn(window.history, "replaceState").mockImplementation(() => {});

    // mock the feature flag
    (useFeatureFlagVariantKey as jest.Mock).mockReturnValue(true);

    // hook wrapper
    renderHook(() =>
      useShareExperiment({
        lessonSlug: "lessonSlug",
        unitSlug: "unitSlug",
        programmeSlug: "programmeSlug",
        source: "lesson-canonical",
        curriculumTrackingProps,
      }),
    );

    const key = getShareIdKey("lessonSlug_unitSlug_programmeSlug");

    expect(window.history.replaceState).toHaveBeenCalledWith(
      expect.anything(), // Ignore the first argument
      expect.anything(), // Ignore the second argument
      `http://localhost?${key}=xxxxxxxxxx&sm=0&src=1`,
    );
  });

  it("should call track shareInitiated if there is no cookie and the feature flag is enabled", () => {
    // mock the feature flag
    (useFeatureFlagVariantKey as jest.Mock).mockReturnValue(true);

    const mockTrack = useAnalytics().track;

    // hook wrapper
    renderHook(() =>
      useShareExperiment({
        lessonSlug: "lessonSlug",
        unitSlug: "unitSlug",
        programmeSlug: "programmeSlug",
        source: "lesson-canonical",
        curriculumTrackingProps,
      }),
    );

    expect(mockTrack.teacherShareInitiated).toHaveBeenCalled();
  });

  it("should not call share initiated if the cookie is already present", () => {
    (useFeatureFlagVariantKey as jest.Mock).mockReturnValue(true);

    const mockTrack = useAnalytics().track;

    // set the cookie
    createAndStoreShareId("lessonSlug_unitSlug_programmeSlug");

    // hook wrapper
    renderHook(() =>
      useShareExperiment({
        lessonSlug: "lessonSlug",
        unitSlug: "unitSlug",
        programmeSlug: "programmeSlug",
        source: "lesson-canonical",
        curriculumTrackingProps,
      }),
    );

    expect(mockTrack.teacherShareInitiated).not.toHaveBeenCalled();
  });

  it("should call track shareConverted the url shareId is present and there is no cookieId or feature flag", () => {
    (useFeatureFlagVariantKey as jest.Mock).mockReturnValue(false);

    const mockTrack = useAnalytics().track;

    const key = getShareIdKey("lessonSlug_unitSlug_programmeSlug");

    window.location.search = `?${key}=xxxxxxxxxx&sm=0&src=1`;

    // hook wrapper
    renderHook(() =>
      useShareExperiment({
        lessonSlug: "lessonSlug",
        unitSlug: "unitSlug",
        programmeSlug: "programmeSlug",
        source: "lesson-canonical",
        curriculumTrackingProps,
      }),
    );

    expect(mockTrack.teacherShareConverted).toHaveBeenCalled();
  });

  it("should not call track shareConverted if the url shareId matches cookieId ", () => {
    (useFeatureFlagVariantKey as jest.Mock).mockReturnValue(false);

    const mockTrack = useAnalytics().track;

    const key = getShareIdKey("lessonSlug_unitSlug_programmeSlug");

    // set the cookie
    createAndStoreShareId("lessonSlug_unitSlug_programmeSlug");

    window.location.search = `?${key}=xxxxxxxxxx&sm=0&src=1`;

    // hook wrapper
    renderHook(() =>
      useShareExperiment({
        lessonSlug: "lessonSlug",
        unitSlug: "unitSlug",
        programmeSlug: "programmeSlug",
        source: "lesson-canonical",
        curriculumTrackingProps,
      }),
    );

    expect(mockTrack.teacherShareConverted).not.toHaveBeenCalled();
  });

  it("should store the conversion shareId in a cookie", () => {
    (useFeatureFlagVariantKey as jest.Mock).mockReturnValue(false);

    const key = getShareIdKey("lessonSlug_unitSlug_programmeSlug");

    window.location.search = `?${key}=xxxxxxxxxx&sm=0&src=1`;

    // hook wrapper
    renderHook(() =>
      useShareExperiment({
        lessonSlug: "lessonSlug",
        unitSlug: "unitSlug",
        programmeSlug: "programmeSlug",
        source: "lesson-canonical",
        curriculumTrackingProps,
      }),
    );

    expect(document.cookie).toContain(`cv-xxxxxxxxxx=true`);
  });

  it("should not send a conversion event if the conversion shareId is already present", () => {
    (useFeatureFlagVariantKey as jest.Mock).mockReturnValue(false);

    const mockTrack = useAnalytics().track;

    const key = getShareIdKey("lessonSlug_unitSlug_programmeSlug");

    window.location.search = `?${key}=xxxxxxxxxx&sm=0&src=1`;

    // set the conversion cookie
    document.cookie = `cv-xxxxxxxxxx=true`;

    // hook wrapper
    renderHook(() =>
      useShareExperiment({
        lessonSlug: "lessonSlug",
        unitSlug: "unitSlug",
        programmeSlug: "programmeSlug",
        source: "lesson-canonical",
        curriculumTrackingProps,
      }),
    );

    expect(mockTrack.teacherShareConverted).not.toHaveBeenCalled();
  });
});
