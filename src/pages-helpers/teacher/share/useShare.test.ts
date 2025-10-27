import { renderHook } from "@testing-library/react";

import { useShare } from "./useShare";
import { getShareIdKey, createAndStoreShareId } from "./createShareId";
import { CurriculumTrackingProps } from "./shareTypes";

import useAnalytics from "@/context/Analytics/useAnalytics";
import { LessonReleaseCohortValueType } from "@/browser-lib/avo/Avo";

const mockReplace = jest.fn();

jest.mock("next/router", () => ({
  useRouter: () => ({
    pathname: "/teachers/lessons/lesson-slug",
    query: { existingParam: "value" },
    replace: mockReplace,
  }),
}));

jest.mock("posthog-js/react", () => ({
  useFeatureFlagVariantKey: jest.fn(),
}));

jest.mock("@/context/Analytics/useAnalytics", () => {
  const track = {
    teacherShareInitiated: jest.fn(),
    teacherShareConverted: jest.fn(),
    teacherShareActivated: jest.fn(),
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

describe("useShare", () => {
  const curriculumTrackingProps: CurriculumTrackingProps & {
    lessonReleaseDate: string;
    lessonReleaseCohort: LessonReleaseCohortValueType;
  } = {
    lessonName: "lessonName",
    lessonSlug: "lesson-slug",
    unitName: "unitName",
    unitSlug: "unit-slug",
    subjectSlug: "subjectSlug",
    subjectTitle: "subjectTitle",
    keyStageSlug: "keyStageSlug",
    keyStageTitle: "Key stage 1",
    lessonReleaseDate: "2023-10-01",
    lessonReleaseCohort: "2020-2023",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockReplace.mockClear();

    Object.defineProperty(window, "location", {
      writable: true,
      value: {
        href: "http://localhost",
        assign: jest.fn(),
        replace: jest.fn(),
        search: "",
      } as MockLocation,
    });

    // reset local storage
    localStorage.clear();
  });

  it("should generate a shareId", () => {
    // hook wrapper
    const { result } = renderHook(() =>
      useShare({
        programmeSlug: "programmeSlug",
        source: "lesson-canonical",
        curriculumTrackingProps,
        overrideExistingShareId: true,
      }),
    );

    const { shareIdRef, shareIdKeyRef } = result.current;
    expect(shareIdRef.current).not.toBeNull();
    expect(shareIdKeyRef.current).not.toBeNull();
  });

  it("should return a shareId based on the shareBaseUrl", () => {
    jest.spyOn(window.history, "replaceState").mockImplementation(() => {});

    // hook wrapper
    const { result } = renderHook(() =>
      useShare({
        programmeSlug: "programmeSlug",
        source: "lesson-canonical",
        shareBaseUrl: "http://localhost:3000/teachers/lessons/lesson-slug",
        curriculumTrackingProps,
        overrideExistingShareId: true,
      }),
    );

    const key = getShareIdKey("lesson-slug_unit-slug_programmeSlug");
    const { shareUrl, browserUrl } = result.current;

    expect(browserUrl).toBe(`http://localhost?${key}=xxxxxxxxxx&sm=0&src=1`);
    expect(shareUrl).toBe(
      `http://localhost:3000/teachers/lessons/lesson-slug?${key}=xxxxxxxxxx&sm=1&src=1`,
    );
  });

  it("should call track shareInitiated if there is no storage", () => {
    const mockTrack = useAnalytics().track;

    // hook wrapper
    renderHook(() =>
      useShare({
        programmeSlug: "programmeSlug",
        source: "lesson-canonical",
        curriculumTrackingProps,
        overrideExistingShareId: true,
      }),
    );

    expect(mockTrack.teacherShareInitiated).toHaveBeenCalled();
  });

  it("should not call share initiated if the storage is already present", () => {
    const mockTrack = useAnalytics().track;

    // set the storage
    createAndStoreShareId("lesson-slug_unit-slug_programmeSlug");

    // hook wrapper
    renderHook(() =>
      useShare({
        programmeSlug: "programmeSlug",
        source: "lesson-canonical",
        curriculumTrackingProps,
        overrideExistingShareId: true,
      }),
    );

    expect(mockTrack.teacherShareInitiated).not.toHaveBeenCalled();
  });

  it("should call track shareConverted the url shareId is present and there is no storageId", () => {
    const mockTrack = useAnalytics().track;

    const key = getShareIdKey("lesson-slug_unit-slug_programmeSlug");

    window.location.search = `?${key}=xxxxxxxxxx&sm=0&src=1`;

    // hook wrapper
    renderHook(() =>
      useShare({
        programmeSlug: "programmeSlug",
        source: "lesson-canonical",
        curriculumTrackingProps,
        overrideExistingShareId: true,
      }),
    );

    expect(mockTrack.teacherShareConverted).toHaveBeenCalled();
  });

  it("should not call track shareConverted if the url shareId matches storageId ", () => {
    const mockTrack = useAnalytics().track;

    const key = getShareIdKey("lesson-slug_unit-slug_programmeSlug");

    // set the storage
    createAndStoreShareId("lesson-slug_unit-slug_programmeSlug");

    window.location.search = `?${key}=xxxxxxxxxx&sm=0&src=1`;

    // hook wrapper
    renderHook(() =>
      useShare({
        programmeSlug: "programmeSlug",
        source: "lesson-canonical",
        curriculumTrackingProps,
        overrideExistingShareId: true,
      }),
    );

    expect(mockTrack.teacherShareConverted).not.toHaveBeenCalled();
  });

  it("should store the conversion shareId in a storage", () => {
    const key = getShareIdKey("lesson-slug_unit-slug_programmeSlug");

    window.location.search = `?${key}=xxxxxxxxxx&sm=0&src=1`;
    const fn = jest.spyOn(Storage.prototype, "setItem");

    // hook wrapper
    renderHook(() =>
      useShare({
        programmeSlug: "programmeSlug",
        source: "lesson-canonical",
        curriculumTrackingProps,
        overrideExistingShareId: true,
      }),
    );

    expect(fn).toHaveBeenCalledWith(`cv-xxxxxxxxxx`, JSON.stringify(true));
  });

  it("should not send a conversion event if the conversion shareId is already present", () => {
    const mockTrack = useAnalytics().track;

    const key = getShareIdKey("lesson-slug_unit-slug_programmeSlug");

    window.location.search = `?${key}=xxxxxxxxxx&sm=0&src=1`;

    // set the conversion storage
    localStorage.setItem("cv-xxxxxxxxxx", JSON.stringify(true));

    // hook wrapper
    renderHook(() =>
      useShare({
        programmeSlug: "programmeSlug",
        source: "lesson-canonical",
        curriculumTrackingProps,
        overrideExistingShareId: true,
      }),
    );

    expect(mockTrack.teacherShareConverted).not.toHaveBeenCalled();
  });

  it("sends an activation event when shareActivated is called", () => {
    const mockTrack = useAnalytics().track;

    const { result } = renderHook(() =>
      useShare({
        programmeSlug: "programmeSlug",
        source: "lesson-canonical",
        curriculumTrackingProps,
        overrideExistingShareId: true,
      }),
    );

    result.current.shareActivated();

    expect(mockTrack.teacherShareActivated).toHaveBeenCalled();
  });

  it("doesn't send an activation event when shareActivated is called and the storage is already present", () => {
    const mockTrack = useAnalytics().track;

    const key = getShareIdKey("lesson-slug_unit-slug_programmeSlug");

    localStorage.setItem(`av-${key}`, JSON.stringify(true));

    const { result } = renderHook(() =>
      useShare({
        programmeSlug: "programmeSlug",
        source: "lesson-canonical",
        curriculumTrackingProps,
        overrideExistingShareId: true,
      }),
    );

    result.current.shareActivated();

    expect(mockTrack.teacherShareActivated).not.toHaveBeenCalled();
  });

  it("should not update browserUrl if overrideExistingShareId is false and urlShareId is present", () => {
    const key = getShareIdKey("lesson-slug_unit-slug_programmeSlug");

    window.location.search = `?${key}=test-share-id&sm=0&src=1`;

    const { result } = renderHook(() =>
      useShare({
        programmeSlug: "programmeSlug",
        source: "lesson-canonical",
        shareBaseUrl: "http://localhost:3000/teachers/lessons/lesson-slug",
        curriculumTrackingProps,
        overrideExistingShareId: false,
      }),
    );

    expect(result.current.browserUrl).toBe(null);
  });

  it.skip("should call router.replace when browserUrl differs from window.location.href", () => {
    const key = getShareIdKey("lesson-slug_unit-slug_programmeSlug");

    // Set up initial window location
    Object.defineProperty(window, "location", {
      writable: true,
      value: {
        href: "http://localhost/teachers/lessons/lesson-slug",
        assign: jest.fn(),
        replace: jest.fn(),
        search: "",
      } as MockLocation,
    });

    renderHook(() =>
      useShare({
        programmeSlug: "programmeSlug",
        source: "lesson-canonical",
        curriculumTrackingProps,
        overrideExistingShareId: true,
      }),
    );

    // Verify router.replace was called with the correct parameters
    expect(mockReplace).toHaveBeenCalledWith(
      {
        pathname: "/teachers/lessons/lesson-slug",
        query: {
          existingParam: "value",
          [key]: "xxxxxxxxxx",
          sm: "0",
          src: "1",
        },
      },
      undefined,
      { shallow: true },
    );
  });

  it("should not call router.replace when browserUrl matches window.location.href", () => {
    const key = getShareIdKey("lesson-slug_unit-slug_programmeSlug");
    const expectedUrl = `http://localhost?${key}=xxxxxxxxxx&sm=0&src=1`;

    // Set window.location.href to match what browserUrl will be
    Object.defineProperty(window, "location", {
      writable: true,
      value: {
        href: expectedUrl,
        assign: jest.fn(),
        replace: jest.fn(),
        search: `?${key}=xxxxxxxxxx&sm=0&src=1`,
      } as MockLocation,
    });

    renderHook(() =>
      useShare({
        programmeSlug: "programmeSlug",
        source: "lesson-canonical",
        curriculumTrackingProps,
        overrideExistingShareId: true,
      }),
    );

    expect(mockReplace).not.toHaveBeenCalled();
  });
});
