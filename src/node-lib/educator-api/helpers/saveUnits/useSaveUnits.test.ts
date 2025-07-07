import { act, waitFor } from "@testing-library/react";

import { useSaveUnits } from "./useSaveUnits";

import { mockLoggedIn, mockLoggedOut } from "@/__tests__/__helpers__/mockUser";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";
import { KeyStageTitleValueType } from "@/browser-lib/avo/Avo";
import { renderHookWithProviders } from "@/__tests__/__helpers__/renderWithProviders";

const mockSetOakToastProps = jest.fn();

jest.mock("@/context/OakToast/useOakToastContext", () => ({
  useOakToastContext: jest.fn(() => ({
    setCurrentToastProps: (props: unknown) => mockSetOakToastProps(props),
  })),
}));

const mockUseGetEducatorData = jest.fn();

jest.mock("@/node-lib/educator-api/helpers/useGetEducatorData", () => ({
  useGetEducatorData: () => mockUseGetEducatorData(),
}));

const fetch = jest.spyOn(global, "fetch") as jest.Mock;

const mockSaveContent = jest.fn();
const mockUnsaveContent = jest.fn();
jest.mock("@/context/Analytics/useAnalytics", () => ({
  __esModule: true,
  default: () => ({
    track: {
      contentSaved: (...args: unknown[]) => mockSaveContent(...args),
      contentUnsaved: (...args: unknown[]) => mockUnsaveContent(...args),
    },
  }),
}));

const mockTrackingData = {
  savedFrom: "lesson_listing_save_button" as const,
  keyStageTitle: "Key stage 1" as KeyStageTitleValueType,
  keyStageSlug: "ks1",
  subjectTitle: "Maths",
  subjectSlug: "maths",
};

const renderHook = renderHookWithProviders();

describe("useSaveUnits", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    fetch.mockResolvedValue({ ok: true });
    setUseUserReturn(mockLoggedIn);
  });
  it("should return correct response for isUnitSaved", async () => {
    mockUseGetEducatorData.mockImplementation(() => ({
      data: ["unit1", "unit2"],
      error: null,
      isLoading: false,
      mutate: jest.fn(),
    }));
    const { result } = renderHook(() =>
      useSaveUnits("test-programme", mockTrackingData),
    );

    expect(result.current.isUnitSaved("unit1")).toBe(true);
    expect(result.current.isUnitSaved("unit2")).toBe(true);
    expect(result.current.isUnitSaved("unit3")).toBe(false);
  });
  it("should save a unit", async () => {
    mockUseGetEducatorData
      .mockImplementationOnce(() => ({
        data: [],
        error: null,
        isLoading: false,
        mutate: jest.fn(),
      }))
      .mockImplementationOnce(() => ({
        data: ["unit1"],
        error: null,
        isLoading: false,
        mutate: jest.fn(),
      }));
    const { result } = renderHook(() =>
      useSaveUnits("test-programme", mockTrackingData),
    );

    expect(result.current.isUnitSaved("unit1")).toBe(false);

    act(() => result.current.onSaveToggle("unit1"));

    await waitFor(() => expect(result.current.isUnitSaved("unit1")).toBe(true));
  });
  it("should unsave when toggling a unit that is already saved", async () => {
    mockUseGetEducatorData.mockImplementation(() => ({
      data: [],
      error: null,
      isLoading: false,
      mutate: jest.fn(),
    }));
    const { result } = renderHook(() =>
      useSaveUnits("test-programme", mockTrackingData),
    );

    act(() => result.current.onSaveToggle("unit1"));
    act(() => result.current.onSaveToggle("unit1"));

    await waitFor(() =>
      expect(result.current.isUnitSaved("unit1")).toBe(false),
    );
  });
  it("should set the toast success variant when saving a unit", async () => {
    mockUseGetEducatorData.mockImplementation(() => ({
      data: [],
      error: null,
      isLoading: false,
      mutate: jest.fn(),
    }));
    const { result } = renderHook(() =>
      useSaveUnits("test-programme", mockTrackingData),
    );

    await act(async () => result.current.onSaveToggle("unit1"));

    expect(mockSetOakToastProps).toHaveBeenCalledWith({
      message: expect.any(Object),
      variant: "green",
      showIcon: true,
      autoDismiss: true,
    });
  });
  it("should set the toast error variant when saving a unit fails", async () => {
    mockUseGetEducatorData.mockImplementation(() => ({
      data: [],
      error: null,
      isLoading: false,
      mutate: jest.fn(),
    }));

    fetch.mockResolvedValue({ ok: false });
    const { result } = renderHook(() =>
      useSaveUnits("test-programme", mockTrackingData),
    );

    await act(async () => result.current.onSaveToggle("unit1"));

    await waitFor(() => expect(mockSetOakToastProps).toHaveBeenCalledTimes(2));
    expect(mockSetOakToastProps).toHaveBeenLastCalledWith({
      message: expect.any(Object),
      variant: "error",
      showIcon: false,
      autoDismiss: true,
    });
  });
  it("should call the correct tracking function when saving a unit", async () => {
    mockUseGetEducatorData.mockImplementation(() => ({
      data: [],
      error: null,
      isLoading: false,
      mutate: jest.fn(),
    }));
    const { result } = renderHook(() =>
      useSaveUnits("test-programme", mockTrackingData),
    );

    await act(async () => result.current.onSaveToggle("unit1"));

    expect(mockSaveContent).toHaveBeenCalledWith({
      analyticsUseCase: "Teacher",
      componentType: "lesson_listing_save_button",
      contentItemSlug: "unit1",
      contentType: "unit",
      engagementIntent: "use",
      eventVersion: "2.0.0",
      keyStageSlug: "ks1",
      keyStageTitle: "Key stage 1",
      platform: "owa",
      product: "teacher lesson resources",
      subjectSlug: "maths",
      subjectTitle: "Maths",
    });
  });
  it("should call the correct tracking function when unsaving a unit", async () => {
    mockUseGetEducatorData.mockImplementation(() => ({
      data: ["unit1"],
      error: null,
      isLoading: false,
      mutate: jest.fn(),
    }));
    const { result } = renderHook(() =>
      useSaveUnits("test-programme", mockTrackingData),
    );

    await act(async () => result.current.onSaveToggle("unit1"));

    expect(mockUnsaveContent).toHaveBeenCalledWith({
      analyticsUseCase: "Teacher",
      componentType: "lesson_listing_save_button",
      contentItemSlug: "unit1",
      contentType: "unit",
      engagementIntent: "use",
      eventVersion: "2.0.0",
      keyStageSlug: "ks1",
      keyStageTitle: "Key stage 1",
      platform: "owa",
      product: "teacher lesson resources",
      subjectSlug: "maths",
      subjectTitle: "Maths",
    });
  });
  it("should set showSignIn to true when user is signed out", () => {
    setUseUserReturn(mockLoggedOut);
    const { result } = renderHook(() =>
      useSaveUnits("test-programme", mockTrackingData),
    );

    act(() => result.current.onSaveToggle("unit1"));

    expect(result.current.showSignIn).toBe(true);
  });
  it("should set showSignIn to true when user is signed in but not onboarded", () => {
    setUseUserReturn({
      ...mockLoggedIn,
      user: {
        ...mockLoggedIn.user,
        publicMetadata: {
          owa: {
            isOnboarded: false,
          },
        },
      },
    });
    const { result } = renderHook(() =>
      useSaveUnits("test-programme", mockTrackingData),
    );

    act(() => result.current.onSaveToggle("unit1"));

    expect(result.current.showSignIn).toBe(true);
  });
});
