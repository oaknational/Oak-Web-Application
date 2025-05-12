import { act, renderHook, waitFor } from "@testing-library/react";

import { useSaveUnits } from "./useSaveUnits";

import { mockLoggedIn, mockLoggedOut } from "@/__tests__/__helpers__/mockUser";
import { setUseUserReturn } from "@/__tests__/__helpers__/mockClerk";

const fetch = jest.spyOn(global, "fetch") as jest.Mock;

const mockSetOakToastProps = jest.fn();

jest.mock("@/context/OakToast/useOakToastContext", () => ({
  useOakToastContext: jest.fn(() => ({
    setCurrentToastProps: (props: unknown) => mockSetOakToastProps(props),
  })),
}));

describe("useSaveUnits", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    setUseUserReturn(mockLoggedIn);
    fetch.mockResolvedValue(true);
  });
  it("should return correct response for isUnitSaved", () => {
    const savedUnits = ["unit1", "unit2"];
    const programmeSlug = "test-programme";

    const { result } = renderHook(() =>
      useSaveUnits(savedUnits, programmeSlug),
    );
    act(() => {
      expect(result.current.isUnitSaved("unit1")).toBe(true);
      expect(result.current.isUnitSaved("unit2")).toBe(true);
      expect(result.current.isUnitSaved("unit3")).toBe(false);
    });
  });
  it("should save a unit", async () => {
    const { result } = renderHook(() => useSaveUnits([], "test-programme"));

    expect(result.current.isUnitSaved("unit1")).toBe(false);

    act(() => result.current.onSaveToggle("unit1"));

    await act(async () =>
      expect(result.current.isUnitSaved("unit1")).toBe(true),
    );
  });
  it("should do nothing when toggling a unit that is already saved", () => {
    const { result } = renderHook(() =>
      useSaveUnits(["unit1"], "test-programme"),
    );

    act(() => result.current.onSaveToggle("unit1"));

    expect(result.current.isUnitSaved("unit1")).toBe(true);
  });
  it("should set the toast success variant when saving a unit", async () => {
    const { result } = renderHook(() => useSaveUnits([], "test-programme"));

    await act(async () => result.current.onSaveToggle("unit1"));

    expect(mockSetOakToastProps).toHaveBeenCalledWith({
      message: expect.any(Object),
      variant: "green",
      showIcon: true,
      autoDismiss: true,
    });
  });
  it("should set the toast error variant when saving a unit fails", async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });
    const { result } = renderHook(() => useSaveUnits([], "test-programme"));

    await act(async () => result.current.onSaveToggle("unit1"));

    await waitFor(() => expect(mockSetOakToastProps).toHaveBeenCalledTimes(2));
    expect(mockSetOakToastProps).toHaveBeenLastCalledWith({
      message: expect.any(Object),
      variant: "error",
      showIcon: false,
      autoDismiss: true,
    });
  });
  it("should set showSignIn to true when user is signed out", () => {
    setUseUserReturn(mockLoggedOut);
    const { result } = renderHook(() => useSaveUnits([], "test-programme"));

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
    const { result } = renderHook(() => useSaveUnits([], "test-programme"));

    act(() => result.current.onSaveToggle("unit1"));

    expect(result.current.showSignIn).toBe(true);
  });
});
